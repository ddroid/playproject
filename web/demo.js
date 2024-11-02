const STATE = require('../src/node_modules/STATE')
/******************************************************************************
  INITIALIZE PAGE
******************************************************************************/
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback)

const make_page = require('../') 

function fallback () { // -> set database defaults or load from database
	return {
    0: {
      admins: ["theme_editor", "theme_widget"],
      subs: [2]
    },
    2: {
      type: "index",
      subs: [3]
    },
    3: {
      type: "topnav"
    },
    1: {
      subs: [4],
      inputs: ["demo.css"]
    },
    "demo.css": {
      $ref: new URL('src/node_modules/css/default/demo.css', location).href
    },
    4: {
      type: 2,
      subs: [5]
    },
    5: {
      type: 3,
      fallback: {
        1: fallback_topnav,
        4: null,
      }
    }
  }
}
function fallback_topnav (data) {
  data['topnav.json'].data.links.push({
    "id": "demo",
    "text": "Demo",
    "url": "demo"
  })
  return data
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
async function boot () {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get('') // hub is "parent's" io "id" to send/receive messages
  const [opts] = sdb.get_sub('index')
  const on = {
    css: inject,
  }
  sdb.watch(onbatch)
  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }
  }
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
    const element = await make_page(opts)
    shadow.append(element)
  }
  // ----------------------------------------
  // INIT
  // ----------------------------------------

  return

}
async function inject (data){
	sheet.replaceSync(data.join('\n'))
}