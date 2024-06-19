const fetch_data = require('fetch-data')
const modules = {
 theme_widget : require('theme-widget'),
 topnav : require('topnav'),
 header : require('header'),
 datdot : require('datdot'),
 editor : require('editor'),
 smartcontract_codes : require('smartcontract-codes'),
 supporters : require('supporters'),
 our_contributors : require('our-contributors'),
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
  const status = {}
  const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {}, ports: {}} // all state of component instance
  const on_rx = {
    init_ch,
    req_ch,
    send,
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
  const text = await fetch_data(path)
  const data = text.pages
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
    return await modules[entry[0]](entry[1], init_ch({name: entry[0]}))
  })))
  update_theme_widget()
  return el
  
  function init_ch({ name }) {
    const ch = new MessageChannel()
    state.ports[name] = ch.port1
    ch.port1.onmessage = event => {
      console.log('Message by', name, ':', event.data)
      on_rx[event.data.type] && on_rx[event.data.type]({...event.data, by: name})
    }
    return ch.port2
  }
  function req_ch({ by, data }){
    const port = init_ch({ name: data })
    state.ports[by].postMessage({ data: 'hi' }, [port])
  }
  function send({ data, to, to_type }){
    console.error(state.ports[to], to)
    state.ports[to].postMessage({ data, type: to_type})
  }
  async function update_theme_widget(){
    state.ports.theme_widget.postMessage({ data: Object.keys(state.ports), type: 'refresh'})
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
