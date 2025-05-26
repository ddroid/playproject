(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const prefix = 'https://raw.githubusercontent.com/alyhxn/playproject/a31832ad3cb24fe15ab36bdc73a929f43179d7b8/'
const init_url = location.hash === '#dev' ? '/doc/state/example/init.js' : prefix + 'doc/state/example/init.js'
const args = arguments

fetch(init_url, { cache: 'no-store' }).then(res => res.text()).then(async source => {
  const module = { exports: {} }
  const f = new Function('module', 'require', source)
  f(module, require)
  const init = module.exports
  await init(args, prefix)
  require('./page') // or whatever is otherwise the main entry of our project
})

},{"./page":11}],2:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, get } = statedb(fallback_module)

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
    theme: inject,
    lang: fill
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
  { // sub nodes
    shadow.append(await head(subs[0]), await foot(subs[1]))
  }
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type] && on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
  }
}


function fallback_module ({ args }) { // -> set database defaults or load from database
	return {
    api: fallback_instance,
    _: { "head": { $: '', }, "foot": { $: '' } }
  }
  function fallback_instance () {
    return {
      _: { "head": { 0: {x: args.x + 1, y: args.y + 2},
        mapping: {
          'theme': 'theme',
        }
       }, "foot": { 0: '',
        mapping: {
          'theme': 'theme',
        }
        } },
      drive: {
        'theme/': {
          'style.css': {
            raw: ''
          }
        }
      }
    }
  }
}

}).call(this)}).call(this,"/doc/state/example/node_modules/app.js")
},{"../../../../src/node_modules/STATE":12,"foot":5,"head":6}],3:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, get } = statedb(fallback_module)

/******************************************************************************
  BTN
******************************************************************************/
const icon = require('icon')

