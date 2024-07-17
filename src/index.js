const fetch_data = require('fetch-data')
const modules = {
 theme_widget : require('theme_widget'),
 topnav : require('topnav'),
 header : require('header'),
 datdot : require('datdot'),
 editor : require('editor'),
 smartcontract_codes : require('smartcontract_codes'),
 supporters : require('supporters'),
 our_contributors : require('our_contributors'),
 footer : require('footer'),
}
/******************************************************************************
  MAKE_PAGE COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------
const sheet = new CSSStyleSheet
sheet.replaceSync(get_theme())
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------

module.exports = make_page

async function make_page(opts, lang) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const id = `${ID}:${count++}` // assigns their own name
  const status = { tree: { '': { id: '' } }, id: 0 }
  const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {}, ports: {}} // all state of component instance
  const on_rx = {
    init_ch,
    req_ch,
    send,
    jump
  }
  // ----------------------------------------
  // OPTS
  // ----------------------------------------
  switch(lang) {
    case 'zh-tw':
    case 'ja':
    case 'th':
    case 'fr':
      var path = `./src/node_modules/lang/${lang}.json`
      break
    default:
      var path = `./src/node_modules/lang/en-us.json`
  }
  const data = await fetch_data(path)
  const {theme} = opts
  
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  shadow.adoptedStyleSheets = [sheet]
  shadow.innerHTML = `
  <div id="top" class='wrap'>
  </div>`
  const main = shadow.querySelector('div')

  main.append(...await Promise.all(Object.entries(data).map(async entry => {
    const el = document.createElement('div')
    el.id = entry[0]
    const shadow = el.attachShadow(shopts)
    shadow.append(await modules[entry[0]](entry[1], init_ch({data: {name: entry[0], pref: entry[1].pref }})))
    return el
  })))
  update_theme_widget()
  return el
  
  function init_ch({ data, hub = '' }) {
    if(data.name)
      var {name, uniq, shared, type} = data
    else
      var name = data
    const ch = new MessageChannel()
    const id = data.id ? data.id : status.id++
    state.ports[id] = ch.port1
    status.tree[id] = { name, type, hub, uniq, shared }
    ch.port1.onmessage = event => {
      on_rx[event.data.type] && on_rx[event.data.type]({...event.data, by: id})
    }
    return ch.port2
  }
  function req_ch ({ by, data }) {
    const port = init_ch({ data, hub: by })
    state.ports[by].postMessage({ data: 'hi' }, [port])
  }
  function send ({ data, to, to_type, by }) {
    state.ports[to].postMessage({ data, type: to_type, by })
  }
  async function update_theme_widget () {
    state.ports[0].postMessage({ data: status.tree, type: 'refresh'})
  }
  async function jump ({ data }) {
    main.querySelector('#'+data).scrollIntoView({ behavior: 'smooth'})
  }
}

function get_theme() {
  return `
.wrap {
    background: var(--bodyBg);
}
[class^="cloud"] {
    transition: left 0.6s, bottom 0.5s, top 0.5s linear;
}`}
