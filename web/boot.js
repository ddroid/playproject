patch_cache_in_browser(arguments[4], arguments[5])

function patch_cache_in_browser (source_cache, module_cache) {
  for (const key of Object.keys(source_cache)) {
    const [module, names] = source_cache[key]
    const dependencies = names || {}
    source_cache[key][0] = patch(module, dependencies)
  }
  function patch (module, dependencies) {
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
        if (require.cache[identifier]) return require.cache[identifier]
        const exports = require.cache[identifier] = original(name)
        return exports
      }
    }
    function resolve (name) { return MAP[name] }
  }
}
require('./demo') // or whatever is otherwise the main entry of our project