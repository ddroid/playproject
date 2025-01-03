(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
patch_cache_in_browser(arguments[4], arguments[5])

function patch_cache_in_browser (source_cache, module_cache) {
  const meta = { modulepath: [], paths: {} }
  for (const key of Object.keys(source_cache)) {
    const [module, names] = source_cache[key]
    const dependencies = names || {}
    source_cache[key][0] = patch(module, dependencies, meta)
  }
  function patch (module, dependencies, meta) {
    const MAP = {}
    for (const [name, number] of Object.entries(dependencies)) MAP[name] = number
    return (...args) => {
      const original = args[0]
      require.cache = module_cache
      require.resolve = resolve
      args[0] = require
      return module(...args)
      function require (name) {
        const identifier = resolve(name)
        if (name.endsWith('STATE')) {
          const modulepath = meta.modulepath.join('/')
          const original_export = require.cache[identifier] || (require.cache[identifier] = original(name))
          const exports = (...args) => original_export(...args, modulepath)
          return exports
        } else if (require.cache[identifier]) return require.cache[identifier]
        else {
          const counter = meta.modulepath.concat(name).join('/')
          if (!meta.paths[counter]) meta.paths[counter] = 0
          const localid = `${name}${meta.paths[counter] ? '#' + meta.paths[counter] : ''}`
          meta.paths[counter]++
          meta.modulepath.push(localid)
        }
        const exports = require.cache[identifier] = original(name)
        if (!name.endsWith('STATE')) meta.modulepath.pop(name)
        return exports
      }
    }
    function resolve (name) { return MAP[name] }
  }
}
require('./page') // or whatever is otherwise the main entry of our project
},{"./page":12}],2:[function(require,module,exports){
const localdb = require('../../../../src/node_modules/localdb')
const db = localdb()
/** Data stored in a entry in db by STATE:
 * id (String): Node Path 
 * name (String): Any (To be used theme_widget)
 * type (String): Module Name for module / Module id for instances
 * hubs (Array): List of hub-nodes
 * subs (Array): List of sub-nodes
 * inputs (Array): List of input files
 */

// Constants and initial setup (global level)
const VERSION = 9

const status = {
  root_module: true, 
  root_instance: true, 
  overrides: {},
  tree: {},
  tree_pointers: {},
  modulepaths: {},
  db
}

// Version check and initialization
check_version()

// Symbol mappings
const listeners = {}
const s2i = {}
const i2s = {}
let admins = [0]

// Inner Function
function STATE (address, modulepath) {
  status.modulepaths[modulepath] = 0
  
  //Variables (module-level)
  const local_status = {
    name: extract_filename(address),
    module_id: modulepath,
    instance_ids: [],
    deny: {},
    subs: []
  }
  return statedb
  
  function statedb (fallback_module) {
    const data = get_module_data(fallback_module)
    
    //Setup local data (module level)
    if(status.root_module){
      status.root_module = false
      data.admins && admins.push(...data.admins)
    }
    local_status.id = data.id
    local_status.module_id = data.id
    data.hubs && add_source(data.hubs)
    
    const sub_modules = {}
    data.subs && data.subs.forEach(id => {
      sub_modules[db.read(['state', id]).type] = id
    })
    window.STATEMODULE = status

    return {
      id: data.id,
      sdb: create_statedb_interface(local_status, modulepath),
      subs: [get],
      sub_modules
    }
  }
  function find_super ({ xtype, fallback }) {
    const split = modulepath.split('/')
    const name = split.at(-2) + '.' + split.at(-1)
    const modulepath_parent = modulepath.split(/\/(?=[^\/]*$)/)[0]
    
    let data = db.read(['state', modulepath_parent]) || db.read(['state', modulepath])
    
    if (xtype === 'instance') {
      data = db.read(['state', modulepath_parent])
    }
    
    data.name = split.at(-1)
    if(xtype === 'module')
      data.path = data.id = modulepath
    else
      data.path = data.id = get_instance_path(modulepath)
    status.tree_pointers[modulepath] = status.tree_pointers[modulepath_parent] 
    local_status.name = name

    return preprocess({ 
      fallback, xtype, 
      pre_data: data, 
      orphan_check: true })
  }
  function get (sid) {
    const data = get_instance_data(sid)
    
    local_status.id = data.id
    symbolfy(data, local_status)
    window.STATEMODULE = status
    
    return {
      id: data.id,
      sdb: create_statedb_interface(local_status, modulepath)
    }
  }
  function preprocess ({ fallback, xtype, pre_data = {}, orphan_check }) {
    const entries = {}
    let {id: pre_id, hubs: pre_hubs} = pre_data

    validate(fallback())
    
    const fallback_data = status.overrides[pre_id] ? 
      status.overrides[pre_id]([fallback]) :
      fallback()
      
    if(status.overrides[pre_id])
      delete status.overrides[pre_id]
    if(xtype === 'module')
      local_status.fallback_instance = fallback_data.api


    register_overrides(fallback_data, modulepath)
    // console.log('overrides: ', status.overrides)
    orphan_check && (fallback_data.orphan = orphan_check)
    const id = sanitize_state({ local_id: '', entry: fallback_data, path: pre_id })
    return {entries, id}

    
    function sanitize_state ({ local_id, entry, path, hub_entry, local_tree }) {
      [path, entry, local_tree] = extract_data({ local_id, entry, path, hub_entry, local_tree })
      
      entry.id = path
      entry.name = local_id.split(':')[0]
      
      sanitize_subs({ local_id, entry, path, local_tree })
      
      delete entry._
      delete entry.drive
      entries[entry.id] = entry
      // console.log('Entry: ', entry)
      return entry.id
    }
    function extract_data ({ local_id, entry, path, hub_entry, local_tree }) {
      if (local_id) {
        entry.hubs = [hub_entry.id]
        if (xtype === 'instance') {
          let temp_path = path.split(':')[0]
          temp_path = temp_path ? temp_path + '/' : temp_path
          const module_id = temp_path + local_id.split('$')[0]
          entry.type = module_id
          path = module_id + ':' + status.modulepaths[module_id]++

        } 
        else {
          entry.type = local_id
          path = path ? path + '/' : ''
          path = path + local_id
          status.tree_pointers[path] = local_tree
        }
      } 
      else {
        if (xtype === 'instance') {
          entry.type = local_status.module_id
        } else {
          local_tree = JSON.parse(JSON.stringify(entry))
          // console.log('pre_id:', pre_id)
          if (pre_id) {
            status.tree_pointers[pre_id]._[local_status.name] = local_tree
          } else {
            status.tree[local_id] = local_tree
          }
          const file_id = local_status.name + '.js'
          entry.inputs || (entry.inputs = {})
          entry.inputs[file_id] = { $ref: new URL(address, location).href }
          entry.type = local_status.name
        }
        pre_hubs && (entry.hubs = pre_hubs)
      }
      return [path, entry, local_tree]
    }
    function sanitize_subs ({ local_id, entry, path, local_tree }) {
      if (!local_id) {
        if(entry._){
          entry.subs = Object.entries(entry._).map(([local_id, value]) => 
            sanitize_state({ local_id, entry: value, path, hub_entry: entry, local_tree })
        )}
        if(entry.drive){
          entry.inputs = Object.entries(entry.drive.inputs).map(([key, value]) => 
            sanitize_file(key, value, entry)
          )
      }
      }
    }
    function sanitize_file (file_id, entry, hub_entry) {
      if (!isNaN(Number(file_id))) return file_id
      
      const file = entry
      file.id = file_id
      file.name = file.name || file_id
      file.type = file.type || file.id.split('.').at(-1)
      file[file.type === 'js' ? 'subs' : 'hubs'] = [hub_entry.id]
      
      const copies = Object.keys(db.read_all(['state', file_id]))
      if (copies.length) {
        const id = copies.sort().at(-1).split(':')[1]
        file.id = file_id + ':' + (Number(id || 0) + 1)
      }
      entries[file.id] = file
      return file.id
    }
  }
  function get_module_data (fallback) {
    let data = db.read(['state', modulepath])
    data?.orphan && (local_status.orphan = true)

    if (status.fallback_check) {
      let result
      if (data) {
        result = preprocess({fallback, xtype: 'module', pre_data: data })
      } 
      else if (status.root_module) {
        status.root_module = false
        result = preprocess({fallback, xtype: 'module', pre_data: {id: modulepath}})
      } 
      else {
        result = find_super({xtype: 'module', fallback})
      }
      data = result.entries[result.id]
      db.append(['state'], result.entries)
    }
    return data
  }
  function get_instance_data (sid) {
    let id = s2i[sid]
    let data = id && db.read(['state', id])

    if (status.fallback_check) {
      let result
      if (!data && !status.root_instance) {
        result = find_super({ xtype: 'instance', fallback: local_status.fallback_instance})
      } else {
        result = preprocess({
          fallback: local_status.fallback_instance, 
          xtype: 'instance', 
          pre_data: data || {id: get_instance_path(modulepath)}
        })
      }
      data = result.entries[result.id]
      db.append(['state'], result.entries)
    }
    else if (status.root_instance) {
      data = db.read(['state', id || get_instance_path(modulepath)])
      status.tree = JSON.parse(JSON.stringify(status.tree))
      status.root_instance = false
    }
    
    if (!data && local_status.orphan) {
      data = db.read(['state', get_instance_path(modulepath)])
    }
    return data
  }
}

// External Function (helper)
function validate (data) {
  /**  Expected structure and types
   * Sample : "key1|key2:*:type1|type2"
   * ":" : separator
   * "|" : OR
   * "*" : Required key
   * 
   * */
  const errors = []
  const expected_structure = {
    '_': {
      ":*": { // Required key, any name allowed
        "0": () => {}, // Optional key
      },
    },
    'drive': {
      'inputs:*': { // Required key
        ":*": { // Required key, any name allowed
          "data|link:*:object|string": {}, // data or link are names, required, object or string are types
          "link": "string"
        },
      },
    },
  };


  validate_shape(data, expected_structure);
  if (errors.length > 0) 
    console.error("Validation failed:", ...errors);

  function validate_shape (obj, expected, super_node = 'root') {
    const keys = Object.keys(obj)
    const values = Object.values(obj)

    Object.entries(expected).forEach(([expected_key, expected_value]) => {
      let [expected_key_names, required, expected_types] = expected_key.split(':')
      expected_types = expected_types ? expected_types.split('|') : [typeof(expected_value)]
      let absent = true

      if(expected_key_names)
        expected_key_names.split('|').forEach(expected_key_name => {
          const value = obj[expected_key_name]

          if(value){
            const type = typeof(value)
            absent = false

            if(expected_types.includes(type))
              type === 'object' && validate_shape(value, expected_value, expected_key_name)
            else
              errors.push(`Type mismatch: Expected "${expected_types.join(' or ')}" got "${type}" for key "${expected_key_name}" at: `, obj)
          }
        })
      else if(required){
        values.forEach((value, index) => {
          absent = false
          const type = typeof(value)
          
          if(expected_types.includes(type))
            expected_types.includes('object') && validate_shape(value, expected_value, keys[index])
          else
            errors.push(`Type mismatch: Expected "${expected_types.join(' or ')}" got "${type}" for key "${keys[index]}" at: `, obj)
        })
      }

      if(absent && required){
        if(expected_key_names)
          errors.push(`Can't find required key "${expected_key_names.replace('|', ' or ')}" at: `, obj)
        else
          errors.push(`No subs found for super key "${super_node}" at sub:`, obj)
      }
    })
  }
}
function extract_filename (address) {
  const parts = address.split('/node_modules/')
  const last = parts.at(-1).split('/')
  return last.at(-1).slice(0, -3)
}
function get_instance_path (modulepath, modulepaths = status.modulepaths) {
  return modulepath + ':' + modulepaths[modulepath]++
}
async function fetch_save ({ id, name, $ref, type, data }) {
  const xtype = (typeof(id) === "number" ? name : id).split('.').at(-1)
  let result = db.read([type, id])
  
  if (!result) {
    result = data || await((await fetch($ref))[xtype === 'json' ? 'json' : 'text']())
    db.add([type, id], result)
  }
  return result
}
function add_source (hubs) {
  hubs.forEach(id => {
    const data = db.read(['state', id])
    if (data.type === 'js') {
      fetch_save(data)
    }
  })
}
function symbolfy (data, local_status) {
  data.subs && data.subs.forEach(sub => {
    const substate = db.read(['state', sub])
    s2i[i2s[sub] = Symbol(sub)] = sub
    local_status.subs.push({ sid: i2s[sub], type: substate.type })
  })
}
function register_overrides (tree, path = '', xtype = 'instance', local_modulepaths = {}) {
  let check_override = true
  let check_sub = false
  local_modulepaths[path] = 0
  check_override = Boolean(tree[0])
  if (check_override) {
    let resultant_path = path
    if(xtype === 'instance')
      resultant_path = get_instance_path(path.split('$')[0], local_modulepaths)
    if(!status.overrides[resultant_path])
      status.overrides[resultant_path] = tree[0]
  }
  
  path = path ? path + '/' : path
  
  if (tree._) {
    Object.entries(tree._).forEach(([type, data]) => {
      const check = register_overrides(data, path + type.replace('.', '/'), xtype, local_modulepaths)
      if (!check) check_sub = true
    })
  }
  
  return !(check_override || check_sub)
}
function check_version () {
  if (db.read(['playproject_version']) != VERSION) {
    localStorage.clear()
    status.fallback_check = true
    db.add(['playproject_version'], VERSION)
  }
}

// Public Function
function create_statedb_interface (local_status, modulepath) {
  return {
    watch, get_sub, req_access
  }
  async function watch (listener) {
    const data = db.read(['state', local_status.id])
    listeners[data.id] = listener
    const input_map = []
    
    if (data.inputs) {
      await Promise.all(data.inputs.map(async input => {
        const input_state = db.read(['state', input])
        const input_data = await fetch_save(input_state)
        input_map.push({ type: input_state.type, data: [input_data] })
      }))
    }
    
    listener(input_map)
    return local_status.subs
  }
  function get_sub (type) {
    return local_status.subs.filter(sub => {
      const dad = db.read(['state', sub.type])
      return dad.type === type
    })
  }
  function req_access (sid) {
    if (local_status.deny[sid]) throw new Error('access denied')
    const el = db.read(['state', s2i[sid]])
    if (admins.includes(s2i[sid]) || admins.includes(el?.name)) {
      return {
        xget: (id) => db.read(['state', id]),
        get_all: () => db.read_all(['state']),
        add_admins: (ids) => { admins.push(...ids) },
        load: (snapshot) => {
          localStorage.clear()
          Object.entries(snapshot).forEach(([key, value]) => {
            db.add([key], JSON.parse(value), true)
          })
          window.location.reload()
        }
      }
    }
  }
}


module.exports = STATE
},{"../../../../src/node_modules/localdb":13}],3:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

