(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
patch_cache_in_browser(arguments[4], arguments[5])

function patch_cache_in_browser (source_cache, module_cache) {
  const meta = { modulepath: ['page'], paths: {} }
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
},{"./page":5}],2:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)
function fallback_module () {
  return {
    api: fallback_instance,
    _: {
      search_bar: {
        $: ([app]) => app()
      }
    }
  }
  function fallback_instance () {
    return {
      _: {
        search_bar: {
          0: ''
        }
      },
      drive: {
        style: {
          'theme.css': {
            raw: `
              .action-bar-container {
                  display: flex;
                  align-items: center;
                  background-color: #212121;
                  padding: 0.5rem;
                  // min-width: 456px
              }

              .action-bar-content {
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  flex:1;
              }

              .icon-button {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                border: none;
                background-color: transparent;
                cursor: pointer;
              }


              .separator {
                  width: 1px;
                  height: 24px;
                  background-color: #424242;
              }

              .search-bar-container {
                flex: 1;
                position: relative;
              }
              svg {
                display: block;
                margin: auto;
              }
            `
          }
        }
      }
    }
  }
}
const { terminal, wand, help } = require('icons')
const search_bar = require('search_bar')

module.exports = action_bar

async function action_bar (opts) {
  const { id, sdb } = await get(opts.sid)
  const on = {
    style: inject
  }
  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
  <div class="action-bar-container">
    <div class="action-bar-content">
      <button class="icon-button">
        ${terminal()}
      </button>
      <div class="separator"></div>
      <button class="icon-button">
        ${wand()}
      </button>
      <div class="separator"></div>
      <searchbar></searchbar>
      <button class="icon-button">
        ${help()}
      </button>
    </div>
  </div>`
  const subs = await sdb.watch(onbatch)
  console.log('actionbar subs:' , subs)
  search_bar(subs[0]).then(el => shadow.querySelector('searchbar').replaceWith(el))
  // to add a click event listener to the buttons:
  // const [btn1, btn2, btn3] = shadow.querySelectorAll('button')
  // btn1.addEventListener('click', () => { console.log('Terminal button clicked') })

  return el
  function onbatch (batch) {
    for (const { type, data } of batch) {
      on[type] && on[type](data)
    }
  }
  function inject(data) {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(data)
    shadow.adoptedStyleSheets = [sheet]
  }
}

}).call(this)}).call(this,"/doc/state/example3/node_modules/app.js")
},{"../../../../src/node_modules/STATE":6,"icons":3,"search_bar":4}],3:[function(require,module,exports){
module.exports = {
  terminal,
  wand,
  search,
  close,
  help,
  crumb
}

const stroke = '#a0a0a0'
const thickness = '1.5'
const width = '24'
const height = '24'

function terminal() {
  const path = `
  <svg width=${width} height=${height} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_256_7194)">
      <path d="M16.6365 16.0813H16.8365V15.8813V14.8297V14.6297H16.6365H11.453H11.253V14.8297V15.8813V16.0813H11.453H16.6365ZM5.09034 7.85454L4.9519 7.99496L5.09034 8.13538L8.58038 11.6752L5.09034 15.2151L4.9519 15.3555L5.09034 15.4959L5.8234 16.2394L5.96582 16.3839L6.10824 16.2394L10.4698 11.8156L10.6082 11.6752L10.4698 11.5348L6.10824 7.11102L5.96582 6.96656L5.8234 7.11102L5.09034 7.85454ZM17.6732 0.960156H4.19606C2.36527 0.960156 0.885937 2.46471 0.885937 4.31468V15.8813C0.885937 17.7313 2.36527 19.2358 4.19606 19.2358H17.6732C19.5041 19.2358 20.9834 17.7313 20.9834 15.8813V4.31468C20.9834 2.46471 19.5041 0.960156 17.6732 0.960156ZM2.33285 4.11468C2.43133 3.15557 3.23023 2.41167 4.19606 2.41167H17.6732C18.6391 2.41167 19.438 3.15557 19.5364 4.11468H2.33285ZM4.19606 17.7843C3.16406 17.7843 2.32264 16.935 2.32264 15.8813V5.5662H19.5467V15.8813C19.5467 16.935 18.7053 17.7843 17.6732 17.7843H4.19606Z" fill=${stroke} stroke=${stroke} stroke-width=${thickness / 4} />
    </g>
    <defs>
      <clipPath id="clip0_256_7194">
        <rect width="22" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>`

  const container = document.createElement('div')
  container.innerHTML = path

  return container.outerHTML
}

function wand() {
  const path = `
  <svg width=${width} height=${height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_256_6751)">
      <path d="M5 17.5L17.5 5L15 2.5L2.5 15L5 17.5Z" stroke=${stroke} stroke-width=${thickness} stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12.5 5L15 7.5" stroke=${stroke} stroke-width=${thickness} stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7.4987 2.5C7.4987 2.94203 7.67429 3.36595 7.98685 3.67851C8.29941 3.99107 8.72334 4.16667 9.16536 4.16667C8.72334 4.16667 8.29941 4.34226 7.98685 4.65482C7.67429 4.96738 7.4987 5.39131 7.4987 5.83333C7.4987 5.39131 7.3231 4.96738 7.01054 4.65482C6.69798 4.34226 6.27406 4.16667 5.83203 4.16667C6.27406 4.16667 6.69798 3.99107 7.01054 3.67851C7.3231 3.36595 7.4987 2.94203 7.4987 2.5Z" stroke=${stroke} stroke-width=${thickness} stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15.8346 10.8333C15.8346 11.2753 16.0102 11.6992 16.3228 12.0118C16.6354 12.3243 17.0593 12.4999 17.5013 12.4999C17.0593 12.4999 16.6354 12.6755 16.3228 12.9881C16.0102 13.3006 15.8346 13.7246 15.8346 14.1666C15.8346 13.7246 15.659 13.3006 15.3465 12.9881C15.0339 12.6755 14.61 12.4999 14.168 12.4999C14.61 12.4999 15.0339 12.3243 15.3465 12.0118C15.659 11.6992 15.8346 11.2753 15.8346 10.8333Z" stroke=${stroke} stroke-width=${thickness} stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_256_6751">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>`

  const container = document.createElement('div')
  container.innerHTML = path

  return container.outerHTML
}

function search() {
  const path = `
  <svg width=${width} height=${height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Group for the circle (background) -->
    <g id="circle">
      <circle cx="12" cy="12" r="12" fill="#1A1A1A"/>
    </g>

    <!-- Group for the search icon (foreground) -->
    <g id="search-icon" transform="translate(7 7)">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_256_6745)">
          <path d="M4.68129 8.49368C6.78776 8.49368 8.49539 6.78605 8.49539 4.67958C8.49539 2.57311 6.78776 0.865479 4.68129 0.865479C2.57482 0.865479 0.867188 2.57311 0.867188 4.67958C0.867188 6.78605 2.57482 8.49368 4.68129 8.49368Z" stroke=${stroke} stroke-width=${thickness} stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9.22987 9.23084L7.69141 7.69238" stroke=${stroke} stroke-width=${thickness}stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0_256_6745">
            <rect width="10" height="10" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </g>
  </svg>`

  const container = document.createElement('div')
  container.innerHTML = path

  return container.outerHTML
}

function close() {
  const path = `
  <svg width=${width} height=${height} viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_256_7190)">
      <path d="M11.25 4.25L3.75 11.75" stroke=${stroke} stroke-width=${thickness} stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3.75 4.25L11.25 11.75" stroke=${stroke} stroke-width=${thickness} stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_256_7190">
        <rect width="15" height="15" fill="white" transform="translate(0 0.5)"/>
      </clipPath>
    </defs>
  </svg>`

  const container = document.createElement('div')
  container.innerHTML = path

  return container.outerHTML
}

function help() {
  const path = `
  <svg width=${width} height=${height} viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_256_7199)">
      <path d="M6 6.66675C6 6.00371 6.27656 5.36782 6.76884 4.89898C7.26113 4.43014 7.92881 4.16675 8.625 4.16675H9.375C10.0712 4.16675 10.7389 4.43014 11.2312 4.89898C11.7234 5.36782 12 6.00371 12 6.66675C12.0276 7.20779 11.8963 7.74416 11.6257 8.19506C11.3552 8.64596 10.9601 8.98698 10.5 9.16675C10.0399 9.40644 9.64482 9.86113 9.37428 10.4623C9.10374 11.0635 8.97238 11.7787 9 12.5001" stroke=${stroke} stroke-width=${thickness * 1.5} stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 15.8333V15.8416" stroke=${stroke} stroke-width=${thickness * 1.5} stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_256_7199">
        <rect width="18" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>`

  const container = document.createElement('div')
  container.innerHTML = path

  return container.outerHTML
}
function crumb() {
  const path = `
  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke=${stroke} stroke-width=${thickness} stroke-linecap="round" stroke-linejoin="round" d="m10 16 4-4-4-4"/>
  </svg>`
  const container = document.createElement('div')
  container.innerHTML = path

  return container.outerHTML
}

},{}],4:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../../src/node_modules/STATE') // Adjust path as needed
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)
function fallback_module () {
  return {
    api: fallback_instance,
    _: {}
  }
  function fallback_instance () {
    return {
      _: {},
      drive: {
        style: {
          'theme.css':{
            raw: `
              .search-bar-container {
                flex: 1;
                position: relative;
              }
          
              .search-input-container {
                height: 2rem;
                padding-left: 0.75rem;
                padding-right: 0.75rem;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                background-color: #303030;
                border-radius: 0.375rem;
                cursor: text;
              }
              
              svg {
                display: block;
                margin: auto;
              }
              
              .search-input-content {
                flex: 1;
              }
          
              .search-input-text {
                font-size: 0.875rem;
                color: #a0a0a0;
              }
          
              .search-input {
                width: 100%;
                background-color: transparent;
                outline: none;
                border: none;
                color: #a0a0a0;
                font-size: 0.875rem;
              }
          
              .search-reset-button {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-left: 0;
                padding: 0;
                border: none;
                background-color: transparent;
              }
          
              .search-reset-button:hover {
                cursor: pointer;
              }
            `
          }
        }
      }
    }
  }
}

const { search, close } = require('icons')
module.exports = search_bar
async function search_bar (opts) {
  const { id, sdb } = await get(opts.sid)
  const on = {
    style: inject
  }
  const el = document.createElement('div')
  el.className = 'search-bar-container'
  const shadow = el.attachShadow({ mode: 'closed' })
  const sheet = new CSSStyleSheet()
  shadow.innerHTML = `
  <div class="search-input-container">
    <div class="search-input-content">
      <div class="search-input-text"></div>
      <input type="text" class="search-input" style="display: none;">
    </div>
    <button class="search-reset-button"></button>
  </div>`

  const input_container = shadow.querySelector('.search-input-container')
  const input_content = shadow.querySelector('.search-input-content')
  const text_span = shadow.querySelector('.search-input-text')
  const input_element = shadow.querySelector('.search-input')
  const reset_button = shadow.querySelector('.search-reset-button')
  let barmode = ''
  const subs = await sdb.watch(onbatch)
  console.log(subs)

  async function onbatch (batch) {
    for (const { type, data } of batch) {
      on[type] && on[type](data)
    }
  }
  input_container.onclick = on_input_container_click
  input_element.onblur = on_input_element_blur
  reset_button.onclick = on_reset_click
  text_span.onclick = on_span_click

  return el
  function inject(data) {
    sheet.replaceSync(data)
    shadow.adoptedStyleSheets = [sheet]
  }
  function show () {
    input_content.replaceChildren(input_element)
    input_element.style.display = 'block'
    input_element.focus()
    reset_button.innerHTML = close()
    barmode = 'already'
  }
  function hide () {
    input_content.replaceChildren(text_span)
    input_element.style.display = 'none'
    reset_button.innerHTML = search()
  }
  function on_input_container_click (event) {
    // console.log('Focus Event:', event)
    if (barmode === 'already') {
      return
    }
    show()
  }
  function on_input_element_blur (event) {
    // console.log('Blur Event:', event)
    if (input_element.value === '') {
      hide()
    }
  }
  function on_span_click (event) {
    event.stopPropagation()
    handle_breadcrumb_click(event)
  }
  function on_reset_click (event) {
    event.stopPropagation()
    handle_reset(event)
  }
  function handle_reset (event) {
    // console.log('Reset Event:', event)
    input_element.value = ''
    hide()
  }
  function handle_breadcrumb_click (event) {
    // console.log('Breadcrumb Event:', event)
    show()
    input_element.placeholder = '#night'
  }
}
}).call(this)}).call(this,"/doc/state/example3/node_modules/search_bar.js")
},{"../../../../src/node_modules/STATE":6,"icons":3}],5:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('../../../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module)
function fallback_module () {
  return {
    _: {
      app: {
        $: '',
        0: override_app
      }
    },
    drive: {
      theme: {
        'style.css': {
          raw: 'body { font-family: \'system-ui\'; }'
        }
      }
    }
  }

  function override_app ([app]) {
    const data = app()
    return data
  }
}

/******************************************************************************
  PAGE
******************************************************************************/
const app = require('app')
const sheet = new CSSStyleSheet()
config().then(() => boot({ sid: '' }))

async function config () {
  // const path = path => new URL(`../src/node_modules/${path}`, `file://${__dirname}`).href.slice(8)
  const html = document.documentElement
  const meta = document.createElement('meta')
  const appleTouch = '<link rel="apple-touch-icon" sizes="180x180" href="./src/node_modules/assets/images/favicon/apple-touch-icon.png">'
  // const icon32 = '<link rel="icon" type="image/png" sizes="32x32" href="./src/node_modules/assets/images/favicon/favicon-32x32.png">'
  // const icon16 = '<link rel="icon" type="image/png" sizes="16x16" href="./src/node_modules/assets/images/favicon/favicon-16x16.png">'
  // const webmanifest = '<link rel="manifest" href="./src/node_modules/assets/images/favicon/site.webmanifest"></link>'
  const font = 'https://fonts.googleapis.com/css?family=Nunito:300,400,700,900|Slackey&display=swap'
  const loadFont = `<link href=${font} rel='stylesheet' type='text/css'>`
  html.setAttribute('lang', 'en')
  meta.setAttribute('name', 'viewport')
  meta.setAttribute('content', 'width=device-width,initial-scale=1.0')
  // @TODO: use font api and cache to avoid re-downloading the font data every time
  document.head.append(meta)
  document.head.innerHTML += appleTouch + loadFont // + icon16 + icon32 + webmanifest
  document.adoptedStyleSheets = [sheet]
  await document.fonts.ready // @TODO: investigate why there is a FOUC
}
/******************************************************************************
  PAGE BOOT
******************************************************************************/
async function boot (opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const on = {
    theme: inject
  }
  const subs = await sdb.watch(onbatch)
  // const status = {}
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
  // desktop
  shadow.append(await app(subs[1]))

  // ----------------------------------------
  // INIT
  // ----------------------------------------

  function onbatch (batch) {
    for (const { type, data } of batch) {
      on[type] && on[type](data)
    }
  }
}
async function inject (data) {
  sheet.replaceSync(data.join('\n'))
}

}).call(this)}).call(this,"/doc/state/example3/page.js")
},{"../../../src/node_modules/STATE":6,"app":2}],6:[function(require,module,exports){
const localdb = require('localdb')
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
const VERSION = 10
const ROOT_ID = 'page'

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
}
window.STATEMODULE = status

// Version check and initialization
status.fallback_check = Boolean(check_version())
status.fallback_check && db.add(['playproject_version'], VERSION)


// Symbol mappings
const s2i = {}
const i2s = {}
let admins = [0, 'menu']

// Inner Function
function STATE (address, modulepath) {
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
    const data = fallback()
    local_status.fallback_instance = data.api

    if(data._)
      status.open_branches[modulepath] = Object.keys(data._).length

    local_status.fallback_module = new Function(`return ${fallback.toString()}`)()
    const updated_status = append_tree_node(modulepath, status)
    Object.assign(status.tree_pointers, updated_status.tree_pointers)
    Object.assign(status.open_branches, updated_status.open_branches)
    status.inits.push(init_module)

    if(!Object.values(status.open_branches).reduce((acc, curr) => acc + curr, 0))
      status.inits.forEach(init => init())
    
    const sdb = create_statedb_interface(local_status, modulepath, xtype = 'module')
    status.dataset = sdb.private_api
    return {
      id: modulepath,
      sdb: sdb.public_api,
      subs: [get],
      // sub_modules
    }
  }
  function append_tree_node (id, status) {
    const [super_id, name] = id.split(/\/(?=[^\/]*$)/)

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
          [new_super_id, temp_name] = new_super_id.split(/\/(?=[^\/]*$)/)
          new_name = temp_name + '.' + new_name
        }
        status.tree_pointers[new_super_id]._[new_name] = { $: { _: {} } }
        status.tree_pointers[id] = status.tree_pointers[new_super_id]._[new_name].$
        status.open_branches[new_super_id]--
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
      console.log('Main module: ', statedata.name, '\n', state_entries)
      updated_local_status && Object.assign(local_status, updated_local_status)
      const old_fallback = local_status.fallback_instance
      local_status.fallback_instance = () => statedata.api([old_fallback])
      db.append(['state'], state_entries)
      // add_source_code(statedata.inputs) // @TODO: remove side effect
    }

    [local_status.sub_modules, symbol2ID, ID2Symbol] = symbolfy(statedata, local_status)
    Object.assign(s2i, symbol2ID)
    Object.assign(i2s, ID2Symbol)
    
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
  function get (sid) {
    const {statedata, state_entries, newstatus} = get_instance_data(sid)

    if (status.fallback_check) {
      Object.assign(status.root_module, newstatus.root_module)
      Object.assign(status.overrides, newstatus.overrides)
      Object.assign(status.tree, newstatus.tree)
      console.log('Main instance: ', statedata.name, '\n', state_entries)
      db.append(['state'], state_entries)
    }
    [local_status.sub_instances[statedata.id], symbol2ID, ID2Symbol] = symbolfy(statedata, local_status)
    Object.assign(s2i, symbol2ID)
    Object.assign(i2s, ID2Symbol)
    const sdb = create_statedb_interface(local_status, statedata.id, xtype = 'instance')
    return {
      id: statedata.id,
      sdb: sdb.public_api,
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
  function get_instance_data (sid) {
    let id = s2i[sid]
    let data = id && db.read(['state', id])
    let sanitized_data, updated_status = status
    if (status.fallback_check) {
      if (!data && !status.root_instance) {
        ({sanitized_data, updated_status} = find_super({ xtype: 'instance', fallback: local_status.fallback_instance, fun_status: status }))
      } else {
        ({sanitized_data, updated_status} = validate_and_preprocess({
          fun_status: status,
          fallback: local_status.fallback_instance, 
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
    const modulepath_super = modulepath.split(/\/(?=[^\/]*$)/)[0]
    const modulepath_grand = modulepath_super.split(/\/(?=[^\/]*$)/)[0]
    const split = modulepath.split('/')
    const name = split.at(-2) + '.' + split.at(-1)
    let data
    const entries = {}
    if(xtype === 'module'){
      data = db.read(['state', modulepath_super])
      data.path = data.id = modulepath
      local_status.name = name

      const super_data = db.read(['state', modulepath_grand])
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
      const instance_path_super = modulepath_super + ':0'
      data = db.read(['state', instance_path_super])
      data.path = data.id = get_instance_path(modulepath)

      
      const super_data = db.read(['state', modulepath_grand + ':0'])
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
    let {id: pre_id, hubs: pre_hubs, mapping} = pre_data
    let fallback_data

    validate(fallback())
    if(fun_status.overrides[pre_id]){
      fallback_data = fun_status.overrides[pre_id].fun[0](get_fallbacks({ fallback, modulename: local_status.name, modulepath, instance_path: pre_id }))
      fun_status.overrides[pre_id].by.splice(0, 1)
      fun_status.overrides[pre_id].fun.splice(0, 1)
      console.log(fallback_data)
    }
    else
      fallback_data = fallback()

    // console.log('fallback_data: ', fallback_data)
    fun_status.overrides = register_overrides({ overrides: fun_status.overrides, tree: fallback_data, path: modulepath, id: pre_id })
    console.log('overrides: ', Object.keys(fun_status.overrides))
    orphan_check && (fallback_data.orphan = orphan_check)
    //This function makes changes in fun_status (side effect)
    return {
      sanitized_data: sanitize_state({ local_id: '', entry: fallback_data, path: pre_id, xtype, mapping, entries }),
      updated_status: fun_status
    }
    
    function sanitize_state ({ local_id, entry, path, hub_entry, local_tree, entries = {}, xtype, mapping }) {
      [path, entry, local_tree] = extract_data({ local_id, entry, path, hub_entry, local_tree, xtype })
      
      entry.id = path
      entry.name = entry.name || local_id.split(':')[0] || local_status.name
      mapping && (entry.mapping = mapping)
      
      entries = {...entries, ...sanitize_subs({ local_id, entry, path, local_tree, xtype, mapping })}
      
      delete entry._
      entries[entry.id] = entry
      // console.log('Entry: ', entry)
      return {entries, entry}
    }
    function extract_data ({ local_id, entry, path, hub_entry, xtype }) {
      if (local_id) {
        entry.hubs = [hub_entry.id]
        if (xtype === 'instance') {
          let temp_path = path.split(':')[0]
          temp_path = temp_path ? temp_path + '/' : temp_path
          const module_id = temp_path + local_id
          entry.type = module_id
          path = module_id + ':' + (status.modulepaths[module_id]++ || 0)
        }
        else {
          entry.type = local_id
          path = path ? path + '/' : ''
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
              if(key === 'mapping' || typeof(override) === 'object')
                return
              const sub_instance = sanitize_state({ local_id, entry: value, path, hub_entry: entry, local_tree, xtype: key === '$' ? 'module' : 'instance', mapping: value['mapping'] }).entry
              entries[sub_instance.id] = JSON.parse(JSON.stringify(sub_instance))
              entry.subs.push(sub_instance.id)
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
              const mapped_file_type = mapping?.[dataset_type] || dataset_type
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
      file.name = file.name || file.id
      file.local_name = file_id
      file.type = type
      file[file.type === 'js' ? 'subs' : 'hubs'] = [entry.id]
      
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
function validate (data) {
  /**  Expected structure and types
   * Sample : "key1|key2:*:type1|type2"
   * ":" : separator
   * "|" : OR
   * "*" : Required key
   * 
   * */
  const expected_structure = {
    '_': {
      ":*": { // Required key, any name allowed
        "*:function|string": () => {}, // Optional key
      },
    },
    'drive': {
      ":*:object|string": { // Required key, any name allowed
        "raw|link:*:object|string": {}, // data or link are names, required, object or string are types
        "link": "string"
      },
    },
  };


  const errors = validate_shape(data, expected_structure)
  // if (errors.length > 0) 
  //   console.error("Validation failed:\n", errors.join('\n'))

  function validate_shape (obj, expected, super_node = 'root', path = '') {
    const errors = []
    const keys = Object.keys(obj)
    const values = Object.values(obj)

    Object.entries(expected).forEach(([expected_key, expected_value]) => {
      let [expected_key_names, required, expected_types] = expected_key.split(':')
      expected_types = expected_types ? expected_types.split('|') : [typeof(expected_value)]
      let absent = true

      if(expected_key_names)
        expected_key_names.split('|').forEach(expected_key_name => {
          const value = obj[expected_key_name]
          if(value !== undefined){
            const type = typeof(value)
            absent = false

            if(expected_types.includes(type))
              type === 'object' && errors.push(...validate_shape(value, expected_value, expected_key_name, path + '/' + expected_key_name))
            else
              console.error(`Type mismatch: Expected "${expected_types.join(' or ')}" got "${type}" for key "${expected_key_name}" at:`, obj, "of", path)
          }
        })
      else if(required){
        values.forEach((value, index) => {
          absent = false
          const type = typeof(value)

          if(expected_types.includes(type))
            type === 'object' && errors.push(...validate_shape(value, expected_value, keys[index], path + '/' + keys[index]))
          else
            console.error(`Type mismatch: Expected "${expected_types.join(' or ')}" got "${type}" for key "${keys[index]}" at: `, obj, "of", path)
        })
      }

      if(absent && required){
        if(expected_key_names)
          errors.push(`Can't find required key "${expected_key_names.replace('|', ' or ')}" at: `, obj, "of", path)
        else
          errors.push(`No subs found for super key "${super_node}" at sub:`, obj, "of", path)
      }
    })
    return errors
  }
}
function extract_filename (address) {
  const parts = address.split('/node_modules/')
  const last = parts.at(-1).split('/')
  return last.at(-1).slice(0, -3)
}
function get_instance_path (modulepath, modulepaths = status.modulepaths) {
  return modulepath + ':' + modulepaths[modulepath]++
}
async function get_input ({ id, name, $ref, type, raw }) {
  const xtype = (typeof(id) === "number" ? name : id).split('.').at(-1)
  let result = db.read([type, id])
  
  if (!result) {
    result = raw !== undefined ? raw : await((await fetch($ref))[xtype === 'json' ? 'json' : 'text']())
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
function symbolfy (data) {
  const s2i = {}
  const i2s = {}
  const subs = []
  data.subs && data.subs.forEach(sub => {
    const substate = db.read(['state', sub])
    s2i[i2s[sub] = Symbol(sub)] = sub
    subs.push({ sid: i2s[sub], type: substate.type })
  })
  return [subs, s2i, i2s]
}
function register_overrides ({overrides, ...args}) {
  recurse(args)
  return overrides
  function recurse ({ tree, path = '', id, xtype = 'instance', local_modulepaths = {} }) {

    tree._ && Object.entries(tree._).forEach(([type, instances]) => {
      const sub_path = path + '/' + type.replace('.', '/')
      Object.entries(instances).forEach(([id, override]) => {
        if(typeof(override) === 'function'){
          let resultant_path = id === '$' ? sub_path : sub_path + ':' + id
          if(overrides[resultant_path]){
            overrides[resultant_path].fun.push(override)
            overrides[resultant_path].by.push(id)
          }
          else
            overrides[resultant_path] = {fun: [override], by: [id]}
        }
        else{
          recurse({ tree: override, path: sub_path, id, xtype, local_modulepaths })
        }
      })
    })
  }
}
function get_fallbacks ({ fallback, modulename, modulepath, instance_path }) {
  return [mutated_fallback, ...status.overrides[instance_path].fun]
    
  function mutated_fallback () {
    const data = fallback()

    data.overrider = status.overrides[instance_path].by[0]
    merge_trees(data, modulepath)
    return data

    function merge_trees (data, path) {
      if (data._) {
        Object.entries(data._).forEach(([type, data]) => merge_trees(data, path + '/' + type.split('$')[0].replace('.', '/')))
      } else {
        data.$ = { _: status.tree_pointers[path]._ }
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
      watch, get_sub, req_access
    },
    private_api: {
      list, register, swtch, unregister
    }
  }
  api.public_api.admin = node_id === ROOT_ID && api.private_api
  return api

  async function watch (listener) {
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
  function req_access (sid) {
    if (local_status.deny[sid]) throw new Error('access denied')
    const el = db.read(['state', s2i[sid]])
    if (admins.includes(s2i[sid]) || admins.includes(el?.name)) {
      return {
        xget: (id) => db.read(['state', id]),
        get_all: () => db.read_all(['state']),
        add_admins: (ids) => { admins.push(...ids) },
        list,
        register,
        load: (snapshot) => {
          localStorage.clear()
          Object.entries(snapshot).forEach(([key, value]) => {
            db.add([key], JSON.parse(value), true)
          })
          window.location.reload()
        },
        swtch
      }
    }
  }
  function list (dataset_type, dataset_name) {
    const node = db.read(['state', ROOT_ID])
    if(dataset_type){
      const dataset_list = []
      node.drive.forEach(dataset_id => {
        const dataset = db.read(['state', dataset_id])
        if(dataset.type === dataset_type)
          dataset_list.push(dataset.name)
      })
      if(dataset_name){
        return recurse(ROOT_ID, dataset_type)
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
  function register (dataset_type, dataset_name, dataset) {
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
    return ' registered ' + dataset_name + '.' + dataset_type
  }
  function unregister (dataset_type, dataset_name) {
    return recurse(ROOT_ID)

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
  function swtch (dataset_type, dataset_name = 'default') {
    recurse(dataset_type, dataset_name, ROOT_ID)

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
},{"localdb":7}],7:[function(require,module,exports){
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