module.exports = {btn, btn_small}
async function btn(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb, io, net } = await get(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    theme: inject,
    lang: fill
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    <button>
      <span></span>
    </button>
    <style>
      button{
        padding: 10px 40px;
      }
    </style>`
  const style = shadow.querySelector('style')
  const button = shadow.querySelector('button')
  const title = shadow.querySelector('button > span')
  const subs = await sdb.watch(onbatch)
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  {
    button.append(await icon(subs[0]))
  }
  // ----------------------------------------
  // EVENT LISTENERS
  // ----------------------------------------
  net.event.length && net.event.click.forEach(msg => {
    io.at(msg.id)
  })
  button.onclick = () => {
    net.event.click.forEach(msg => io_port.postMessage(msg))
  }
  let io_port
  io.on(port => {
    const { by, to } = port
    io_port = port
    port.onmessage = event => {
      const txt = event.data
      const key = `[${by} -> ${to}]`
      console.log(key, txt)
    }
  })
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type] && on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
    title.replaceChildren(data.title)
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
      on[type] && on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
    button.innerHTML = data.title
  }
}


function fallback_module () {
  return {
    api: fallback_instance,
    _: { icon: {$: ''} }
  }
  function fallback_instance () {
    return {
      _: { icon: {0: ''} },
      drive: {
        'lang/': {
          'en-us.json': {
            raw: {
              title: 'Click me'
            }
          }
        },
      },
      net: {
        api: ['inject', 'fill'],
        event: {
          click: [],
        }
      }
    }
  }
}

}).call(this)}).call(this,"/doc/state/example/node_modules/btn.js")
},{"../../../../src/node_modules/STATE":12,"icon":7}],4:[function(require,module,exports){
function fallback_module () { // -> set database defaults or load from database
	return {
    _: {
      "nav": {},
    }
  }
}
function fallback_instance () {
  return {
    _: {
      "nav": {
        0: override_nav,
        mapping: {
          'style.css': 'style.css'
        }
      },
      drive: {
        'theme/': 'style.css',
        'style.css': {
          raw: ''
        }
      }
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
const { sdb, get } = statedb(fallback_module)

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


function fallback_module () {
  return {
    api: fallback_instance,
    _:{ text: { $: '' } }
  }
  function fallback_instance () {
    return {
      _:{ text: { 0: '' } } } 
    }
}

}).call(this)}).call(this,"/doc/state/example/node_modules/foot.js")
},{"../../../../src/node_modules/STATE":12,"text":10}],6:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, get } = statedb(fallback_module)

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
    theme: inject,
    lang: fill
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
      on[type] && on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
  }
}


function fallback_module () { // -> set database defaults or load from database
	return {
    api: fallback_instance,
    _: { "foo": { $: '' } }
  }
  function fallback_instance ({ args }) {
    console.log('Hello from head: ', args)
    return {
      _: { "foo": { 0: '',
        mapping: {
          'theme': 'theme',
          'lang': 'lang',
        }
       } },
      drive: {
        'theme/': {
          'style.css': {
            raw: ''
          }
        }
      }
    }
  }
}
}).call(this)}).call(this,"/doc/state/example/node_modules/head.js")
},{"../../../../src/node_modules/STATE":12,"foo":4}],7:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, get } = statedb(fallback_module)

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
    theme: inject,
    lang: fill
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


function fallback_module () {
  return {
    api: fallback_instance,
  }
  function fallback_instance () {
    return {}
  }
}

}).call(this)}).call(this,"/doc/state/example/node_modules/icon.js")
},{"../../../../src/node_modules/STATE":12}],8:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, get, io } = statedb(fallback_module)

/******************************************************************************
  MENU
******************************************************************************/
const {btn, btn_small} = require('btn')


module.exports = {menu, menu_hover}
async function menu(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb, net, io } = await get(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    style: inject,
    lang: fill,
  }
  io.on(port => {
    const { by, to } = port
    port.onmessage = event => {
      const txt = event.data
      const key = `[${by} -> ${to}]`
      console.log(key, txt)
    }
    port.postMessage({type: 'register', args: {
      type: 'theme', 
      name: 'rainbow', 
      dataset: {
      'page': {
        'style.css': {
          raw: `body { font-family: cursive; }`,
        }
      },
      'page>app>head>foo>nav:0': {
        'style.css': {
              raw: `
                nav{
                  display: flex;
                  gap: 20px;
                  padding: 20px;
                  background: #4b2d6d;
                  color: white;
                  box-shadow: 0px 1px 6px 1px gray;
                  margin: 5px;
                }
                .title{
                  background: linear-gradient(currentColor 0 0) 0 100% / var(--underline-width, 0) .1em no-repeat;
                  transition: color .5s ease, background-size .5s;
                  cursor: pointer;
                }
                .box{
                  display: flex;
                  gap: 20px;
                }
                .title:hover{
                  --underline-width: 100%
                }
              `
            }
      },
      
    }
    }})
  
  })
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
    console.log(net)
    io.at(net[0].id)
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
      on[type] && on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
    title.replaceChildren(data.title)
    main.replaceChildren(...data.links.map(link => {
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
  const { id, sdb } = get.hover(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    style: inject,
    lang: fill
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
      on[type] && on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
    title.replaceChildren(data.title)
    main.replaceChildren(...data.links.map(link => {
      const el = document.createElement('li')
      el.innerHTML = link
      return el
    }))
  }
}


function fallback_module () {
  const api = fallback_instance
  api.hover = fallback_instance_hover
  return {
    api,
    _: { btn: { $: '' }}
  }
  function fallback_instance () {
    return {
      _: {
        btn: { 0: '' , 1: '',
          mapping: {
            'lang': 'lang',
          }
         }},
      drive: {
        'style/': {
          'theme.css': {
            raw: `
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
        },
        'lang/': {
          'en-us.json': {
            raw: {
              title: 'menu',
              links: ['link1', 'link2'],
            }
          },
        },
      }
    }
  }
  function fallback_instance_hover () {
    return {
      _: {
        btn: { 0: '' , 1: '',
          mapping: {
            'lang': 'lang',
          }
         }},
      drive: {
        'style/': {
          'theme.css': {
            raw: `
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
        },
        'lang/': {
          'en-us.json': {
            raw: {
              title: 'menu',
              links: ['link1', 'link2'],
            }
          },
        },
      }
    }
  }
}
}).call(this)}).call(this,"/doc/state/example/node_modules/menu.js")
},{"../../../../src/node_modules/STATE":12,"btn":3}],9:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, get } = statedb(fallback_module)

/******************************************************************************
  NAV
******************************************************************************/
const {menu, menu_hover} = require('menu')
const {btn, btn_small} = require('btn')

module.exports = nav
async function nav(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts?.sid) // hub is "parent's" io "id" to send/receive messages
  const on = {
    theme: inject,
    lang: fill
  }

  const { drive } = sdb
  // console.log(await drive.put('lang/en-uk.json', { links: ['Home', 'About', 'Contact'] }))
  // console.log(await drive.get('lang/en-uk.json'))
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    <nav>
      <div class="box">

      <div>
    </nav>
    <style></style>`
  const main = shadow.querySelector('nav')
  const div = shadow.querySelector('div')
  const style = shadow.querySelector('style')
  const subs = await sdb.watch(onbatch)
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  console.log(subs)
  { //menu
    main.append(await menu(subs[0]), await menu(subs[1]), await menu(subs[2]), await menu_hover(subs[3]), await btn(subs[4]), await btn(subs[5]))
  }
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type] && on[type](data)
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill([data]) {
    div.replaceChildren(...data.links.map(link => {
      const el = document.createElement('div')
      el.classList.add('title')
      el.innerHTML = link
      return el
    }))
  }
}


function fallback_module () { // -> set database defaults or load from database
	return {
    api: fallback_instance,
    _: { 'menu':{ $: ([menu]) => {
          const state = menu()
          state.api = (args) => {
            const { old_fallback } = args
            const data = old_fallback[0]()
            data.drive['lang/']['en-us.json'].raw.links = ['temp1', 'temp2']
            return data
          }
          return state
          }},
          btn: { $: '' }
}}
  function fallback_instance () {
    return {
      _: { 'menu':{ 
        0: override_menu, 1: override_menu1, 2: '',
        3: override_menu_hover,
          mapping: { 'style': 'theme', 'lang': 'lang', 'io': 'io' }
        }, btn: {
          0: override_btn,
          1: override_btn1,
          mapping: { 'lang': 'lang' }
        },
      },
      drive: {
        'theme/': {
          'style.css': {
            $ref: 'nav.css'
          }
        },
        'lang/': {
          'en-us.json': {
            raw: {
              links: ['Home', 'About', 'Contact']
            }
          }
        }
      }
    }
  }
  function override_menu ([menu], path){
    const data = menu()
    data.drive['lang/']['en-us.json'].raw = {
      title: 'Services',
      links: ['Marketing', 'Design', 'Web Dev', 'Ad Compaign']
    }
    return data
  }
  function override_menu1 ([menu]){
    const data = menu()
    data.drive['lang/']['en-us.json'].raw = {
      title: 'Services',
      links: ['Marketing', 'Design', 'Web Dev', 'Ad Compaign']
    }
    return data
  }
  function override_menu_hover ([menu], path){
    const data = menu()
    data.drive['lang/']['en-us.json'].raw = {
      title: 'Services#hover',
      links: ['Marketing', 'Design', 'Web Dev', 'Ad Compaign']
    }
    return data
  }
  function override_btn ([btn]){
    const data = btn()
    data.drive['lang/']['en-us.json'].raw = {
      title: 'Register',
    }
    return data
  }
  function override_btn1 ([btn]){
    const data = btn()
    data.drive['lang/']['en-us.json'].raw = {
      title: 'Switch',
    }
    return data
  }
}
}).call(this)}).call(this,"/doc/state/example/node_modules/nav/nav.js")
},{"../../../../../src/node_modules/STATE":12,"btn":3,"menu":8}],10:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, get } = statedb(fallback_module)

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