function fallback_module () { // -> set database defaults or load from database
	return {
    api: fallback_instance,
    _: {
      "head": {},
      "foot": {},
    }
  }
}
function fallback_instance () {
  return {
    _: {
      "head": {},
      "foot": {},
    }
  }
}
/******************************************************************************
  PAGE
******************************************************************************/
const head = require('head')
const foot = require('foot')

module.exports = app
async function app(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    css: inject,
    json: fill
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    <style></style>`
  const style = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  { // nav
    shadow.append(await head(subs[0]), await foot(subs[1]))
  }
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
  }
}

}).call(this)}).call(this,"/doc/state/example2/node_modules/app.js")
},{"STATE":2,"foot":6,"head":7}],4:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

function fallback_module () {
  return {
    api: fallback_instance,
    _: {
      icon: {}
    }
  }
}
function fallback_instance () {
  return {
    _: {
      icon: {}
    },
    drive: {
      inputs: {
        'btn.json': {
          data: {
            title: 'Click me'
          }
        }
      }
    }
  }
}
/******************************************************************************
  BTN
******************************************************************************/
delete require.cache[require.resolve('icon')]
const icon = require('icon')

module.exports = {btn, btn_small}
async function btn(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    css: inject,
    json: fill
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    <button></button>
    <style>
      button{
        padding: 10px 40px;
      }
    </style>`
  const style = shadow.querySelector('style')
  const button = shadow.querySelector('button')
  const subs = await sdb.watch(onbatch)
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  {
    button.append(await icon(subs[0]))
  }
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
    button.append(data.title)
  }
}
async function btn_small(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    css: inject,
    json: fill
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    <button></button>
    <style></style>`
  const style = shadow.querySelector('style')
  const button = shadow.querySelector('button')
  const subs = await sdb.watch(onbatch)
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  {
    button.append(await icon(subs[0]))
  }
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
    button.innerHTML = data.title
  }
}

}).call(this)}).call(this,"/doc/state/example2/node_modules/btn.js")
},{"STATE":2,"icon":8}],5:[function(require,module,exports){
function fallback_module () { // -> set database defaults or load from database
	return {
    _: {
      "nav": {},
      "nav#1": {}
    }
  }
}
function fallback_instance () {
  return {
    _: {
      "nav": {
        0: override_nav
      },
      "nav#1": {},
    }
  }
}
function override_nav ([nav]) {
  const data = nav()
  console.log(JSON.parse(JSON.stringify(data)))
  data.inputs['nav.json'].data.links.push('Page')
  return data
}
/******************************************************************************
  FOO
******************************************************************************/
const nav = require('nav')

module.exports = foo
async function foo(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    <style></style>`
  const main = shadow.querySelector('nav')
  const style = shadow.querySelector('style')
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  { // nav
    shadow.append(await nav())
  }
  return el
}

},{"nav":10}],6:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

