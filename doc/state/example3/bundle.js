(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
patch_cache_in_browser(arguments[4], arguments[5])

function patch_cache_in_browser (source_cache, module_cache) {
  const meta = { modulepath: ['page'], paths: {} }
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
        if (name.endsWith('node_modules/STATE')) {
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
        if (!name.endsWith('node_modules/STATE')) meta.modulepath.pop(name)
        return exports
      }
    }
    function resolve (name) { return MAP[name] }
  }
}
require('./page') // or whatever is otherwise the main entry of our project
},{"./page":8}],2:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

function fallback_module () {
  return {
    api: fallback_instance,
    _: {
      btn1: {},
      btn2: {},
      btn3: {},
      btn4: {},
      text: {}
    }
  }
  function fallback_instance () {
    return {
      _: {
        btn1: {},
        btn2: {},
        btn3: {},
        btn4: {},
        text: {}
      },
      drive: {
        style: {
          'theme.css': {
            raw: `
            .menu {
              display: flex;
              justify-content: space-around;
              margin: 10px 0px 10px 0px;
            }
            .text-container {
              border: 1px solid #ccc;
              padding: 10px;
            }`
          }
        }
      }
    }
  }
}

const btn1 = require('btn1')
const btn2 = require('btn2')
const btn3 = require('btn3')
const btn4 = require('btn4')
const text_module = require('text')

module.exports = test_menu
async function test_menu (opts) {
  const { id, sdb } = await get(opts.sid)
  const on = {
    style: inject
  }

  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
	<div class="menu"></div>
	<div class="text-container"></div>
	<style></style>`

  const menu_el = shadow.querySelector('.menu')
  const text_container_el = shadow.querySelector('.text-container')
  const style_el = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)
  // console.log(subs)
  // console.dir(subs)

  menu_el.append(
    await btn1(subs[0]),
    await btn2(subs[1]),
    await btn3(subs[2]),
    await btn4(subs[3]))
  text_container_el.append(await text_module(subs[4]))
  
  return el

  function onbatch (batch) {
    for (const { type, data } of batch) {
      on[type] && on[type](data)
    }
  }

  async function inject (data) {
    style_el.innerHTML = data.join('\n')
  }
}

}).call(this)}).call(this,"/doc/state/example3/node_modules/app.js")
},{"../../../../src/node_modules/STATE":9,"btn1":3,"btn2":4,"btn3":5,"btn4":6,"text":7}],3:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

const textitle = 'first text'

function fallback_module () {
  return {
    api: fallback_instance,
  }
  function fallback_instance () {
    return {
      drive: {
        style: {
          'theme.css': {
            raw: `
            button{
              padding: 8px 16px;
            }`
          }
        },
        lang: {
          'en-us.json': {
            raw: {
              label: 'Button 1'
            }
          }
        }
      }
    }
  }
}
module.exports = btn1
async function btn1 (opts) {
  const { id, sdb } = await get(opts.sid)
  const on = {
    style: inject,
    lang: fill
  }

  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
	<button></button>
	<style></style>`

  const button_el = shadow.querySelector('button')
  const style_el = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)

  button_el.onclick = btn_click
  return el
  function onbatch (batch) {
    for (const { type, data } of batch) {
      on[type] && on[type](data)
    }
  }
  async function fill (data) {
    button_el.textContent = data[0].label
  }
  async function btn_click(params) {
    console.log(params)
  }
  async function inject (data) {
    style_el.innerHTML = data.join('\n')
  }
}

}).call(this)}).call(this,"/doc/state/example3/node_modules/btn1.js")
},{"../../../../src/node_modules/STATE":9}],4:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

const textitle = 'second text'

