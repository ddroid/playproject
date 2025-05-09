const local_init = require('./init.js')
const USE_GITHUB_INIT = false
const init_url = 'https://raw.githubusercontent.com/alyhxn/playproject/refs/heads/main/doc/state/example/init.js'
const args = arguments

fetch(init_url).then(res => res.text()).then(async source => {
  const module = { exports: {} }
  const f = new Function('module', 'require', source)
  f(module, require)
  const init = module.exports
  USE_GITHUB_INIT ? await init(args) : await local_init(args, USE_GITHUB_INIT)
  require('./page') // or whatever is otherwise the main entry of our project
})