function fallback_module () {
  return {
    api: fallback_instance,
    _:{
      text: {}
    }
  }
}
function fallback_instance () {
  return {
    _:{
      text: {}
    }
  }
}
/******************************************************************************
  FOOT
******************************************************************************/
const text = require('text')

module.exports = foot
async function foot(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    css: inject,
    json: fill
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    <style></style>`
  const style = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  {
    shadow.prepend(await text(subs[0]))
  }
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
  }
}

}).call(this)}).call(this,"/doc/state/example2/node_modules/foot.js")
},{"STATE":2,"text":11}],7:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

function fallback_module () { // -> set database defaults or load from database
	return {
    api: fallback_instance,
    _: {
      "foo": {}
    }
  }
}
function fallback_instance () {
  return {
    _: {
      "foo": {},
    }
  }
}
/******************************************************************************
  HEAD
******************************************************************************/
const foo = require('foo')

module.exports = head
async function head(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    css: inject,
    json: fill
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    <style></style>`
  const style = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  { // nav
    shadow.append(await foo(subs[0]))
  }
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
  }
}

}).call(this)}).call(this,"/doc/state/example2/node_modules/head.js")
},{"STATE":2,"foo":5}],8:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

function fallback_module () {
  return {
    api: fallback_instance,
  }
}
function fallback_instance () {
  return {}
}
/******************************************************************************
  ICON
******************************************************************************/
module.exports = icon
async function icon(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    css: inject,
    json: fill
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    🗃
    <style></style>`
  const style = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
  }
}

}).call(this)}).call(this,"/doc/state/example2/node_modules/icon.js")
},{"STATE":2}],9:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

function fallback_module () {
  return {
    api: fallback_instance,
    _: {
      btn: {},
    }
  }
}
function fallback_instance () {
  return {
    _: {
      btn: {},
      'btn$small': {},
    },
    drive: {
      inputs: {
        'menu.json': {
          data: {
            title: 'menu',
            links: ['link1', 'link2'],
          }
        },
        'menu.css': {
          data: `
            .title{
              background: linear-gradient(currentColor 0 0) 0 100% / var(--underline-width, 0) .1em no-repeat;
              transition: color .5s ease, background-size .5s;
              cursor: pointer;
            }
            .title:hover{
              --underline-width: 100%
            }
            ul{
              background: #273d3d;
              list-style: none;
              display: none;
              position: absolute;
              padding: 10px;
              box-shadow: 0px 1px 6px 1px gray;
              border-radius: 5px;
            }
            ul.active{
              display: block;
            }
          `
        }
      }
    }
  }
}
/******************************************************************************
  MENU
******************************************************************************/
delete require.cache[require.resolve('btn')]
const {btn, btn_small} = require('btn')


module.exports = {menu, menu_hover}
async function menu(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    css: inject,
    json: fill
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    <div tabindex='0' class='title'></div>
    <ul>
    </ul>
    <style></style>`
  const main = shadow.querySelector('ul')
  const title = shadow.querySelector('.title')
  const style = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)
  // ----------------------------------------
  // EVENT LISTENERS
  // ----------------------------------------
  title.onclick = () => {
    main.classList.toggle('active')
  }
  title.onblur = () => {
    main.classList.remove('active')
  }
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  { //btn
    main.append(await btn(subs[0]), await btn_small(subs[1]))
  }
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
    title.innerHTML = data.title
    main.append(...data.links.map(link => {
      const el = document.createElement('li')
      el.innerHTML = link
      return el
    }))
  }
}
async function menu_hover(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    css: inject,
    json: fill
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    <div tabindex='0' class='title'></div>
    <ul>
    </ul>
    <style></style>`
  const main = shadow.querySelector('ul')
  const title = shadow.querySelector('.title')
  const style = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)
  // ----------------------------------------
  // EVENT LISTENERS
  // ----------------------------------------
  title.onmouseover = () => {
    main.classList.add('active')
  }
  title.onmouseout = () => {
    main.classList.remove('active')
  }
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  { //btn
    main.append(await btn(subs[0]), await btn_small(subs[1]))
  }
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
    title.innerHTML = data.title
    main.append(...data.links.map(link => {
      const el = document.createElement('li')
      el.innerHTML = link
      return el
    }))
  }
}

}).call(this)}).call(this,"/doc/state/example2/node_modules/menu.js")
},{"STATE":2,"btn":4}],10:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

function fallback_module () { // -> set database defaults or load from database
	return {
      api: fallback_instance,
      _: {
        'menu':{},
      }
    }
  }
function fallback_instance () {
  return {
    _: {
      'menu':{
        0: override_menu
      },
      'menu$hover': {
        0: override_menu_hover
      }
    },
    drive: {
      inputs: {
        'nav.css': {
          data: `
            nav{
              display: flex;
              gap: 20px;
              padding: 20px;
              background: #4b6d6d;
              color: white;
              box-shadow: 0px 1px 6px 1px gray;
              margin: 5px;
            }
            .title{
              background: linear-gradient(currentColor 0 0) 0 100% / var(--underline-width, 0) .1em no-repeat;
              transition: color .5s ease, background-size .5s;
              cursor: pointer;
            }
            .title:hover{
              --underline-width: 100%
            }
          `
        },
        'nav.json': {
          data: {
            links: ['Home', 'About', 'Contact']
          }
        }
      }
    }
  }
}
function override_menu ([menu], path){
  const data = menu()
  data.drive.inputs['menu.json'].data = {
    title: 'Services',
    links: ['Marketing', 'Design', 'Web Dev', 'Ad Compaign']
  }
  return data
}
function override_menu_hover ([menu], path){
  const data = menu()
  data.drive.inputs['menu.json'].data = {
    title: 'Services#hover',
    links: ['Marketing', 'Design', 'Web Dev', 'Ad Compaign']
  }
  return data
}
/******************************************************************************
  NAV
******************************************************************************/
delete require.cache[require.resolve('menu')]
const {menu, menu_hover} = require('menu')

module.exports = nav
async function nav(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts?.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    css: inject,
    json: fill
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    <nav>
    </nav>
    <style></style>`
  const main = shadow.querySelector('nav')
  const style = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  { //menu
    main.append(await menu(subs[0]), await menu_hover(subs[1]))
  }
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
    main.append(...data.links.map(link => {
      const el = document.createElement('div')
      el.classList.add('title')
      el.innerHTML = link
      return el
    }))
  }
}

}).call(this)}).call(this,"/doc/state/example2/node_modules/nav.js")
},{"STATE":2,"menu":9}],11:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

