/******************************************************************************
  STATE
******************************************************************************/
const STATE = require('STATE')
const name = 'index'
const statedb = STATE({ modulename: name })
const shopts = { mode: 'closed' }
// ----------------------------------------
const { id, sdb, getdb } = statedb(fallback)
function fallback (main_db) { main_db.populate(require('./module.json')) }
sdb.on({ css: css => {} })
/******************************************************************************
  MAKE_PAGE COMPONENT
******************************************************************************/
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
module.exports = main

async function main(opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await getdb(opts.sid, fallback) // hub is "parent's" io "id" to send/receive messages
  const subs = await sdb.on({
    css: function oncss (css) { },
    args: function onargs (args) { },
  })
  const on = {
    jump,
    inject,
    inject_all,
  }
  const send = await IO({ 
    id, 
    name, 
    type: 'comp', 
    comp: name }, on)
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
  <div id="top" class='wrap'>
  </div>`
  const main = shadow.querySelector('div')

  main.append(...await Promise.all(
    Object.entries(subs).map(async ([name, sids]) => {
      const el = document.createElement('div')
      el.name = name
      const shadow = el.attachShadow(shopts)
      shadow.append(await modules[name]({ sid: sids[0], hub: [id] }))
      return el
  })))
  init_css()
  return el
  
  function fallback() {
    return require('./instance.json')
  }
  async function jump ({ data }) {
    main.querySelector('#'+data).scrollIntoView({ behavior: 'smooth'})
  }
  async function init_css () {
    const pref = JSON.parse(localStorage.pref || '{}')
    const pref_shared = pref[name] || [{ id: name }]
    const pref_uniq = pref[id] || []
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

