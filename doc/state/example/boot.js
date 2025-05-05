const local_init = require('./init.js')
const USE_GITHUB_INIT = false
const init_url = 'https://raw.githubusercontent.com/alyhxn/playproject/refs/heads/main/doc/state/example/init.js'

const args = arguments

fetch(init_url).then(res => res.text()).then(async source => {
  const module = { exports: {} }
  const f = new Function('module', 'require', source)
  f(module, require)
  const init = module.exports
  USE_GITHUB_INIT ? await init(USE_GITHUB_INIT, args) : await local_init(USE_GITHUB_INIT, args)
  require('./page') // or whatever is otherwise the main entry of our project
})
