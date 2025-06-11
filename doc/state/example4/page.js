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
  const { drive } = sdb
  const editor_theme = {
    type: 'theme',
    name: 'editor',
    dataset: {}
  }
  sdb.admin.register(editor_theme)
  const subs = await sdb.watch(onbatch, on)

  io.on(port => {
    const { by, to } = port
    port.onmessage = event => {
      console.log(event.data)
      const data = event.data
      on[data.type] && on[data.type](data.args)
    }
  })
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.body
  const shopts = { mode: 'closed' }
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
    <input type="radio" />`
  shadow.adoptedStyleSheets = [sheet]
  const button = shadow.querySelector('input')
  button.addEventListener('click', () => {
    Object.values(sdb.admin.status.listeners).forEach(listener => {
      listener([{
        type: 'edit_mode',
        paths: []
      }])})
  })
  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------
  { // desktop
    shadow.append(await app(subs[0]))
  }
  // ----------------------------------------
  // INIT
  // ----------------------------------------

  async function onbatch(batch) {
    for (const {type, paths} of batch) {
      const data = await Promise.all(paths.map(path => drive.get(path).then(file => file.raw)))
      on[type] && on[type](data)
    }
  }
}
async function inject(data) {
  sheet.replaceSync(data.join('\n'))
}

function fallback_module (args, { listfy, tree }) {
  listfy(tree)
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
      app: { $: '', 0: '', mapping: { theme: 'theme' } }
    },
    drive: {
      'theme/': { 'style.css': { raw: "body { font-family: 'system-ui'; }" } },
      'lang/': {}
    }
  }
}
