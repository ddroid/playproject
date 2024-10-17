(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
//  theme_widget : require('theme_widget'),
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
},{"./instance.json":2,"./module.json":3,"STATE":4,"io":6,"topnav":11}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
// STATE.js

const snapshot = null
const localdb = require('localdb')
const db = localdb()
const status = {root_module: true, root_instance: true}

if(db.read(['playproject_version']) != 3){
  localStorage.clear()
  status.snapshot = true
  db.add(['playproject_version'], 3)
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
    if(status.snapshot || !data){
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
    // data.slot.hubs && add_source(data.slot.hubs)
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
    if(status.snapshot || !data){
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
},{"localdb":8}],5:[function(require,module,exports){
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
},{"loadSVG":7}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
},{"./instance.json":9,"./module.json":10,"STATE":4,"graphic":5,"io":6}],12:[function(require,module,exports){
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
},{"../":1,"../src/node_modules/STATE":4,"./instance.json":13,"./module.json":14}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}]},{},[12]);
