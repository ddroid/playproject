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
},{"./page":11}],2:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)

function fallback_module () { // -> set database defaults or load from database
	return {
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

}).call(this)}).call(this,"/doc/state/example/node_modules/app.js")
},{"../../../../src/node_modules/STATE":12,"foot":5,"head":6}],3:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)

function fallback_module () {
  return {
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
    inputs: {
      'btn.json': {
        data: {
          title: 'Click me'
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

}).call(this)}).call(this,"/doc/state/example/node_modules/btn.js")
},{"../../../../src/node_modules/STATE":12,"icon":7}],4:[function(require,module,exports){
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

},{"nav":9}],5:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)

function fallback_module () {
  return {
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

}).call(this)}).call(this,"/doc/state/example/node_modules/foot.js")
},{"../../../../src/node_modules/STATE":12,"text":10}],6:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)

function fallback_module () { // -> set database defaults or load from database
	return {
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

}).call(this)}).call(this,"/doc/state/example/node_modules/head.js")
},{"../../../../src/node_modules/STATE":12,"foo":4}],7:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)

function fallback_module () {
  return {}
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

}).call(this)}).call(this,"/doc/state/example/node_modules/icon.js")
},{"../../../../src/node_modules/STATE":12}],8:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)

function fallback_module () {
  return {
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

}).call(this)}).call(this,"/doc/state/example/node_modules/menu.js")
},{"../../../../src/node_modules/STATE":12,"btn":3}],9:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)

function fallback_module () { // -> set database defaults or load from database
	return {
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
function override_menu ([menu], path){
  const data = menu()
  data.inputs['menu.json'].data = {
    title: 'Services',
    links: ['Marketing', 'Design', 'Web Dev', 'Ad Compaign']
  }
  return data
}
function override_menu_hover ([menu], path){
  const data = menu()
  data.inputs['menu.json'].data = {
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

}).call(this)}).call(this,"/doc/state/example/node_modules/nav.js")
},{"../../../../src/node_modules/STATE":12,"menu":8}],10:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)

