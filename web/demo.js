const make_page = require('../') 
const statedb = require('../src/node_modules/STATE')
const theme = require('theme')
/******************************************************************************
  INITIALIZE PAGE
******************************************************************************/
// ----------------------------------------
let current_theme = theme
const sheet = new CSSStyleSheet()
sheet.replaceSync(get_theme(current_theme))
// ----------------------------------------
config().then(() => boot({ themes: { theme } }))

/******************************************************************************
  CSS & HTML Defaults
******************************************************************************/
async function config () {
  const path = path => new URL(`../src/node_modules/${path}`, `file://${__dirname}`).href.slice(8)

  const html = document.documentElement
  const meta = document.createElement('meta')
	const appleTouch = `<link rel="apple-touch-icon" sizes="180x180" href="./src/node_modules/assets/images/favicon/apple-touch-icon.png">`
	const icon32 = `<link rel="icon" type="image/png" sizes="32x32" href="./src/node_modules/assets/images/favicon/favicon-32x32.png">`
	const icon16 = `<link rel="icon" type="image/png" sizes="16x16" href="./src/node_modules/assets/images/favicon/favicon-16x16.png">`
	const webmanifest = `<link rel="manifest" href="./src/node_modules/assets/images/favicon/site.webmanifest"></link>`
  html.setAttribute('lang', 'en')
  meta.setAttribute('name', 'viewport')
  meta.setAttribute('content', 'width=device-width,initial-scale=1.0')
  // @TODO: use font api and cache to avoid re-downloading the font data every time
  document.adoptedStyleSheets = [sheet]
  document.head.append(meta)
  document.head.innerHTML += appleTouch + icon16 + icon32 + webmanifest
  await document.fonts.ready // @TODO: investigate why there is a FOUC
}
/******************************************************************************
  PAGE BOOT
******************************************************************************/
async function boot (opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const status = {}
  const sid = await statedb.init('./data.json')
  // ----------------------------------------
  // OPTS
  // ----------------------------------------
  const { page = 'INFO', theme = 'theme' } = opts
  const themes = opts.themes
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
    const on = { 'theme_change': on_theme }
    const opts = { page, theme, themes, sid }
    const element = await make_page(opts)
    shadow.append(element)
  }
  // ----------------------------------------
  // INIT
  // ----------------------------------------

  return

  function on_theme (message) {
    ;current_theme = current_theme === light_theme ? dark_theme : light_theme
    sheet.replaceSync(get_theme(current_theme))
  }
}
function get_theme (opts) {
	return`
	:host{
		${Object.entries(opts).map(entry => `--${entry[0]}: ${entry[1]};`).join('')}
	}
	html {
		font-size: 82.5%;
		scroll-behavior: smooth;
	}
	body {
		font-family: var(--bodyFont);
		font-size: 1.4rem;
		color: var(--bodyColor);
		margin: 0;
		padding: 0;
		background-color: var(--bodyBg);
		overflow-x: hidden;
	}
	a {
		text-decoration: none;
	}
	button {
		outline: none;
		border: none;
		font-family: var(--titleFont);
		font-size: var(--sectionButtonSize);
		color: var(--titleColor);
		border-radius: 2rem;
		padding: 1.2rem 3.8rem;
		cursor: pointer;
	}
	img {
		width: 100%;
		height: auto;
	}
	article {
		font-size: var(--articleSize);
		color: var(--articleColor);
		line-height: 2.5rem;
		padding-bottom: 4rem;
	}
	@media only screen and (min-width: 2561px) {
		article {
			font-size: calc(var(--articleSize) * 1.5 );
			line-height: calc(2.5rem * 1.5);
		}
		button {
			font-size: calc(var(--sectionButtonSize) * 1.5 );
	}
	}
	@media only screen and (min-width: 4096px) {
		article {
			font-size: calc(var(--articleSize) * 2.25 );
			line-height: calc(2.5rem * 2.25);
		}
		button {
			font-size: calc(var(--sectionButtonSize) * 2.25 );
		}
	}`
}