function fallback_module () {
  return {
    api: fallback_instance,
  }
  function fallback_instance () {
    return {}
  }
}

}).call(this)}).call(this,"/doc/state/example/node_modules/text.js")
},{"../../../../src/node_modules/STATE":12}],11:[function(require,module,exports){
(function (__filename,__dirname){(function (){
const STATE = require('../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { id, sdb, io } = statedb(fallback_module)

/******************************************************************************
  PAGE
******************************************************************************/
const app = require('app')
const sheet = new CSSStyleSheet()
config().then(() => boot({ sid: '' }))

async function config() {
  const path = path => new URL(`../src/node_modules/${path}`, `file://${__dirname}`).href.slice(8)
  const html = document.documentElement
  const meta = document.createElement('meta')
  const font = 'https://fonts.googleapis.com/css?family=Nunito:300,400,700,900|Slackey&display=swap'
  const loadFont = `<link href=${font} rel='stylesheet' type='text/css'>`
  html.setAttribute('lang', 'en')
  meta.setAttribute('name', 'viewport')
  meta.setAttribute('content', 'width=device-width,initial-scale=1.0')
  // @TODO: use font api and cache to avoid re-downloading the font data every time
  document.head.append(meta)
  document.head.innerHTML += loadFont
  document.adoptedStyleSheets = [sheet]
  await document.fonts.ready // @TODO: investigate why there is a FOUC
}
/******************************************************************************
  PAGE BOOT
******************************************************************************/
async function boot(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const on = {
    theme: inject,
    ...sdb.admin
  }

  const subs = await sdb.watch(onbatch, on)

  io.on(port => {
    const { by, to } = port
    port.onmessage = event => {
      const data = event.data
      on[data.type] && on[data.type](data.args)
    }
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
    shadow.append(await app(subs[0]))
  }
  // ----------------------------------------
  // INIT
  // ----------------------------------------

  function onbatch(batch) {
    for (const { type, data } of batch) {
      on[type] && on[type](data)
    }
  }
}
async function inject(data) {
  sheet.replaceSync(data.join('\n'))
}

function fallback_module ({ listfy, tree }) {
  console.log('fallback_module', listfy(tree))
  const rainbow_theme = {
    type: 'theme',
    name: 'rainbow',
    dataset: {
      page: {
        'style.css': {
          raw: 'body { font-family: cursive; }'
        }
      },
      'page>app>head>foo>nav:0': {
        'style.css': {
          raw: `
                  nav{
                    display: flex;
                    gap: 20px;
                    padding: 20px;
                    background: #4b2d6d;
                    color: white;
                    box-shadow: 0px 1px 6px 1px gray;
                    margin: 5px;
                  }
                  .title{
                    background: linear-gradient(currentColor 0 0) 0 100% / var(--underline-width, 0) .1em no-repeat;
                    transition: color .5s ease, background-size .5s;
                    cursor: pointer;
                  }
                  .box{
                    display: flex;
                    gap: 20px;
                  }
                  .title:hover{
                    --underline-width: 100%
                  }
                `
        }
      }

    }
  }
  return {
    _: {
      app: {
        $: { x: 0, y: 1 },
        0: override_app,
        mapping: {
          theme: 'theme'
        }
      }
    },
    drive: {
      'theme/': {
        'style.css': {
          raw: 'body { font-family: \'system-ui\'; }'
        }
      },
      'lang/': {}
    }
  }
  function override_app ([app]) {
    const data = app()
    data._.head.$._['foo>nav'].$._.menu[0] = ([menu, nav$menu]) => {
      const data = menu()
      // console.log(nav$menu([menu]))
      data.drive['lang/']['en-us.json'].raw = {
        links: ['custom', 'menu'],
        title: 'Custom'
      }
      return data
    }
    data._.head.$._['foo>nav'].$._.btn[0] = ([btn, btn1]) => {
      const data = btn()
      // console.log(nav$menu([menu]))
      data.drive['lang/']['en-us.json'].raw = {
        title: 'Register'
      }
      data.net.event.click.push({ address: 'page', type: 'register', args: rainbow_theme })
      return data
    }
    data._.head.$._['foo>nav'].$._.btn[1] = ([btn, btn1]) => {
      const data = btn()
      // console.log(nav$menu([menu]))
      data.drive['lang/']['en-us.json'].raw = {
        title: 'Switch'
      }
      data.net.event.click.push({
        address: 'page',
        type: 'swtch',
        args: {
          type: 'theme',
          name: 'rainbow'
        }
      })
      return data
    }
    return data
  }
}

}).call(this)}).call(this,"/doc/state/example/page.js","/doc/state/example")
},{"../../../src/node_modules/STATE":12,"app":2}],12:[function(require,module,exports){
const localdb = require('localdb')
const io = require('io')

const db = localdb()
/** Data stored in a entry in db by STATE (Schema): 
 * id (String): Node Path 
 * name (String/Optional): Any (To be used in theme_widget)
 * type (String): Module Name for module / Module id for instances
 * hubs (Array): List of hub-nodes
 * subs (Array): List of sub-nodes
 * inputs (Array): List of input files
 */
// Constants and initial setup (global level)
const VERSION = 13
const HELPER_MODULES = ['io', 'localdb', 'STATE']
const FALLBACK_POST_ERROR = '\nFor more info visit https://github.com/alyhxn/playproject/blob/main/doc/state/temp.md#defining-fallbacks'
const FALLBACK_SYNTAX_POST_ERROR = '\nFor more info visit https://github.com/alyhxn/playproject/blob/main/doc/state/temp.md#key-descriptions'
const FALLBACK_SUBS_POST_ERROR = '\nFor more info visit https://github.com/alyhxn/playproject/blob/main/doc/state/temp.md#shadow-dom-integration'
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
  listeners: {},
  missing_supers: new Set(),
  imports: {},
  expected_imports: {},
  used_ids: new Set(),
  a2i: {},
  i2a: {},
  services: {},
  args: {}
}
window.STATEMODULE = status

// Version check and initialization
status.fallback_check = Boolean(check_version())
status.fallback_check && db.add(['playproject_version'], VERSION)


// Symbol mappings
const s2i = {}
const i2s = {}
let admins = [0]

// Inner Function
function STATE (address, modulepath, dependencies) {
  !status.ROOT_ID && (status.ROOT_ID = modulepath)
  status.modulepaths[modulepath] = 0
  //Variables (module-level)
  
  const local_status = {
    name: extract_filename(address),
    module_id: modulepath,
    deny: {},
    sub_modules: [],
    sub_instances: {}
  }
  status.local_statuses[modulepath] = local_status
  return statedb
  
  function statedb (fallback) {
    const data = fallback({ listfy: tree => listfy(tree, modulepath), tree: status.tree_pointers[modulepath], args: status.args[modulepath] })
    local_status.fallback_instance = data.api
    const super_id = modulepath.split(/>(?=[^>]*$)/)[0]
    
    if(super_id === status.current_node){
      status.expected_imports[super_id].splice(status.expected_imports[super_id].indexOf(modulepath), 1)
    }
    else if((status?.current_node?.split('>').length || 0) < super_id.split('>').length){
      let temp = super_id
      while(temp !== status.current_node && temp.includes('>')){
        status.open_branches[temp] = 0
        temp = temp.split(/>(?=[^>]*$)/)[0]
      }
    }
    else{
      let temp = status.current_node
      while(temp !== super_id && temp.includes('>')){
        status.open_branches[temp] = 0
        temp = temp.split(/>(?=[^>]*$)/)[0]
      }
    }

    if(data._){
      status.open_branches[modulepath] = Object.keys(data._).length
      status.expected_imports[modulepath] = Object.keys(data._)
      status.current_node = modulepath
    }

    local_status.fallback_module = new Function(`return ${fallback.toString()}`)()
    verify_imports(modulepath, dependencies, data)
    const updated_status = append_tree_node(modulepath, status)
    Object.assign(status.tree_pointers, updated_status.tree_pointers)
    Object.assign(status.open_branches, updated_status.open_branches)
    status.inits.push(init_module)
    
    if(!Object.values(status.open_branches).reduce((acc, curr) => acc + curr, 0)){
      status.inits.forEach(init => init())
    }
    
    const sdb = create_statedb_interface(local_status, modulepath, xtype = 'module')
    status.dataset = sdb.private_api

    const get = init_instance
    const extra_fallbacks = Object.entries(local_status.fallback_instance || {})
    extra_fallbacks.length && extra_fallbacks.forEach(([key, value]) => {
      get[key] = (sid) => get(sid, value)
    })
    if(!status.a2i[modulepath]){
      status.i2a[status.a2i[modulepath] = encode(modulepath)] = modulepath
    }
    return {
      id: modulepath,
      sdb: sdb.public_api,
      get: init_instance,
      io: io(status.a2i[modulepath], modulepath)
      // sub_modules
    }
  }
  function append_tree_node (id, status) {
    const [super_id, name] = id.split(/>(?=[^>]*$)/)

    if(name){
      if(status.tree_pointers[super_id]){
        status.tree_pointers[super_id]._[name] = { $: { _: {} } }
        status.tree_pointers[id] = status.tree_pointers[super_id]._[name].$
        status.open_branches[super_id]--
      }
      else{
        let temp_name, new_name = name
        let new_super_id = super_id
        
        while(!status.tree_pointers[new_super_id]){
          [new_super_id, temp_name] = new_super_id.split(/>(?=[^>]*$)/)
          new_name = temp_name + '>' + new_name
        }
        status.tree_pointers[new_super_id]._[new_name] = { $: { _: {} } }
        status.tree_pointers[id] = status.tree_pointers[new_super_id]._[new_name].$
        if(!status.missing_supers.has(super_id))
          status.open_branches[new_super_id]--
        status.missing_supers.add(super_id)
      }
    }
    else{
      status.tree[id] = { $: { _: {} } }
      status.tree_pointers[id] = status.tree[id].$
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
      console.log('Main module: ', statedata.id, '\n', state_entries)
      updated_local_status && Object.assign(local_status, updated_local_status)
      // console.log('Local status: ', local_status.fallback_instance, statedata.api)
      const old_fallback = local_status.fallback_instance
      
      if(local_status.fallback_instance ? local_status.fallback_instance?.toString() === statedata.api?.toString() : false)
        local_status.fallback_instance = statedata.api
      else
        local_status.fallback_instance = (args) => {
          console.log('Old fallback: ', old_fallback)
          return statedata.api({old_fallback: [old_fallback], ...args})
        }
      const extra_fallbacks = Object.entries(old_fallback || {})
      extra_fallbacks.length && extra_fallbacks.forEach(([key, value]) => {
        local_status.fallback_instance[key] = () => statedata.api[key] ? statedata.api[key]([value]) : old_fallback[key]()
      })
      db.append(['state'], state_entries)
      // add_source_code(statedata.inputs) // @TODO: remove side effect
    }
    [local_status.sub_modules, symbol2ID, ID2Symbol, address2ID, ID2Address] = symbolfy(statedata, local_status)
    Object.assign(s2i, symbol2ID)
    Object.assign(i2s, ID2Symbol)
    Object.assign(status.a2i, address2ID)
    Object.assign(status.i2a, ID2Address)
    
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
  function init_instance (sid, fallback = local_status.fallback_instance) {
    const {statedata, state_entries, newstatus} = get_instance_data(sid, fallback)
    
    if (status.fallback_check) {
      Object.assign(status.root_module, newstatus.root_module)
      Object.assign(status.overrides, newstatus.overrides)
      Object.assign(status.tree, newstatus.tree)
      console.log('Main instance: ', statedata.id, '\n', state_entries)
      db.append(['state'], state_entries)
    }
    [local_status.sub_instances[statedata.id], symbol2ID, ID2Symbol, address2ID, ID2Address] = symbolfy(statedata, local_status)
    Object.assign(s2i, symbol2ID)
    Object.assign(i2s, ID2Symbol)
    Object.assign(status.a2i, address2ID)
    Object.assign(status.i2a, ID2Address)
    
    const sdb = create_statedb_interface(local_status, statedata.id, xtype = 'instance')

    const sanitized_event = {}
    statedata.net && Object.entries(statedata.net?.event).forEach(([def, action]) => {
      sanitized_event[def] = action.map(msg => {
        msg.id = status.a2i[msg.address] || (a2i[msg.address] = encode(msg.address))
        return msg
      })
    })
    if(statedata.net)
      statedata.net.event = sanitized_event
    return {
      id: statedata.id,
      net: statedata.net,
      sdb: sdb.public_api,
      io: io(status.a2i[statedata.id], modulepath)
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
  function get_instance_data (sid, fallback) {
    let id = s2i[sid]
    if(id && (id.split(':')[0] !== modulepath || !id.includes(':')))
        throw new Error(`Access denied! Wrong SID '${id}' used by instance of '${modulepath}'` + FALLBACK_SUBS_POST_ERROR)
    if(status.used_ids.has(id))
      throw new Error(`Access denied! SID '${id}' is already used` + FALLBACK_SUBS_POST_ERROR)

    id && status.used_ids.add(id)
    let data = id && db.read(['state', id])
    let sanitized_data, updated_status = status
    if (status.fallback_check) {
      if (!data && !status.root_instance) {
        ({sanitized_data, updated_status} = find_super({ xtype: 'instance', fallback, fun_status: status }))
      } else {
        ({sanitized_data, updated_status} = validate_and_preprocess({
          fun_status: status,
          fallback, 
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
    let modulepath_super = modulepath.split(/\>(?=[^>]*$)/)[0]
    let modulepath_grand = modulepath_super.split(/\>(?=[^>]*$)/)[0]
    const split = modulepath.split('>')
    let data
    const entries = {}
    if(xtype === 'module'){
      let name = split.at(-1)
      while(!data && modulepath_grand.includes('>')){
        data = db.read(['state', modulepath_super])
        const split = modulepath_super.split(/\>(?=[^>]*$)/)
        modulepath_super = split[0]
        name = split[1] + '>' + name
      }
      data.path = data.id = modulepath_super + '>' + name
      modulepath = modulepath_super + '>' + name
      local_status.name = name

      const super_data = db.read(['state', modulepath_super])
      super_data.subs.forEach((sub_id, i) => {
        if(sub_id === modulepath_super){
          super_data.subs.splice(i, 1)
          return
        }
      })
      super_data.subs.push(data.id)
      entries[super_data.id] = super_data
    }
    else{
      //@TODO: Make the :0 dynamic
      let instance_path_super = modulepath_super + ':0'
      let temp
      while(!data && temp !== modulepath_super){
        data = db.read(['state', instance_path_super])
        temp = modulepath_super
        modulepath_grand = modulepath_super = modulepath_super.split(/\>(?=[^>]*$)/)[0]
        instance_path_super = modulepath_super + ':0'
      }
      data.path = data.id = get_instance_path(modulepath)
      temp = null
      let super_data
      let instance_path_grand = modulepath_grand.includes('>') ? modulepath_grand + ':0' : modulepath_grand

      while(!super_data?.subs && temp !== modulepath_grand){
        super_data = db.read(['state', instance_path_grand])
        temp = modulepath_grand
        modulepath_grand = modulepath_grand.split(/\>(?=[^>]*$)/)[0]
        instance_path_grand = modulepath_grand.includes('>') ? modulepath_grand + ':0' : modulepath_grand
      }
      
      super_data.subs.forEach((sub_id, i) => {
        if(sub_id === instance_path_super){
          super_data.subs.splice(i, 1)
          return
        }
      })
      super_data.subs.push(data.id)
      entries[super_data.id] = super_data
    }
    data.name = split.at(-1)
    return { updated_local_status: local_status,
      ...validate_and_preprocess({ 
      fun_status,
      fallback, xtype, 
      pre_data: data, 
      orphan_check: true, entries }) }
  }
  function validate_and_preprocess ({ fallback, xtype, pre_data = {}, orphan_check, fun_status, entries }) {
    const used_keys = new Set()
    let {id: pre_id, hubs: pre_hubs, mapping} = pre_data
    let fallback_data
    try {
      validate(fallback({ listfy: tree => listfy(tree, modulepath), tree: status.tree_pointers[modulepath], args: status.args[pre_id] }), xtype)
    } catch (error) {
      throw new Error(`in fallback function of ${pre_id} ${xtype}\n${error.stack}`)
    }
    if(fun_status.overrides[pre_id]){
      fallback_data = fun_status.overrides[pre_id].fun[0](get_fallbacks({ fallback, modulename: local_status.name, modulepath, instance_path: pre_id }))
      console.log('Override used: ', pre_id)
      fun_status.overrides[pre_id].by.splice(0, 1)
      fun_status.overrides[pre_id].fun.splice(0, 1)
    }
    else
      fallback_data = fallback({ listfy: tree => listfy(tree, modulepath), tree: status.tree_pointers[modulepath], args: status.args[pre_id] })

    // console.log('fallback_data: ', fallback_data)
    fun_status.overrides = register_overrides({ overrides: fun_status.overrides, tree: fallback_data, path: modulepath, id: pre_id })
    console.log('overrides: ', Object.keys(fun_status.overrides))
    orphan_check && (fallback_data.orphan = orphan_check)
    //This function makes changes in fun_status (side effect)
    return {
      sanitized_data: sanitize_state({ local_id: '', entry: fallback_data, path: pre_id, xtype, mapping, entries }),
      updated_status: fun_status
    }
    
    function sanitize_state ({ local_id, entry, path, hub_entry, local_tree, entries = {}, xtype, mapping, xkey }) {
      [path, entry, local_tree] = extract_data({ local_id, entry, path, hub_entry, local_tree, xtype, xkey })

      entry.id =  path
      entry.name = entry.name || local_id.split(':')[0] || local_status.name
      mapping && (entry.mapping = mapping)
      
      entries = {...entries, ...sanitize_subs({ local_id, entry, path, local_tree, xtype, mapping })}
      delete entry._
      entries[entry.id] = entry
      // console.log('Entry: ', entry)
      return {entries, entry}
    }
    function extract_data ({ local_id, entry, path, hub_entry, xtype, xkey }) {
      if (local_id) {
        entry.hubs = [hub_entry.id]
        if (xtype === 'instance') {
          let temp_path = path.split(':')[0]
          temp_path = temp_path ? temp_path + '>' : temp_path
          const module_id = temp_path + local_id
          entry.type = module_id
          path = module_id + ':' + xkey
          temp = Number(xkey)+1
          temp2 = db.read(['state', path])
          while(temp2 || used_keys.has(path)){
            path = module_id + ':' + temp
            temp2 = db.read(['state', path])
            temp++
          }
        }
        else {
          entry.type = local_id
          path = path ? path + '>' : ''
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
            Object.entries(value).forEach(([key, override]) => {
              if(key === 'mapping' || (key === '$' && xtype === 'instance'))
                return
              const sub_instance = sanitize_state({ local_id, entry: value, path, hub_entry: entry, local_tree, xtype: key === '$' ? 'module' : 'instance', mapping: value['mapping'], xkey: key }).entry
              entries[sub_instance.id] = JSON.parse(JSON.stringify(sub_instance))
              entry.subs.push(sub_instance.id)
              used_keys.add(sub_instance.id)
            })
        })}
        if (entry.drive) {
          // entry.drive.theme && (entry.theme = entry.drive.theme)
          // entry.drive.lang && (entry.lang = entry.drive.lang)
          entry.inputs = []
          const new_drive = []
          Object.entries(entry.drive).forEach(([dataset_type, dataset]) => {
            dataset_type = dataset_type.split('/')[0]

            const new_dataset = { files: [], mapping: {} }
            Object.entries(dataset).forEach(([key, value]) => {
              const sanitized_file = sanitize_file(key, value, entry, entries)
              entries[sanitized_file.id] = sanitized_file
              new_dataset.files.push(sanitized_file.id)
            })
            new_dataset.id = local_status.name + '.' + dataset_type + '.dataset'
            new_dataset.type = dataset_type
            new_dataset.name = 'default'
            const copies = Object.keys(db.read_all(['state', new_dataset.id]))
            if (copies.length) {
              const id = copies.sort().at(-1).split(':')[1]
              new_dataset.id = new_dataset.id + ':' + (Number(id || 0) + 1)
            }
            entries[new_dataset.id] = new_dataset
            let check_name = true
            entry.inputs.forEach(dataset_id => {
              const ds = entries[dataset_id]
              if(ds.type === new_dataset.type)
                check_name = false
            })
            check_name && entry.inputs.push(new_dataset.id)
            new_drive.push(new_dataset.id)


            if(!status.root_module){
              const hub_entry = db.read(['state', entry.hubs[0]])
              if(!mapping?.[dataset_type])
                throw new Error(`No mapping found for dataset "${dataset_type}" of subnode "${entry.id}" in node "${hub_entry.id}"\nTip: Add a mapping prop for "${dataset_type}" dataset in "${hub_entry.id}"'s fallback for "${entry.id}"` + FALLBACK_POST_ERROR)
              const mapped_file_type = mapping[dataset_type]
              hub_entry.inputs.forEach(input_id => {
                const input = db.read(['state', input_id])
                if(mapped_file_type === input.type){
                  input.mapping[entry.id] = new_dataset.id
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
    function sanitize_file (file_id, file, entry, entries) {
      const type = file_id.split('.').at(-1)

      if (!isNaN(Number(file_id))) return file_id


      file.id = local_status.name + '.' + type
      file.name = file.name || file_id
      file.type = type
      file[file.type === 'js' ? 'subs' : 'hubs'] = [entry.id]
      if(file.$ref){
        file.$ref = address.substring(0, address.lastIndexOf("/")) + '/' + file.$ref
      }
      const copies = Object.keys(db.read_all(['state', file.id]))
      if (copies.length) {
        const no = copies.sort().at(-1).split(':')[1]
        file.id = file.id + ':' + (Number(no || 0) + 1)
      }
      while(entries[file.id]){
        const no = file.id.split(':')[1]
        file.id = file.id + ':' + (Number(no || 0) + 1)
      }
      return file
    }
  }
}

// External Function (helper)
function validate (data, xtype) {
  /**  Expected structure and types
   * Sample : "key1|key2:*:type1|type2"
   * ":" : separator
   * "|" : OR
   * "*" : Required key
   * */
  const expected_structure = {
    'api::function': () => {},
    '_::object': {
      ":*:object": xtype === 'module' ? {
        ":*:function|string|object": '',
        "mapping::": {}
      } : { // Required key, any name allowed
        ":*:function|string|object": () => {}, // Optional key
        "mapping::": {}
      },
    },
    'drive::object': {
      "::object": {
        "::object": { // Required key, any name allowed
          "raw|$ref:*:object|string": {}, // data or $ref are names, required, object or string are types
          "$ref": "string"
        }
      },
    },
    'net::object': {}
  }

  validate_shape(data, expected_structure)

  function validate_shape (obj, expected, super_node = 'root', path = '') {
    const keys = Object.keys(obj)
    const values = Object.values(obj)
    let strict = Object.keys(expected).length

    const all_keys = []
    Object.entries(expected).forEach(([expected_key, expected_value]) => {
      let [expected_key_names, required, expected_types] = expected_key.split(':')
      expected_types = expected_types ? expected_types.split('|') : [typeof(expected_value)]
      let absent = true
      if(expected_key_names)
        expected_key_names.split('|').forEach(expected_key_name => {
          const value = obj[expected_key_name]
          if(value !== undefined){
            all_keys.push(expected_key_name)
            const type = typeof(value)
            absent = false

            if(expected_types.includes(type))
              type === 'object' && validate_shape(value, expected_value, expected_key_name, path + '/' + expected_key_name)
            else
              throw new Error(`Type mismatch: Expected "${expected_types.join(' or ')}" got "${type}" for key "${expected_key_name}" at:` + path + FALLBACK_POST_ERROR)
          }
        })
      else{
        strict = false
        values.forEach((value, index) => {
          absent = false
          const type = typeof(value)

          if(expected_types.includes(type))
            type === 'object' && validate_shape(value, expected_value, keys[index], path + '/' + keys[index])
          else
            throw new Error(`Type mismatch: Expected "${expected_types.join(' or ')}" got "${type}" for key "${keys[index]}" at: ` + path + FALLBACK_POST_ERROR)
        })
      }
      if(absent && required){
        if(expected_key_names)
          throw new Error(`Can't find required key "${expected_key_names.replace('|', ' or ')}" at: ` + path + FALLBACK_POST_ERROR)
        else
          throw new Error(`No sub-nodes found for super key "${super_node}" at sub: ` + path + FALLBACK_POST_ERROR)
      }
    })

    strict && keys.forEach(key => {
      if(!all_keys.includes(key)){
        throw new Error(`Unknown key detected: '${key}' is an unknown property at: ${path || 'root'}` + FALLBACK_POST_ERROR)
      }
    })
  }
}
function extract_filename (address) {
  const parts = address.split('/node_modules/')
  const last = parts.at(-1).split('/')
  if(last.at(-1) === 'index.js')
    return last.at(-2)
  return last.at(-1).slice(0, -3)
}
function get_instance_path (modulepath, modulepaths = status.modulepaths) {
  return modulepath + ':' + modulepaths[modulepath]++
}
async function get_input ({ id, name, $ref, type, raw }) {
  const xtype = (typeof(id) === "number" ? name : id).split('.').at(-1)
  let result = db.read([type, id])
  
  if (!result) {
    if (raw === undefined){
      let ref_url = $ref
      // Patch: Prepend GitHub project name if running on GitHub Pages
      if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
        const path_parts = window.location.pathname.split('/').filter(Boolean)
        if (path_parts.length > 0 && !$ref.startsWith('/' + path_parts[0])) {
          ref_url = '/' + path_parts[0] + ($ref.startsWith('/') ? '' : '/') + $ref
        }
      }
      const response = await fetch(ref_url)
      if (!response.ok) 
        throw new Error(`Failed to fetch data from '${ref_url}' for '${id}'` + FALLBACK_SYNTAX_POST_ERROR)
      else
        result = await response[xtype === 'json' ? 'json' : 'text']()
    }
    else
      result = raw
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
function verify_imports (id, imports, data) {
  const state_address = imports.find(imp => imp.includes('STATE'))
  HELPER_MODULES.push(state_address)
  imports = imports.filter(imp => !HELPER_MODULES.includes(imp))
  if(!data._){
    if(imports.length > 1){
      imports.splice(imports.indexOf(state_address), 1)
      throw new Error(`No sub-nodes found for required modules "${imports.join(', ')}" in the fallback of "${status.local_statuses[id].module_id}"` + FALLBACK_POST_ERROR)
    }
    else return
  }
  const fallback_imports = Object.keys(data._)

  imports.forEach(imp => {
    let check = true
    fallback_imports.forEach(fallimp => {
      if(imp === fallimp)
        check = false
    })

    if(check)
      throw new Error('Required module "'+imp+'" is not defined in the fallback of '+status.local_statuses[id].module_id + FALLBACK_POST_ERROR)
  })
  
  fallback_imports.forEach(fallimp => {
    let check = true
    imports.forEach(imp => {
      if(imp === fallimp)
        check = false
    })
    
    if(check)
      throw new Error('Module "'+fallimp+'" defined in the fallback of '+status.local_statuses[id].module_id+' is not required')
  })

}
function symbolfy (data) {
  const i2s = {}
  const s2i = {}
  const i2a = {}
  const a2i = {}
  const subs = []
  data.subs && data.subs.forEach(sub => {
    const substate = db.read(['state', sub])
    i2a[a2i[sub] = encode(sub)] = sub
    s2i[i2s[sub] = Symbol(a2i[sub])] = sub
    subs.push({ sid: i2s[sub], type: substate.type })
  })
  return [subs, s2i, i2s, a2i, i2a]
}
function encode(text) {
  let code = ''
  while (code.length < 50) {
    for (let i = 0; i < text.length && code.length < 50; i++) {
      code += Math.floor(10 + Math.random() * 90)
    }
  }
  return code
}
function listfy(tree, prefix = '') {
  if (!tree)
    return []

  const result = []

  function walk(current, prefix = '') {
    for (const key in current) {
      if (key === '$' && current[key]._ && typeof current[key]._ === 'object') {
        walk(current[key]._, prefix)
      } else {
        const path = prefix ? `${prefix}>${key}` : key
        result.push(path)
        if (current[key]?.$?._ && typeof current[key].$._ === 'object') {
          walk(current[key].$._, path)
        }
      }
    }
  }

  if (tree._ && typeof tree._ === 'object') {
    walk(tree._, prefix)
  }

  return result
}
function register_overrides ({overrides, ...args}) {
  recurse(args)
  return overrides
  function recurse ({ tree, path = '', id, xtype = 'instance', local_modulepaths = {} }) {

    tree._ && Object.entries(tree._).forEach(([type, instances]) => {
      const sub_path = path + '>' + type
      Object.entries(instances).forEach(([id, override]) => {
        const resultant_path = id === '$' ? sub_path : sub_path + ':' + id
        if(typeof(override) === 'function'){
          if(overrides[resultant_path]){
            overrides[resultant_path].fun.push(override)
            overrides[resultant_path].by.push(id)
          }
          else
            overrides[resultant_path] = {fun: [override], by: [id]}
        }
        else if (typeof(override) === 'object' && id !== 'mapping' && override._ === undefined)
          status.args[resultant_path] = structuredClone(override)
        else
          recurse({ tree: override, path: sub_path, id, xtype, local_modulepaths })
      })
    })
  }
}
function get_fallbacks ({ fallback, modulename, modulepath, instance_path }) {
  return [mutated_fallback, ...status.overrides[instance_path].fun]
    
  function mutated_fallback () {
    console.log('Args: ', status.args[instance_path])
    const data = fallback({ listfy: tree => listfy(tree, modulepath), tree: status.tree_pointers[modulepath], args: status.args[instance_path] })

    data.overrider = status.overrides[instance_path].by[0]
    merge_trees(data, modulepath)
    return data

    function merge_trees (data, path) {
      if (data._) {
        Object.entries(data._).forEach(([type, data]) => merge_trees(data, path + '>' + type.split('$')[0].replace('.', '>')))
      } else {
        data.$ = { _: status.tree_pointers[path]?._ }
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
  const api =  {
    public_api: {
      watch, get_sub, drive: {
        get, has, put, list
      }
    },
    private_api: {
      xget: (id) => db.read(['state', id]),
      get_all: () => db.read_all(['state']),
      get_db,
      register,
      load: (snapshot) => {
        localStorage.clear()
        Object.entries(snapshot).forEach(([key, value]) => {
          db.add([key], JSON.parse(value), true)
        })
        window.location.reload()
      },
      swtch,
      unregister
    }
  }
  node_id === status.ROOT_ID && (api.public_api.admin = api.private_api)
  return api

  async function watch (listener, on) {
    if(on)
      status.services[node_id] = Object.keys(on)
    const data = db.read(['state', node_id])
    if(listener){
      status.listeners[data.id] = listener
      listener(await make_input_map(data.inputs))
    }
    return xtype === 'module' ? local_status.sub_modules : local_status.sub_instances[node_id]
  }
  function get_sub (type) {
    return local_status.subs.filter(sub => {
      const dad = db.read(['state', sub.type])
      return dad.type === type
    })
  }
  function get_db ({ type: dataset_type, name: dataset_name } = {}) {
    const node = db.read(['state', status.ROOT_ID])
    if(dataset_type){
      const dataset_list = []
      node.drive.forEach(dataset_id => {
        const dataset = db.read(['state', dataset_id])
        if(dataset.type === dataset_type)
          dataset_list.push(dataset.name)
      })
      if(dataset_name){
        return recurse(status.ROOT_ID, dataset_type)
      }
      return dataset_list
    }
    const datasets = []
    node.inputs && node.inputs.forEach(dataset_id => {
      datasets.push(db.read(['state', dataset_id]).type)
    })
    return datasets
  
    function recurse (node_id, dataset_type){
      const node_list = []
      const entry = db.read(['state', node_id])
      const temp = entry.mapping ? Object.keys(entry.mapping).find(key => entry.mapping[key] === dataset_type) : null
      const mapped_type = temp || dataset_type
      entry.drive && entry.drive.forEach(dataset_id => {
        const dataset = db.read(['state', dataset_id])
        if(dataset.name === dataset_name && dataset.type === mapped_type){
          node_list.push(node_id)
          return
        }
      })
      entry.subs && entry.subs.forEach(sub_id => node_list.push(...recurse(sub_id, mapped_type)))
      return node_list
    }
  }
  function register ({ type: dataset_type, name: dataset_name, dataset}) {
    Object.entries(dataset).forEach(([node_id, files]) => {
      const new_dataset = { files: [] }
      Object.entries(files).forEach(([file_id, file]) => {
        const type = file_id.split('.').at(-1)
        
        file.id = local_status.name + '.' + type
        file.local_name = file_id
        file.type = type
        file[file.type === 'js' ? 'subs' : 'hubs'] = [node_id]
        
        const copies = Object.keys(db.read_all(['state', file.id]))
        if (copies.length) {
          const no = copies.sort().at(-1).split(':')[1]
          file.id = file.id + ':' + (Number(no || 0) + 1)
        }  
        db.add(['state', file.id], file)
        new_dataset.files.push(file.id)
      })
  
      const node = db.read(['state', node_id])
      new_dataset.id = node.name + '.' + dataset_type + '.dataset'
      new_dataset.name = dataset_name
      new_dataset.type = dataset_type
      const copies = Object.keys(db.read_all(['state', new_dataset.id]))
      if (copies.length) {
        const id = copies.sort().at(-1).split(':')[1]
        new_dataset.id = new_dataset.id + ':' + (Number(id || 0) + 1)
      }
      db.push(['state', node_id, 'drive'], new_dataset.id)
      db.add(['state', new_dataset.id], new_dataset)
    })
    console.log(' registered ' + dataset_name + '.' + dataset_type)
  }
  function unregister ({ type: dataset_type, name: dataset_name } = {}) {
    return recurse(status.ROOT_ID)

    function recurse (node_id){
      const node = db.read(['state', node_id])
      node.drive && node.drive.some(dataset_id => {
        const dataset = db.read(['state', dataset_id])
        if(dataset.name === dataset_name && dataset.type === dataset_type){
          node.drive.splice(node.drive.indexOf(dataset_id), 1)
          return true
        }
      })
      node.inputs && node.inputs.some(dataset_id => {
        const dataset = db.read(['state', dataset_id])
        if(dataset.name === dataset_name && dataset.type === dataset_type){
          node.inputs.splice(node.inputs.indexOf(dataset_id), 1)
          swtch(dataset_type)
          return true
        }
      })
      db.add(['state', node_id], node)
      node.subs.forEach(sub_id => recurse(sub_id))
    }
  }
  function swtch ({ type: dataset_type, name: dataset_name = 'default'}) {
    recurse(dataset_type, dataset_name, status.ROOT_ID)

    async function recurse (target_type, target_name, id) {
      const node = db.read(['state', id])
      
      let target_dataset
      node.drive && node.drive.forEach(dataset_id => {
        const dataset = db.read(['state', dataset_id])
        if(target_name === dataset.name && target_type === dataset.type){
          target_dataset = dataset
          return
        }
      })
      if(target_dataset){
        node.inputs.forEach((dataset_id, i) => {
          const dataset = db.read(['state', dataset_id])
          if(target_type === dataset.type){
            node.inputs.splice(i, 1)
            return
          }
        })
        node.inputs.push(target_dataset.id)
      }
      db.add(['state', id], node)
      status.listeners[id] && status.listeners[id](await make_input_map(node.inputs))
      node.subs && node.subs.forEach(sub_id => {
        const subdataset_id = target_dataset?.mapping?.[sub_id] 
        recurse(target_type, db.read(['state', subdataset_id])?.name || target_name, sub_id)
      })
    }
  }
  
  function list (path) {
    const node = db.read(['state', node_id])
    const dataset_names = node.drive.map(dataset_id => {
      return dataset_id.split('.').at(1) + '/'
    })
    if (path) {
      let index
      dataset_names.some((dataset_name, i) => {
        if (path.includes(dataset_name)) {
          index = i
          return true
        }
      })
      if (index === undefined)
        throw new Error(`Dataset "${dataset_name}" not found in node "${node.name}"`) 
      const dataset = db.read(['state', node.drive[index]])
      return dataset.files.map(fileId => {
        const file = db.read(['state', fileId])
        return file.name
      })
    }
    return dataset_names
  }
  function get (path) {
    const [dataset_name, file_name] = path.split('/')
    const node = db.read(['state', node_id])
    let dataset
    node.drive.some(dataset_id => {
      if (dataset_name === dataset_id.split('.').at(1)) {
        dataset = db.read(['state', dataset_id])
        return true
      }
    })
    if (!dataset) 
      throw new Error(`Dataset "${dataset_name}" not found in node "${node.name}"`)
    
    return dataset.files.map(file_id => {
      const file = db.read(['state', file_id])
      if (file.name === file_name) {
        return { id: file.id, name: file.name, type: file.type, raw: file.raw }
      }
    }).filter(Boolean)[0] || null
  }
  function put (path, buffer) {
    const [dataset_name, filename] = path.split('/')
    let dataset
    const node = db.read(['state', node_id])
    node.drive.some(dataset_id => {
      if (dataset_name === dataset_id.split('.').at(1)) {
        dataset = db.read(['state', dataset_id])
        return true
      }
    })
    if (!dataset) 
      throw new Error(`Dataset "${dataset_name}" not found in node "${node.name}"`)
    const type = filename.split('.').pop()
    let file_id = filename
    let count = 1
    while (db.read(['state', file_id])) {
      file_id = `${filename}:${count++}`
    }
    const file = {
      id: file_id,
      name: filename,
      type,
      raw: buffer
    }
    db.add(['state', file_id], file)
    dataset.files.push(file_id)
    db.add(['state', dataset.id], dataset)
    return { id: file_id, name: filename, type, raw: buffer }
  }
  function has (path) {
    const [dataset_name, filename] = path.split('/')
    let dataset
    const node = db.read(['state', node_id])
    node.drive.some(dataset_id => {
      if (dataset_name === dataset_id.split('.').at(1)) {
        dataset = db.read(['state', dataset_id])
        return true
      }
    })
    if (!dataset) 
      throw new Error(`Dataset "${dataset_name}" not found in node "${node.name}"`)
    return dataset.files.some(file_id => {
      const file = db.read(['state', file_id])
      return file && file.name === filename
    })
  }
}
async function make_input_map (inputs) {
  const input_map = []   
  if (inputs) {
    await Promise.all(inputs.map(async input => {
      let files = []
      const dataset = db.read(['state', input])
      await Promise.all(dataset.files.map(async file_id => {
        const input_state = db.read(['state', file_id])
        files.push(await get_input(input_state))
      }))
      input_map.push({ type: dataset.type, data: files })
    }))
  }
  return input_map
}


module.exports = STATE
},{"io":13,"localdb":14}],13:[function(require,module,exports){
const taken = {}

module.exports = io
function io(seed, alias) {
  if (taken[seed]) throw new Error(`seed "${seed}" already taken`)
  // const pk = seed.slice(0, seed.length / 2)
  // const sk = seed.slice(seed.length / 2, seed.length)
  const self = taken[seed] = { id: seed, alias, peer: {} }
  const io = { at, on }
  return io

  async function at (id, signal = AbortSignal.timeout(1000)) {
    if (id === seed) throw new Error('cannot connect to loopback address')
    if (!self.online) throw new Error('network must be online')
    const peer = taken[id] || {}
    // if (self.peer[id] && peer.peer[pk]) {
    //   self.peer[id].close() || delete self.peer[id]
    //   peer.peer[pk].close() || delete peer.peer[pk]
    //   return console.log('disconnect')
    // }
    // self.peer[id] = peer
    if (!peer.online) return wait() // peer with id is offline or doesnt exist
    connect()
    function wait () {
      const { resolve, reject, promise } = Promise.withResolvers()
      signal.onabort = () => reject(`timeout connecting to "${id}"`)
      peer.online = { resolve }
      return promise.then(connect)
    }
    function connect () {
      signal.onabort = null
      const { port1, port2 } = new MessageChannel()
      port2.by = port1.to = id
      port2.to = port1.by = seed
      self.online(self.peer[id] = port1)
      peer.online(peer.peer[seed] = port2)
    }
  }
  function on (online) { 
    if (!online) return self.online = null
    const resolve = self.online?.resolve
    self.online = online
    if (resolve) resolve(online)
  }
}
},{}],14:[function(require,module,exports){
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
