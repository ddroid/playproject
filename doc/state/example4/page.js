const STATE = require('../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { id, sdb, io } = statedb(fallback_module)
const editor = require('quick_editor')
const editor = require('quick_editor')

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
    <label class="toggle-switch">
      <input type="checkbox">
      <span class="slider"></span>
    </label>
    `
  shadow.adoptedStyleSheets = [sheet]
  const editor_btn = shadow.querySelector('input')
  const toggle = editor()
  editor_btn.onclick = toggle

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
  return {
    _: {
      app: { $: '', 0: '', mapping: { theme: 'theme' } },
      quick_editor: 0
      app: { $: '', 0: '', mapping: { theme: 'theme' } },
      editor: 0
    },
    drive: {
      'theme/': { 'style.css': {
        raw: `
        body { font-family: 'system-ui'; }
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 26px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: #ccc;
          border-radius: 26px;
          transition: 0.4s;
        }

        .slider::before {
          content: "";
          position: absolute;
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: 0.4s;
        }

        input:checked + .slider {
          background-color: #2196F3;
        }

        input:checked + .slider::before {
          transform: translateX(24px);
        }
        `
      }},
      'theme/': { 'style.css': {
        raw: `
        body { font-family: 'system-ui'; }
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 26px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: #ccc;
          border-radius: 26px;
          transition: 0.4s;
        }

        .slider::before {
          content: "";
          position: absolute;
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: 0.4s;
        }

        input:checked + .slider {
          background-color: #2196F3;
        }

        input:checked + .slider::before {
          transform: translateX(24px);
        }
        `
      }},
      'lang/': {}
    }
  }
}
