const IO = require('io')
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
const statedb = require('STATE')
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
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------

module.exports = make_page

async function make_page(opts, lang) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const name = 'index'
  const id = `${ID}:${count++}` // assigns their own name
  const status = {}
  const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {}, ports: ['', '', '']} // all state of component instance
  const on = {
    jump,
    inject,
    inject_all,
  }
  const sdb = statedb()
  const sid = await sdb.init('./data.json')
  const data = sdb.get(sid)
  const {send, css_id} = await IO({ name, type: 'comp', comp: name }, on)
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
  const {theme} = opts
  
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
  <div id="top" class='wrap'>
  </div>`
  const main = shadow.querySelector('div')

  main.append(...await Promise.all(Object.entries(modules).map(async entry => {
    const el = document.createElement('div')
    el.id = entry[0]
    const shadow = el.attachShadow(shopts)
    shadow.append(await entry[1]({ sid: data.sub[entry[0]], hub: [css_id] }))
    return el
  })))
  init_css()
  return el
  
  async function jump ({ data }) {
    main.querySelector('#'+data).scrollIntoView({ behavior: 'smooth'})
  }
  async function init_css () {
    const pref = JSON.parse(localStorage.pref)
    const pref_shared = pref[name] || data.shared || [{ id: name }]
    const pref_uniq = pref[css_id] || data.uniq || []
    pref_shared.forEach(async v => inject_all({ data: await get_theme(v)}))
    pref_uniq.forEach(async v => inject({ data: await get_theme(v)}))
  }
  async function inject_all ({ data }) {
    const sheet = new CSSStyleSheet
    sheet.replaceSync(data)
    shadow.adoptedStyleSheets.push(sheet)
  }
  async function inject ({ data }){
    const style = document.createElement('style')
    style.innerHTML = data
    shadow.append(style)
  }
  async function get_theme ({local = true, theme = 'default', id}) {
    let theme_css
    if(local)
      theme_css = await (await fetch(`./src/node_modules/css/${theme}/${id}.css`)).text()
    else
      theme_css = JSON.parse(localStorage[theme])[id]
    return theme_css
  }
}

