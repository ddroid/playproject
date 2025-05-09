let USE_GITHUB_STATE

module.exports = init
async function init(args, check = true) {
  USE_GITHUB_STATE = check
  clear_db_on_file_change()
  await patch_cache_in_browser(args[4], args[5])
}

function clear_db_on_file_change() {
  const is_file_changed = sessionStorage.getItem('file_change_reload') === 'true'
  const last_item = sessionStorage.getItem('last_item')
  const now = Date.now()

  if (!(is_file_changed && last_item && (now - last_item) < 200)) {
    localStorage.clear()
  }

  sessionStorage.removeItem('file_change_reload')
  sessionStorage.removeItem('last_item')
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    sessionStorage.setItem('file_change_reload', 'true')
    sessionStorage.setItem('last_item', Date.now())
  }
})


async function patch_cache_in_browser (source_cache, module_cache) {
  let STATE_JS
  if(USE_GITHUB_STATE){
    const state_url = 'https://raw.githubusercontent.com/alyhxn/playproject/refs/heads/main/src/node_modules/STATE.js'
    const localdb_url = 'https://raw.githubusercontent.com/alyhxn/playproject/refs/heads/main/src/node_modules/localdb.js'
    STATE_JS = await Promise.all([
      fetch(state_url).then(res => res.text()),
      fetch(localdb_url).then(res => res.text()),
    ]).then(([state_source, localdb_source]) => {
      const localdb = load(localdb_source)
      const STATE_JS = load(state_source, () => localdb)
      return STATE_JS
      function load (source, require) {
        const module = { exports: {} }
        const f = new Function('module', 'require', source)
        f(module, require)
        return module.exports
      }
    })
  }
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
        if (name.endsWith('STATE') || name === 'io') {
          const modulepath = meta.modulepath.join('>')
          let original_export
          if(name.endsWith('STATE') && USE_GITHUB_STATE) 
            original_export = STATE_JS
          else
            original_export = require.cache[identifier] || (require.cache[identifier] = original(name))
          const exports = (...args) => original_export(...args, modulepath, Object.keys(dependencies))
          return exports
        } else {
          // Clear cache for non-STATE and non-io modules
          delete require.cache[identifier]
          const counter = meta.modulepath.concat(name).join('>')
          if (!meta.paths[counter]) meta.paths[counter] = 0
          let localid = `${name}${meta.paths[counter] ? '#' + meta.paths[counter] : ''}`
          meta.paths[counter]++
          meta.modulepath.push(localid.replace(/^\.\+/, '').replace('>', ','))
          const exports = original(name)
          meta.modulepath.pop(name)
          return exports
        }
      }
    }
    function resolve (name) { return MAP[name] }
  }
}