function fallback_module () {
  return {
    api: fallback_instance,
  }
  function fallback_instance () {
    return {
      drive: {
        style: {
          'theme.css': {
            raw: `
            button{
              padding: 8px 16px;
            }`
          }
        },
        lang: {
          'en-us.json': {
            raw: {
              label: 'Button 2'
            }
          }
        }
      }
    }
  }
}
module.exports = btn1
async function btn1 (opts) {
  const { id, sdb } = await get(opts.sid)
  const on = {
    style: inject,
    lang: fill
  }

  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
	<button></button>
	<style></style>`

  const button_el = shadow.querySelector('button')
  const style_el = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)

  button_el.onclick = btn_click
  return el
  function onbatch (batch) {
    for (const { type, data } of batch) {
      on[type] && on[type](data)
    }
  }
  async function fill (data) {
    button_el.textContent = data[0].label
  }
  async function btn_click(params) {
    console.log(params)
  }
  async function inject (data) {
    style_el.innerHTML = data.join('\n')
  }
}

}).call(this)}).call(this,"/doc/state/example3/node_modules/btn2.js")
},{"../../../../src/node_modules/STATE":9}],5:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

const textitle = 'third text'

function fallback_module () {
  return {
    api: fallback_instance,
  }
  function fallback_instance () {
    return {
      drive: {
        style: {
          'theme.css': {
            raw: `
            button{
              padding: 8px 16px;
            }`
          }
        },
        lang: {
          'en-us.json': {
            raw: {
              label: 'Button 3'
            }
          }
        }
      }
    }
  }
}
module.exports = btn1
async function btn1 (opts) {
  const { id, sdb } = await get(opts.sid)
  const on = {
    style: inject,
    lang: fill
  }

  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
	<button></button>
	<style></style>`

  const button_el = shadow.querySelector('button')
  const style_el = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)

  button_el.onclick = btn_click
  return el
  function onbatch (batch) {
    for (const { type, data } of batch) {
      on[type] && on[type](data)
    }
  }
  async function fill (data) {
    button_el.textContent = data[0].label
  }
  async function btn_click(params) {
    console.log(params)
  }
  async function inject (data) {
    style_el.innerHTML = data.join('\n')
  }
}

}).call(this)}).call(this,"/doc/state/example3/node_modules/btn3.js")
},{"../../../../src/node_modules/STATE":9}],6:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

const textitle = 'forth text'

