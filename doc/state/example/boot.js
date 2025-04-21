patch_cache_in_browser(arguments[4], arguments[5])
clear_db_on_file_change()
require('./page') // or whatever is otherwise the main entry of our project



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
        if (name.endsWith('STATE') || name === 'io') {
          const modulepath = meta.modulepath.join('>')
          const original_export = require.cache[identifier] || (require.cache[identifier] = original(name))
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