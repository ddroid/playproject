(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){

// ------------------------------------------
// Rellax.js
// Buttery smooth parallax library
// Copyright (c) 2016 Moe Amaya (@moeamaya)
// MIT license
//
// Thanks to Paraxify.js and Jaime Cabllero
// for parallax concepts
// ------------------------------------------

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Rellax = factory();
  }
}(typeof window !== "undefined" ? window : global, function () {
  var Rellax = function(el, options){
    "use strict";

    var self = Object.create(Rellax.prototype);

    var posY = 0;
    var screenY = 0;
    var posX = 0;
    var screenX = 0;
    var blocks = [];
    var pause = true;

    // check what requestAnimationFrame to use, and if
    // it's not supported, use the onscroll event
    var loop = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function(callback){ return setTimeout(callback, 1000 / 60); };

    // store the id for later use
    var loopId = null;

    // Test via a getter in the options object to see if the passive property is accessed
    var supportsPassive = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassive = true;
        }
      });
      window.addEventListener("testPassive", null, opts);
      window.removeEventListener("testPassive", null, opts);
    } catch (e) {}

    // check what cancelAnimation method to use
    var clearLoop = window.cancelAnimationFrame || window.mozCancelAnimationFrame || clearTimeout;

    // check which transform property to use
    var transformProp = window.transformProp || (function(){
        var testEl = document.createElement('div');
        if (testEl.style.transform === null) {
          var vendors = ['Webkit', 'Moz', 'ms'];
          for (var vendor in vendors) {
            if (testEl.style[ vendors[vendor] + 'Transform' ] !== undefined) {
              return vendors[vendor] + 'Transform';
            }
          }
        }
        return 'transform';
      })();

    // Default Settings
    self.options = {
      speed: -2,
	    verticalSpeed: null,
	    horizontalSpeed: null,
      breakpoints: [576, 768, 1201],
      center: false,
      wrapper: null,
      relativeToWrapper: false,
      round: true,
      vertical: true,
      horizontal: false,
      verticalScrollAxis: "y",
      horizontalScrollAxis: "x",
      callback: function() {},
    };

    // User defined options (might have more in the future)
    if (options){
      Object.keys(options).forEach(function(key){
        self.options[key] = options[key];
      });
    }

    function validateCustomBreakpoints () {
      if (self.options.breakpoints.length === 3 && Array.isArray(self.options.breakpoints)) {
        var isAscending = true;
        var isNumerical = true;
        var lastVal;
        self.options.breakpoints.forEach(function (i) {
          if (typeof i !== 'number') isNumerical = false;
          if (lastVal !== null) {
            if (i < lastVal) isAscending = false;
          }
          lastVal = i;
        });
        if (isAscending && isNumerical) return;
      }
      // revert defaults if set incorrectly
      self.options.breakpoints = [576, 768, 1201];
      console.warn("Rellax: You must pass an array of 3 numbers in ascending order to the breakpoints option. Defaults reverted");
    }

    if (options && options.breakpoints) {
      validateCustomBreakpoints();
    }

    // By default, rellax class
    if (!el) {
      el = '.rellax';
    }

    // check if el is a className or a node
    var elements = typeof el === 'string' ? document.querySelectorAll(el) : [el];

    // Now query selector
    if (elements.length > 0) {
      self.elems = elements;
    }

    // The elements don't exist
    else {
      console.warn("Rellax: The elements you're trying to select don't exist.");
      return;
    }

    // Has a wrapper and it exists
    if (self.options.wrapper) {
      if (!self.options.wrapper.nodeType) {
        var wrapper = document.querySelector(self.options.wrapper);

        if (wrapper) {
          self.options.wrapper = wrapper;
        } else {
          console.warn("Rellax: The wrapper you're trying to use doesn't exist.");
          return;
        }
      }
    }

    // set a placeholder for the current breakpoint
    var currentBreakpoint;

    // helper to determine current breakpoint
    var getCurrentBreakpoint = function (w) {
      var bp = self.options.breakpoints;
      if (w < bp[0]) return 'xs';
      if (w >= bp[0] && w < bp[1]) return 'sm';
      if (w >= bp[1] && w < bp[2]) return 'md';
      return 'lg';
    };

    // Get and cache initial position of all elements
    var cacheBlocks = function() {
      for (var i = 0; i < self.elems.length; i++){
        var block = createBlock(self.elems[i]);
        blocks.push(block);
      }
    };


    // Let's kick this script off
    // Build array for cached element values
    var init = function() {
      for (var i = 0; i < blocks.length; i++){
        self.elems[i].style.cssText = blocks[i].style;
      }

      blocks = [];

      screenY = window.innerHeight;
      screenX = window.innerWidth;
      currentBreakpoint = getCurrentBreakpoint(screenX);

      setPosition();

      cacheBlocks();

      animate();

      // If paused, unpause and set listener for window resizing events
      if (pause) {
        window.addEventListener('resize', init);
        pause = false;
        // Start the loop
        update();
      }
    };

    // We want to cache the parallax blocks'
    // values: base, top, height, speed
    // el: is dom object, return: el cache values
    var createBlock = function(el) {
      var dataPercentage = el.getAttribute( 'data-rellax-percentage' );
      var dataSpeed = el.getAttribute( 'data-rellax-speed' );
      var dataXsSpeed = el.getAttribute( 'data-rellax-xs-speed' );
      var dataMobileSpeed = el.getAttribute( 'data-rellax-mobile-speed' );
      var dataTabletSpeed = el.getAttribute( 'data-rellax-tablet-speed' );
      var dataDesktopSpeed = el.getAttribute( 'data-rellax-desktop-speed' );
      var dataVerticalSpeed = el.getAttribute('data-rellax-vertical-speed');
      var dataHorizontalSpeed = el.getAttribute('data-rellax-horizontal-speed');
      var dataVericalScrollAxis = el.getAttribute('data-rellax-vertical-scroll-axis');
      var dataHorizontalScrollAxis = el.getAttribute('data-rellax-horizontal-scroll-axis');
      var dataZindex = el.getAttribute( 'data-rellax-zindex' ) || 0;
      var dataMin = el.getAttribute( 'data-rellax-min' );
      var dataMax = el.getAttribute( 'data-rellax-max' );
      var dataMinX = el.getAttribute('data-rellax-min-x');
      var dataMaxX = el.getAttribute('data-rellax-max-x');
      var dataMinY = el.getAttribute('data-rellax-min-y');
      var dataMaxY = el.getAttribute('data-rellax-max-y');
      var mapBreakpoints;
      var breakpoints = true;

      if (!dataXsSpeed && !dataMobileSpeed && !dataTabletSpeed && !dataDesktopSpeed) {
        breakpoints = false;
      } else {
        mapBreakpoints = {
          'xs': dataXsSpeed,
          'sm': dataMobileSpeed,
          'md': dataTabletSpeed,
          'lg': dataDesktopSpeed
        };
      }

      // initializing at scrollY = 0 (top of browser), scrollX = 0 (left of browser)
      // ensures elements are positioned based on HTML layout.
      //
      // If the element has the percentage attribute, the posY and posX needs to be
      // the current scroll position's value, so that the elements are still positioned based on HTML layout
      var wrapperPosY = self.options.wrapper ? self.options.wrapper.scrollTop : (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
      // If the option relativeToWrapper is true, use the wrappers offset to top, subtracted from the current page scroll.
      if (self.options.relativeToWrapper) {
        var scrollPosY = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
        wrapperPosY = scrollPosY - self.options.wrapper.offsetTop;
      }
      var posY = self.options.vertical ? ( dataPercentage || self.options.center ? wrapperPosY : 0 ) : 0;
      var posX = self.options.horizontal ? ( dataPercentage || self.options.center ? self.options.wrapper ? self.options.wrapper.scrollLeft : (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft) : 0 ) : 0;

      var blockTop = posY + el.getBoundingClientRect().top;
      var blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;

      var blockLeft = posX + el.getBoundingClientRect().left;
      var blockWidth = el.clientWidth || el.offsetWidth || el.scrollWidth;

      // apparently parallax equation everyone uses
      var percentageY = dataPercentage ? dataPercentage : (posY - blockTop + screenY) / (blockHeight + screenY);
      var percentageX = dataPercentage ? dataPercentage : (posX - blockLeft + screenX) / (blockWidth + screenX);
      if(self.options.center){ percentageX = 0.5; percentageY = 0.5; }

      // Optional individual block speed as data attr, otherwise global speed
      var speed = (breakpoints && mapBreakpoints[currentBreakpoint] !== null) ? Number(mapBreakpoints[currentBreakpoint]) : (dataSpeed ? dataSpeed : self.options.speed);
      var verticalSpeed = dataVerticalSpeed ? dataVerticalSpeed : self.options.verticalSpeed;
      var horizontalSpeed = dataHorizontalSpeed ? dataHorizontalSpeed : self.options.horizontalSpeed;

      // Optional individual block movement axis direction as data attr, otherwise gobal movement direction
      var verticalScrollAxis = dataVericalScrollAxis ? dataVericalScrollAxis : self.options.verticalScrollAxis;
      var horizontalScrollAxis = dataHorizontalScrollAxis ? dataHorizontalScrollAxis : self.options.horizontalScrollAxis;

      var bases = updatePosition(percentageX, percentageY, speed, verticalSpeed, horizontalSpeed);

      // ~~Store non-translate3d transforms~~
      // Store inline styles and extract transforms
      var style = el.style.cssText;
      var transform = '';

      // Check if there's an inline styled transform
      var searchResult = /transform\s*:/i.exec(style);
      if (searchResult) {
        // Get the index of the transform
        var index = searchResult.index;

        // Trim the style to the transform point and get the following semi-colon index
        var trimmedStyle = style.slice(index);
        var delimiter = trimmedStyle.indexOf(';');

        // Remove "transform" string and save the attribute
        if (delimiter) {
          transform = " " + trimmedStyle.slice(11, delimiter).replace(/\s/g,'');
        } else {
          transform = " " + trimmedStyle.slice(11).replace(/\s/g,'');
        }
      }

      return {
        baseX: bases.x,
        baseY: bases.y,
        top: blockTop,
        left: blockLeft,
        height: blockHeight,
        width: blockWidth,
        speed: speed,
        verticalSpeed: verticalSpeed,
        horizontalSpeed: horizontalSpeed,
        verticalScrollAxis: verticalScrollAxis,
        horizontalScrollAxis: horizontalScrollAxis,
        style: style,
        transform: transform,
        zindex: dataZindex,
        min: dataMin,
        max: dataMax,
        minX: dataMinX,
        maxX: dataMaxX,
        minY: dataMinY,
        maxY: dataMaxY
      };
    };

    // set scroll position (posY, posX)
    // side effect method is not ideal, but okay for now
    // returns true if the scroll changed, false if nothing happened
    var setPosition = function() {
      var oldY = posY;
      var oldX = posX;

      posY = self.options.wrapper ? self.options.wrapper.scrollTop : (document.documentElement || document.body.parentNode || document.body).scrollTop || window.pageYOffset;
      posX = self.options.wrapper ? self.options.wrapper.scrollLeft : (document.documentElement || document.body.parentNode || document.body).scrollLeft || window.pageXOffset;
      // If option relativeToWrapper is true, use relative wrapper value instead.
      if (self.options.relativeToWrapper) {
        var scrollPosY = (document.documentElement || document.body.parentNode || document.body).scrollTop || window.pageYOffset;
        posY = scrollPosY - self.options.wrapper.offsetTop;
      }


      if (oldY != posY && self.options.vertical) {
        // scroll changed, return true
        return true;
      }

      if (oldX != posX && self.options.horizontal) {
        // scroll changed, return true
        return true;
      }

      // scroll did not change
      return false;
    };

    // Ahh a pure function, gets new transform value
    // based on scrollPosition and speed
    // Allow for decimal pixel values
    var updatePosition = function(percentageX, percentageY, speed, verticalSpeed, horizontalSpeed) {
      var result = {};
      var valueX = ((horizontalSpeed ? horizontalSpeed : speed) * (100 * (1 - percentageX)));
      var valueY = ((verticalSpeed ? verticalSpeed : speed) * (100 * (1 - percentageY)));

      result.x = self.options.round ? Math.round(valueX) : Math.round(valueX * 100) / 100;
      result.y = self.options.round ? Math.round(valueY) : Math.round(valueY * 100) / 100;

      return result;
    };

    // Remove event listeners and loop again
    var deferredUpdate = function() {
      window.removeEventListener('resize', deferredUpdate);
      window.removeEventListener('orientationchange', deferredUpdate);
      (self.options.wrapper ? self.options.wrapper : window).removeEventListener('scroll', deferredUpdate);
      (self.options.wrapper ? self.options.wrapper : document).removeEventListener('touchmove', deferredUpdate);

      // loop again
      loopId = loop(update);
    };

    // Loop
    var update = function() {
      if (setPosition() && pause === false) {
        animate();

        // loop again
        loopId = loop(update);
      } else {
        loopId = null;

        // Don't animate until we get a position updating event
        window.addEventListener('resize', deferredUpdate);
        window.addEventListener('orientationchange', deferredUpdate);
        (self.options.wrapper ? self.options.wrapper : window).addEventListener('scroll', deferredUpdate, supportsPassive ? { passive: true } : false);
        (self.options.wrapper ? self.options.wrapper : document).addEventListener('touchmove', deferredUpdate, supportsPassive ? { passive: true } : false);
      }
    };

    // Transform3d on parallax element
    var animate = function() {
      var positions;
      for (var i = 0; i < self.elems.length; i++){
        // Determine relevant movement directions
        var verticalScrollAxis = blocks[i].verticalScrollAxis.toLowerCase();
        var horizontalScrollAxis = blocks[i].horizontalScrollAxis.toLowerCase();
        var verticalScrollX = verticalScrollAxis.indexOf("x") != -1 ? posY : 0;
        var verticalScrollY = verticalScrollAxis.indexOf("y") != -1 ? posY : 0;
        var horizontalScrollX = horizontalScrollAxis.indexOf("x") != -1 ? posX : 0;
        var horizontalScrollY = horizontalScrollAxis.indexOf("y") != -1 ? posX : 0;

        var percentageY = ((verticalScrollY + horizontalScrollY - blocks[i].top + screenY) / (blocks[i].height + screenY));
        var percentageX = ((verticalScrollX + horizontalScrollX - blocks[i].left + screenX) / (blocks[i].width + screenX));

        // Subtracting initialize value, so element stays in same spot as HTML
        positions = updatePosition(percentageX, percentageY, blocks[i].speed, blocks[i].verticalSpeed, blocks[i].horizontalSpeed);
        var positionY = positions.y - blocks[i].baseY;
        var positionX = positions.x - blocks[i].baseX;

        // The next two "if" blocks go like this:
        // Check if a limit is defined (first "min", then "max");
        // Check if we need to change the Y or the X
        // (Currently working only if just one of the axes is enabled)
        // Then, check if the new position is inside the allowed limit
        // If so, use new position. If not, set position to limit.

        // Check if a min limit is defined
        if (blocks[i].min !== null) {
          if (self.options.vertical && !self.options.horizontal) {
            positionY = positionY <= blocks[i].min ? blocks[i].min : positionY;
          }
          if (self.options.horizontal && !self.options.vertical) {
            positionX = positionX <= blocks[i].min ? blocks[i].min : positionX;
          }
        }

        // Check if directional min limits are defined
        if (blocks[i].minY != null) {
            positionY = positionY <= blocks[i].minY ? blocks[i].minY : positionY;
        }
        if (blocks[i].minX != null) {
            positionX = positionX <= blocks[i].minX ? blocks[i].minX : positionX;
        }

        // Check if a max limit is defined
        if (blocks[i].max !== null) {
          if (self.options.vertical && !self.options.horizontal) {
            positionY = positionY >= blocks[i].max ? blocks[i].max : positionY;
          }
          if (self.options.horizontal && !self.options.vertical) {
            positionX = positionX >= blocks[i].max ? blocks[i].max : positionX;
          }
        }

        // Check if directional max limits are defined
        if (blocks[i].maxY != null) {
            positionY = positionY >= blocks[i].maxY ? blocks[i].maxY : positionY;
        }
        if (blocks[i].maxX != null) {
            positionX = positionX >= blocks[i].maxX ? blocks[i].maxX : positionX;
        }

        var zindex = blocks[i].zindex;

        // Move that element
        // (Set the new translation and append initial inline transforms.)
        var translate = 'translate3d(' + (self.options.horizontal ? positionX : '0') + 'px,' + (self.options.vertical ? positionY : '0') + 'px,' + zindex + 'px) ' + blocks[i].transform;
        self.elems[i].style[transformProp] = translate;
      }
      self.options.callback(positions);
    };

    self.destroy = function() {
      for (var i = 0; i < self.elems.length; i++){
        self.elems[i].style.cssText = blocks[i].style;
      }

      // Remove resize event listener if not pause, and pause
      if (!pause) {
        window.removeEventListener('resize', init);
        pause = true;
      }

      // Clear the animation loop to prevent possible memory leak
      clearLoop(loopId);
      loopId = null;
    };

    // Init
    init();

    // Allow to recalculate the initial values whenever we want
    self.refresh = init;

    return self;
  };
  return Rellax;
}));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (__filename){(function (){
/******************************************************************************
  STATE
******************************************************************************/
const STATE = require('STATE')
const name = 'app'
const statedb = STATE(__filename)
const shopts = { mode: 'closed' }
// ----------------------------------------
const { sdb, subs: [get], sub_modules } = statedb(fallback_module, fallback_instance)
function fallback_module () { 
  return {
    _: {
      'topnav': {},
      'theme_widget': {},
      'header': {},
      'footer': {}
    }
  }
}
function fallback_instance () {
  return {
    _: {
      'topnav': {},
      'theme_widget': {},
      'header': {},
      'footer': {}
    },
    inputs: {
      'app.css': {
        $ref: new URL('src/node_modules/css/default/app.css', location).href
      }
    }
  }
}
function override ([topnav]) {
  const data = topnav()
  console.log(data)
  data['topnav.json'].data.links.push({
    "id": "app",
    "text": "app",
    "url": "app"
  })
  return data
}
/******************************************************************************
  MAKE_PAGE COMPONENT
******************************************************************************/
const IO = require('io')
const modules = {
 [sub_modules['theme_widget']] : require('theme_widget'),
 [sub_modules['topnav']] : require('topnav'),
 [sub_modules['header']]  : require('header'),
//  datdot : require('datdot'),
//  editor : require('editor'),
//  smartcontract_codes : require('smartcontract_codes'),
//  supporters : require('supporters'),
//  our_contributors : require('our_contributors'),
[sub_modules['footer']]  : require('footer'),
}
module.exports = app

async function app (opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid)
  const on = {
    jump,
    css: inject,
  }
  
  const send = await IO(id, name, on)
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
  <div id="top" class='wrap'></div>
  <style></style>`
  const style = shadow.querySelector('style')
  const main = shadow.querySelector('div')

  const subs = await sdb.watch(onbatch)
  
  console.log(subs, modules)
  main.append(...await Promise.all(
    subs.map(async ({sid, type}) => {
      const el = document.createElement('div')
      el.name = type
      const shadow = el.attachShadow(shopts)
      shadow.append(await modules[type]({ sid, hub: [id] }))
      return el
  })))
  return el
  
  function onbatch(batch) {
    for (const {type, data} of batch) {
      on[type](data)
    }  
  }
  async function jump ({ data }) {
    main.querySelector('#'+data).scrollIntoView({ behavior: 'smooth'})
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
}


}).call(this)}).call(this,"/src/app.js")
},{"STATE":3,"footer":4,"header":9,"io":10,"theme_widget":14,"topnav":16}],3:[function(require,module,exports){
// STATE.js

const localdb = require('localdb')
const db = localdb()
const status = {
  root_module: true, 
  root_instance: true, 
  module_index: {}, 
  overrides: {},
  tree: {},
  tree_pointers: {}
}
//@TODO Where devs can define slots
const default_slots = ['hubs', '_', 'inputs', 'outputs']

const version = 8
if(db.read(['playproject_version']) != version){
  localStorage.clear()
  status.fallback_check = true
  db.add(['playproject_version'], version)
}
// db.read(['state']) || db.add(['state'], {})

const listeners = {}
const s2i = {}
const i2s = {}
var admins = [0]

module.exports = STATE
function STATE (address) {
  const local_status = {
    name: extract_filename(address),
    deny: {}, subs: []
  }

  const sdb = { watch, get_sub, req_access }
  const subs = [get]
  const admin = { xget, get_all, add_admins, load }
  return statedb

  function extract_filename (address) {
    const parts = address.split('/node_modules/')
    const last = parts.at(-1).split('/')
    return last.at(-1).slice(0, -3)
  }
  function statedb (fallback_module, fallback_instance) {
    local_status.fallback_instance = fallback_instance
    const search_filters = {'type': local_status.name}
    let data = db.find(['state'], search_filters, status.module_index[local_status.name])
    if (status.fallback_check) {
      preprocess(fallback_module, 'module', data || {id: 0})
      data = db.find(['state'], search_filters, status.module_index[local_status.name])
    }
    if(data.id == 0){
      data.admins && add_admins(data.admins)
    }
    local_status.id = data.id
    local_status.module_id = data.id
    data.hubs && add_source(data.hubs)
    const sub_modules = {}
    data.subs && data.subs.forEach(id => {
      sub_modules[db.read(['state', id]).type] = id
    })
    return { id: data.id, sdb, subs, sub_modules }
  }
  function add_source (hubs) {
    hubs.forEach(id => {
      const data = db.read(['state', id])
      if(data.type === 'js'){
        fetch_save(data)
      }
    })
  }
  function symbolfy (data) {
    data.subs && data.subs.forEach(sub => {
      const substate = db.read(['state', sub])
      s2i[i2s[sub] = Symbol(sub)] = sub
      local_status.subs.push({ sid: i2s[sub], type: substate.type })
    })
  }
  function load (snapshot) {
    localStorage.clear()
    Object.entries(snapshot).forEach(([key, value]) => {
      db.add([key], JSON.parse(value), true)
    })
    window.location.reload()
  }
  function get (sid) {
    const id = s2i[sid]
    let data = db.read(['state', id])
    if(status.fallback_check){
      preprocess(local_status.fallback_instance, 'instance', data)
      data = db.read(['state', id])
    }
    if(status.root_instance){
      data = db.find(['state'], {'type': 0})
      status.root_instance = false
    }
    local_status.id = data.id
    symbolfy(data)
    return {id, sdb}
  }
  async function watch (listener) {
    const data = db.read(['state', local_status.id])
    listeners[data.id] = listener
    const input_map = []
    data.inputs && await Promise.all(data.inputs.map(async input => {
      const input_state = db.read(['state', input])
      const input_data = await fetch_save(input_state)
      input_map.push({ type: input_state.type, data: [input_data] })
    }))
    listener(input_map)
    return local_status.subs
  }
  async function fetch_save({ id, name, $ref, type, data }) {
    const xtype = (typeof(id) === "number" ? name : id).split('.').at(-1)
    let result = db.read([ type, id ])
    if(!result){
      result = data || await((await fetch($ref))[xtype === 'json' ?'json' :'text']())
      db.add([type, id], result)
    }
    return result
  }
  function get_sub (type) {
    return local_status.subs.filter(sub => {
      const dad = db.read(['state', sub.type])
      return dad.type === type
    })
  }
  async function add_admins (ids) {
    admins.push(...ids)
  }
  function req_access (sid) {
    if (local_status.deny[sid]) throw new Error('access denied')
    const el = db.read(['state', s2i[sid]])
    if(admins.includes(s2i[sid]) || admins.includes(el?.name))
      return admin
  }
  function xget (id) {
    return db.read(['state', id])
  }
  function get_all () {
    return db.read_all(['state'])
  }
  function preprocess (fallback, xtype, super_data = {}) {
    let count = db.length(['state'])
    let {id: super_id, hubs, subs} = super_data
    let subs_data = {}, subs_types, id_map = {}
    if(subs){
      subs.forEach(id => subs_data[id] = db.read(['state', id]))
      subs_types = new Set(Object.values(subs_data).map(sub => sub.type))
    }
    let host_data
    if(super_data.fallback){
      host_data = status.overrides[super_data.fallback]([fallback], status.tree_pointers[super_data.type])
    }
    else
      host_data = fallback()

    const on = {
      _: clean_node,
      inputs: clean_file,
    }
    clean_node('', host_data)

    function clean_node (local_id, entry, hub_entry, hub_module, local_tree) {
      let module
      const split = local_id.split(':')
      if(local_id){
        entry.hubs = [hub_entry.id]
        if(xtype === 'instance')
          hub_module?.subs && hub_module.subs.forEach(id => {
            const module_data = db.read(['state', id])
            if(module_data.idx == split[0]){
              entry.type = module_data.id
              module = module_data
              return
            }
          })
        else{
          entry.idx = local_id
          entry.type = split[0]
          status.tree_pointers[count] = local_tree
        }
        //Check if sub-entries are already initialized by a super
        if(subs_types && subs_types.has(entry.type)){
          const super_entry = Object.values(subs_data).find(sub => sub.type == entry.type)
          //continue a fallback chain
          const index = super_entry?.fallback?.find(key => key == hub_entry.type)
          if(index){
            const key = 'f' + Object.keys(status.overrides).length
            super_entry.fallback[index] = key
            const fun = entry.fallback.find(v => typeof(v) === 'function')
            status.overrides[key] = fun
            db.add(['state', super_entry.id], super_entry)
          }
          return super_entry.id
        }
      }
      else{
        if(xtype === 'instance'){
          module = db.read(['state', local_status.module_id])
          entry.type = module.id
        }
        else{
          local_tree = JSON.parse(JSON.stringify(entry))
          if(super_id)
            status.tree_pointers[super_id]._[super_data.idx] = local_tree
          else
            status.tree[local_id] = local_tree
          const file_id = local_status.name+'.js'
          entry.inputs || (entry.inputs = {})
          entry.inputs[file_id] = { $ref: new URL(address, location).href }
          entry.type = entry.type || local_status.name
          entry.idx = super_data.idx
        }
        hubs && (entry.hubs = hubs)
      }
      entry.id = local_id ? count++ : super_id || count++
      entry.name = entry.name || module?.type || entry.type || local_status.name
      
      id_map[local_id] = entry.type
      //start a fallback chain
      if(entry[0]){
        const key = 'f' + Object.keys(status.overrides).length
        status.overrides[key] = entry[0]
        delete(entry[0])
        entry.fallback = key
        // const new_fallback = []
        // entry[0].forEach(handler => {
        //   if(typeof(handler) === 'function'){
        //     const key = 'f' + Object.keys(status.overrides).length
        //     new_fallback.push(key)
        //     status.overrides[key] = handler
        //   }
        //   else
        //     new_fallback.push(id_map[handler])
        // })
        // entry.fallback = new_fallback
      }
      // console.log(JSON.parse(JSON.stringify(entry)))
      default_slots.forEach(slot => {
        if(entry[slot] && on[slot])
          entry[slot === '_' ? 'subs' : slot] = Object.entries(entry[slot])
          .map(([key, value]) => on[slot](key, value, entry, module, local_tree))
      })
      delete(entry._)
      db.add(['state', entry.id], entry)
      return entry.id
    }
    function clean_file (file_id, entry, hub_entry){
      if(!isNaN(Number(file_id)))
        return file_id
      const file = entry
      file.id = file_id
      file.name = file.name || file_id
      file.type = file.type || file.id.split('.').at(-1)
      file[file.type === 'js' ? 'subs' : 'hubs' ] = [hub_entry.id]
      const copies = Object.keys(db.read_all(['state', file_id]))
      if(copies.length){
        const id = copies.sort().at(-1).split(':')[1]
        file.id = file_id + ':' + (Number(id || 0) + 1)
      }
      db.add(['state', file.id], file)
      return file.id
    }
  }
  
}
},{"localdb":12}],4:[function(require,module,exports){
(function (__filename){(function (){
const graphic = require('graphic')
const IO = require('io')
const STATE = require('STATE')
const name = 'footer'
const statedb = STATE(__filename)
// ----------------------------------------
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)
function fallback_module () { 
	return {}
}
function fallback_instance () { 
	const data = require('./instance.json')
	data.inputs['footer.css'] = {
		$ref: new URL('src/node_modules/css/default/footer.css', location).href
	}
	return data 
}
/******************************************************************************
  APP FOOTER COMPONENT
******************************************************************************/
// ----------------------------------------
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = footer

async function footer (opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid) 
  const on = {
		css: inject,
		scroll,
		json: fill
	}
	
  const send = await IO(id, name, on)
  // ----------------------------------------
  // OPTS
  // ----------------------------------------
  let island = await graphic('island', './src/node_modules/assets/svg/deco-island.svg')
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
      <footer class='footer'>
      </footer>
    <style></style>`
  // ----------------------------------------
  const style = shadow.querySelector('style')
  const footer = shadow.querySelector('footer')

	sdb.watch(onbatch)
  return el

  function onbatch(batch){
		for (const {type, data} of batch) {
      on[type](data)
    }  
	}
	async function inject (data){
		style.innerHTML = data.join('\n')
	}
  async function fill ([ opts ]) {
    const graphics = opts.icons.map(icon => graphic('icon', icon.imgURL))
    const icons = await Promise.all(graphics)
    footer.innerHTML = `
          <div class='scene'>
              ${island.outerHTML}
              <nav class='contacts'>
                  ${opts.icons.map((icon, i) => 
                      `<a href=${icon.url} 
                      title=${icon.name} 
                      target="${icon.url.includes('http') ? "_blank" : null}"
                      >${icons[i].outerHTML}</a>`
                  )}
              </nav>
          </div>
          <p class='copyright'>${new Date().getFullYear()+' '+opts.copyright}</p>
      `
  }
  async function scroll () {
    el.scrollIntoView({behavior: 'smooth'})
    el.tabIndex = '0'
    el.focus()
    el.onblur = () => {
      el.tabIndex = '-1'
      el.onblur = null
    }
  }
}

}).call(this)}).call(this,"/src/node_modules/footer/footer.js")
},{"./instance.json":5,"STATE":3,"graphic":8,"io":10}],5:[function(require,module,exports){
module.exports={
  "inputs": {
    "footer.json": {
      "data": {
        "copyright": " PlayProject",
        "icons": [
          {
            "id": "1",
            "name": "email",
            "imgURL": "./src/node_modules/assets/svg/email.svg",
            "url": "mailto:ninabreznik@gmail.com"
          },
          {
            "id": "2",
            "name": "twitter",
            "imgURL": "./src/node_modules/assets/svg/twitter.svg",
            "url": "https://twitter.com/playproject_io"
          },
          {
            "id": "3",
            "name": "Github",
            "imgURL": "./src/node_modules/assets/svg/github.svg",
            "url": "https://github.com/playproject-io"
          },
          {
            "id": "4",
            "name": "Gitter",
            "imgURL": "./src/node_modules/assets/svg/gitter.svg",
            "url": "https://gitter.im/playproject-io/community"
          }
        ]
      }
    }
  }
}
},{}],6:[function(require,module,exports){
(function (__filename){(function (){
/******************************************************************************
  STATE
******************************************************************************/
const STATE = require('STATE')
const localdb = require('localdb')
const name = 'graph_explorer'
const statedb = STATE(__filename)
const default_slots = [['hubs', 'subs'], ['inputs', 'outputs']]
// ----------------------------------------
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)
function fallback_module () { 
  return {}
}
function fallback_instance () {
  return {
    inputs: {
      'graph_explorer.css': {
        $ref: new URL('src/node_modules/css/default/graph_explorer.css', location).href
      }
    }
  }
}

const IO = require('io')
const {copy, get_color, download_json} = require('helper')
/******************************************************************************
  GRAPH COMPONENT
******************************************************************************/
// ----------------------------------------
const shopts = { mode: 'closed' }
// ----------------------------------------

module.exports = graph_explorer

async function graph_explorer (opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const db = localdb()
  const { id, sdb } = await get(opts.sid)
  const hub_id = opts.hub[0]
  const status = { tab_id: 0, count: 0, entry_types: {}, menu_ids: [] }
  const on = {
    init,
    css: inject,
    scroll
  }

  const on_add = {
    entry: add_entry,
    entry_compact: add_entry_compact,
    menu: add_action
  }
  const admin = sdb.req_access(opts.sid)
  const send = await IO(id, name, on)
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  const style = document.createElement('style')
  await sdb.watch(onbatch)
  shadow.innerHTML = `
  <div>
    <button class="export">
      Export
    </button>
    <button class="import">
      Import
    </button>
    <input style="display: none;" class="upload" type='file' />
  </div>
  <span>Compact mode</span>
  <label class="toggle_switch">
    <input type="checkbox">
    <span class="slider"></span>
  </label>
  <main>

  </main>`
  const main = shadow.querySelector('main')
  const compact_switch = shadow.querySelector('.toggle_switch > input')
  const upload = shadow.querySelector('.upload')
  const import_btn = shadow.querySelector('.import')
  const export_btn = shadow.querySelector('.export')
  shadow.append(style)
  shadow.addEventListener('copy', oncopy)
  /************************************
   Listeners
  *************************************/
  compact_switch.onchange = e => add_root(e.target.checked)
  export_btn.onclick = export_fn
  import_btn.onclick = () => upload.click()
  upload.onchange = import_fn
  return el

  /******************************************
   Mix
  ******************************************/
  function onbatch (batch) {
    for (const {type, data} of batch) {
      on[type](data)
    }  
  }
  async function oncopy (e) {
    const selection = shadow.getSelection()
    e.clipboardData.setData('text/plain', copy(selection))
    e.preventDefault()
  }
  function export_fn () {
    const blob = new Blob([JSON.stringify(localStorage, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = 'snapshot.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  function import_fn () {
    const file = upload.files[0]
    const reader = new FileReader()
    reader.onload = e => {
      const blob = JSON.parse(e.target.result)
      admin.load(blob)
    }
    reader.readAsText(file)
  }
  async function init ({ data }) {
    let id = Object.keys(data).length + 1

    add({ id, name: 'edit', type: 'action', hubs: [] })
    add({ id, name: 'link', type: 'action', hubs: [] })
    add({ id, name: 'unlink', type: 'action', hubs: [] })
    add({ id, name: 'drop', type: 'action', hubs: [] })

    status.graph = data
    add_root(false)

    function add (args){
      status.menu_ids.push(args.id)
      data[id++] = args
    }
  }
  async function add_root(compact) {
    status.xentry = null
    status.entry_types = {}
    status.count = 0
    status.tab_id = 0
    main.innerHTML = ''
    const root_entries = Object.values(status.graph).filter(entry => !entry.hubs)
    if(compact)
      root_entries.forEach((data, i) => add_entry_compact({hub_el: main, data, last: i === root_entries.length - 1, ancestry:[] }))
    else  
      root_entries.forEach((data, i) => add_entry({hub_el: main, data, last: i === root_entries.length - 1, ancestry:[] }))
  }
  function html_template (data, space, pos){
    const element = document.createElement('div')
    element.classList.add(data.type, 'entry', 'a'+data.id)
    element.tabIndex = '0'
    element.dataset.space = space
    element.dataset.pos = pos
    return element
  }
  /******************************************
   Addition Operation
  ******************************************/
  // function add_el ({ data, parent, space, grand_last, type }){
  //   const is_single = parent.children.length ? false : true
  //   if(data.root){
  //     parent.prepend(add_root({ data, last: false}))
  //     return
  //   }
  //   //hub or sub node check
  //   if(type === 'inputs')
  //     parent.append(on_add[type]({ data, space, grand_last, first: is_single}))
  //   else
  //     parent.prepend(on_add[type]({ data, space, grand_last, last: is_single}))
  // }

  function add_action ({ hub_el, data, last, space = '' }) {
    const element = html_template(data, last, space)
    hub_el.append(element)
    !status.entry_types[data.type] && (status.entry_types[data.type] = Object.keys(status.entry_types).length)

    element.innerHTML = `
    <div class="slot_list">
      <span class="odd">${space}</span>
      <span class="type_emo odd"></span>
      <span class="name odd">${data.name}</span>
    </div>`
    const name = element.querySelector('.slot_list > .name')
    name.onclick = () => send({ type: 'click', to: hub_id, data })

  }
  function add_entry_compact ({ hub_el, data, first, last, space = '', pos, ancestry }) {
    //Init
    const element = html_template(data, last, space, pos)
    !status.entry_types[data.type] && (status.entry_types[data.type] = Object.keys(status.entry_types).length)
    ancestry = [...ancestry]
    let lo_space = space + (last ? '&nbsp;' : '│')
    let hi_space = space + (first ? '&nbsp;' : '│')
    const space_handle = [], els = []
    let slot_no = 0, slot_on

    //HTML
    element.innerHTML = `
      <div class="slot_list">
        <span class="space odd"><!--
        -->${space}<span>${last ? '└' : first ? "┌" : '├'}</span><!--
        --><span class='on'>${last ? '┗' : first ? "┏" : '┠'}</span>
        </span><!--
        --><span class="menu_emo"></span><!--
        --><span class="type_emo odd"></span><!--
        --><span class="name odd">${data.name}</span>
      </div>
      <div class="menu entries"></div>
    `

    //Unavoidable mix
    const slot_list = element.querySelector('.slot_list')
    const name = element.querySelector('.slot_list > .name')
    hub_el.append(element)
    const copies = main.querySelectorAll('.a'+data.id + '> .slot_list')
    if(copies.length > 1){
      copies.forEach(copy => !copy.previousElementSibling && (copy.style.color = '#000000'))
    }
    if(ancestry.includes(data.id)){
      name.onclick = () => {
        const copies = main.querySelectorAll('.a'+data.id + '> .slot_list')
        copies.forEach((copy, i) => {
          if(copy === slot_list)
            return
          const temp1 = copy.style.color
          const temp2 = copy.style.backgroundColor
          copy.style.color = '#fff'
          copy.style.backgroundColor = '#000000'
          setTimeout(() => {
            copy.style.color = temp1
            copy.style.backgroundColor = temp2
          }, 1000)
        })
      }
      return
    }
    ancestry.push(data.id)

    //Elements
    const menu_emo = element.querySelector('.slot_list > .menu_emo')
    const type_emo = element.querySelector('.slot_list > .type_emo')
    const menu = element.querySelector('.menu')

    //Listeners
    type_emo.onclick = type_click
    name.onclick = () => send({ type: 'click', to: hub_id, data })
    const slotmap = []
    const data_keys = Object.keys(data)
    const new_pair = [[], []]
    const slot_handle = []
    let check = false
    default_slots.forEach(pair => {
      pair.forEach((slot, i) => {
        if(data_keys.includes(slot)){
          new_pair[i].push(slot)
          check = true
        }
      })
    })
    check && slotmap.push(new_pair)
    slotmap.forEach(handle_slot)
    menu_click({el: menu, emo: menu_emo, data: status.menu_ids, pos: 0, type: 'menu'})
    if(getComputedStyle(type_emo, '::before').content === 'none')
      type_emo.innerHTML = `[${status.entry_types[data.type]}]`

    //Procedures
    async function handle_slot (pair, i) {
      const slot_check = [false, false]
      const slot_emo = document.createElement('span')
      slot_emo.innerHTML = '<span>─</span><span></span>'
      menu_emo.before(slot_emo)
      slot_no++

      pair.forEach((x, j) => {
        let gap, mode, emo_on
        const pos = !j
        const count = status.count++
        const style = document.createElement('style')
        const entries = document.createElement('div')
        entries.classList.add('entries')

        element.append(style)
        if(pos){
          slot_list.before(entries)
          mode= 'hi'
          gap = hi_space
          hi_space += `<span class="space${count}"><span class="hi">&nbsp;</span>${x.length ? '<span class="xhi">│</span>' : ''}&nbsp;&nbsp;</span>`
        }
        else{
          menu.after(entries)
          mode = 'lo'
          gap = lo_space
          lo_space += `<span class="space${count}"><span class="lo">&nbsp;</span>${x.length ? '<span class="xlo">│</span>' : ''}&nbsp;&nbsp;</span>`
        }
        style.innerHTML = `.space${count} > .x${mode}{display: none;}`
        els.push(slot_emo)
        space_handle.push(() => style.innerHTML = `.space${count}${slot_on ? ` > .x${mode}` : ''}{display: none;}`)
        if(!x.length){
          const space = document.createElement('span')
          space.innerHTML = '&nbsp;&nbsp;&nbsp;'
          return
        }
        slot_emo.classList.add('compact')

        slot_handle.push(() => {
          slot_emo.classList.add('on')
          style.innerHTML = `.space${count} > .${emo_on ? 'x' : ''}${mode}{display: none;}`
          // emo_on && space_handle[i]()
          slot_check[j] = emo_on = !emo_on
          if(slot_check[0] && slot_check[1])
            slot_emo.children[0].innerHTML = '┼'
          else if(slot_check[0] && !slot_check[1])
            slot_emo.children[0].innerHTML = '┴'
          else if(!slot_check[0] && slot_check[1])
            slot_emo.children[0].innerHTML = '┬'
          else{
            slot_emo.children[0].innerHTML = '─'
            slot_emo.classList.remove('on')
          }
          const ids = []
          x.forEach(slot => ids.push(...data[slot]))
          handle_click({space: gap, pos, el: entries, data: ids, ancestry, type: 'entry_compact' })
        })
      })
      if(getComputedStyle(slot_emo, '::before').content === 'none')
        slot_emo.innerHTML = `<span>─</span><span>${slot_no}─</span>`
    }
    async function type_click() {
      slot_on = !slot_on
      // if(status.xentry === type_emo)
      //   status.xentry = null
      // else{
      //   status.xentry?.click()
      //   status.xentry = type_emo
      // }
      slot_list.classList.toggle('on')
      let temp = element
      //Find path to root
      while(temp.tagName !== 'MAIN'){
        if(temp.classList.contains('entry')){
          slot_on ? temp.classList.add('on') : temp.classList.remove('on')
          while(temp.previousElementSibling){
            temp = temp.previousElementSibling
            slot_on ? temp.classList.add('on') : temp.classList.remove('on')
          }
        }
        temp = temp.parentElement
      }
      els.forEach((emo, i) => {
        if(!emo.classList.contains('on')){
          space_handle[i]()
        }
      })
      slot_handle[0] && slot_handle[0]()
      slot_handle[1] && slot_handle[1]()
    }
    async function menu_click({ emo, emo_on, ...rest }, i) {
      emo.onclick = () => {
        emo.classList.toggle('on')
        emo_on = !emo_on
        handle_click({space: lo_space, ...rest })
      }
    }
  }
  function add_entry ({ hub_el, data, first, last, space = '', pos, ancestry }) {
    //Init
    const element = html_template(data, last, space, pos)
    !status.entry_types[data.type] && (status.entry_types[data.type] = Object.keys(status.entry_types).length)
    ancestry = [...ancestry]
    let lo_space = space + (last ? '&nbsp;&nbsp;&nbsp;' : '│&nbsp;&nbsp;')
    let hi_space = space + (first ? '&nbsp;&nbsp;&nbsp;' : '│&nbsp;&nbsp;')
    const space_handle = [], els = []
    let slot_no = 0, slot_on

    //HTML
    element.innerHTML = `
      <div class="slot_list">
        <span class="space odd"><!--
        -->${space}<span>${last ? '└' : first ? "┌" : '├'}</span><!--
        --><span class='on'>${last ? '┗' : first ? "┏" : '┠'}</span>
        </span><!--
        --><span class="menu_emo"></span><!--
        --><span class="type_emo odd"></span><!--
        --><span class="name odd">${data.name}</span>
      </div>
      <div class="menu entries"></div>
    `

    //Unavoidable mix
    const slot_list = element.querySelector('.slot_list')
    const name = element.querySelector('.slot_list > .name')
    hub_el.append(element)
    const copies = main.querySelectorAll('.a'+data.id + '> .slot_list')
    if(copies.length > 1){
      copies.forEach(copy => !copy.previousElementSibling && (copy.style.color = '#000000'))
    }
    if(ancestry.includes(data.id)){
      name.onclick = () => {
        const copies = main.querySelectorAll('.a'+data.id + '> .slot_list')
        copies.forEach((copy, i) => {
          if(copy === slot_list)
            return
          const temp1 = copy.style.color
          const temp2 = copy.style.backgroundColor
          copy.style.color = '#fff'
          copy.style.backgroundColor = '#000000'
          setTimeout(() => {
            copy.style.color = temp1
            copy.style.backgroundColor = temp2
          }, 1000)
        })
      }
      return
    }
    ancestry.push(data.id)

    //Elements
    const menu_emo = element.querySelector('.slot_list > .menu_emo')
    const type_emo = element.querySelector('.slot_list > .type_emo')
    const space_emo = element.querySelector('.slot_list > .space')
    const menu = element.querySelector('.menu')

    //Listeners
    space_emo.onclick = () => type_click(0)
    type_emo.onclick = () => type_click(1)
    name.onclick = () => send({ type: 'click', to: hub_id, data })
    const slotmap = []
    const data_keys = Object.keys(data)
    const new_pair = [[], []]
    const slot_handle = []
    let check = false
    default_slots.forEach(pair => {
      pair.forEach((slot, i) => {
        if(data_keys.includes(slot)){
          new_pair[i].push(slot)
          check = true
        }
      })
    })
    check && slotmap.push(new_pair)
    slotmap.forEach(handle_slot)
    menu_click({el: menu, emo: menu_emo, data: status.menu_ids, pos: 0, type: 'menu'})
    if(getComputedStyle(type_emo, '::before').content === 'none')
      type_emo.innerHTML = `[${status.entry_types[data.type]}]`

    //Procedures
    async function handle_slot (pair, i) {
      const slot_check = [false, false]
      const slot_emo = document.createElement('span')
      slot_emo.innerHTML = '<span></span><span>─</span>'
      menu_emo.before(slot_emo)
      slot_no++

      pair.forEach((x, j) => {
        let gap, mode, emo_on
        const pos = !j
        const count = status.count++
        const style = document.createElement('style')
        const entries = document.createElement('div')
        entries.classList.add('entries')

        element.append(style)
        if(pos){
          slot_list.before(entries)
          mode= 'hi'
          gap = hi_space
          hi_space += `<span class="space${count}"><span class="hi">&nbsp;</span>${x.length ? '<span class="xhi">│</span>' : ''}&nbsp;&nbsp;</span>`
        }
        else{
          menu.after(entries)
          mode = 'lo'
          gap = lo_space
          lo_space += `<span class="space${count}"><span class="lo">&nbsp;</span>${x.length ? '<span class="xlo">│</span>' : ''}&nbsp;&nbsp;</span>`
        }
        style.innerHTML = `.space${count} > .x${mode}{display: none;}`
        els.push(slot_emo)
        space_handle.push(() => style.innerHTML = `.space${count}${slot_on ? ` > .x${mode}` : ''}{display: none;}`)
        if(!x.length){
          const space = document.createElement('span')
          space.innerHTML = '&nbsp;&nbsp;&nbsp;'
          return
        }
        slot_emo.classList.add('compact')

        slot_handle.push(() => {
          slot_emo.classList.add('on')
          style.innerHTML = `.space${count} > .${emo_on ? 'x' : ''}${mode}{display: none;}`
          // emo_on && space_handle[i]()
          slot_check[j] = emo_on = !emo_on
          if(slot_check[0] && slot_check[1])
            slot_emo.children[1].innerHTML = '┼'
          else if(slot_check[0] && !slot_check[1])
            slot_emo.children[1].innerHTML = '┴'
          else if(!slot_check[0] && slot_check[1])
            slot_emo.children[1].innerHTML = '┬'
          else{
            slot_emo.children[1].innerHTML = '─'
            slot_emo.classList.remove('on')
          }
          const ids = []
          x.forEach(slot => ids.push(...data[slot]))
          handle_click({space: gap, pos, el: entries, data: ids, ancestry })
        })
      })
      if(getComputedStyle(slot_emo, '::before').content === 'none')
        slot_emo.innerHTML = `<span>${slot_no}─</span><span>─</span>`
    }
    async function type_click(i) {
      slot_on = !slot_on
      // if(status.xentry === type_emo)
      //   status.xentry = null
      // else{
      //   status.xentry?.click()
      //   status.xentry = type_emo
      // }
      slot_list.classList.toggle('on')
      let temp = element
      //Find path to root
      while(temp.tagName !== 'MAIN'){
        if(temp.classList.contains('entry')){
          slot_on ? temp.classList.add('on') : temp.classList.remove('on')
          while(temp.previousElementSibling){
            temp = temp.previousElementSibling
            slot_on ? temp.classList.add('on') : temp.classList.remove('on')
          }
        }
        temp = temp.parentElement
      }
      els.forEach((emo, i) => {
        if(!emo.classList.contains('on')){
          space_handle[i]()
        }
      })
      // slot_handle[0] && slot_handle[0]()
      slot_handle[i] && slot_handle[i]()
    }

    async function menu_click({ emo, emo_on, ...rest }, i) {
      emo.onclick = () => {
        emo.classList.toggle('on')
        emo_on = !emo_on
        handle_click({space: lo_space, ...rest })
      }
    }
  }
  // async function add_node_data (name, type, parent_id, users, author){
  //   const node_id = status.graph.length
  //   status.graph.push({ id: node_id, name, type: state.code_words[type], room: {}, users })
  //   if(parent_id){
  //     save_msg({
  //         head: [id],
  //         type: 'save_msg',
  //         data: {username: 'system', content: author + ' added ' + type.slice(0,-1)+': '+name, chat_id: parent_id}
  //       })
  //     //Add a message in the chat
  //     if(state.chat_task && parent_id === state.chat_task.id.slice(1))
  //       channel_up.send({
  //         head: [id, channel_up.send.id, channel_up.mid++],
  //         type: 'render_msg',
  //         data: {username: 'system', content: author+' added '+type.slice(0,-1)+': '+name}
  //       })
  //     const sub_nodes = graph[parent_id][state.add_words[type]]
  //     sub_nodes ? sub_nodes.push(node_id) : graph[parent_id][state.add_words[type]] = [node_id]
  //   }
  //   else{
  //     graph[node_id].root = true
  //     graph[node_id].users = [opts.host]
  //   }
  //   save_msg({
  //     head: [id],
  //     type: 'save_msg',
  //     data: {username: 'system', content: author + ' created ' + type.slice(0,-1)+': '+name, chat_id: node_id}
  //   })
  //   const channel = state.net[state.aka.taskdb]
  //   channel.send({
  //     head: [id, channel.send.id, channel.mid++],
  //     type: 'set',
  //     data: graph
  //   })
    
  // }
  // async function on_add_node (data) {
  //   const node = data.id ? shadow.querySelector('#a' + data.id + ' > .'+data.type) : main
  //   node && node.children.length && add_el({ data: { name: data.name, id: status.graph.length, type: state.code_words[data.type] }, parent: node, grand_last: data.grand_last, type: data.type, space: data.space })
  //   add_node_data(data.name, data.type, data.id, data.users, data.user)
  // }
  /******************************************
   Event handlers
  ******************************************/
  function handle_focus (e) {
    state.xtask = e.target
    state.xtask.classList.add('focus')
    state.xtask.addEventListener('blur', e => {
      if(e.relatedTarget && e.relatedTarget.classList.contains('noblur'))
        return
      state.xtask.classList.remove('focus')
      state.xtask = undefined
    }, { once: true })
  }
  function handle_popup (e) {
    const el = e.target
    el.classList.add('show')
    popup.style.top = el.offsetTop - 20 + 'px'
    popup.style.left = el.offsetLeft - 56 + 'px'
    popup.focus()
    popup.addEventListener('blur', () => {
      el.classList.remove('show')
    }, { once: true })
  }
  function handle_click ({ el, data, pos, hub_id, type = 'entry', ...rest }) {
    el.classList.toggle('show')
    if(data && el.children.length < 1){
      length = data.length - 1
      data.forEach((value, i) => on_add[type]({ hub_el: el, data: {...status.graph[value], hub_id}, first: pos ? 0 === i : false, last: pos ? false : length === i, pos, ...rest }))
    }
  }
  async function handle_export () {
    const data = await traverse( state.xtask.id.slice(1) )
    download_json(data)
  }
  async function handle_add (data) {
    data = data.slice(2).trim().toLowerCase() + 's'
    const input = document.createElement('input')
    let node, task_id, space = '', grand_last = true, root = true
    //expand other siblings
    if(state.xtask){
      node = state.xtask.querySelector('.' + data)
      task_id = state.xtask.id.slice(1)
      const before = state.xtask.querySelector('.' + data.slice(0,3))
      before.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable: true, view: window}))
      node.classList.add('show')
      grand_last = state.xtask.dataset.grand_last
      space = state.xtask.dataset.space
      state.xtask.classList.remove('focus')
      state.xtask = undefined
      root = false
    }
    else{
      node = main
      task_id = ''
    }
    node.prepend(input)
    input.onkeydown = async (event) => {
      if (event.key === 'Enter') {
        input.blur()
        add_el({ data : { name: input.value, id: status.graph.length, type: state.code_words[data], root }, space, grand_last, type: data, parent: node })
        const users = task_id ? graph[task_id].users : [host]
        add_node_data(input.value, data, task_id, users, host)
        //sync with other users
        if(users.length > 1)
          channel_up.send({
            head: [id, channel_up.send.id, channel_up.mid++],
            type: 'send',
            data: {to: 'task_explorer', route: ['up', 'task_explorer'], users: graph[task_id].users.filter(user => user !== host), type: 'on_add_node', data: {name: input.value, id: task_id, type: data, users, grand_last, space, user: host} }
          })
      }
    }
    input.focus()
    input.onblur = () => input.remove()
  }
  /******************************************
   Tree traversal
  ******************************************/
  async function jump (e){
    let target_id = e.currentTarget.dataset.id
    const el = main.querySelector('#a'+target_id)
    if(el)
      el.focus()
    else{
      const path = []
      let temp
      for(temp = status.graph[target_id]; temp.hub; temp = status.graph[temp.hub[0]])
        path.push(temp.id)
      temp = main.querySelector('#a'+temp.id)
      target_id = 'a'+target_id
      while(temp.id !== target_id){
        const sub_emo = temp.querySelector('.sub_emo')
        sub_emo.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable: true, view: window}))
        temp.classList.add('show')
        temp = temp.querySelector('#a'+path.pop())
      }
      temp.focus()
    }
      
  }
  async function traverse (id) {
    state.result = []
    state.track = []
    recurse(id)
    return state.result
  }
  function recurse (id){
    if(state.track.includes(id))
      return
    state.result.push(graph[id])
    state.track.push(id)
    for(temp = 0; graph[id].sub && temp < graph[id].sub.length; temp++)
      recurse(graph[id].sub[temp])
    for(temp = 0; graph[id].inputs && temp < graph[id].inputs.length; temp++)
      recurse(graph[id].inputs[temp])
    for(temp = 0; graph[id].outputs && temp < graph[id].outputs.length; temp++)
      recurse(graph[id].outputs[temp])
  }
  /******************************************
   Communication
  ******************************************/
  async function scroll () {
    el.scrollIntoView({behavior: 'smooth'})
    el.tabIndex = '0'
    el.focus()
    el.onblur = () => {
      el.tabIndex = '-1'
      el.onblur = null
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
}
}).call(this)}).call(this,"/src/node_modules/graph_explorer/graph_explorer.js")
},{"STATE":3,"helper":7,"io":10,"localdb":12}],7:[function(require,module,exports){
function copy (selection) {
  const range = selection.getRangeAt(0)
  const selectedElements = []
  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_ELEMENT,
    {
        acceptNode: function(node) {
            return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        }
    },
    false
  )

  while (walker.nextNode()) {
      walker.currentNode.tagName === 'SPAN' && selectedElements.push(walker.currentNode)
  }
  let text = ''
  selectedElements.forEach(el => {
    const before = getComputedStyle(el, '::before').content
    text += (before === 'none' ? '' : before.slice(1, -1)) + el.textContent
    text += el.classList.contains('name') ? '\n' : ''
  })
  return text
}
function get_color () {
  const letters = 'CDEF89'
  let color = '#'
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)]
  }
  return color;
}
function download_json (data) {
  const json_string = JSON.stringify(data, null, 2);
  const blob = new Blob([json_string], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'data.json';
  link.click();
}
module.exports = {copy, get_color, download_json}
},{}],8:[function(require,module,exports){
const loadSVG = require('loadSVG')

function graphic(className, url) {
  
  return new Promise((resolve, reject) => {
    const el = document.createElement('div')
    el.classList.add(className)
    loadSVG(url, (err, svg) => {
      if (err) return console.error(err)
      el.append(svg)
      resolve(el)
    })
  })
}   

module.exports = graphic
},{"loadSVG":11}],9:[function(require,module,exports){
(function (__filename){(function (){
const graphic = require('graphic')
const Rellax = require('rellax')
const IO = require('io')
const STATE = require('STATE')
const name = 'header'
const statedb = STATE(__filename)
const shopts = { mode: 'closed' }
/******************************************************************************
  HEADER COMPONENT
******************************************************************************/

// ----------------------------------------
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)
function fallback_module () { 
  return {}
}
function fallback_instance () {
  return {
    inputs: {
      'header.css': {
        $ref: new URL('src/node_modules/css/default/header.css', location).href
      },
      "header.json": {
        data: {
          "title": "Infrastructure for the next-generation Internet"
        }
      }
    }
  }
}
module.exports = header

async function header (opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid)
  const on = {
    css: inject,
    json: fill,
    scroll
  }
  const send = await IO(id, name, on)
  // ----------------------------------------
  // OPTS
  // ----------------------------------------
  var graphics = [
    graphic('playIsland', './src/node_modules/assets/svg/play-island.svg'),
    graphic('sun', './src/node_modules/assets/svg/sun.svg'),
    graphic('cloud1', './src/node_modules/assets/svg/cloud.svg'),
    graphic('cloud2', './src/node_modules/assets/svg/cloud.svg'),
    graphic('cloud3', './src/node_modules/assets/svg/cloud.svg'),
    graphic('cloud4', './src/node_modules/assets/svg/cloud.svg'),
    graphic('cloud5', './src/node_modules/assets/svg/cloud.svg'),
    graphic('cloud6', './src/node_modules/assets/svg/cloud.svg'),
    graphic('cloud7', './src/node_modules/assets/svg/cloud.svg'),
  ]

  const [playIsland, sun, cloud1, cloud2, cloud3, cloud4, cloud5, cloud6, cloud7] = await Promise.all(graphics)

  // Parallax effects
  // let playRellax = new Rellax(playIsland, { speed: 2 })
  let sunRellax = new Rellax(sun, { speed: 2 })
  let cloud1Rellax = new Rellax(cloud1, { speed: 4 })
  let cloud2Rellax = new Rellax(cloud2, { speed: 2 })
  let cloud3Rellax = new Rellax(cloud3, { speed: 4 })
  let cloud4Rellax = new Rellax(cloud4, { speed: 2 })
  let cloud5Rellax = new Rellax(cloud5, { speed: 4 })
  let cloud6Rellax = new Rellax(cloud6, { speed: 3 })
  let cloud7Rellax = new Rellax(cloud7, { speed: 3 })
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
  <div class='header'>
      <h1 class='title'></h1>
      <section class='scene'>
          <div class='sunCloud'>
          </div>
      </section>
  </div>
  <style></style>`
  // ----------------------------------------
  const style = shadow.querySelector('style')
  const scene = shadow.querySelector('.scene')
  const sunCloud = shadow.querySelector('.sunCloud')
  const title = shadow.querySelector('.title')
  await sdb.watch(onbatch)
  scene.append(cloud3, cloud4, cloud5, cloud6, cloud7, playIsland)
  sunCloud.append(cloud1, sun, cloud2)
  
  return el

  function onbatch(batch) {
    for (const {type, data} of batch) {
      on[type](data)
    }  
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
  async function fill ([ opts ]) {
    title.innerHTML = opts.title
  }
  async function scroll () {
    el.scrollIntoView({behavior: 'smooth'})
    el.tabIndex = '0'
    el.focus()
    el.onblur = () => {
      el.tabIndex = '-1'
      el.onblur = null
    }
  }
}


}).call(this)}).call(this,"/src/node_modules/header/header.js")
},{"STATE":3,"graphic":8,"io":10,"rellax":1}],10:[function(require,module,exports){
const ports = {}
const graph = {}
let timer
module.exports = io
async function io(id, name, on) {
  const on_rx = {
    on: {init}
  }
  ports[id] = { id, name, on}
  timer && clearTimeout(timer)
  timer = setTimeout(init, 1000)
  return send

  async function send(data) {
    const port = ports[data.to] || ports[await find_id(data.to)] || on_rx
    return port.on[data.type](data)
  }
  async function find_id (name){
    return (Object.values(ports).filter(node => node.name === name)[0] || {id: undefined}).id
  }
  async function init() {
    ports[await find_id('theme_widget')]?.on['refresh']()
  }
}
},{}],11:[function(require,module,exports){
async function loadSVG (url, done) { 
    const parser = document.createElement('div')
    let response = await fetch(url)
    if (response.status == 200) {
      let svg = await response.text()
      parser.innerHTML = svg
      return done(null, parser.children[0])
    }
    throw new Error(response.status)
}

module.exports = loadSVG
},{}],12:[function(require,module,exports){
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
    const data = JSON.parse(localStorage[keys[0]])
    let temp = data
    keys.slice(1).forEach(key => {
      temp = temp[key]
    })
    temp.push(value)
    localStorage[keys[0]] = JSON.stringify(data)
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
},{}],13:[function(require,module,exports){
(function (__filename){(function (){
/******************************************************************************
  STATE
******************************************************************************/
const STATE = require('STATE')
const name = 'theme_editor'
const statedb = STATE(__filename)
// ----------------------------------------
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)
function fallback_module () { 
  return {}
}
function fallback_instance () {
  return {
    inputs: {
      'theme_editor.css': {
        $ref: new URL('src/node_modules/css/default/theme_editor.css', location).href
      }
    }
  }
}
/******************************************************************************
  THEME_EDITOR COMPONENT
******************************************************************************/
const DB = require('localdb')
const IO = require('io')
// ----------------------------------------
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = theme_editor
async function theme_editor (opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const status = { tab_id: 0 }
  const db = DB()
  const on = {
    init,
    hide,
    css: inject
  }
  const {xget} = sdb.req_access(opts.sid)
  const send = await IO(id, name, on)
  
  status.themes = {
    builtin: Object.keys(opts.paths),
    saved: Object.keys(JSON.parse(localStorage.index || (localStorage.index = '{}')))
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  const style = document.createElement('style')
  await sdb.watch(onbatch)

  shadow.innerHTML = `
  <main>
    <div class="content">
    </div>
    <div class="relative">
      <input list="themes" class="theme" placeholder='Enter theme' />
      <div id="themes" class="theme"></div>
    </div>
    <button class="load single">
      Load
    </button>
    <button class="inject">
      Inject
    </button>
    <button class="save_file single">
      Save file
    </button>
    <button class="save_pref">
      Save pref
    </button>
    <button class="drop_theme single">
      Drop theme
    </button>
    <button class="drop_file single">
      Drop file
    </button>
    <button class="reset single">
      Reset
    </button>
    <button class="export single">
      Export
    </button>
    <button class="import single">
      Import
    </button>
    <input style="display: none;" class="upload" type='file' />
    <button class="add">
      Add
    </button>
    <h3>
    </h3>
    <div class="tabs">
      <div class="box"></div>
      <span class="plus">+</span>
    </div>
  </main>`
  const main = shadow.querySelector('main')
  const inject_btn = shadow.querySelector('.inject')
  const load_btn = shadow.querySelector('.load')
  const save_file_btn = shadow.querySelector('.save_file')
  const save_pref_btn = shadow.querySelector('.save_pref')
  const add_btn = shadow.querySelector('.add')
  const drop_theme_btn = shadow.querySelector('.drop_theme')
  const drop_file_btn = shadow.querySelector('.drop_file')
  const reset_btn = shadow.querySelector('.reset')
  const upload = shadow.querySelector('.upload')
  const import_btn = shadow.querySelector('.import')
  const export_btn = shadow.querySelector('.export')
  const title = shadow.querySelector('h3')
  const content = shadow.querySelector('.content')
  const tabs = shadow.querySelector('.tabs > .box')
  const plus = shadow.querySelector('.plus')
  const select_theme = shadow.querySelector('div.theme')
  const input = shadow.querySelector('input.theme')

  input.onfocus = () => select_theme.classList.add('active')
  input.onblur = () => setTimeout(() => select_theme.classList.remove('active'), 200)
  input.oninput = update_select_theme
  inject_btn.onclick = on_inject
  load_btn.onclick = () => load(input.value, false)
  save_file_btn.onclick = save_file
  save_pref_btn.onclick = save_pref
  add_btn.onclick = () => add(input.value)
  drop_theme_btn.onclick = drop_theme
  drop_file_btn.onclick = drop_file
  export_btn.onclick = export_fn
  import_btn.onclick = () => upload.click()
  upload.onchange = import_fn
  reset_btn.onclick = () => {localStorage.clear(), location.reload()}
  plus.onclick = () => add_tab('New')
  shadow.append(style)
  update_select_theme()
  
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }  
  }
  async function hide () {
    main.classList.toggle('select')
    status.select = !status.select
  }
  async function export_fn () {
    const theme = db.read([ input.value ])
    const index = db.read([ 'index', input.value ])
    const blob = new Blob([JSON.stringify({theme, index}, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = input.value
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  async function import_fn () {
    const file = upload.files[0]
    const name = file.name.split('.')[0]
    await add(name)
    const reader = new FileReader()
    reader.onload = e => {
      const blob = JSON.parse(e.target.result)
      db.add([name], blob.theme)
      db.add(['index', name], blob.index)
      load(name)
    }
    reader.readAsText(file)
  }
  async function add (theme) {
    db.add([theme], [])
    status.themes.saved.push(theme)
    db.add(['index', theme], [])
    update_select_theme()
  }
  async function drop_theme () {
    db.drop([input.value])
    db.drop(['index', input.value])
    status.themes.saved = status.themes.saved.filter(v => v != input.value)
    update_select_theme()
    input.value = 'default'
    load('default')
  }
  async function drop_file () {
    db.drop([status.active_tab.dataset.theme, status.active_tab.dataset.id])
    db.drop(['index', status.active_tab.dataset.theme, status.active_tab.dataset.id])
    close_tab(status.active_tab)
  }
  async function forget_changes () {
    status.active_el.classList.remove('dirty')
    const dirt = JSON.parse(localStorage.dirt)
    delete(dirt[status.title])
    localStorage.dirt = JSON.stringify(dirt)
  }
  async function save_file () {
    // forget_changes()
    if(db.read([input.value])){
      db.push(['index', input.value], status.active_tab.dataset.name)
      db.push([input.value], status.textarea.value)
    }
  }
  async function save_pref () {
    const pref = db.read(['pref'])
    if(status.select){
      var ids = await get_select()
      ids.forEach(id => pref[id] = [])
    }
    pref[status.instance_id] = []
    pref[status.title] = []
    Array.from(tabs.children).forEach(tab => {
      if(tab.dataset.access === "uniq"){
        if(ids)
          ids.forEach(id => 
          pref[id].push({theme: tab.dataset.theme, id: tab.dataset.id, local: status.themes.builtin.includes(tab.dataset.theme)})
        )
        else
          pref[status.instance_id].push({theme: tab.dataset.theme, id: tab.dataset.id, local: status.themes.builtin.includes(tab.dataset.theme)})
      }
      else
        pref[status.title].push({theme: tab.dataset.theme, id: tab.dataset.id, local: status.themes.builtin.includes(tab.dataset.theme) })
    })
    db.add(['pref'], pref)
  }
  async function unsave () {
    status.active_el.classList.add('dirty')
    let theme = localStorage[input.value] && JSON.parse(localStorage[input.value])
    if(theme){
      theme.css[status.title] = textarea.value
      localStorage[input.value] = JSON.stringify(theme)
      const dirt = JSON.parse(localStorage.dirt)
      dirt[status.title] = input.value
      localStorage.dirt = JSON.stringify(dirt)
    }
    else{
      const name = input.value + '*'
      theme = localStorage[name] && JSON.parse(localStorage[name])
      if(theme){
        theme.css[status.title] = textarea.value
        localStorage[name] = JSON.stringify(theme)
        const dirt = JSON.parse(localStorage.dirt)
        dirt[status.title] = name
        localStorage.dirt = JSON.stringify(dirt)
      }
      else{
        theme = { theme: true, css: {} }
        theme.css[status.title] = textarea.value
        localStorage[name] = JSON.stringify(theme)
        status.themes.saved.push(name)
        const dirt = JSON.parse(localStorage.dirt)
        dirt[status.title] = name
        localStorage.dirt = JSON.stringify(dirt)
        update_select_theme()
        input.value = name
      }
    }
  }
  async function on_inject () {
    if(status.active_tab.dataset.type === 'json'){
      const id = add_data(status.textarea.value)
      const hub = xget(xget(id).hub).id
      send({type: 'refresh', to: hub})
    }
    else{
      if(status.select){
        const ids = await get_select()
        ids.forEach(id => {
          send({ type: 'inject', to: id, data: status.textarea.value })
        })
      }
      else
        send({ type: 'inject', to: status.node_data.hub_id, data: status.textarea.value })
    }
  }
  async function get_select () {
    return await send({ type: 'get_select', to: 'theme_widget'})
  }
  async function load (theme, clear = true) {
    if(clear){
      content.innerHTML = ''
      tabs.innerHTML = ''
    }
    if(status.themes.builtin.includes(theme)){
      const index = opts.paths[theme].length
      for(let i = 0; i < index; i++){
        const temp = await fetch(`./src/node_modules/css/${theme}/${i}.css`)
        add_tab(i, await temp.text(), '', theme, status.title)
      }
    }
    else{
      const temp = db.read([theme])
      temp.forEach((file, i) => {
          add_tab(i, file, '', theme, status.title)
      })
    }
    // forget_changes()
  }
  async function init ({ data }) {
    title.innerHTML = data.id
    status.title = data.type
    status.instance_id = data.id
    let value = data.file ? db.read([data.xtype, data.id]) : data
    if(data.type === 'json' || !data.file)
      value = JSON.stringify(value, null, 2)
    add_tab(data.name, value)
  }
  async function add_tab (id, value = '', access = 'uniq', theme = 'default') {
    if(id === 'New' && status.themes.builtin.includes(theme)){
      theme += '*'
      add(theme)
    }
    const tab = document.createElement('span')
    const tab_id = '_' + status.tab_id++
    tab.id = tab_id
    const index = opts.paths[theme] || db.read(['index', theme])
    tabs.append(tab)
    const btn = document.createElement('span')
    btn.innerHTML = index[id] || id
    tab.dataset.id = id
    tab.dataset.name = btn.innerHTML
    tab.dataset.theme = theme
    tab.dataset.access = access
    btn.onclick = () => switch_tab(tab.id)
    btn.ondblclick = rename
    const btn_x = document.createElement('span')
    btn_x.innerHTML = 'x'
    tab.append(btn, btn_x)
    tab.tabIndex = '0'
    tab.onkeydown = e => {
      if(e.key === 'ArrowRight' && tab.nextElementSibling)
        tab.nextElementSibling.after(tab)
      else if(e.key === 'ArrowLeft' && tab.previousElementSibling)
        tab.previousElementSibling.before(tab)
      tab.focus()
    }
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.id = tab_id
    content.append(textarea)
    btn_x.onclick = () => close_tab(tab)
    switch_tab(tab_id)
  }
  async function close_tab (tab) {
    content.querySelector('#' + tab.id).remove()
    tab.remove()
    if(tabs.children.length)
      switch_tab(tabs.children[tabs.children.length - 1].id)
    else
      add_tab('New')
  }
  async function switch_tab (tab_id) {
    status.textarea && status.textarea.classList.remove('active')
    status.textarea = content.querySelector('#' + tab_id)
    status.textarea.classList.add('active')
    status.active_tab && status.active_tab.classList.remove('active')
    status.active_tab = tabs.querySelector('#' + tab_id)
    status.active_tab.classList.add('active')
    status.active_tab.focus()
    input.value = status.active_tab.dataset.theme
  }
  async function rename (e) {
    const btn = e.target
    const hub = btn.parentElement
    const input = document.createElement('input')
    input.value = btn.innerHTML
    btn.innerHTML = ''
    btn.append(input)
    input.onkeydown = e => {
      if(e.key === 'Enter'){
        btn.innerHTML = input.value
        db.add([hub.dataset.theme, hub.dataset.id], input.value)
      }
    }
    input.onblur = e => {
      if(e.relatedTarget)
        btn.innerHTML = hub.dataset.name
    }
    input.focus()
  }
  async function update_select_theme () {
    const builtin = document.createElement('div')
    builtin.classList.add('cat')
    status.themes.builtin.forEach(theme => {
      const el = document.createElement('div')
      el.innerHTML = theme
      el.onclick = () => input.value = theme
      theme.includes(input.value) && builtin.append(el)
    })
    builtin.innerHTML && builtin.insertAdjacentHTML('afterbegin', '<b>builtin</b>')
    const saved = document.createElement('div')
    saved.classList.add('cat')
    status.themes.saved.forEach(theme => {
      const el = document.createElement('div')
      el.innerHTML = theme
      el.onclick = () => input.value = theme
      theme.includes(input.value) && saved.append(el)
    })
    saved.innerHTML && saved.insertAdjacentHTML('afterbegin', '<b>saved</b>')
    select_theme.innerHTML = ''
    select_theme.append(builtin, saved)
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
}

}).call(this)}).call(this,"/src/node_modules/theme_editor/theme_editor.js")
},{"STATE":3,"io":10,"localdb":12}],14:[function(require,module,exports){
(function (__filename){(function (){
/******************************************************************************
  STATE
******************************************************************************/
const STATE = require('STATE')
const name = 'theme_widget'
const statedb = STATE(__filename)
const shopts = { mode: 'closed' }
// ----------------------------------------
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)
function fallback_module () { 
  return {
    _: {
      'theme_editor': {},
      'graph_explorer': {}
    }
  }
}
function fallback_instance () {
  return {
    _: {
      'theme_editor': {},
      'graph_explorer': {}
    },
    inputs: {
      'theme_widget.css': {
        $ref: new URL('src/node_modules/css/default/theme_widget.css', location).href
      }
    }
  }
}
/******************************************************************************
  THEME_WIDGET COMPONENT
******************************************************************************/
const theme_editor = require('theme_editor')
const graph_explorer = require('graph_explorer')
const IO = require('io')
// ----------------------------------------
module.exports = theme_widget

async function theme_widget (opts) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const { id, sdb } = await get(opts.sid) // hub is "parent's" io "id" to send/receive messages
  const status = { tab_id: 0, init_check: true }
  const on = {
    refresh,
    get_select,
    css: inject,
    scroll,
    click
  }
  const {get_all} = sdb.req_access(opts.sid)
  const send = await IO(id, name, on)

  status.clickables = ['css', 'json', 'js']
  status.dirts = JSON.parse(localStorage.dirt || (localStorage.dirt = '{}'))
  localStorage.pref || (localStorage.pref = '{}')
  const paths =  JSON.parse(await(await fetch('./src/node_modules/css/index.json')).text())
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  shadow.innerHTML = `
  <section>
    <div class="btn">
      ⚙️
    </div>
    <div class="popup">
      <div class="box">
        <span class="stats">
          Entries: 
        </span>
        <button class="select">Select</button>
        <input min="0" max="100" value="75" type="range"/>
      </div>
      <div class="editor">
      </div>
    </div>
  </section>
  <style></style>`
  const style = shadow.querySelector('style')
  const btn = shadow.querySelector('.btn')
  const popup = shadow.querySelector('.popup')
  const box = popup.querySelector('.box')
  const list = box.querySelector('.list')
  const editor = popup.querySelector('.editor')
  const stats = box.querySelector('.stats')
  const select = box.querySelector('.select')
  const slider = box.querySelector('input')

  const theme_editor_sub = sdb.get_sub('theme_editor')
  const graph_explorer_sub = sdb.get_sub('graph_explorer')
  await sdb.watch(onbatch)

  editor.append(await theme_editor({ sid: theme_editor_sub[0].sid, hub: [id], paths }))
  box.prepend(await graph_explorer({ sid: graph_explorer_sub[0].sid, hub: [id] }))
  select.onclick = on_select
  slider.oninput = blur
  return el

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }  
  }
  async function blur(e) {
    popup.style.opacity = e.target.value/100
  }
  async function on_select () {
    list.classList.toggle('active')
    send({to: 'theme_editor', type: 'hide'})
  }
  async function get_select () {
    const inputs = list.querySelectorAll('input')
    const output = []
    inputs.forEach(el => el.checked && output.push(el.nextElementSibling.id))
    send({type: 'send', to: 'theme_editor', data: output})
  }
  async function refresh () {
    const data = get_all()
    status.tree = data
    stats.innerHTML = `Entries: ${Object.keys(data).length}`
    btn.onclick = () => {
      popup.classList.toggle('active')
      status.init_check && send({type: 'init', to: 'graph_explorer' , data:status.tree})
      status.init_check = false
    }
  }
  async function click ({ data }) {
    send({ to: 'theme_editor', type: 'init', data})
    status.active_el && status.active_el.classList.remove('active')
    if(status.instance_id === data.id)
      editor.classList.toggle('active')
    else{
      editor.classList.add('active')
      el.classList.add('active')
    }
    status.instance_id = data.id
    status.active_el = el
  }
  async function scroll () {
    el.scrollIntoView({behavior: 'smooth'})
    el.tabIndex = '0'
    el.focus()
    el.onblur = () => {
      el.tabIndex = '-1'
      el.onblur = null
    }
  }
  async function inject (data){
    style.innerHTML = data.join('\n')
  }
}

}).call(this)}).call(this,"/src/node_modules/theme_widget/theme_widget.js")
},{"STATE":3,"graph_explorer":6,"io":10,"theme_editor":13}],15:[function(require,module,exports){
module.exports={
  "inputs": {
    "topnav.json": {
      "type": "content",
      "data": {
        "links": [
        {
          "id": "datdot",
          "text": "DatDot",
          "url": "datdot"
        },
        {
          "id": "editor",
          "text": "Play Editor",
          "url": "editor"
        },
        {
          "id": "smartcontract_codes",
          "text": "Smart Contract Codes",
          "url": "smartcontract_codes"
        },
        {
          "id": "supporters",
          "text": "Supporters",
          "url": "supporters"
        },
        {
          "id": "our_contributors",
          "text": "Contributors",
          "url": "our_contributors"
        }
      ]
      }
    }
  }

}
},{}],16:[function(require,module,exports){
(function (__filename){(function (){
/******************************************************************************
  STATE
******************************************************************************/
const STATE = require('STATE')
const name = 'topnav'
const statedb = STATE(__filename)
// ----------------------------------------
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)
function fallback_module () { 
	return {}
}
function fallback_instance () { 
	const data = require('./instance.json')
	data.inputs['topnav.css'] = {
		$ref: new URL('src/node_modules/css/default/topnav.css', location).href
	}
	return data 
}

/******************************************************************************
  OUR CONTRIBUTORS COMPONENT
******************************************************************************/
const graphic = require('graphic')
const IO = require('io')
// ----------------------------------------
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = topnav

async function topnav (opts) {
	// ----------------------------------------
	// ID + JSON STATE
	// ----------------------------------------
	const { id, sdb } = await get(opts.sid) 
	const status = {}
	const on = {
		css: inject,
		scroll,
		content: fill
	}
	
  const send = await IO(id, name, on)
	// ----------------------------------------
	// OPTS
	// ----------------------------------------

	const playLogo = await graphic('playLogo', './src/node_modules/assets/svg/logo.svg')
	// ----------------------------------------
	// TEMPLATE
	// ----------------------------------------
	const el = document.createElement('div')
	const shadow = el.attachShadow(shopts)
	shadow.innerHTML = `
		<section class='topnav'>
				<a href="#top">${playLogo.outerHTML}</a>
				<nav class='menu'>
				</nav>
		</section>
	<style></style>`
  const style = shadow.querySelector('style')
	const menu = shadow.querySelector('.menu')
	const body = shadow.querySelector('section')
	const scrollUp = 'scrollUp'
	const scrollDown = 'scrollDown'
	let lastScroll = 0
	
	window.addEventListener('scroll', ()=> {
		if (window.innerWidth >= 1024) {
			let currentScroll = window.pageYOffset
			if (currentScroll < 1) {
					body.classList.remove(scrollUp)
					body.classList.remove(scrollDown)
					return
			}
			if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
					body.classList.add(scrollDown)
					body.classList.remove(scrollUp)
			} else if (currentScroll < lastScroll) {
					body.classList.add(scrollUp)
					body.classList.remove(scrollDown)
			}
			lastScroll = currentScroll
		}
	})

	window.addEventListener('resize', ()=> {
		if (window.innerWidth <= 1024) {
			body.classList.remove(scrollUp)
			body.classList.remove(scrollDown)
		}
	})
	sdb.watch(onbatch)
  
	return el

	function onbatch(batch){
		for (const {type, data} of batch) {
      on[type](data)
    }  
	}
	async function inject (data){
		style.innerHTML = data.join('\n')
	}
	function fill ([ opts ]) { 
		menu.replaceChildren(...opts.links.map(make_link))
	}
	function click(url) {
		send({to:'index', type: 'jump', data: url })
	}
	function make_link(link){
		const a = document.createElement('a')
		a.href = `#${link.url}`
		a.textContent = link.text
		a.onclick = () => click(link.url)
		return a
	}
	async function scroll () {
		el.scrollIntoView({behavior: 'smooth'})
		el.tabIndex = '0'
		el.focus()
		el.onblur = () => {
			el.tabIndex = '-1'
			el.onblur = null
		}
	}
}

}).call(this)}).call(this,"/src/node_modules/topnav/topnav.js")
},{"./instance.json":15,"STATE":3,"graphic":8,"io":10}],17:[function(require,module,exports){
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
},{"./demo":18}],18:[function(require,module,exports){
(function (__filename,__dirname){(function (){
const STATE = require('../src/node_modules/STATE')
/******************************************************************************
  INITIALIZE PAGE
******************************************************************************/
const statedb = STATE(__filename)
const { sdb, subs: [get] } = statedb(fallback_module, fallback_instance)

const make_page = require('../src/app') 

function fallback_module () { // -> set database defaults or load from database
	return {
      admins: ["theme_editor", "theme_widget", "graph_explorer"],
      _: {
        "app": {}
      }
    }
  }
function fallback_instance () {
  return {
    _: {
      "app": {
        0: override
      }
    },
    inputs: {
      "demo.css": {
        $ref: new URL('src/node_modules/css/default/demo.css', location).href
      }
    }
  }
}
function override ([app], path) {
  const data = app()
  console.log(path._.app._.topnav)
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
  const [opts] = sdb.get_sub('app')
  const on = {
    css: inject,
  }
  sdb.watch(onbatch)
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

  function onbatch(batch){
    for (const {type, data} of batch) {
      on[type](data)
    }
  }
}
async function inject (data){
	sheet.replaceSync(data.join('\n'))
}
}).call(this)}).call(this,"/web/demo.js","/web")
},{"../src/app":2,"../src/node_modules/STATE":3}]},{},[17]);