function fallback_module () {
  return {
    api: fallback_instance,
  }
  function fallback_instance () {
    return {
      drive: {
        style: {
          'theme.css': {
            raw: `
            button{
              padding: 8px 16px;
            }`
          }
        },
        lang: {
          'en-us.json': {
            raw: {
              label: 'Button 4'
            }
          }
        }
      }
    }
  }
}
module.exports = btn1
async function btn1 (opts) {
  const { id, sdb } = await get(opts.sid)
  const on = {
    style: inject,
    lang: fill
  }

  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
	<button></button>
	<style></style>`

  const button_el = shadow.querySelector('button')
  const style_el = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)

  button_el.onclick = btn_click
  return el
  function onbatch (batch) {
    for (const { type, data } of batch) {
      on[type] && on[type](data)
    }
  }
  async function fill (data) {
    button_el.textContent = data[0].label
  }
  async function btn_click(params) {
    console.log(params)
  }
  async function inject (data) {
    style_el.innerHTML = data.join('\n')
  }
}

}).call(this)}).call(this,"/doc/state/example3/node_modules/btn4.js")
},{"../../../../src/node_modules/STATE":9}],7:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)

function fallback_module () {
  return {
    api: fallback_instance
  }
  function fallback_instance () {
    return {
      drive: {
        text: {
          'content.txt': {
            raw: 'third text'
          }
        }
      }
    }
  }
}

module.exports = text
async function text (opts) {
  const { id, sdb } = await get(opts.sid)
  const on = {
    text: fill
  }

  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
	<span></span>
	<style>
		span {
			display: block;
			padding: 10px;
      }
	</style>`

  const span_el = shadow.querySelector('span')
  const style_el = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)

  return el
  function onbatch (batch) {
    for (const { type, data } of batch) {
      on[type] && on[type](data)
    }
  }
  async function fill ([data]) {
    span_el.textContent = data
  }
}

}).call(this)}).call(this,"/doc/state/example3/node_modules/text.js")
},{"../../../../src/node_modules/STATE":9}],8:[function(require,module,exports){
(function (__filename,__dirname){(function (){
const STATE = require('../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)
function fallback_module () {
  return {
    _: {
      app: {
        0: override_app
      }
    },
    drive: {
      theme: {
        'style.css': {
          raw: 'body { font-family: \'system-ui\'; }'
        }
      }
    }
  }

  function override_app ([app]) {
    const data = app()
    return data
  }
}

/******************************************************************************
  PAGE
******************************************************************************/
const app = require('app')
const sheet = new CSSStyleSheet()
config().then(() => boot({ sid: '' }))

async function config () {
  const path = path => new URL(`../src/node_modules/${path}`, `file://${__dirname}`).href.slice(8)
  const html = document.documentElement
  const meta = document.createElement('meta')
  const appleTouch = '<link rel="apple-touch-icon" sizes="180x180" href="./src/node_modules/assets/images/favicon/apple-touch-icon.png">'
  // const icon32 = '<link rel="icon" type="image/png" sizes="32x32" href="./src/node_modules/assets/images/favicon/favicon-32x32.png">'
  // const icon16 = '<link rel="icon" type="image/png" sizes="16x16" href="./src/node_modules/assets/images/favicon/favicon-16x16.png">'
  // const webmanifest = '<link rel="manifest" href="./src/node_modules/assets/images/favicon/site.webmanifest"></link>'
  const font = 'https://fonts.googleapis.com/css?family=Nunito:300,400,700,900|Slackey&display=swap'
  const loadFont = `<link href=${font} rel='stylesheet' type='text/css'>`
  html.setAttribute('lang', 'en')
  meta.setAttribute('name', 'viewport')
  meta.setAttribute('content', 'width=device-width,initial-scale=1.0')
  // @TODO: use font api and cache to avoid re-downloading the font data every time
  document.head.append(meta)
  document.head.innerHTML += appleTouch + loadFont // + icon16 + icon32 + webmanifest
  document.adoptedStyleSheets = [sheet]
  await document.fonts.ready // @TODO: investigate why there is a FOUC
}
/******************************************************************************
  PAGE BOOT
******************************************************************************/
async function boot (opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const on = {
    theme: inject
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
  document.body.style.margin = 0

  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  { // desktop
    shadow.append(await app(subs[1]))
  }
  // ----------------------------------------
  // INIT
  // ----------------------------------------

  function onbatch (batch) {
    for (const { type, data } of batch) {
      on[type] && on[type](data)
    }
  }
}
async function inject (data) {
  sheet.replaceSync(data.join('\n'))
}

}).call(this)}).call(this,"/doc/state/example3/page.js","/doc/state/example3")
},{"../../../src/node_modules/STATE":9,"app":2}],9:[function(require,module,exports){
const localdb = require('localdb')
const db = localdb()
/** Data stored in a entry in db by STATE (Schema): 
 * id (String): Node Path 
 * name (String/Optional): Any (To be used theme_widget)
 * type (String): Module Name for module / Module id for instances
 * hubs (Array): List of hub-nodes
 * subs (Array): List of sub-nodes
 * inputs (Array): List of input files
 */
// Constants and initial setup (global level)
const VERSION = 10

const status = {
  root_module: true, 
  root_instance: true, 
  overrides: {},
  tree: {},
  tree_pointers: {},
  modulepaths: {},
  inits: [],
  open_branches: {},
  db,
  local_statuses: {},
  dataset_api: {}
}
window.STATEMODULE = status

// Version check and initialization
status.fallback_check = Boolean(check_version())
status.fallback_check && db.add(['playproject_version'], VERSION)


// Symbol mappings
const listeners = {}
const s2i = {}
const i2s = {}
let admins = [0]

// Inner Function
function STATE (address, modulepath) {
  status.modulepaths[modulepath] = 0
  //Variables (module-level)

  let local_status = {
    name: extract_filename(address),
    module_id: modulepath,
    deny: {},
    sub_modules: [],
    sub_instances: {}
  }
  status.local_statuses[modulepath] = local_status
  return statedb
  
  function statedb (fallback) {
    const data = fallback()
    if(data._)
      status.open_branches[modulepath] = Object.keys(data._).length

    local_status.fallback_module = new Function(`return ${fallback.toString()}`)()
    const updated_status = append_tree_node(modulepath, status)
    Object.assign(status.tree_pointers, updated_status.tree_pointers)
    Object.assign(status.open_branches, updated_status.open_branches)
    status.inits.push(init_module)

    if(!Object.values(status.open_branches).reduce((acc, curr) => acc + curr, 0))
      status.inits.forEach(init => init())
    
    const sdb = create_statedb_interface(local_status, modulepath, xtype = 'module')
    status.dataset_api[modulepath] = sdb.private_api
    return {
      id: modulepath,
      sdb: sdb.public_api,
      subs: [get],
      // sub_modules
    }
  }
  function append_tree_node (id, status) {
    const [super_id, name] = id.split(/\/(?=[^\/]*$)/)

    if(name){
      if(status.tree_pointers[super_id]){
        status.tree_pointers[super_id]._[name] = { _: {} }
        status.tree_pointers[id] = status.tree_pointers[super_id]._[name]
        status.open_branches[super_id]--
      }
      else{
        let temp_name, new_name = name
        let new_super_id = super_id
        while(!status.tree_pointers[new_super_id]){
          [new_super_id, temp_name] = new_super_id.split(/\/(?=[^\/]*$)/)
          new_name = temp_name + '.' + new_name
        }
        status.tree_pointers[new_super_id]._[new_name] = { _: {} }
        status.tree_pointers[id] = status.tree_pointers[new_super_id]._[new_name]
        status.open_branches[new_super_id]--
      }
    }
    else{
      status.tree[id] = { _: {} }
      status.tree_pointers[id] = status.tree[id]
    }
    return status
  }
  function init_module () {
    const {statedata, state_entries, newstatus, updated_local_status} = get_module_data(local_status.fallback_module)
    statedata.orphan && (local_status.orphan = true)
    //side effects
    if (status.fallback_check) {
      Object.assign(status.root_module, newstatus.root_module)
      Object.assign(status.overrides, newstatus.overrides)
      // console.log('Main module: ', statedata.name, '\n', state_entries)
      local_status = updated_local_status ? updated_local_status : local_status
      local_status.fallback_instance = statedata.api
      db.append(['state'], state_entries)
      // add_source_code(statedata.inputs) // @TODO: remove side effect
    }

    [local_status.sub_modules, symbol2ID, ID2Symbol] = symbolfy(statedata, local_status)
    Object.assign(s2i, symbol2ID)
    Object.assign(i2s, ID2Symbol)
    
    //Setup local data (module level)
    if(status.root_module){
      status.root_module = false
      statedata.admins && admins.push(...statedata.admins)
    }
    // @TODO: handle sub_modules when dynamic require is implemented
    // const sub_modules = {}
    // statedata.subs && statedata.subs.forEach(id => {
    //   sub_modules[db.read(['state', id]).type] = id
    // })
  }
  function get (sid) {
    const {statedata, state_entries, newstatus} = get_instance_data(sid)

    if (status.fallback_check) {
      Object.assign(status.root_module, newstatus.root_module)
      Object.assign(status.overrides, newstatus.overrides)
      Object.assign(status.tree, newstatus.tree)
      // console.log('Main instance: ', statedata.name, '\n', state_entries)
      db.append(['state'], state_entries)
    }
    [local_status.sub_instances[statedata.id], symbol2ID, ID2Symbol] = symbolfy(statedata, local_status)
    Object.assign(s2i, symbol2ID)
    Object.assign(i2s, ID2Symbol)
    const sdb = create_statedb_interface(local_status, statedata.id, xtype = 'instance')
    status.dataset_api[statedata.id] = sdb.list
    return {
      id: statedata.id,
      sdb: sdb.public_api,
    }
  }
  function get_module_data (fallback) {
    let data = db.read(['state', modulepath])

    if (status.fallback_check) {
      if (data) {
        var {sanitized_data, updated_status} = validate_and_preprocess({ fun_status: status, fallback, xtype: 'module', pre_data: data })
      } 
      else if (status.root_module) {
        var {sanitized_data, updated_status} = validate_and_preprocess({ fun_status: status, fallback, xtype: 'module', pre_data: {id: modulepath}})
      } 
      else {
        var {sanitized_data, updated_status, updated_local_status} = find_super({ xtype: 'module', fallback, fun_status:status, local_status })
      }
      data = sanitized_data.entry
    }
    return {
      statedata: data,
      state_entries: sanitized_data?.entries,
      newstatus: updated_status,
      updated_local_status
    }
  }
  function get_instance_data (sid) {
    let id = s2i[sid]
    let data = id && db.read(['state', id])
    let sanitized_data, updated_status = status
    if (status.fallback_check) {
      if (!data && !status.root_instance) {
        ({sanitized_data, updated_status} = find_super({ xtype: 'instance', fallback: local_status.fallback_instance, fun_status: status }))
      } else {
        ({sanitized_data, updated_status} = validate_and_preprocess({
          fun_status: status,
          fallback: local_status.fallback_instance, 
          xtype: 'instance',
          pre_data: data || {id: get_instance_path(modulepath)}
        }))
        updated_status.root_instance = false
      }
      data = sanitized_data.entry
    }
    else if (status.root_instance) {
      data = db.read(['state', id || get_instance_path(modulepath)])
      updated_status.tree = JSON.parse(JSON.stringify(status.tree))
      updated_status.root_instance = false
    }
    
    if (!data && local_status.orphan) {
      data = db.read(['state', get_instance_path(modulepath)])
    }
    return {
      statedata: data,
      state_entries: sanitized_data?.entries,
      newstatus: updated_status,
    }
  }
  function find_super ({ xtype, fallback, fun_status, local_status }) {
    const modulepath_super = modulepath.split(/\/(?=[^\/]*$)/)[0]
    const split = modulepath.split('/')
    const name = split.at(-2) + '.' + split.at(-1)
    let data

    if(xtype === 'module'){
      data = db.read(['state', modulepath_super])
      data.path = data.id = modulepath
      local_status.name = name
    }
    else{
      data = db.read(['state', modulepath_super + ':0'])
      data.path = data.id = get_instance_path(modulepath)
    }
    data.name = split.at(-1)
    return { updated_local_status: local_status,
      ...validate_and_preprocess({ 
      fun_status,
      fallback, xtype, 
      pre_data: data, 
      orphan_check: true }) }
  }
  function validate_and_preprocess ({ fallback, xtype, pre_data = {}, orphan_check, fun_status }) {
    let {id: pre_id, hubs: pre_hubs, mapping} = pre_data

    validate(fallback())
    if(fun_status.overrides[pre_id]){
      fallback_data = fun_status.overrides[pre_id].fun[0](get_fallbacks({ fallback, modulename: local_status.name, modulepath, instance_path: pre_id }))
      fun_status.overrides[pre_id].by.splice(0, 1)
      fun_status.overrides[pre_id].fun.splice(0, 1)
    }
    else
      fallback_data = fallback()

    fun_status.overrides = register_overrides({ overrides: fun_status.overrides, tree: fallback_data, path: modulepath, id: pre_id })
    // console.log('overrides: ', fun_status.overrides)
    orphan_check && (fallback_data.orphan = orphan_check)
    //This function makes changes in fun_status (side effect)
    return {
      sanitized_data: sanitize_state({ local_id: '', entry: fallback_data, path: pre_id, xtype, mapping }),
      updated_status: fun_status
    }
    
    function sanitize_state ({ local_id, entry, path, hub_entry, local_tree, entries = {}, xtype, mapping }) {
      [path, entry, local_tree] = extract_data({ local_id, entry, path, hub_entry, local_tree, xtype })
      
      entry.id = path
      entry.name = entry.name || local_id.split(':')[0] || local_status.name
      mapping && (entry.mapping = mapping)
      
      entries = {...sanitize_subs({ local_id, entry, path, local_tree, xtype, mapping })}
      
      delete entry._
      entries[entry.id] = entry
      // console.log('Entry: ', entry)
      return {entries, entry}
    }
    function extract_data ({ local_id, entry, path, hub_entry, xtype }) {
      if (local_id) {
        entry.hubs = [hub_entry.id]
        if (xtype === 'instance') {
          let temp_path = path.split(':')[0]
          temp_path = temp_path ? temp_path + '/' : temp_path
          const module_id = temp_path + local_id.split('$')[0]
          entry.type = module_id
          path = module_id + ':' + (status.modulepaths[module_id]++ || 0)
        }
        else {
          entry.type = local_id
          path = path ? path + '/' : ''
          path = path + local_id
        }
      } 
      else {
        if (xtype === 'instance') {
          entry.type = local_status.module_id
        } else {
          local_tree = JSON.parse(JSON.stringify(entry))
          // @TODO Handle JS file entry
          // console.log('pre_id:', pre_id)
          // const file_id = local_status.name + '.js'
          // entry.drive || (entry.drive = {})
          // entry.drive[file_id] = { $ref: address }
          entry.type = local_status.name
        }
        pre_hubs && (entry.hubs = pre_hubs)
      }
      return [path, entry, local_tree]
    }
    function sanitize_subs ({ local_id, entry, path, local_tree, xtype, mapping }) {
      const entries = {}
      if (!local_id) {
        entry.subs = []
        if(entry._){
          //@TODO refactor when fallback structure improves
          Object.entries(entry._).forEach(([local_id, value]) => {
            const sub_entry = sanitize_state({ local_id, entry: value, path, hub_entry: entry, local_tree, xtype, mapping: value['mapping'] }).entry
            entries[sub_entry.id] = JSON.parse(JSON.stringify(sub_entry))
            entry.subs.push(sub_entry.id)
            if(xtype === 'module')
              Object.keys(value).forEach(override => {
                if(!isNaN(parseInt(override))){
                  const sub_instance = sanitize_state({ local_id, entry: value, path, hub_entry: entry, local_tree, xtype: 'instance', mapping: value['mapping'] }).entry
                  entries[sub_instance.id] = sub_instance
                  entry.subs.push(sub_instance.id)
                }
              })
        })}
        if (entry.drive) {
          // entry.drive.theme && (entry.theme = entry.drive.theme)
          // entry.drive.lang && (entry.lang = entry.drive.lang)
          entry.inputs = []
          const new_drive = []
          Object.entries(entry.drive).forEach(([dataset_name, dataset]) => {
            const new_dataset = { files: [], mapping: [] }
            Object.entries(dataset).forEach(([key, value]) => {
              const sanitized_file = sanitize_file(key, value, entry)
              entries[sanitized_file.id] = sanitized_file
              new_dataset.files.push(sanitized_file.id)
            })
            new_dataset.id = local_status.name + '.' + dataset_name + '.dataset'
            new_dataset.name = dataset_name
            const copies = Object.keys(db.read_all(['state', new_dataset.id]))
            if (copies.length) {
              const id = copies.sort().at(-1).split(':')[1]
              new_dataset.id = new_dataset.id + ':' + (Number(id || 0) + 1)
            }
            entries[new_dataset.id] = new_dataset
            entry.inputs.push(new_dataset.id)
            new_drive.push(new_dataset.id)


            if(!status.root_module){
              const hub_entry = db.read(['state', entry.hubs[0]])
              const mapped_file_name = mapping?.[dataset_name] || dataset_name
              hub_entry.inputs.forEach(input_id => {
                const input = db.read(['state', input_id])
                if(mapped_file_name === input.name){
                  input.mapping.push(new_dataset.id)
                  entries[input_id] = input
                  return
                }
              })
            }
          })
          entry.drive = new_drive
        }
      }
      return entries
    }
    function sanitize_file (file_id, file, entry) {
      const type = file_id.split('.').at(-1)

      if (!isNaN(Number(file_id))) return file_id


      file.id = local_status.name + '.' + type
      file.name = file.name || file.id
      file.local_name = file_id
      file.type = type
      file[file.type === 'js' ? 'subs' : 'hubs'] = [entry.id]
      
      const copies = Object.keys(db.read_all(['state', file.id]))
      if (copies.length) {
        const id = copies.sort().at(-1).split(':')[1]
        file.id = file.id + ':' + (Number(id || 0) + 1)
      }
      return file
    }
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
  const expected_structure = {
    '_': {
      ":*": { // Required key, any name allowed
        "0": () => {}, // Optional key
      },
    },
    'drive': {
      ":*:object|string": { // Required key, any name allowed
        "raw|link:*:object|string": {}, // data or link are names, required, object or string are types
        "link": "string"
      },
    },
  };


  const errors = validate_shape(data, expected_structure)
  // if (errors.length > 0) 
  //   console.error("Validation failed:\n", errors.join('\n'))

  function validate_shape (obj, expected, super_node = 'root', path = '') {
    const errors = []
    const keys = Object.keys(obj)
    const values = Object.values(obj)

    Object.entries(expected).forEach(([expected_key, expected_value]) => {
      let [expected_key_names, required, expected_types] = expected_key.split(':')
      expected_types = expected_types ? expected_types.split('|') : [typeof(expected_value)]
      let absent = true

      if(expected_key_names)
        expected_key_names.split('|').forEach(expected_key_name => {
          const value = obj[expected_key_name]
          if(value !== undefined){
            const type = typeof(value)
            absent = false

            if(expected_types.includes(type))
              type === 'object' && errors.push(...validate_shape(value, expected_value, expected_key_name, path + '/' + expected_key_name))
            else
              console.error(`Type mismatch: Expected "${expected_types.join(' or ')}" got "${type}" for key "${expected_key_name}" at:`, obj, "of", path)
          }
        })
      else if(required){
        values.forEach((value, index) => {
          absent = false
          const type = typeof(value)

          if(expected_types.includes(type))
            type === 'object' && errors.push(...validate_shape(value, expected_value, keys[index], path + '/' + keys[index]))
          else
            console.error(`Type mismatch: Expected "${expected_types.join(' or ')}" got "${type}" for key "${keys[index]}" at: `, obj, "of", path)
        })
      }

      if(absent && required){
        if(expected_key_names)
          errors.push(`Can't find required key "${expected_key_names.replace('|', ' or ')}" at: `, obj, "of", path)
        else
          errors.push(`No subs found for super key "${super_node}" at sub:`, obj, "of", path)
      }
    })
    return errors
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
async function get_input ({ id, name, $ref, type, raw }) {
  const xtype = (typeof(id) === "number" ? name : id).split('.').at(-1)
  let result = db.read([type, id])
  
  if (!result) {
    result = raw !== undefined ? raw : await((await fetch($ref))[xtype === 'json' ? 'json' : 'text']())
  }
  return result
}
//Unavoidable side effect
function add_source_code (hubs) {
  hubs.forEach(async id => {
    const data = db.read(['state', id])
    if (data.type === 'js') {
      data.data = await get_input(data)
      db.add(['state', data.id], data)
      return
    }
  })
}
function symbolfy (data) {
  const s2i = {}
  const i2s = {}
  const subs = []
  data.subs && data.subs.forEach(sub => {
    const substate = db.read(['state', sub])
    s2i[i2s[sub] = Symbol(sub)] = sub
    subs.push({ sid: i2s[sub], type: substate.type })
  })
  return [subs, s2i, i2s]
}
function register_overrides ({overrides, ...args}) {
  recurse(args)
  return overrides
  function recurse ({ tree, path = '', id, xtype = 'instance', local_modulepaths = {} }) {
    let check_override = true
    let check_sub = false
    local_modulepaths[path] = 0
    if(xtype === 'module'){
      Object.entries(([id, override]) => {
        if(!isNaN(parseInt(id))){
          check_override = true
          let resultant_path = path + ':' + id
          if(overrides[resultant_path]){
            overrides[resultant_path].fun.push(override)
            overrides[resultant_path].by.push(id)
          }
          else
            overrides[resultant_path] = {fun: [override], by: [id]}
        }
      })
    }
    else{
      check_override = Boolean(tree[0])
      if (check_override) {
        const resultant_path = get_instance_path(path.split('$')[0], local_modulepaths)
        if(overrides[resultant_path]){
          overrides[resultant_path].fun.push(tree[0])
          overrides[resultant_path].by.push(id)
        }
        else
          overrides[resultant_path] = {fun: [tree[0]], by: [id]}
      }
    }
    
    path = path ? path + '/' : path
    
    if (tree._) {
      Object.entries(tree._).forEach(([type, data]) => {
        const check = recurse({ tree: data, path: path + type.replace('.', '/'), id, xtype, local_modulepaths })
        if (!check) check_sub = true
      })
    }
    
    return !(check_override || check_sub)
  }
}
function get_fallbacks ({ fallback, modulename, modulepath, instance_path }) {
  return [mutated_fallback, ...status.overrides[instance_path].fun]
    
  function mutated_fallback () {
    const data = fallback()

    data.overrider = status.overrides[instance_path].by[0]
    merge_trees(data, modulepath)
    return data

    function merge_trees (data, path) {
      if (data._) {
        Object.entries(data._).forEach(([type, data]) => merge_trees(data, path + '/' + type.split('$')[0].replace('.', '/')))
      } else {
        const id = db.read(['state', path]).id
        data._ = status.tree_pointers[id]._
      }
    }
  }
}
function check_version () {
  if (db.read(['playproject_version']) != VERSION) {
    localStorage.clear()
    return true
  }
}

// Public Function
function create_statedb_interface (local_status, node_id, xtype) {
  return {
    public_api: {
      watch, get_sub, req_access
    },
    private_api: {
      list, register
    }
  }
  async function watch (listener) {
    const data = db.read(['state', node_id])
    if(listener){
      listeners[data.id] = listener
      const input_map = []
      
      if (data.inputs) {
        await Promise.all(data.inputs.map(async input => {
          let data = []
          const dataset = db.read(['state', input])
          await Promise.all(dataset.files.map(async file_id => {
            const input_state = db.read(['state', file_id])
            data.push(await get_input(input_state))
          }))
          input_map.push({ type: dataset.name, data })
        }))
      }
      
      listener(input_map)
    }
    return xtype === 'module' ? local_status.sub_modules : local_status.sub_instances[node_id]
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
        list,
        register,
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
  function list (dataset_name) {
    const entry = db.read(['state', node_id])
    if(dataset_name){
      let target_dataset
      entry.drive.forEach(dataset_id => {
        const dataset = db.read(['state', dataset_id])
        if (dataset.name === dataset_name){
          target_dataset = dataset
          return 
        }
      })
      return target_dataset.files
    }
    else{
      const datasets = []
      entry.drive.forEach(dataset_id => {
        datasets.push(db.read(['state', dataset_id]).name)
      })
      return datasets
    }
  }
  function register (dataset_name, files, mapping) {
    const new_dataset = { files, mapping: mapping?.subs }
    new_dataset.id = local_status.name + '.' + dataset_name + '.dataset'
    new_dataset.name = dataset_name
    const copies = Object.keys(db.read_all(['state', new_dataset.id]))
    if (copies.length) {
      const id = copies.sort().at(-1).split(':')[1]
      new_dataset.id = new_dataset.id + ':' + (Number(id || 0) + 1)
    }

    const entry = db.read(['state', node_id])
    db.push(['state', node_id, 'drive'], new_dataset.id)
    db.add(['state', new_dataset.id], new_dataset)
    if(entry.hubs){
      const hub_drive = db.read(['state', entry.hubs[0]])
      hub_drive.forEach(id => {
        const super_dataset = db.read(['state', id])
        if(super_dataset.name === mapping?.super){
          if(!super_dataset.mapping.includes(mapping.super))
            db.push(['state', id, 'mapping'], mapping.super)
          return
        }
      })
    }
    return node_id + ' registered ' + dataset_name
  }
}


module.exports = STATE
},{"localdb":10}],10:[function(require,module,exports){
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
    const independent_key = keys.slice(0, -1)
    const data = JSON.parse(localStorage[prefix + independent_key.join('/')])
    console.log(independent_key, keys.at(-1))
    data[keys.at(-1)].push(value)
    localStorage[prefix + independent_key.join('/')] = JSON.stringify(data)
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