function fallback_module () {
  return {}
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

}).call(this)}).call(this,"/doc/state/example/node_modules/text.js")
},{"../../../../src/node_modules/STATE":12}],11:[function(require,module,exports){
(function (__filename,__dirname){(function (){
const STATE = require('../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)
function fallback_module () { // -> set database defaults or load from database
	return {
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
function override_app ([app]) {
  const data = app()
  console.log(JSON.parse(JSON.stringify(data._.head)))
  // data._.head._.foo._.nav._.menu[0] = ([menu]) => {
  //   const data = menu()
  //   data.inputs['menu.json'].data = {
  //     links: ['custom', 'menu'],
  //     title: 'Custom'
  //   }
  //   return data
  // }
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
}).call(this)}).call(this,"/doc/state/example/page.js","/doc/state/example")
},{"../../../src/node_modules/STATE":12,"app":2}],12:[function(require,module,exports){
// STATE.js

const localdb = require('localdb')
const db = localdb()
const status = {
  root_module: true, 
  root_instance: true, 
  overrides: {},
  tree: {},
  tree_pointers: {},
  modulepaths: [],
  db
}
//@TODO Where devs can define slots
const default_slots = ['_', 'inputs']

const version = 9
if(db.read(['playproject_version']) != version){
  localStorage.clear()
  status.fallback_check = true
  db.add(['playproject_version'], version)
}
// db.read(['state']) || db.add(['state'], {})

const listeners = {}
const s2i = {}
const i2s = {}
var admins = [0]

module.exports = STATE
function STATE (address, modulepath) {
  status.modulepaths.push(modulepath)
  const local_status = {
    name: extract_filename(address),
    deny: {}, subs: []
  }

  const sdb = { watch, get_sub, req_access }
  const subs = [get]
  const admin = { xget, get_all, add_admins, load }
  return statedb

  function extract_filename (address) {
    const parts = address.split('/node_modules/')
    const last = parts.at(-1).split('/')
    return last.at(-1).slice(0, -3)
  }
  function statedb (fallback_module, fallback_instance) {
    local_status.fallback_instance = fallback_instance
    const search_filters = {'path': modulepath }
    let data = db.find(['state'], search_filters)
    if (status.fallback_check) {
      if(!data){
        if(status.root_module)
          status.root_module = false
        else{
          find_super('module')
          data = db.find(['state'], search_filters)
        }
      }
      preprocess(fallback_module, 'module', data || {id: 0})
      data = db.find(['state'], search_filters)
    }
    if(data.id == 0){
      data.admins && add_admins(data.admins)
    }

    local_status.id = data.id
    local_status.module_id = data.id
    data.hubs && add_source(data.hubs)
    const sub_modules = {}
    data.subs && data.subs.forEach(id => {
      sub_modules[db.read(['state', id]).type] = id
    })
    return { id: data.id, sdb, subs, sub_modules }
  }
  function find_super (xtype) {
    const split = modulepath.split('/')
    const modulepath_parent = modulepath.split(/\/(?=[^\/]*$)/)[0]
    const node = split.at(-1)
    const parent = split.at(-2)
    function fallback () {
      return {
      _: {
        [node]: {}
      }
    }}
    const search_filters = {'path': modulepath_parent }
    let data = db.find(['state'], search_filters)
    if(xtype === 'instance')
      data = db.find(['state'], {'type': data.id})
    console.log(data)
    return preprocess(fallback, xtype, data, {name: parent, module_id: data.type}, modulepath_parent)
  }
  function add_source (hubs) {
    hubs.forEach(id => {
      const data = db.read(['state', id])
      if(data.type === 'js'){
        fetch_save(data)
      }
    })
  }
  function symbolfy (data) {
    data.subs && data.subs.forEach(sub => {
      const substate = db.read(['state', sub])
      s2i[i2s[sub] = Symbol(sub)] = sub
      local_status.subs.push({ sid: i2s[sub], type: substate.type })
    })
  }
  function load (snapshot) {
    localStorage.clear()
    Object.entries(snapshot).forEach(([key, value]) => {
      db.add([key], JSON.parse(value), true)
    })
    window.location.reload()
  }
  function get (sid) {
    let id = s2i[sid]
    let data = db.read(['state', id])
    if(status.fallback_check){
      // console.log(data, local_status.name)
      if(!data && !status.root_instance){
        const super_id = find_super('instance')
        const super_node = db.read(['state', super_id])
        data = db.read(['state', super_node.subs[0]])
        console.log(data)
      }
      id = preprocess(local_status.fallback_instance, 'instance', data)
      data = db.read(['state', id])
    }
    if(status.root_instance){
      status.tree = JSON.parse(JSON.stringify(status.tree))
      status.root_instance = false
    }
    local_status.id = data.id
    symbolfy(data)
    window.STATEMODULE = status
    return {id, sdb}
  }
  async function watch (listener) {
    const data = db.read(['state', local_status.id])
    listeners[data.id] = listener
    const input_map = []
    data.inputs && await Promise.all(data.inputs.map(async input => {
      const input_state = db.read(['state', input])
      const input_data = await fetch_save(input_state)
      input_map.push({ type: input_state.type, data: [input_data] })
    }))
    listener(input_map)
    return local_status.subs
  }
  async function fetch_save({ id, name, $ref, type, data }) {
    const xtype = (typeof(id) === "number" ? name : id).split('.').at(-1)
    let result = db.read([ type, id ])
    if(!result){
      result = data || await((await fetch($ref))[xtype === 'json' ?'json' :'text']())
      db.add([type, id], result)
    }
    return result
  }
  function get_sub (type) {
    return local_status.subs.filter(sub => {
      const dad = db.read(['state', sub.type])
      return dad.type === type
    })
  }
  async function add_admins (ids) {
    admins.push(...ids)
  }
  function req_access (sid) {
    if (local_status.deny[sid]) throw new Error('access denied')
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
  function preprocess (fallback, xtype, pre_data = {}, fun_status = local_status, fun_modulepath = modulepath) {
    let count = db.length(['state'])
    let {id: pre_id, hubs, subs} = pre_data
    let subs_data = {}, subs_types, id_map = {}
    if(subs){
      subs.forEach(id => subs_data[id] = db.read(['state', id]))
      subs_types = new Set(Object.values(subs_data).map(sub => sub.type))
    }
    let host_data
    if (pre_data.fallback) {
      host_data = status.overrides[pre_data.fallback]([merge_trees(fallback)])
      reduce_tree(host_data)
      function reduce_tree (tree, first) {
        let check_override = true, check_sub = false
        check_override = Boolean(tree[0])
        if(tree._){
          Object.entries(tree._).forEach(([type, data]) => {
            const check = reduce_tree(data, true)
            if(check){
              first && delete tree._[type]
            }
            else
              check_sub = true
          })
        }
        if(!(check_override || check_sub))
          return true
      }
      function merge_trees (fallback) {
        return () => {
          const data = fallback()
          traverse (data, fun_status.name)
          function traverse (data, type) {
            if(data._)
              Object.entries(data._).forEach(([type, data]) => traverse(data, type))
            else{
              type = type.split('$')[0]
              const id = db.find(['state'], {type}).id
              data._ = status.tree_pointers[id]?._?.[type]?._
              // console.log(data, id, type, status.tree_pointers[id])
            }
          }
          return data
        }
      }
    }
    else
      host_data = fallback()

    const on = {
      _: clean_node,
      inputs: clean_file,
    }
    return clean_node('', host_data, fun_modulepath)

    function clean_node (local_id, entry, path, hub_entry, hub_module, local_tree) {
      let module
      console.log(fun_status.name, xtype, local_id)
      const split = local_id.split(':')
      if(local_id){
        entry.hubs = [hub_entry.id]
        if(xtype === 'instance')
          hub_module?.subs && hub_module.subs.forEach(id => {
            const module_data = db.read(['state', id])
            if(module_data.idx == split[0]){
              entry.type = module_data.id
              module = module_data
              return
            }
          })
        else{
          entry.idx = local_id
          const module_split = local_id.split('#')
          entry.type = module_split[0]
          status.tree_pointers[count] = local_tree
          path = path ? path + '/' : path
          let new_path = path + local_id
          if(new_path in status.modulepaths)
            new_path = path + module_split[0] + (Number(module_split[1]) + 1)
          entry.path = new_path
          path = new_path
        }
        //Check if sub-entries are already initialized by a super
        // console.log(subs_types, entry.type)
        if(subs_types && subs_types.has(entry.type)){
          const super_entry = Object.values(subs_data).find(sub => sub.type == entry.type)
          //continue a fallback chain
          const index = super_entry?.fallback?.find?.(key => key == hub_entry.type)
          if(index){
            const key = 'f' + Object.keys(status.overrides).length
            super_entry.fallback[index] = key
            const fun = entry.fallback.find(v => typeof(v) === 'function')
            status.overrides[key] = fun
            db.add(['state', super_entry.id], super_entry)
          }
          return super_entry.id
        }
      }
      else{
        if(xtype === 'instance'){
          module = db.read(['state', fun_status.module_id])
          entry.type = module.id
        }
        else{
          local_tree = JSON.parse(JSON.stringify(entry))
          if(pre_id){
            // console.log(pre_id, pre_data.idx, xtype, local_tree)
            status.tree_pointers[pre_id]._[pre_data.idx] = local_tree
          }
          else{
            status.tree[local_id] = local_tree
          }
          const file_id = fun_status.name+'.js'
          entry.inputs || (entry.inputs = {})
          entry.inputs[file_id] = { $ref: new URL(address, location).href }
          entry.type = entry.type || fun_status.name
          entry.idx = pre_data.idx
          entry.path = path
        }
        hubs && (entry.hubs = hubs)
      }
      entry.id = local_id ? count++ : pre_id || count++
      entry.name = entry.name || module?.type || entry.type || fun_status.name
      
      id_map[local_id] = entry.type
      //start a fallback chain
      if(entry[0]){
        // console.log(fun_status.name, entry)
        const key = 'f' + Object.keys(status.overrides).length
        status.overrides[key] = entry[0]
        delete(entry[0])
        entry.fallback = key
        // const new_fallback = []
        // entry[0].forEach(handler => {
        //   if(typeof(handler) === 'function'){
        //     const key = 'f' + Object.keys(status.overrides).length
        //     new_fallback.push(key)
        //     status.overrides[key] = handler
        //   }
        //   else
        //     new_fallback.push(id_map[handler])
        // })
        // entry.fallback = new_fallback
      }
      // console.log(JSON.parse(JSON.stringify(entry)))
      default_slots.forEach(slot => {
        if(entry[slot] && on[slot])
          entry[slot === '_' ? 'subs' : slot] = Object.entries(entry[slot])
          .map(([key, value]) => on[slot](key, value, path, entry, module, local_tree))
      })
      delete(entry._)
      db.add(['state', entry.id], entry)
      return entry.id
    }
    function clean_file (file_id, entry, hub_entry){
      if(!isNaN(Number(file_id)))
        return file_id
      const file = entry
      file.id = file_id
      file.name = file.name || file_id
      file.type = file.type || file.id.split('.').at(-1)
      file[file.type === 'js' ? 'subs' : 'hubs' ] = [hub_entry.id]
      const copies = Object.keys(db.read_all(['state', file_id]))
      if(copies.length){
        const id = copies.sort().at(-1).split(':')[1]
        file.id = file_id + ':' + (Number(id || 0) + 1)
      }
      db.add(['state', file.id], file)
      return file.id
    }
  }
  
}
},{"localdb":13}],13:[function(require,module,exports){
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