function fallback_module () {
  return {
    api: fallback_instance,
  }
}
function fallback_instance () {
  return {}
}
/******************************************************************************
  TEXT
******************************************************************************/
module.exports = text
async function text(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    css: inject,
    json: fill
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    Copyright © 2024  Playproject Inc.
    <style></style>`
  const style = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
  }
}

}).call(this)}).call(this,"/doc/state/example2/node_modules/text.js")
},{"STATE":2}],12:[function(require,module,exports){
(function (__filename,__dirname){(function (){
const STATE = require('STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)
function fallback_module () { // -> set database defaults or load from database
	return {
     // drive: {},
     api: fallback_instance,
     // on (subpath, overrides) {},
    _: {
      "app": {},
    }
  }
}
function fallback_instance () {
  return {
    _: {
      "app": {
        0: override_app
      }
    },
    drive: {
      inputs: {
        "page.css": {
          data: `
            body{
              font-family: 'system-ui';
            }
          `
        }
      }
    }
  }
}
function override_app ([app]) {
  const data = app()
  console.log(JSON.parse(JSON.stringify(data._.head)))
  data._.head[0] = page$head_override
  return data
}
function page$head_override ([head]) {
  const data = head()
  data._['foo.nav'] = {
    0: page$nav_override
  }
  return data
}
function page$foo_override ([foo]) {
  const data = foo()
  data._.nav[0] = page$nav_override
  return data
}
function page$nav_override ([nav]) {
  const data = nav()
  data._.menu[0] = page$menu_override
  return data
}
function page$menu_override ([menu]) {
  const data = menu()
  console.log(data)
  data.drive.inputs['menu.json'].data = {
    links: ['custom', 'menu'],
    title: 'Custom'
  }
  return data
}
/******************************************************************************
  PAGE
******************************************************************************/
const app = require('app')
const sheet = new CSSStyleSheet()
config().then(() => boot({ }))

async function config () {
  const path = path => new URL(`../src/node_modules/${path}`, `file://${__dirname}`).href.slice(8)
  const html = document.documentElement
  const meta = document.createElement('meta')
	const appleTouch = `<link rel="apple-touch-icon" sizes="180x180" href="./src/node_modules/assets/images/favicon/apple-touch-icon.png">`
	const icon32 = `<link rel="icon" type="image/png" sizes="32x32" href="./src/node_modules/assets/images/favicon/favicon-32x32.png">`
	const icon16 = `<link rel="icon" type="image/png" sizes="16x16" href="./src/node_modules/assets/images/favicon/favicon-16x16.png">`
	const webmanifest = `<link rel="manifest" href="./src/node_modules/assets/images/favicon/site.webmanifest"></link>`
  const font = 'https://fonts.googleapis.com/css?family=Nunito:300,400,700,900|Slackey&display=swap'
	const loadFont = `<link href=${font} rel='stylesheet' type='text/css'>`
	html.setAttribute('lang', 'en')
  meta.setAttribute('name', 'viewport')
  meta.setAttribute('content', 'width=device-width,initial-scale=1.0')
  // @TODO: use font api and cache to avoid re-downloading the font data every time
  document.head.append(meta)
  document.head.innerHTML += appleTouch + icon16 + icon32 + webmanifest + loadFont
	document.adoptedStyleSheets = [sheet]
  await document.fonts.ready // @TODO: investigate why there is a FOUC
}
/******************************************************************************
  PAGE BOOT
******************************************************************************/
async function boot () {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get('')
  const on = {
    css: inject,
  }
  const subs = await sdb.watch(onbatch)
  const status = {}
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.body
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
	shadow.adoptedStyleSheets = [sheet]
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  { // desktop
    shadow.append(await app(subs[0]))
  }
  // ----------------------------------------
  // INIT
  // ----------------------------------------

  return

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }
  }
}
async function inject (data){
	sheet.replaceSync(data.join('\n'))
}
}).call(this)}).call(this,"/doc/state/example2/page.js","/doc/state/example2")
},{"STATE":2,"app":3}],13:[function(require,module,exports){
/******************************************************************************
  LOCALDB COMPONENT
******************************************************************************/
module.exports = localdb

function localdb () {
  const prefix = '153/'
  return { add, read_all, read, drop, push, length, append, find }

  function length (keys) {
    const address = prefix + keys.join('/')
    return Object.keys(localStorage).filter(key => key.includes(address)).length
  }
  /**
   * Assigns value to the key of an object already present in the DB
   * 
   * @param {String[]} keys 
   * @param {any} value 
   */
  function add (keys, value, precheck) {
    localStorage[(precheck ? '' : prefix) + keys.join('/')] = JSON.stringify(value)
  }
  /**
   * Appends values into an object already present in the DB
   * 
   * @param {String[]} keys 
   * @param {any} value 
   */
  function append (keys, data) {
    const pre = keys.join('/')
    Object.entries(data).forEach(([key, value]) => {
      localStorage[prefix + pre+'/'+key] = JSON.stringify(value)
    })
  }
  /**
   * Pushes value to an array already present in the DB
   * 
   * @param {String[]} keys
   * @param {any} value 
   */
  function push (keys, value) {
    const data = JSON.parse(localStorage[keys[0]])
    let temp = data
    keys.slice(1).forEach(key => {
      temp = temp[key]
    })
    temp.push(value)
    localStorage[keys[0]] = JSON.stringify(data)
  }
  function read (keys) {
    const result = localStorage[prefix + keys.join('/')]
    return result && JSON.parse(result)
  }
  function read_all (keys) {
    const address = prefix + keys.join('/')
    let result = {}
    Object.entries(localStorage).forEach(([key, value]) => {
      if(key.includes(address))
        result[key.split('/').at(-1)] = JSON.parse(value)
      })
    return result
  }
  function drop (keys) {
    if(keys.length > 1){
      const data = JSON.parse(localStorage[keys[0]])
      let temp = data
      keys.slice(1, -1).forEach(key => {
        temp = temp[key]
      })
      if(Array.isArray(temp))
        temp.splice(keys[keys.length - 1], 1)
      else
        delete(temp[keys[keys.length - 1]])
      localStorage[keys[0]] = JSON.stringify(data)
    }
    else
      delete(localStorage[keys[0]])
  }
  function find (keys, filters, index = 0) {
    let index_count = 0
    const address = prefix + keys.join('/')
    const target_key = Object.keys(localStorage).find(key => {
      if(key.includes(address)){
        const entry = JSON.parse(localStorage[key])
        let count = 0
        Object.entries(filters).some(([search_key, value]) => {
          if(entry[search_key] !== value)
            return
          count++
        })
        if(count === Object.keys(filters).length){
          if(index_count === index)
            return key
          index_count++
        }
      }
    }, undefined)
    return target_key && JSON.parse(localStorage[target_key])
  } 
}
},{}]},{},[1]);
