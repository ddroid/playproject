(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={
  "0": {
    "id": 0,
    "name": "demo",
    "type": "module",
    "xtype": "demo",
    "admins": ["theme_editor", "theme_widget"],
    "slot": {
      "": [["", "subs"]],
      "subs": [1]
    }
  },
  "1": {
    "id": 1,
    "name": "demo",
    "type": "instance",
    "xtype": "demo",
    "slot": {
      "": [["hubs", "subs"], ["inputs"]],
      "hubs": [0],
      "subs": [7],
      "inputs": [10]
    }
  },
  "2": {
    "id": 2,
    "name": "modules",
    "type": "folder",
    "slot": {
      "": [["", "subs"]],
      "subs": [6, 12, 16, 21, 25]
    }
  },
  "3": {
    "id": 3,
    "name": "css",
    "type": "folder",
    "slot": {
      "": [["", "subs"]],
      "subs": [14, 18, 23, 27]
    }
  },
  "4": {
    "id": 4,
    "name": "content",
    "type": "folder",
    "slot": {
      "": [["", "subs"]],
      "subs": [19, 28]
    }
  },
  "5": {
    "id": 5,
    "name": "source",
    "type": "folder",
    "slot": {
      "": [["", "subs"]],
      "subs": [9, 11, 15, 20, 24]
    }
  },
  "6": {
    "id": 6,
    "name": "index",
    "type": "module",
    "xtype": "index",
    "slot": {
      "": [["hubs", "subs"]],
      "hubs": [2, 9],
      "subs": [7]
    }
  },
  "7": {
    "id": 7,
    "name": "index",
    "type": "instance",
    "xtype": "index",
    "slot": {
      "": [["hubs", "subs"], ["inputs"]],
      "hubs": [1, 6, 9],
      "inputs": [8],
      "subs": [13, 26]
    }
  },
  "8": {
    "id": 8,
    "name": "index.css",
    "type": "css",
    "xtype": "css",
    "file": "src/node_modules/css/default/index.css",
    "slot": {
      "": [["hub"]],
      "hubs": [3, 7]
    }
  },
  "9": {
    "id": 9,
    "name": "index.js",
    "type": "js",
    "xtype": "js",
    "file": "src/index.js",
    "slot": {
      "": [["hubs", "subs"]],
      "hubs": [5],
      "subs": [6, 7]
    }
  },
  "10": {
    "id": 10,
    "name": "demo.css",
    "type": "css",
    "xtype": "css",
    "file": "src/node_modules/css/default/demo.css",
    "slot": {
      "": [["hub"]],
      "hubs": [3, 1]
    }
  },
  "11": {
    "id": 11,
    "name": "theme_widget.js",
    "type": "js",
    "xtype": "js",
    "file": "src/node_modules/theme_widget/theme_widget.js",
    "slot": {
      "": [["hubs", "subs"]],
      "hubs": [5],
      "subs": [12, 13]
    }
  },
  "12": {
    "id": 12,
    "name": "theme_widget",
    "type": "module",
    "xtype": "theme_widget",
    "slot": {
      "": [["hubs", "subs"]],
      "hubs": [2, 11],
      "subs": [13]
    }
  },
  "13": {
    "id": 13,
    "name": "theme_widget",
    "type": "instance",
    "xtype": "theme_widget",
    "slot": {
      "": [["hubs", "subs"], ["inputs"]],
      "hubs": [12, 7, 11],
      "inputs": [14],
      "subs": [17, 22]
    }
  },
  "14": {
    "id": 14,
    "name": "theme_widget.css",
    "type": "css",
    "xtype": "css",
    "file": "src/node_modules/css/default/theme_widget.css",
    "slot": {
      "": [["hubs"]],
      "hubs": [3, 13]
    }
  },
  "15": {
    "id": 15,
    "name": "graph_explorer.js",
    "type": "js",
    "xtype": "js",
    "file": "src/node_modules/graph_explorer/graph_explorer.js",
    "slot": {
      "": [["hubs", "subs"]],
      "hubs": [5],
      "subs": [16, 17]
    }
  },
  "16": {
    "id": 16,
    "name": "graph_explorer",
    "type": "module",
    "xtype": "graph_explorer",
    "slot": {
      "": [["hubs", "subs"]],
      "hubs": [2, 15],
      "subs": [17]
    }
  },
  "17": {
    "id": 17,
    "name": "graph_explorer",
    "type": "instance",
    "xtype": "graph_explorer",
    "slot": {
      "": [["hubs"], ["inputs"]],
      "hubs": [16, 13, 15],
      "inputs": [18, 19]
    }
  },
  "18": {
    "id": 18,
    "name": "graph_explorer.css",
    "type": "css",
    "xtype": "css",
    "file": "src/node_modules/css/default/graph_explorer.css",
    "slot": {
      "": [["hubs"]],
      "hubs": [3, 17]
    }
  },
  "19": {
    "id": 19,
    "name": "graph_explorer.json",
    "type": "json",
    "xtype": "content",
    "file": "src/content/graph_explorer.json",
    "slot": {
      "": [["hubs"]],
      "hubs": [4, 17]
    }
  },
  "20": {
    "id": 20,
    "name": "theme_editor.js",
    "type": "js",
    "xtype": "js",
    "file": "src/node_modules/theme_editor/theme_editor.js",
    "slot": {
      "": [["hubs", "subs"]],
      "hubs": [5],
      "subs": [21, 22]
    }
  },
  "21": {
    "id": 21,
    "name": "theme_editor",
    "type": "module",
    "xtype": "theme_editor",
    "slot": {
      "": [["hubs", "subs"]],
      "hubs": [2, 20],
      "subs": [22]
    }
  },
  "22": {
    "id": 22,
    "name": "theme_editor",
    "type": "instance",
    "xtype": "theme_editor",
    "slot": {
      "": [["hubs"], ["inputs"]],
      "hubs": [21, 13, 20],
      "inputs": [23]
    }
  },
  "23": {
    "id": 23,
    "name": "theme_editor.css",
    "type": "css",
    "xtype": "css",
    "file": "src/node_modules/css/default/theme_editor.css",
    "slot": {
      "": [["hubs"]],
      "hubs": [3, 22]
    }
  },
  "24": {
    "id": 24,
    "name": "topnav.js",
    "type": "js",
    "xtype": "js",
    "file": "src/node_modules/topnav/topnav.js",
    "slot": {
      "": [["hubs", "subs"]],
      "hubs": [5],
      "subs": [25, 26]
    }
  },
  "25": {
    "id": 25,
    "name": "topnav",
    "type": "module",
    "xtype": "topnav",
    "slot": {
      "": [["hubs", "subs"]],
      "hubs": [2, 24],
      "subs": [26]
    }
  },
  "26": {
    "id": 26,
    "name": "topnav",
    "type": "instance",
    "xtype": "topnav",
    "slot": {
      "": [["hubs"], ["inputs"]],
      "hubs": [25, 7, 24],
      "inputs": [27, 28]
    }
  },
  "27": {
    "id": 27,
    "name": "topnav.css",
    "type": "css",
    "xtype": "css",
    "file": "src/node_modules/css/default/topnav.css",
    "slot": {
      "": [["hubs"]],
      "hubs": [3, 26]
    }
  },
  "28": {
    "id": 28,
    "name": "topnav.json",
    "type": "content",
    "file": "src/content/topnav.json",
    "slot": {
      "": [["hubs"]],
      "hubs": [4, 26]
    }
  }
}

},{}],2:[function(require,module,exports){
(function (__filename){(function (){
/******************************************************************************
  STATE
******************************************************************************/
const STATE = require('STATE')
const name = 'index'
const statedb = STATE(__filename)
const shopts = { mode: 'closed' }
// ----------------------------------------
const { id, sdb, getdb } = statedb(fallback)
function fallback () { return require('./module.json') }
sdb.on(css => {})
/******************************************************************************
  MAKE_PAGE COMPONENT
******************************************************************************/
const IO = require('io')
const modules = {
 theme_widget : require('theme_widget'),
 topnav : require('topnav'),
//  header : require('header'),
//  datdot : require('datdot'),
//  editor : require('editor'),
//  smartcontract_codes : require('smartcontract_codes'),
//  supporters : require('supporters'),
//  our_contributors : require('our_contributors'),
//  footer : require('footer'),
}
module.exports = index

async function index(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await getdb(opts.sid, fallback) // hub is "parent's" io "id" to send/receive messages
  const on = {
    jump,
    inject,
  }
  const send = await IO(id, name, on)
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
  <div id="top" class='wrap'></div>
  <style></style>`
  const style = shadow.querySelector('style')
  const main = shadow.querySelector('div')

  const subs = await sdb.on({
    css: inject
  })
  console.log(subs)
  main.append(...await Promise.all(
    Object.entries(subs).map(async ([name, sids]) => {
      const el = document.createElement('div')
      el.name = name
      const shadow = el.attachShadow(shopts)
      shadow.append(await modules[name]({ sid: sids[0], hub: [id] }))
      return el
  })))
  return el
  
  function fallback() {
    return require('./instance.json')
  }
  async function jump ({ data }) {
    main.querySelector('#'+data).scrollIntoView({ behavior: 'smooth'})
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
}


}).call(this)}).call(this,"/src/index.js")
},{"./instance.json":3,"./module.json":4,"STATE":5,"io":11,"theme_widget":19,"topnav":22}],3:[function(require,module,exports){
module.exports={
  "0": {
    "slot": {
      "": [["", "subs"], ["inputs"]],
      "subs": [1],
      "inputs": ["index.css", "index.json"]
    }
  },
  "index.css": {
    "data": " ",
    "slot": {
      "": [["hubs"]],
      "hubs": [0]
    }
  },
  "index.json": {
    "type": "content",
    "data": {},
    "slot": {
      "": [["hubs"]],
      "hubs": [0]
    }
  },
  "1": {
    "name": "topnav",
    "slot": {
      "": [["hubs"]],
      "hubs": [0]
    }
  }
}
},{}],4:[function(require,module,exports){
module.exports={
  "0": {
      "slot": {
        "": [["hubs"]],
        "hubs": ["index.js"]
      }
    },
  "index.js": {
    "slot": {
      "": [["", "subs"]],
      "subs": [0]
    }
  }
}
},{}],5:[function(require,module,exports){
// STATE.js

const snapshot = require('../../snapshot.json')
const localdb = require('localdb')
const db = localdb()
const status = {root_module: true, root_instance: true}

if(db.read(['playproject_version']) != 4){
  localStorage.clear()
  status.snapshot = true
  db.add(['playproject_version'], 4)
}
// db.read(['state']) || db.add(['state'], {})

const listeners = {}
const s2i = {}
const i2s = {}
var admins = [0]

module.exports = STATE
function STATE(filename) {
  const parts = filename.split('/node_modules/')
  const last = parts.at(-1).split('/')
  let modulename = last.at(-1).slice(0, -3)
  let data
  const deny = {}, subs = {}
  const sdb = { on, get_sub, req_access }
  const admin = { xget, get_all, add_admins }
  return statedb

  function statedb (fallback) {
    data = db.get_by_value(['state'], {'name': modulename, type: 'module'})
    if(status.snapshot){
      if (status.root_module){
        status.snapshot = !snapshot
        snapshot ? db.append(['state'], snapshot) : preprocess(fallback())
        status.root_module = false
      }
      else
        preprocess(fallback())
      data = db.get_by_value(['state'], {'name': modulename, type: 'module'})
    }
    if(data.id == 0){
      data.admins && add_admins(data.admins)
    }
    data.slot.hubs && add_source(data.slot.hubs)
    return { id: data.id, sdb, getdb }
  }
  function add_source(hubs){
    hubs.forEach(id => {
      const data = db.read(['state', id])
      if(data.type === 'js'){
        fetch_save(data)
      }
    })
  }
  function symbolfy (data){
    data.slot.subs && data.slot.subs.forEach(sub => {
      const substate = db.read(['state', sub])
      s2i[i2s[sub] = Symbol(sub)] = sub
      subs[substate.xtype]?.push(i2s[sub]) || (subs[substate.xtype] = [i2s[sub]])
    })
  }
  function getdb (sid, fallback){
    const id = s2i[sid]
    data = db.read(['state', id])
    if(status.snapshot){
      preprocess_instance(fallback(), id)
      data = db.read(['state', id])
    }
    if(status.root_instance){
      data = db.get_by_value(['state'], {'name': modulename, type: 'instance'})
      status.root_instance = false
    }
    symbolfy(data)
    return {id, sdb}
  }
  async function on (local_listeners) {
    listeners[data.id] = local_listeners
    const input_map = {}
    data.slot.inputs && await Promise.all(data.slot.inputs.map(async input => {
      const input_state = db.read(['state', input])
      const input_data = await fetch_save(input_state)
      input_map[input_state.type]?.push(input_data) || (input_map[input_state.type] = [input_data])
    }))
    local_listeners && Object.entries(local_listeners).forEach(([datatype, listener]) => {
      input_map[datatype] && listener(input_map[datatype])
    })
    return subs
  }
  async function fetch_save({ id, name, file, type, data }) {
    const xtype = (typeof(id) === "number" ? name : id).split('.').at(-1)
    let result = db.read([ type, id ])
    if(!result){
      result = data || await((await fetch(file))[xtype === 'json' ?'json' :'text']())
      db.add([type, id], result)
    }
    return result
  }
  function get_sub (name) {
    return subs[name]
  }
  async function add_admins (ids) {
    admins.push(...ids)
  }
  function req_access (sid) {
    if (deny[sid]) throw new Error('access denied')
    const el = db.read(['state', s2i[sid]])
    if(admins.includes(s2i[sid]) || admins.includes(el?.name))
      return admin
  }
  function xget (id) {
    return db.read(['state', id])
  }
  function get_all () {
    return db.read_all(['state'])
  }
  function preprocess (raw_data) {
    let id = db.length(['state'])
    clean(raw_data[0])
    
    function clean (entry) {
      entry.id = id
      entry.name = modulename
      entry.type = 'module'
      db.add(['state', id], entry)
      const file = raw_data[entry.slot.hubs[0]]
      file.id = entry.slot.hubs[0]
      db.add(['state', file.id], file)
    }
  }
  function preprocess_instance (raw_data, new_id) {
    let count = db.length(['state'])
    const on = {
      subs: clean_instance,
      inputs: clean_file
    }
    clean_instance(0)

    function clean_instance (entry_id) {
      const entry = raw_data[entry_id]
      console.log(entry, modulename)
      entry.id = entry_id ? count++ : new_id
      entry.name = entry.name || modulename
      entry.type = 'instance'
      entry.xtype = entry.name
      const new_slot = {}
      Object.entries(entry.slot).forEach(([slot, ids]) => {
        const new_ids = []
        if(Object.keys(on).includes(slot))
          ids.forEach(id => new_ids.push(on[slot](id)))
        new_slot[slot] = new_ids
      })
      entry.slot = new_slot
      db.add(['state', entry.id], entry)
      return entry.id
    }
    function clean_file (file_id){
      const file = raw_data[file_id]
      file.id = file_id
      file.type = file.type || file.id.split('.').at(-1)
      db.add(['state', file_id], file)
      return file_id
    }
  }
  
}





//
//DUMP
//
async function pinit (url) {
  if (!STATE.init) throw new Error('already initialized')
  STATE.init = undefined
  Object.freeze(STATE)
  let data = db.read(['state'])
  if(!data){
    const res = await fetch(url)
    data = res.ok && await (res).json()
    db.add(['state'], data || {
      "0": {
        id: "0"
      }
    })
  }
  const length = db.length(['state'])
  for (var id = 0; id < length; id++) s2i[i2s[id] = Symbol(id)] = id
  return i2s[0]
  async function reset () {
    await db.clear()
  }
}
function static () {
  const sdb = { get, req_access }
  const deny = {}
  return sdb

  function symbolfy (data) {
    data?.sub && Object.entries(data.sub).forEach(assign)
    return data

    function assign([comp, ids]){
      if(typeof(ids) === 'object'){
        data.sub[comp] = []
        ids.forEach(id => {
          data.sub[comp].push(i2s[id])
          deny[i2s[id]] = true
        })
      }
      else{
        data.sub[comp] = i2s[ids]
        deny[i2s[ids]] = true
      }
    }
  }
  async function get (sid, fallback) {
    if (deny[sid]) throw new Error('access denied')
    const id = s2i[sid]
    let xnode = db.read(['state', id])
    if(Object.keys(xnode).length < 2)
      xnode = preprocess(await fallback())[id]
    return symbolfy(xnode)
  }
  function preprocess (local_data) {
    let count = db.length(['state'])
      Object.values(local_data)[0].id = id
      local_data[id] = Object.values(local_data)[0]
      id && delete(local_data[0])

      Object.values(local_data).forEach(node => {
        node.sub && Object.entries(node.sub).forEach(([comp, list]) => {
          node.sub[comp] = []
          list.forEach(id => {
            if(Number(id) > count){
              s2i[i2s[id] = Symbol(id)] = id
              local_data[id].id = id
              node.sub[comp].push(id)
            }
            else{
              s2i[i2s[count] = Symbol(count)] = count
              local_data[count] = local_data[id] || {}
              local_data[count].id = count
              id.includes('x') && delete(local_data[id])
              node.sub[comp].push(count++)
            }
          })
        })
      })
      db.append(['state'], local_data)
      return local_data
  }
  function req_access(sid) {
    if (deny[sid]) throw new Error('access denied')
    const el = db.read(['state', s2i[sid]])
    if(admins.includes(s2i[sid]) || admins.includes(el?.comp))
      return { xget, set_admins }
  }
  function xget(id) {
    return db.read(['state', id])
  }
  async function set_admins(ids) {
    admins = ids
  }
}
},{"../../snapshot.json":1,"localdb":13}],6:[function(require,module,exports){
(function (__filename){(function (){
/******************************************************************************
  STATE
******************************************************************************/
const STATE = require('STATE')
const name = 'graph_explorer'
const statedb = STATE(__filename)
// ----------------------------------------
const { id, sdb, getdb } = statedb(fallback)
function fallback () { return require('./module.json') }
sdb.on({ css: css => {} })

const IO = require('io')
const {copy, get_color, download_json} = require('helper')
/******************************************************************************
  GRAPH COMPONENT
******************************************************************************/
// ----------------------------------------
const shopts = { mode: 'closed' }
// ----------------------------------------

module.exports = graph_explorer

async function graph_explorer (opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await getdb(opts.sid, fallback)
  const hub_id = opts.hub[0]
  const status = { tab_id: 0, count: 0, entry_types: {}, menu_ids: [] }
  const on = {
    init,
    inject,
    scroll
  }
  const on_add = {
    entry: add_entry,
    menu: add_action
  }
  const send = await IO(id, name, on)
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  const style = document.createElement('style')
  await sdb.on({
    css: inject
  })
  shadow.innerHTML = `
  <main>

  </main>`
  const main = shadow.querySelector('main')
  shadow.append(style)
  shadow.addEventListener('copy', oncopy)

  return el

  /******************************************
   Mix
  ******************************************/
  async function fallback() {
    return require('./instance.json')
  }
  async function oncopy(e) {
    const selection = shadow.getSelection()
    e.clipboardData.setData('text/plain', copy(selection))
    e.preventDefault()
  }
  async function init ({ data }) {
    let id = Object.keys(data).length + 1

    add({ id, name: 'edit', type: 'action', slot: {hubs: []} })
    add({ id, name: 'link', type: 'action', slot: {hubs: []} })
    add({ id, name: 'unlink', type: 'action', slot: {hubs: []} })
    add({ id, name: 'drop', type: 'action', slot: {hubs: []} })

    status.graph = data
    console.log(data)
    const root_entries = Object.values(data).filter(entry => !entry.slot.hubs)
    root_entries.forEach((data, i) => add_entry({hub_el: main, data, last: i === root_entries.length - 1, ancestry:[] }))
    function add (args){
      status.menu_ids.push(args.id)
      data[id++] = args
    }
  }
  function html_template (data, space, pos){
    const element = document.createElement('div')
    element.classList.add(data.type, 'entry', 'a'+data.id)
    element.tabIndex = '0'
    element.dataset.space = space
    element.dataset.pos = pos
    return element
  }
  /******************************************
   Addition Operation
  ******************************************/
  // function add_el ({ data, parent, space, grand_last, type }){
  //   const is_single = parent.children.length ? false : true
  //   if(data.root){
  //     parent.prepend(add_root({ data, last: false}))
  //     return
  //   }
  //   //hub or sub node check
  //   if(type === 'inputs')
  //     parent.append(on_add[type]({ data, space, grand_last, first: is_single}))
  //   else
  //     parent.prepend(on_add[type]({ data, space, grand_last, last: is_single}))
  // }

  function add_action ({ hub_el, data, last, space = '' }) {
    const element = html_template(data, last, space)
    hub_el.append(element)
    !status.entry_types[data.type] && (status.entry_types[data.type] = Object.keys(status.entry_types).length)

    element.innerHTML = `
    <div class="slot_list">
      <span class="odd">${space}</span>
      <span class="type_emo odd"></span>
      <span class="name odd">${data.name}</span>
    </div>`
    const name = element.querySelector('.slot_list > .name')
    name.onclick = () => send({ type: 'click', to: hub_id, data })

  }
  function add_entry ({ hub_el, data, first, last, space = '', pos, ancestry }) {
    //Init
    const element = html_template(data, last, space, pos)
    !status.entry_types[data.type] && (status.entry_types[data.type] = Object.keys(status.entry_types).length)
    ancestry = [...ancestry]
    let lo_space = space + (last ? '&nbsp;&nbsp;&nbsp;' : '│&nbsp;&nbsp;')
    let hi_space = space + (first ? '&nbsp;&nbsp;&nbsp;' : '│&nbsp;&nbsp;')
    const space_handle = [], els = []
    let slot_no = 0, slot_on

    //HTML
    element.innerHTML = `
      <div class="entries hi_row">${space}${first ? '&nbsp;' : '│'}</div>
      <div class="slot_list">
        <span class="space odd"><!--
        -->${space}<span>${last ? '└' : first ? "┌" : '├'}</span><!--
        --><span class='on'>${last ? '┗' : first ? "┏" : '┠'}</span>
        </span><!--
        --><span class="menu_emo"></span><!--
        --><span class="type_emo odd"></span><!--
        --><span class="name odd">${data.name}</span>
      </div>
      <div class="entries lo_row">${space}${last ? '&nbsp;' : '│'}</div>
      <div class="menu entries"></div>
    `

    //Unavoidable mix
    hub_el.append(element)
    const copies = main.querySelectorAll('.a'+data.id + '> .slot_list')
    if(copies.length > 1){
      const color = get_color()
      copies.forEach(copy => copy.style.backgroundColor = color)
    }
    if(ancestry.includes(data.id))
      return
    ancestry.push(data.id)

    //Elements
    const slot_list = element.querySelector('.slot_list')
    const name = element.querySelector('.slot_list > .name')
    const menu_emo = element.querySelector('.slot_list > .menu_emo')
    const type_emo = element.querySelector('.slot_list > .type_emo')
    const menu = element.querySelector('.menu')
    const hi_row = element.querySelector('.hi_row')
    const lo_row = element.querySelector('.lo_row')

    //Listeners
    type_emo.onclick = type_click
    name.onclick = () => send({ type: 'click', to: hub_id, data })
    data.slot[''].forEach(handle_slot)
    menu_click({el: menu, emo: menu_emo, data: status.menu_ids, pos: 0, type: 'menu'})
    if(getComputedStyle(type_emo, '::before').content === 'none')
      type_emo.innerHTML = `[${status.entry_types[data.type]}]`

    //Procedures
    async function handle_slot (pair, i) {
      const slot_check = [false, false]
      const slot_emo = document.createElement('span')
      slot_emo.innerHTML = '<span></span><span>─</span>'
      menu_emo.before(slot_emo)
      slot_no++

      pair.forEach((x, j) => {
        let gap, mode, emo_on, arrow_gap
        const pos = !j
        const count = status.count++
        const entries = document.createElement('div')
        const arrow = document.createElement('span')
        const style = document.createElement('style')
        
        entries.classList.add('entries')
        element.append(style)
        if(pos){
          hi_row.before(entries)
          hi_row.append(arrow)
          mode= 'hi'
          gap = hi_space
          hi_space += `<span class="space${count}"><span class="hi">&nbsp;</span>${x ? '<span class="xhi">│</span>' : ''}&nbsp;&nbsp;</span>`
          arrow_gap = `<span class="space${count}"><span class="hi">&nbsp;</span><span class="xhi">│</span></span>`
        }
        else{
          menu.after(entries)
          lo_row.append(arrow)
          mode = 'lo'
          gap = lo_space
          lo_space += `<span class="space${count}"><span class="lo">&nbsp;</span>${x ? '<span class="xlo">│</span>' : ''}&nbsp;&nbsp;</span>`
          arrow_gap = `<span class="space${count}"><span class="lo">&nbsp;</span><span class="xlo">│</span></span>`
        }
        style.innerHTML = `.space${count} > .x${mode}{display: none;}`
        els.push(slot_emo)
        space_handle.push(() => style.innerHTML = `.space${count}${slot_on ? ` > .x${mode}` : ''}{display: none;}`)
        if(!x){
          const space = document.createElement('span')
          space.innerHTML = '&nbsp;&nbsp;&nbsp;'
          j ? lo_row.append(space) : hi_row.append(space)
          return
        }
        slot_emo.classList.add(x)
        arrow.classList.add(mode+'_emo')
        arrow.innerHTML = arrow_gap

        arrow.onclick = () => {
          arrow.classList.toggle('on')
          slot_emo.classList.add('on')
          style.innerHTML = `.space${count} > .${emo_on ? 'x' : ''}${mode}{display: none;}`
          // emo_on && space_handle[i]()
          slot_check[j] = emo_on = !emo_on
          if(slot_check[0] && slot_check[1])
            slot_emo.children[1].innerHTML = '┼'
          else if(slot_check[0] && !slot_check[1])
            slot_emo.children[1].innerHTML = '┴'
          else if(!slot_check[0] && slot_check[1])
            slot_emo.children[1].innerHTML = '┬'
          else{
            slot_emo.children[1].innerHTML = '─'
            slot_emo.classList.remove('on')
          }
          handle_click({space: gap, pos, el: entries, data: data.slot[x], ancestry })
        }
      })
      if(getComputedStyle(slot_emo, '::before').content === 'none')
        slot_emo.innerHTML = `<span>${slot_no}─</span><span>─</span>`
    }
    async function type_click() {
      slot_on = !slot_on
      if(status.xentry === type_emo)
        status.xentry = null
      else{
        status.xentry?.click()
        status.xentry = type_emo
      }
      slot_list.classList.toggle('on')
      hi_row.classList.toggle('show')
      lo_row.classList.toggle('show')
      let temp = element
      //Find path to root
      while(temp.tagName !== 'MAIN'){
        if(temp.classList.contains('entry')){
          slot_on ? temp.classList.add('on') : temp.classList.remove('on')
          while(temp.previousElementSibling){
            temp = temp.previousElementSibling
            slot_on ? temp.classList.add('on') : temp.classList.remove('on')
          }
        }
        temp = temp.parentElement
      }
      els.forEach((emo, i) => {
        if(!emo.classList.contains('on')){
          space_handle[i]()
        }
      })
    }
    async function menu_click({ emo, emo_on, ...rest }, i) {
      emo.onclick = () => {
        emo.classList.toggle('on')
        emo_on = !emo_on
        handle_click({space: lo_space, ...rest })
      }
    }
  }
  // async function add_node_data (name, type, parent_id, users, author){
  //   const node_id = status.graph.length
  //   status.graph.push({ id: node_id, name, type: state.code_words[type], room: {}, users })
  //   if(parent_id){
  //     save_msg({
  //         head: [id],
  //         type: 'save_msg',
  //         data: {username: 'system', content: author + ' added ' + type.slice(0,-1)+': '+name, chat_id: parent_id}
  //       })
  //     //Add a message in the chat
  //     if(state.chat_task && parent_id === state.chat_task.id.slice(1))
  //       channel_up.send({
  //         head: [id, channel_up.send.id, channel_up.mid++],
  //         type: 'render_msg',
  //         data: {username: 'system', content: author+' added '+type.slice(0,-1)+': '+name}
  //       })
  //     const sub_nodes = graph[parent_id][state.add_words[type]]
  //     sub_nodes ? sub_nodes.push(node_id) : graph[parent_id][state.add_words[type]] = [node_id]
  //   }
  //   else{
  //     graph[node_id].root = true
  //     graph[node_id].users = [opts.host]
  //   }
  //   save_msg({
  //     head: [id],
  //     type: 'save_msg',
  //     data: {username: 'system', content: author + ' created ' + type.slice(0,-1)+': '+name, chat_id: node_id}
  //   })
  //   const channel = state.net[state.aka.taskdb]
  //   channel.send({
  //     head: [id, channel.send.id, channel.mid++],
  //     type: 'set',
  //     data: graph
  //   })
    
  // }
  // async function on_add_node (data) {
  //   const node = data.id ? shadow.querySelector('#a' + data.id + ' > .'+data.type) : main
  //   node && node.children.length && add_el({ data: { name: data.name, id: status.graph.length, type: state.code_words[data.type] }, parent: node, grand_last: data.grand_last, type: data.type, space: data.space })
  //   add_node_data(data.name, data.type, data.id, data.users, data.user)
  // }
  /******************************************
   Event handlers
  ******************************************/
  function handle_focus (e) {
    state.xtask = e.target
    state.xtask.classList.add('focus')
    state.xtask.addEventListener('blur', e => {
      if(e.relatedTarget && e.relatedTarget.classList.contains('noblur'))
        return
      state.xtask.classList.remove('focus')
      state.xtask = undefined
    }, { once: true })
  }
  function handle_popup (e) {
    const el = e.target
    el.classList.add('show')
    popup.style.top = el.offsetTop - 20 + 'px'
    popup.style.left = el.offsetLeft - 56 + 'px'
    popup.focus()
    popup.addEventListener('blur', () => {
      el.classList.remove('show')
    }, { once: true })
  }
  function handle_click ({ el, data, pos, hub_id, type = 'entry', ...rest }) {
    el.classList.toggle('show')
    if(data && el.children.length < 1){
      length = data.length - 1
      data.forEach((value, i) => on_add[type]({ hub_el: el, data: {...status.graph[value], hub_id}, first: pos ? 0 === i : false, last: pos ? false : length === i, pos, ...rest }))
    }
  }
  async function handle_export () {
    const data = await traverse( state.xtask.id.slice(1) )
    download_json(data)
  }
  async function handle_add (data) {
    data = data.slice(2).trim().toLowerCase() + 's'
    const input = document.createElement('input')
    let node, task_id, space = '', grand_last = true, root = true
    //expand other siblings
    if(state.xtask){
      node = state.xtask.querySelector('.' + data)
      task_id = state.xtask.id.slice(1)
      const before = state.xtask.querySelector('.' + data.slice(0,3))
      before.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable: true, view: window}))
      node.classList.add('show')
      grand_last = state.xtask.dataset.grand_last
      space = state.xtask.dataset.space
      state.xtask.classList.remove('focus')
      state.xtask = undefined
      root = false
    }
    else{
      node = main
      task_id = ''
    }
    node.prepend(input)
    input.onkeydown = async (event) => {
      if (event.key === 'Enter') {
        input.blur()
        add_el({ data : { name: input.value, id: status.graph.length, type: state.code_words[data], root }, space, grand_last, type: data, parent: node })
        const users = task_id ? graph[task_id].users : [host]
        add_node_data(input.value, data, task_id, users, host)
        //sync with other users
        if(users.length > 1)
          channel_up.send({
            head: [id, channel_up.send.id, channel_up.mid++],
            type: 'send',
            data: {to: 'task_explorer', route: ['up', 'task_explorer'], users: graph[task_id].users.filter(user => user !== host), type: 'on_add_node', data: {name: input.value, id: task_id, type: data, users, grand_last, space, user: host} }
          })
      }
    }
    input.focus()
    input.onblur = () => input.remove()
  }
  /******************************************
   Tree traversal
  ******************************************/
  async function jump (e){
    let target_id = e.currentTarget.dataset.id
    const el = main.querySelector('#a'+target_id)
    if(el)
      el.focus()
    else{
      const path = []
      let temp
      for(temp = status.graph[target_id]; temp.hub; temp = status.graph[temp.hub[0]])
        path.push(temp.id)
      temp = main.querySelector('#a'+temp.id)
      target_id = 'a'+target_id
      while(temp.id !== target_id){
        const sub_emo = temp.querySelector('.sub_emo')
        sub_emo.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable: true, view: window}))
        temp.classList.add('show')
        temp = temp.querySelector('#a'+path.pop())
      }
      temp.focus()
    }
      
  }
  async function traverse (id) {
    state.result = []
    state.track = []
    recurse(id)
    return state.result
  }
  function recurse (id){
    if(state.track.includes(id))
      return
    state.result.push(graph[id])
    state.track.push(id)
    for(temp = 0; graph[id].sub && temp < graph[id].sub.length; temp++)
      recurse(graph[id].sub[temp])
    for(temp = 0; graph[id].inputs && temp < graph[id].inputs.length; temp++)
      recurse(graph[id].inputs[temp])
    for(temp = 0; graph[id].outputs && temp < graph[id].outputs.length; temp++)
      recurse(graph[id].outputs[temp])
  }
  /******************************************
   Communication
  ******************************************/
  async function scroll () {
    el.scrollIntoView({behavior: 'smooth'})
    el.tabIndex = '0'
    el.focus()
    el.onblur = () => {
      el.tabIndex = '-1'
      el.onblur = null
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
}
}).call(this)}).call(this,"/src/node_modules/graph_explorer/graph_explorer.js")
},{"./instance.json":7,"./module.json":8,"STATE":5,"helper":9,"io":11}],7:[function(require,module,exports){
module.exports={}
},{}],8:[function(require,module,exports){
module.exports={ 
  "0": {
    "comp": "graph_explorer"
  }
}
},{}],9:[function(require,module,exports){
function copy (selection) {
  const range = selection.getRangeAt(0)
  const selectedElements = []
  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_ELEMENT,
    {
        acceptNode: function(node) {
            return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        }
    },
    false
  )

  while (walker.nextNode()) {
      walker.currentNode.tagName === 'SPAN' && selectedElements.push(walker.currentNode)
  }
  let text = ''
  selectedElements.forEach(el => {
    const before = getComputedStyle(el, '::before').content
    text += (before === 'none' ? '' : before.slice(1, -1)) + el.textContent
    text += el.classList.contains('name') ? '\n' : ''
  })
  return text
}
function get_color () {
  const letters = 'CDEF89'
  let color = '#'
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)]
  }
  return color;
}
function download_json (data) {
  const json_string = JSON.stringify(data, null, 2);
  const blob = new Blob([json_string], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'data.json';
  link.click();
}
module.exports = {copy, get_color, download_json}
},{}],10:[function(require,module,exports){
const loadSVG = require('loadSVG')

function graphic(className, url) {
  
  return new Promise((resolve, reject) => {
    const el = document.createElement('div')
    el.classList.add(className)
    loadSVG(url, (err, svg) => {
      if (err) return console.error(err)
      el.append(svg)
      resolve(el)
    })
  })
}   

module.exports = graphic
},{"loadSVG":12}],11:[function(require,module,exports){
const ports = {}
const graph = {}
let timer
module.exports = io
async function io(id, name, on) {
  const on_rx = {
    on: {init}
  }
  ports[id] = { id, name, on}
  timer && clearTimeout(timer)
  timer = setTimeout(init, 1000)
  return send

  async function send(data) {
    const port = ports[data.to] || ports[await find_id(data.to)] || on_rx
    return port.on[data.type](data)
  }
  async function find_id (name){
    return (Object.values(ports).filter(node => node.name === name)[0] || {id: undefined}).id
  }
  async function init() {
    ports[await find_id('theme_widget')].on['refresh']()
  }
}
},{}],12:[function(require,module,exports){
async function loadSVG (url, done) { 
    const parser = document.createElement('div')
    let response = await fetch(url)
    if (response.status == 200) {
      let svg = await response.text()
      parser.innerHTML = svg
      return done(null, parser.children[0])
    }
    throw new Error(response.status)
}

module.exports = loadSVG
},{}],13:[function(require,module,exports){
/******************************************************************************
  LOCALDB COMPONENT
******************************************************************************/
module.exports = localdb

function localdb () {
  return { add, read_all, read, drop, push, length, append, get_by_value }

  function length (keys) {
    const address = keys.join('/')
    return Object.keys(localStorage).filter(key => key.includes(address)).length
  }
  /**
   * Assigns value to the key of an object already present in the DB
   * 
   * @param {String[]} keys 
   * @param {any} value 
   */
  function add (keys, value) {
    localStorage[keys.join('/')] = JSON.stringify(value)
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
      localStorage[pre+'/'+key] = JSON.stringify(value)
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
    const result = localStorage[keys.join('/')]
    return result && JSON.parse(result)
  }
  function read_all (keys) {
    const address = keys.join('/')
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
  function get_by_value (keys, filters) {
    const address = keys.join('/')
    const target_key = Object.keys(localStorage).find(key => {
      if(key.includes(address)){
        const entry = JSON.parse(localStorage[key])
        let count = 0
        Object.entries(filters).some(([search_key, value]) => {
          if(entry[search_key] !== value)
            return
          count++
        })
        if(count === Object.keys(filters).length)
          return key
      }
    }, undefined)
    return target_key && JSON.parse(localStorage[target_key])
  } 
}
},{}],14:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],15:[function(require,module,exports){
module.exports={ 
  "0": {
    "comp": "theme_editor"
  }
}
},{}],16:[function(require,module,exports){
(function (__filename){(function (){
/******************************************************************************
  STATE
******************************************************************************/
const STATE = require('STATE')
const name = 'theme_editor'
const statedb = STATE(__filename)
// ----------------------------------------
const { id, sdb, getdb } = statedb(fallback)
function fallback () { return require('./module.json') }
sdb.on({ css: css => {} })
/******************************************************************************
  THEME_EDITOR COMPONENT
******************************************************************************/
const DB = require('localdb')
const IO = require('io')
// ----------------------------------------
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = theme_editor
async function theme_editor (opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await getdb(opts.sid, fallback) // hub is "parent's" io "id" to send/receive messages
  const status = { tab_id: 0 }
  const db = await DB()
  const on = {
    init,
    hide
  }
  const {xget} = sdb.req_access(opts.sid)
  const send = await IO(id, name, on)
  
  status.themes = {
    builtin: Object.keys(opts.paths),
    saved: Object.keys(JSON.parse(localStorage.index || (localStorage.index = '{}')))
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  const style = document.createElement('style')
  await sdb.on({
    css: inject,
  })
  shadow.innerHTML = `
  <main>
    <div class="content">
    </div>
    <div class="relative">
      <input list="themes" class="theme" placeholder='Enter theme' />
      <div id="themes" class="theme"></div>
    </div>
    <button class="load single">
      Load
    </button>
    <button class="inject">
      Inject
    </button>
    <button class="save_file single">
      Save file
    </button>
    <button class="save_pref">
      Save pref
    </button>
    <button class="drop_theme single">
      Drop theme
    </button>
    <button class="drop_file single">
      Drop file
    </button>
    <button class="reset single">
      Reset
    </button>
    <button class="export single">
      Export
    </button>
    <button class="import single">
      Import
    </button>
    <input style="display: none;" class="upload" type='file' />
    <button class="add">
      Add
    </button>
    <h3>
    </h3>
    <div class="tabs">
      <div class="box"></div>
      <span class="plus">+</span>
    </div>
  </main>`
  const main = shadow.querySelector('main')
  const inject_btn = shadow.querySelector('.inject')
  const load_btn = shadow.querySelector('.load')
  const save_file_btn = shadow.querySelector('.save_file')
  const save_pref_btn = shadow.querySelector('.save_pref')
  const add_btn = shadow.querySelector('.add')
  const drop_theme_btn = shadow.querySelector('.drop_theme')
  const drop_file_btn = shadow.querySelector('.drop_file')
  const reset_btn = shadow.querySelector('.reset')
  const upload = shadow.querySelector('.upload')
  const import_btn = shadow.querySelector('.import')
  const export_btn = shadow.querySelector('.export')
  const title = shadow.querySelector('h3')
  const content = shadow.querySelector('.content')
  const tabs = shadow.querySelector('.tabs > .box')
  const plus = shadow.querySelector('.plus')
  const select_theme = shadow.querySelector('div.theme')
  const input = shadow.querySelector('input.theme')

  input.onfocus = () => select_theme.classList.add('active')
  input.onblur = () => setTimeout(() => select_theme.classList.remove('active'), 200)
  input.oninput = update_select_theme
  inject_btn.onclick = on_inject
  load_btn.onclick = () => load(input.value, false)
  save_file_btn.onclick = save_file
  save_pref_btn.onclick = save_pref
  add_btn.onclick = () => add(input.value)
  drop_theme_btn.onclick = drop_theme
  drop_file_btn.onclick = drop_file
  export_btn.onclick = export_fn
  import_btn.onclick = () => upload.click()
  upload.onchange = import_fn
  reset_btn.onclick = () => {localStorage.clear(), location.reload()}
  plus.onclick = () => add_tab('New')
  shadow.append(style)
  update_select_theme()
  
  return el

  async function fallback() {
    return require('./instance.json')
  }
  async function hide () {
    main.classList.toggle('select')
    status.select = !status.select
  }
  async function export_fn () {
    const theme = db.read([ input.value ])
    const index = db.read([ 'index', input.value ])
    const blob = new Blob([JSON.stringify({theme, index}, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = input.value
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  async function import_fn () {
    const file = upload.files[0]
    const name = file.name.split('.')[0]
    await add(name)
    const reader = new FileReader()
    reader.onload = e => {
      const blob = JSON.parse(e.target.result)
      db.add([name], blob.theme)
      db.add(['index', name], blob.index)
      load(name)
    }
    reader.readAsText(file)
  }
  async function add (theme) {
    db.add([theme], [])
    status.themes.saved.push(theme)
    db.add(['index', theme], [])
    update_select_theme()
  }
  async function drop_theme () {
    db.drop([input.value])
    db.drop(['index', input.value])
    status.themes.saved = status.themes.saved.filter(v => v != input.value)
    update_select_theme()
    input.value = 'default'
    load('default')
  }
  async function drop_file () {
    db.drop([status.active_tab.dataset.theme, status.active_tab.dataset.id])
    db.drop(['index', status.active_tab.dataset.theme, status.active_tab.dataset.id])
    close_tab(status.active_tab)
  }
  async function forget_changes () {
    status.active_el.classList.remove('dirty')
    const dirt = JSON.parse(localStorage.dirt)
    delete(dirt[status.title])
    localStorage.dirt = JSON.stringify(dirt)
  }
  async function save_file () {
    // forget_changes()
    if(db.read([input.value])){
      db.push(['index', input.value], status.active_tab.dataset.name)
      db.push([input.value], status.textarea.value)
    }
  }
  async function save_pref () {
    const pref = db.read(['pref'])
    if(status.select){
      var ids = await get_select()
      ids.forEach(id => pref[id] = [])
    }
    pref[status.instance_id] = []
    pref[status.title] = []
    Array.from(tabs.children).forEach(tab => {
      if(tab.dataset.access === "uniq"){
        if(ids)
          ids.forEach(id => 
          pref[id].push({theme: tab.dataset.theme, id: tab.dataset.id, local: status.themes.builtin.includes(tab.dataset.theme)})
        )
        else
          pref[status.instance_id].push({theme: tab.dataset.theme, id: tab.dataset.id, local: status.themes.builtin.includes(tab.dataset.theme)})
      }
      else
        pref[status.title].push({theme: tab.dataset.theme, id: tab.dataset.id, local: status.themes.builtin.includes(tab.dataset.theme) })
    })
    db.add(['pref'], pref)
  }
  async function unsave () {
    status.active_el.classList.add('dirty')
    let theme = localStorage[input.value] && JSON.parse(localStorage[input.value])
    if(theme){
      theme.css[status.title] = textarea.value
      localStorage[input.value] = JSON.stringify(theme)
      const dirt = JSON.parse(localStorage.dirt)
      dirt[status.title] = input.value
      localStorage.dirt = JSON.stringify(dirt)
    }
    else{
      const name = input.value + '*'
      theme = localStorage[name] && JSON.parse(localStorage[name])
      if(theme){
        theme.css[status.title] = textarea.value
        localStorage[name] = JSON.stringify(theme)
        const dirt = JSON.parse(localStorage.dirt)
        dirt[status.title] = name
        localStorage.dirt = JSON.stringify(dirt)
      }
      else{
        theme = { theme: true, css: {} }
        theme.css[status.title] = textarea.value
        localStorage[name] = JSON.stringify(theme)
        status.themes.saved.push(name)
        const dirt = JSON.parse(localStorage.dirt)
        dirt[status.title] = name
        localStorage.dirt = JSON.stringify(dirt)
        update_select_theme()
        input.value = name
      }
    }
  }
  async function on_inject () {
    if(status.active_tab.dataset.type === 'json'){
      const id = add_data(status.textarea.value)
      const hub = xget(xget(id).hub).id
      send({type: 'refresh', to: hub})
    }
    else{
      if(status.select){
        const ids = await get_select()
        ids.forEach(id => {
          send({ type: 'inject', to: id, data: status.textarea.value })
        })
      }
      else
        send({ type: 'inject', to: status.node_data.hub_id, data: status.textarea.value })
    }
  }
  async function get_select () {
    return await send({ type: 'get_select', to: 'theme_widget'})
  }
  async function load (theme, clear = true) {
    if(clear){
      content.innerHTML = ''
      tabs.innerHTML = ''
    }
    if(status.themes.builtin.includes(theme)){
      const index = opts.paths[theme].length
      for(let i = 0; i < index; i++){
        const temp = await fetch(`./src/node_modules/css/${theme}/${i}.css`)
        add_tab(i, await temp.text(), '', theme, status.title)
      }
    }
    else{
      const temp = db.read([theme])
      temp.forEach((file, i) => {
          add_tab(i, file, '', theme, status.title)
      })
    }
    // forget_changes()
  }
  async function init ({ data }) {
    title.innerHTML = data.id
    status.title = data.type
    status.instance_id = data.id
    let value = data.file ? db.read([data.xtype, data.id]) : data
    if(data.type === 'json' || !data.file)
      value = JSON.stringify(value, null, 2)
    add_tab(data.name, value)
  }
  async function add_tab (id, value = '', access = 'uniq', theme = 'default') {
    if(id === 'New' && status.themes.builtin.includes(theme)){
      theme += '*'
      add(theme)
    }
    const tab = document.createElement('span')
    const tab_id = '_' + status.tab_id++
    tab.id = tab_id
    const index = opts.paths[theme] || db.read(['index', theme])
    tabs.append(tab)
    const btn = document.createElement('span')
    btn.innerHTML = index[id] || id
    tab.dataset.id = id
    tab.dataset.name = btn.innerHTML
    tab.dataset.theme = theme
    tab.dataset.access = access
    btn.onclick = () => switch_tab(tab.id)
    btn.ondblclick = rename
    const btn_x = document.createElement('span')
    btn_x.innerHTML = 'x'
    tab.append(btn, btn_x)
    tab.tabIndex = '0'
    tab.onkeydown = e => {
      if(e.key === 'ArrowRight' && tab.nextElementSibling)
        tab.nextElementSibling.after(tab)
      else if(e.key === 'ArrowLeft' && tab.previousElementSibling)
        tab.previousElementSibling.before(tab)
      tab.focus()
    }
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.id = tab_id
    content.append(textarea)
    btn_x.onclick = () => close_tab(tab)
    switch_tab(tab_id)
  }
  async function close_tab (tab) {
    content.querySelector('#' + tab.id).remove()
    tab.remove()
    if(tabs.children.length)
      switch_tab(tabs.children[tabs.children.length - 1].id)
    else
      add_tab('New')
  }
  async function switch_tab (tab_id) {
    status.textarea && status.textarea.classList.remove('active')
    status.textarea = content.querySelector('#' + tab_id)
    status.textarea.classList.add('active')
    status.active_tab && status.active_tab.classList.remove('active')
    status.active_tab = tabs.querySelector('#' + tab_id)
    status.active_tab.classList.add('active')
    status.active_tab.focus()
    input.value = status.active_tab.dataset.theme
  }
  async function rename (e) {
    const btn = e.target
    const hub = btn.parentElement
    const input = document.createElement('input')
    input.value = btn.innerHTML
    btn.innerHTML = ''
    btn.append(input)
    input.onkeydown = e => {
      if(e.key === 'Enter'){
        btn.innerHTML = input.value
        db.add([hub.dataset.theme, hub.dataset.id], input.value)
      }
    }
    input.onblur = e => {
      if(e.relatedTarget)
        btn.innerHTML = hub.dataset.name
    }
    input.focus()
  }
  async function update_select_theme () {
    const builtin = document.createElement('div')
    builtin.classList.add('cat')
    status.themes.builtin.forEach(theme => {
      const el = document.createElement('div')
      el.innerHTML = theme
      el.onclick = () => input.value = theme
      theme.includes(input.value) && builtin.append(el)
    })
    builtin.innerHTML && builtin.insertAdjacentHTML('afterbegin', '<b>builtin</b>')
    const saved = document.createElement('div')
    saved.classList.add('cat')
    status.themes.saved.forEach(theme => {
      const el = document.createElement('div')
      el.innerHTML = theme
      el.onclick = () => input.value = theme
      theme.includes(input.value) && saved.append(el)
    })
    saved.innerHTML && saved.insertAdjacentHTML('afterbegin', '<b>saved</b>')
    select_theme.innerHTML = ''
    select_theme.append(builtin, saved)
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
}

}).call(this)}).call(this,"/src/node_modules/theme_editor/theme_editor.js")
},{"./instance.json":14,"./module.json":15,"STATE":5,"io":11,"localdb":13}],17:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],18:[function(require,module,exports){
module.exports={
  "0": {
    "comp": "theme_widget",
    "sub": {
      "theme_editor": ["x"],
      "graph_explorer": ["x"]
    }
  }
}
},{}],19:[function(require,module,exports){
(function (__filename){(function (){
/******************************************************************************
  STATE
******************************************************************************/
const STATE = require('STATE')
const name = 'theme_widget'
const statedb = STATE(__filename)
const shopts = { mode: 'closed' }
// ----------------------------------------
const { id, sdb, getdb } = statedb(fallback)
function fallback () { return require('./module.json') }
sdb.on({ css: css => {} })
/******************************************************************************
  THEME_WIDGET COMPONENT
******************************************************************************/
const theme_editor = require('theme_editor')
const graph_explorer = require('graph_explorer')
const IO = require('io')
// ----------------------------------------
module.exports = theme_widget

async function theme_widget (opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await getdb(opts.sid, fallback) // hub is "parent's" io "id" to send/receive messages
  const status = { tab_id: 0, init_check: true }
  const on = {
    refresh,
    get_select,
    inject,
    scroll,
    click
  }
  const {get_all} = sdb.req_access(opts.sid)
  const send = await IO(id, name, on)

  status.clickables = ['css', 'json', 'js']
  status.dirts = JSON.parse(localStorage.dirt || (localStorage.dirt = '{}'))
  localStorage.pref || (localStorage.pref = '{}')
  const paths =  JSON.parse(await(await fetch('./src/node_modules/css/index.json')).text())
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
  <section>
    <div class="btn">
      ⚙️
    </div>
    <div class="popup">
      <div class="box">
        <span class="stats">
          Entries: 
        </span>
        <button class="select">Select</button>
        <input min="0" max="100" value="75" type="range"/>
      </div>
      <div class="editor">
      </div>
    </div>
  </section>
  <style></style>`
  const style = shadow.querySelector('style')
  const btn = shadow.querySelector('.btn')
  const popup = shadow.querySelector('.popup')
  const box = popup.querySelector('.box')
  const list = box.querySelector('.list')
  const editor = popup.querySelector('.editor')
  const stats = box.querySelector('.stats')
  const select = box.querySelector('.select')
  const slider = box.querySelector('input')

  const subs = await sdb.on({
    css: inject
  })
  editor.append(await theme_editor({ sid: subs.theme_editor?.[0], hub: [id], paths }))
  box.prepend(await graph_explorer({ sid: subs.graph_explorer?.[0], hub: [id] }))
  select.onclick = on_select
  slider.oninput = blur
  return el

  async function fallback() {
    return require('./instance.json')
  }
  async function blur(e) {
    popup.style.opacity = e.target.value/100
  }
  async function on_select () {
    list.classList.toggle('active')
    send({to: 'theme_editor', type: 'hide'})
  }
  async function get_select () {
    const inputs = list.querySelectorAll('input')
    const output = []
    inputs.forEach(el => el.checked && output.push(el.nextElementSibling.id))
    send({type: 'send', to: 'theme_editor', data: output})
  }
  async function refresh () {
    const data = get_all()
    status.tree = data
    stats.innerHTML = `Entries: ${Object.keys(data).length}`
    btn.onclick = () => {
      popup.classList.toggle('active')
      status.init_check && send({type: 'init', to: 'graph_explorer' , data:status.tree})
      status.init_check = false
    }
  }
  async function click ({ data }) {
    send({ to: 'theme_editor', type: 'init', data})
    status.active_el && status.active_el.classList.remove('active')
    if(status.instance_id === data.id)
      editor.classList.toggle('active')
    else{
      editor.classList.add('active')
      el.classList.add('active')
    }
    status.instance_id = data.id
    status.active_el = el
  }
  async function scroll () {
    el.scrollIntoView({behavior: 'smooth'})
    el.tabIndex = '0'
    el.focus()
    el.onblur = () => {
      el.tabIndex = '-1'
      el.onblur = null
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
}

}).call(this)}).call(this,"/src/node_modules/theme_widget/theme_widget.js")
},{"./instance.json":17,"./module.json":18,"STATE":5,"graph_explorer":6,"io":11,"theme_editor":16}],20:[function(require,module,exports){
module.exports={
  "0": {
    "slot": {
      "": [["", "subs"], ["inputs"]],
      "inputs": ["topnav.css", "topnav.json"]
    }
  },
  "topnav.css": {
    "data": " ",
    "slot": {
      "": [["hubs"]],
      "hubs": [0]
    }
  },
  "topnav.json": {
    "type": "content",
    "data": {
      "links": [
      {
        "id": "datdot",
        "text": "DatDot",
        "url": "datdot"
      },
      {
        "id": "editor",
        "text": "Play Editor",
        "url": "editor"
      },
      {
        "id": "smartcontract_codes",
        "text": "Smart Contract Codes",
        "url": "smartcontract_codes"
      },
      {
        "id": "supporters",
        "text": "Supporters",
        "url": "supporters"
      },
      {
        "id": "our_contributors",
        "text": "Contributors",
        "url": "our_contributors"
      }
    ]
    },
    "slot": {
      "": [["hubs"]],
      "hubs": [0]
    }
  }
}
},{}],21:[function(require,module,exports){
module.exports={
  "0": {
      "slot": {
        "": [["hubs"]],
        "hubs": ["topnav.js"]
      }
    },
  "topnav.js": {
    "slot": {
      "": [["", "subs"]],
      "subs": [0]
    }
  }
}
},{}],22:[function(require,module,exports){
(function (__filename){(function (){
/******************************************************************************
  STATE
******************************************************************************/
const STATE = require('STATE')
const name = 'topnav'
const statedb = STATE(__filename)
// ----------------------------------------
const { id, sdb, getdb } = statedb(fallback)
function fallback () { return require('./module.json') }
sdb.on({ css: css => {} })

/******************************************************************************
  OUR CONTRIBUTORS COMPONENT
******************************************************************************/
const graphic = require('graphic')
const IO = require('io')
// ----------------------------------------
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = topnav

async function topnav (opts) {
	// ----------------------------------------
	// ID + JSON STATE
	// ----------------------------------------
	const { id, sdb } = await getdb(opts.sid, fallback) // hub is "parent's" io "id" to send/receive messages
	const status = {}
	const on = {
		inject,
		scroll
	}

  const send = await IO(id, name, on)
	// ----------------------------------------
	// OPTS
	// ----------------------------------------

	const playLogo = await graphic('playLogo', './src/node_modules/assets/svg/logo.svg')
	// ----------------------------------------
	// TEMPLATE
	// ----------------------------------------
	const el = document.createElement('div')
	const shadow = el.attachShadow(shopts)
	shadow.innerHTML = `
		<section class='topnav'>
				<a href="#top">${playLogo.outerHTML}</a>
				<nav class='menu'>
				</nav>
		</section>
	<style></style>`
  const style = shadow.querySelector('style')
	const menu = shadow.querySelector('.menu')
	const body = shadow.querySelector('section')
	const scrollUp = 'scrollUp'
	const scrollDown = 'scrollDown'
	let lastScroll = 0
	
	window.addEventListener('scroll', ()=> {
		if (window.innerWidth >= 1024) {
			let currentScroll = window.pageYOffset
			if (currentScroll < 1) {
					body.classList.remove(scrollUp)
					body.classList.remove(scrollDown)
					return
			}
			if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
					body.classList.add(scrollDown)
					body.classList.remove(scrollUp)
			} else if (currentScroll < lastScroll) {
					body.classList.add(scrollUp)
					body.classList.remove(scrollDown)
			}
			lastScroll = currentScroll
		}
	})

	window.addEventListener('resize', ()=> {
		if (window.innerWidth <= 1024) {
			body.classList.remove(scrollUp)
			body.classList.remove(scrollDown)
		}
	})
	await sdb.on({
    css: inject,
    content: oncontent,
  })

	return el

	function oncontent ([ opts ]) { 
		console.log(opts)
		menu.innerHTML = ''
		menu.append(...opts.links.map(make_link))
	}
	function fallback() {
    return require('./instance.json')
  }
	function click(url) {
		send({to:'index', type: 'jump', data: url })
	}
	function make_link(link){
		const a = document.createElement('a')
		a.href = `#${link.url}`
		a.textContent = link.text
		a.onclick = () => click(link.url)
		return a
	}
	async function scroll () {
		el.scrollIntoView({behavior: 'smooth'})
		el.tabIndex = '0'
		el.focus()
		el.onblur = () => {
			el.tabIndex = '-1'
			el.onblur = null
		}
	}
	async function inject (data){
		style.innerHTML = data.join('\n')
	}
}

}).call(this)}).call(this,"/src/node_modules/topnav/topnav.js")
},{"./instance.json":20,"./module.json":21,"STATE":5,"graphic":10,"io":11}],23:[function(require,module,exports){
(function (__filename,__dirname){(function (){
const STATE = require('../src/node_modules/STATE')
/******************************************************************************
  INITIALIZE PAGE
******************************************************************************/
const statedb = STATE(__filename)
const { id, sdb, getdb } = statedb(fallback)

const make_page = require('../') 

function fallback () { // -> set database defaults or load from database
	return require('./module.json')
}
/******************************************************************************
  CSS & HTML Defaults
******************************************************************************/
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
async function boot (opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await getdb('', fallback) // hub is "parent's" io "id" to send/receive messages
  const [sid] = sdb.get_sub('index')
  sdb.on({
    css: inject,
  })
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
    const element = await make_page({sid})
    shadow.append(element)
  }
  // ----------------------------------------
  // INIT
  // ----------------------------------------

  return

  function fallback () { // -> set database defaults or load from database
    return require('./instance.json')
  }
}
async function inject (data){
	sheet.replaceSync(data.join('\n'))
}
}).call(this)}).call(this,"/web/demo.js","/web")
},{"../":2,"../src/node_modules/STATE":5,"./instance.json":24,"./module.json":25}],24:[function(require,module,exports){
module.exports={
  "0": {
    "id": 0,
    "name": "demo",
    "type": "instance",
    "xtype": "demo",
    "admins": ["theme_editor", "theme_widget"],
    "slot": {
      "": [["", "subs"], ["inputs"]],
      "subs": [1],
      "inputs": ["demo.css"]
    }
  },
  "demo.css": {
    "id": "demo.css",
    "name": "demo.css",
    "type": "css",
    "xtype": "css",
    "file": "src/node_modules/css/default/demo.css",
    "slot": {
      "": [["hub"]],
      "hubs": [0]
    }
  },
  "1": {
    "name": "index",
    "slot": {
      "": [["hubs"]],
      "hubs": [0]
    }
  }
}
},{}],25:[function(require,module,exports){
module.exports={
  "0": {
      "slot": {
        "": [["hubs"]],
        "hubs": ["demo.js"]
      }
    },
  "demo.js": {
    "slot": {
      "": [["", "subs"]],
      "subs": [0]
    }
  }
}
},{}]},{},[23]);
