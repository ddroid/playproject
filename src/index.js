const theme_widget = require('theme-widget')
const topnav = require('topnav')
const Header = require('header')
const datdot = require('datdot')
const editor = require('editor')
const smartcontract_codes = require('smartcontract-codes')
const supporters = require('supporters')
const our_contributors = require('our-contributors')
const Footer = require('footer')
const fetch_data = require('fetch-data')
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
  const { menu, header, section1, section2, section3, section4, section5, footer } = text.pages
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
  main.append(await topnav(menu, init_ch({name: 'topnav'})), await Header(header, init_ch({name: 'header'})), await datdot(section1, init_ch({name: 'datdot'})), await editor(section2, init_ch({name: 'editor'})), await smartcontract_codes(section3, init_ch({name: 'smartcontract_codes'})), await supporters(section4, init_ch({name: 'supporters'})), await our_contributors(section5, init_ch({name: 'our_contributors'})), await Footer(footer, init_ch({name: 'footer'})), await theme_widget(Object.keys(state.ports), init_ch({name: 'theme_widget'})))
  return el
  
  function init_ch({ name }) {
    const ch = new MessageChannel()
    state.ports[name] = ch.port1
    ch.port1.onmessage = event => {
      console.log('Message from', name, ':', event.data)
      on_rx[event.data.type] && on_rx[event.data.type]({...event.data, from: name})
    }
    return ch.port2
  }
  function req_ch({ from, data }){
    const port = init_ch({ name: data })
    state.ports[from].postMessage({ data: 'hi' }, [port])
  }
  function send({ data, to, to_type }){
    console.error(state.ports[to], to)
    state.ports[to].postMessage({ data, type: to_type})
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
