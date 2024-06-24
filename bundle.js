(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
(function (process,__filename){(function (){
const fetch_data = require('fetch-data')
const modules = {
 theme_widget : require('theme_widget'),
 topnav : require('topnav'),
 header : require('header'),
 datdot : require('datdot'),
 editor : require('editor'),
 smartcontract_codes : require('smartcontract_codes'),
 supporters : require('supporters'),
 our_contributors : require('our_contributors'),
 footer : require('footer'),
}
/******************************************************************************
  MAKE_PAGE COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------
const sheet = new CSSStyleSheet
sheet.replaceSync(get_theme())
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------

module.exports = make_page

async function make_page(opts, lang) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const id = `${ID}:${count++}` // assigns their own name
  const status = { tree: { } }
  const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {}, ports: {}} // all state of component instance
  const on_rx = {
    init_ch,
    req_ch,
    send,
    jump
  }
  status.id = 0
  // ----------------------------------------
  // OPTS
  // ----------------------------------------
  switch(lang) {
    case 'zh-tw':
    case 'ja':
    case 'th':
    case 'fr':
      var path = `./src/node_modules/lang/${lang}.json`
      break
    default:
      var path = `./src/node_modules/lang/en-us.json`
  }
  const text = await fetch_data(path)
  const data = text.pages
  const {theme} = opts
  
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  shadow.adoptedStyleSheets = [sheet]
  shadow.innerHTML = `
  <div id="top" class='wrap'>
  </div>`
  const main = shadow.querySelector('div')
  main.append(...await Promise.all(Object.entries(data).map(async entry => {
    const el = document.createElement('div')
    el.id = entry[0]
    const shadow = el.attachShadow(shopts)
    shadow.append(await modules[entry[0]](entry[1], init_ch({name: entry[0]})))
    return el
  })))
  update_theme_widget()
  return el
  
  function init_ch({ name, hub = '' }) {
    const ch = new MessageChannel()
    const id = status.id++
    state.ports[id] = ch.port1
    status.tree[id] = { name, hub }
    ch.port1.onmessage = event => {
      on_rx[event.data.type] && on_rx[event.data.type]({...event.data, by: id})
    }
    return ch.port2
  }
  function req_ch ({ by, data }) {
    const port = init_ch({ name: data, hub: by })
    state.ports[by].postMessage({ data: 'hi' }, [port])
  }
  function send ({ data, to, to_type, by }) {
    state.ports[to].postMessage({ data, type: to_type, by })
  }
  async function update_theme_widget () {
    state.ports[0].postMessage({ data: status.tree, type: 'refresh'})
  }
  async function jump ({ data }) {
    main.querySelector('#'+data).scrollIntoView({ behavior: 'smooth'})
  }
}

function get_theme() {
  return `
.wrap {
    background: var(--bodyBg);
}
[class^="cloud"] {
    transition: left 0.6s, bottom 0.5s, top 0.5s linear;
}`}

}).call(this)}).call(this,require('_process'),"/src/index.js")
},{"_process":1,"datdot":7,"editor":8,"fetch-data":9,"footer":10,"header":12,"our_contributors":14,"smartcontract_codes":15,"supporters":16,"theme_widget":17,"topnav":18}],4:[function(require,module,exports){
(function (process,__filename){(function (){
/******************************************************************************
  CONTENT COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------
const sheet = new CSSStyleSheet
sheet.replaceSync(get_theme())
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = content

function content(data, theme) {
    // ----------------------------------------
    // ID + JSON STATE
    // ----------------------------------------
    const id = `${ID}:${count++}` // assigns their own name
    const status = {}
    const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {} } // all state of component instance
    // ----------------------------------------
    // TEMPLATE
    // ----------------------------------------
    const el = document.createElement('div')
    el.classList.add('content')
    const shadow = el.attachShadow(shopts)
    shadow.adoptedStyleSheets = [sheet]
    shadow.innerHTML = `
    <div class="main">
        <h2 class="subTitle subTitleColor">${data.title}</h2>
        <article class=article>${data.article}</article>
        ${data.url ? `<a class="button buttonBg" href=${data.url} target="_blank">${data.action}</a>` : ''}
    </div>
    `
    return el
}

function get_theme () {
  return `
.main {
    text-align: center;
}
.subTitle {
    font-family: var(--titleFont);
    font-size: var(--subTitleSize);
    margin-bottom: 2.5rem;
}
.subTitleColor {
    color: var(--section2TitleColor);
}
.article {
    font-size: var(--articleSize);
    color: var(--articleColor);
    line-height: 2.5rem;
    padding-bottom: 4rem;
}
.button {
    display: inline-block;
    outline: none;
    border: none;
    font-family: var(--titleFont);
    font-size: var(--sectionButtonSize);
    color: var(--titleColor);
    border-radius: 2rem;
    padding: 1.2rem 3.8rem;
    cursor: pointer;
}
a {
    text-decoration: none;
}
.buttonBg {

}
@media screen and (min-width: 2561px) {
    .subTitle {
        font-size: calc(var(--subTitleSize) * 1.5);
    }
}
}
@media screen and (min-width: 4096px) {
    .subTitle {
        font-size: calc(var(--subTitleSize) * 2.25);
    }
}
@media screen and (max-width: 414px) {
    .subTitle {
        font-size: var(--titlesSizeS);
        margin-bottom: 1.5rem;
    }
}
`}
}).call(this)}).call(this,require('_process'),"/src/node_modules/content.js")
},{"_process":1}],5:[function(require,module,exports){
(function (process,__filename){(function (){
const Graphic = require('graphic')
/******************************************************************************
  CONTRIBUTOR COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------
const sheet = new CSSStyleSheet
sheet.replaceSync(get_theme())
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = contributor

async function contributor(person, className, port) {
    // ----------------------------------------
    // ID + JSON STATE
    // ----------------------------------------
    const id = `${ID}:${count++}` // assigns their own name
    const status = {}
    const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {} } // all state of component instance
    const lifeIsland = await Graphic('lifeIsland','./src/node_modules/assets/svg/life-island.svg')
    // ----------------------------------------
    // TEMPLATE
    // ----------------------------------------
    const el = document.createElement('div')
    const shadow = el.attachShadow(shopts)
    el.classList.add(className)
    shadow.adoptedStyleSheets = [sheet]
    shadow.innerHTML = `
      <div>
        <div class='member'>
          <img class='avatar' src=${person.avatar} alt=${person.name}>
          <div class='info'>
            <h3 class='name'>${person.name}</h3>
            ${person.careers &&
                person.careers.map( career =>
                    `<span class='career'>${career}</span>`
                )
            }
          </div>
        </div>
        ${lifeIsland.outerHTML}
      </div>
    `
    return el
}

function get_theme () {
  return `
.member {
    position: absolute;
    z-index: 1;
    display: grid;
    grid-template: 1fr / 40% 60%;
    width: 70%;
    top: 20%;
}
.avatar {
    position: relative;
    z-index: 2;
    width: 100%;
    height: auto;
}
.info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: var(--contributorsTextSize);
    text-align: center;
    background-color: var(--contributorsBg);
    padding: 0% 2% 4% 20%;
    margin-left: -20%;
}
.name {
    color: var(--section5TitleColor);
    margin-top: 0;
    margin-bottom: 3%;
}
.career {
    display: block;
    color: var(--contributorsCareerColor);
}
.lifeIsland {
    width: 100%;
}
@media only screen and (max-width: 1550px) {
    .member {
        width: 280px;
        top: 15%;
        left: -2vw;
    }
}
@media only screen and (max-width: 1200px) {
    .lifeIsland {
        width: 115%;
    }
}
@media only screen and (max-width: 1280px) {
    .member {
        top: 12%;
        left: -4vw;
    }
}

@media only screen and (max-width: 1130px) {
    .member {
        top: 1vw;
        left: -6vw;
    }
}
@media only screen and (max-width: 1024px) {
    .lifeIsland {
        width: 100%;
    }
    .member {
        width: 32vw;
        top: 6vw;
        left: -2vw;
    }
}
@media only screen and (max-width: 768px) {
    .member {
        width: 85%;
        top: 5vw;
        left: -4vw;
    }
}
@media only screen and (max-width: 640px) {
    .member {
        width: 75%;
        top: 9vw;
    }
}
@media only screen and (max-width: 414px) {
    .member {
        width: 90%;
        top: 5vw;
        left: -10vw;
    }
}
`
}


}).call(this)}).call(this,require('_process'),"/src/node_modules/contributor.js")
},{"_process":1,"graphic":11}],6:[function(require,module,exports){
(function (process,__filename){(function (){
/******************************************************************************
  SUPPORTERS COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------

const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = crystalIsland

async function crystalIsland({date, info}, deco, island, title) {
    // ----------------------------------------
    // ID + JSON STATE
    // ----------------------------------------
    const id = `${ID}:${count++}` // assigns their own name
    const status = {}
    const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {} } // all state of component instance
    // ----------------------------------------
    // OPTS
    // ----------------------------------------
    deco = await Promise.all(deco)
    // ----------------------------------------
    // TEMPLATE
    // ----------------------------------------
    const el = document.createElement('div')
    el.classList.add('scene')
    el.innerHTML = `
        <div class='deco'>
            <div class='content'>
                <h3>${date}</h3>
                ${ info === 'Coming soon' ? `<h3>${info}</h3>` : `<p>${info}</p>` }
            </div>
            ${title}
        </div>
    `
    // ----------------------------------------
    const deco_el = el.querySelector('.deco')
    el.append( island)
    deco_el.append(...deco)
    return el
}

module.exports = crystalIsland
}).call(this)}).call(this,require('_process'),"/src/node_modules/crystalIsland.js")
},{"_process":1}],7:[function(require,module,exports){
(function (process,__filename){(function (){
const graphic = require('graphic')
const Rellax = require('rellax')
const content = require('content')
/******************************************************************************
  DATDOT COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------
const sheet = new CSSStyleSheet
sheet.replaceSync(get_theme())
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = datdot

async function datdot(data) {
    // ----------------------------------------
    // ID + JSON STATE
    // ----------------------------------------
    const id = `${ID}:${count++}` // assigns their own name
    const status = {}
    const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {} } // all state of component instance
    // ----------------------------------------
    // OPTS
    // ----------------------------------------
    var graphics = [
      graphic('blockchainIsland', './src/node_modules/assets/svg/blockchian-island.svg'),
      graphic('blossomIsland', './src/node_modules/assets/svg/blossom-island.svg'),
      graphic('cloud1', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud2', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud3', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud4', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud5', './src/node_modules/assets/svg/cloud.svg'),
    ]

    const [blockchainIsland, blossomIsland, cloud1, cloud2, cloud3, cloud4, cloud5] = await Promise.all(graphics)
    // Parallax effects
    let cloud1Rellax = new Rellax( cloud1, { speed: 4})
    let cloud2Rellax = new Rellax( cloud2, { speed: 2})
    let cloud3Rellax = new Rellax( cloud3, { speed: 5})
    let cloud4Rellax = new Rellax( cloud4, { speed: 2})
    let cloud5Rellax = new Rellax( cloud5, { speed: 4})
    
    // ----------------------------------------
    // TEMPLATE
    // ----------------------------------------
    const el = document.createElement('div')
    const shadow = el.attachShadow(shopts)
    shadow.adoptedStyleSheets = [sheet]
    shadow.innerHTML = `
    <section id="datdot" class="section">
    </section>
    `
    const main = shadow.querySelector('section')
    main.append(content(data), blockchainIsland, blossomIsland, cloud1, cloud2, cloud3, cloud4, cloud5)

    return el
}

function get_theme () {
  return `
.section {
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 60% 40%;
    background-image: linear-gradient(0deg, var(--section1BgGEnd), var(--section1BgGStart));
    padding: 0 2vw;
}
.content {
    position: relative;
    z-index: 9;
    grid-row-start: 1;
    grid-column-start: 2;
    grid-column-end: 3;
    text-align: center;
    padding: 0 5%; 
}
.subTitleColor {
    color: var(--section1TitleColor);
}
.buttonBg {
    background-image: linear-gradient(0deg, #ed6e87, #e9627e);
}
.blockchainIsland {
    position: relative;
    z-index: 2;
    grid-row-start: 1; 
    grid-row-end: 3;
    grid-column-start: 1; 
}
.blossomIsland {
    position: relative;
    z-index: 2;
    grid-column-start: 2;
    grid-row-start: 2;
    grid-row-end: 3;
    padding-left: 2rem;
    align-self: end;
    width: 90%;
}
.cloud1 {
    position: absolute;
    z-index: 4;
    width: 10vw;
    bottom: 10vh;
    left: 5vw;
}
.cloud2 {
    position: absolute;
    z-index: 4;
    width: 14vw;
    bottom: -8vh;
    left: 42vw;
}
.cloud3 {
    position: absolute;
    z-index: 1;
    width: 8vw;
    bottom: 15vh;
    left: 52vw;
}
.cloud4 {
    position: absolute;
    width: 6vw;
    bottom: 60%;
    right: 5vw;
}
.cloud5 {
    position: absolute;
    z-index: 1;
    width: 18vw;
    bottom: -10vh;
    right: 2vw;
}
@media only screen and (max-width: 1560px) {
    .content {
        padding: 0;
    }
    .blossomIsland {
        margin-top: 30px;
        width: 35vw;
    }
}
@media only screen and (max-width: 1024px) {
    .section1 {
        grid-template-columns: 55% 45%; 
    }
    .content {
        grid-column-start: 1;
        padding: 0 15vw;
    }
    .blockchainIsland {
        grid-row-start: 2;
    }
    .blossomIsland {
        width: 90%;
        margin-left: 2vw;
        align-self: center;
    }
    .cloud1 {
        bottom: 0vh;
    }
    .cloud2 {
        bottom: -5vh;
    }
    .cloud3 {
        bottom: 10%;
    }
    .cloud4 {
        bottom: 60%;
        width: 12vw;
    }
    .cloud5 {
        bottom: -4vh;
    }
}
@media only screen and (max-width: 812px) { 
    .cloud3 {
        bottom: 10%;
    }
    .cloud4 {
        bottom: 50%;
    }
}
@media only screen and (max-width: 768px) { 
    .cloud3 {
        bottom: 12%;
    }
}
@media only screen and (max-width: 640px) {
    .section1 {
        grid-template-rows: repeat(3, auto);
        grid-template-columns: 100%;
    }
    .content {
        padding-bottom: 10%;
    }
    .blockchainIsland {
        grid-column-end: 3;
    }
    .blossomIsland {
        grid-row-start: 3;
        grid-column-start: 1;
        width: 100%;
        justify-self: end;
    }
    .cloud1 {
        width: 15vw;
    }
    .cloud2 {
        width: 30vw;
        left: 50vw;
        bottom: -50vw;
    }
    .cloud3 {
        width: 20vw;
        bottom: 5vw;
    }
    .cloud4 {
        top: 30vw;
    }
}
@media only screen and (max-width: 414px) {
    .content {
        padding: 0 5vw 5vh 5vw;
    }
    .article {
        padding-bottom: 2rem;
    }
    .section {
        margin-top: 0;
    }
    .blossomIsland {
        width: 60vw;
        margin-left: 35vw;
    }
    .cloud3 {
        bottom: 5vh;
    }
    .cloud4 {
        bottom: 35%;
        width: 15vw;
    }
}
`}
}).call(this)}).call(this,require('_process'),"/src/node_modules/datdot.js")
},{"_process":1,"content":4,"graphic":11,"rellax":2}],8:[function(require,module,exports){
(function (process,__filename){(function (){
const graphic = require('graphic')
const Rellax = require('rellax')
const Content = require('content')
/******************************************************************************
  EDITOR COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------
const sheet = new CSSStyleSheet
sheet.replaceSync(get_theme())
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = editor

async function editor (data) {
    // ----------------------------------------
    // ID + JSON STATE
    // ----------------------------------------
    const id = `${ID}:${count++}` // assigns their own name
    const status = {}
    const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {} } // all state of component instance
    // ----------------------------------------
    // OPTS
    // ----------------------------------------
    const graphics = [
      graphic('island', './src/node_modules/assets/svg/floating-island.svg'),
      graphic('energyIsland', './src/node_modules/assets/svg/energy-island.svg'),
      graphic('tree', './src/node_modules/assets/svg/single-tree.svg'),
      graphic('stone', './src/node_modules/assets/svg/stone.svg'),
      graphic('cloud1', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud2', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud3', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud4', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud5', './src/node_modules/assets/svg/cloud.svg'),
    ]

    const [island, energyIsland, tree, stone, cloud1, cloud2, cloud3, cloud4, cloud5] = await Promise.all(graphics)

    // Parallax effects
    let cloud1Rellax = new Rellax( cloud1, { speed: 2})
    let cloud2Rellax = new Rellax( cloud2, { speed: 3})
    let cloud3Rellax = new Rellax( cloud3, { speed: 4})
    let cloud4Rellax = new Rellax( cloud4, { speed: 4})
    let cloud5Rellax = new Rellax( cloud5, { speed: 3})

    // ----------------------------------------
    // TEMPLATE
    // ----------------------------------------
    const el = document.createElement('div')
    const shadow = el.attachShadow(shopts)
    shadow.adoptedStyleSheets = [sheet]
    shadow.innerHTML = `
    <section id="smartcontractUI" class='section'>
        <div class='scene'>
            <div class='objects'>
                <img class='logo' src=${data.logo} alt="${data.title} logo">
                <img class='screenshot' src=${data.image} alt=${data.title}>
                <div class='deco'>
                    ${stone.outerHTML}
                    ${tree.outerHTML}
                </div>
            </div>
            ${island.outerHTML}
        </div>
    </section>
    `
    // ----------------------------------------
    const main = shadow.querySelector('section')
    main.append(energyIsland, cloud1, cloud2, cloud3, cloud4, cloud5)
    main.prepend(Content(data))
    return el
}

function get_theme () {
  return `
.section {
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 40% 60%;
    background-image: linear-gradient(0deg, var(--section2BgGEnd), var(--section2BgGStart));
    padding: 5vw 2vw;
}
.content {
    position: relative;
    z-index: 9;
    grid-row-start: 1;
    grid-column-start: 1;
    grid-column-end: 2;
    text-align: center;
    padding: 0 5%;
    margin-bottom: 86px;
}
.subTitleColor {
    color: var(--section2TitleColor);
}
.buttonBg {
    background-image: linear-gradient(0deg, #4dc7be, #35bdb9);
}
.scene {
    position: relative;
    grid-row-start: span 2;
    grid-column-start: 2;
}
.objects {
    position: relative;
}
.screenshot {
    width: 80%;
    margin-bottom: -5.5%;
    margin-left: 10%;
}
.logo {
    position: absolute;
    left: 0%;
    bottom: -20%;
    width: 20%;
}
.deco {
    position: absolute;
    right: 0;
    bottom: -18.5%;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
}
.tree {
    width: 13%;
}
.stone {
    position: relative;
    width: 10%;
    right: -3%;
}
.island {
}
.energyIsland {
    grid-row-start: 2;
    grid-column-start: 1;
    grid-column-end: 2;
    width: 80%;
    justify-self: center;
}
.cloud1 {
    position: absolute;
    width: 10vw;
    left: 2vw;
    bottom: 0;
    z-index: 3;
}
.cloud2 {
    position: absolute;
    width: 15vw;
    left: 38vw;
    bottom: -35vw;
    z-index: 2;
}
.cloud3 {
    position: absolute;
    width: 8vw;
    right: 30vw;
    bottom: -34vw;
    z-index: 3;
}
.cloud4 {
    position: absolute;
    width: 14vw;
    right: 6vw;
    bottom: -40vw;
    z-index: 3;
}
.cloud5 {
    position: absolute;
    width: 8vw;
    right: 2vw;
    bottom: -10vw;
    z-index: 2;
}
@media only screen and (max-width: 1024px) {
    .content {
        grid-row-start: 1;
        grid-column-end: 3;
    }
    .scene {
        grid-row-start: 2;
    }
    .energyIsland {
        align-self: end;
    }
}

@media only screen and (max-width: 640px) {
    .scene {
        grid-column-start: 1;
        grid-column-end: 3;
    }
    .energyIsland {
        grid-row-start: 3;
        grid-column-start: 1;
        grid-column-end: 3;
        width: 60%;
        justify-self: start;
    }
    .cloud1 {
        width: 16vw;
    }
    .cloud2 {
        width: 20vw;
        left: 50vw;
        bottom: 10vw;
    }
    .cloud3 {
        width: 15vw;
        bottom: 50vw;
    }
    .cloud4 {
        width: 25vw;
        bottom: -85vw;
    }
    .cloud5 {
        width: 15vw;
        bottom: 30vw;
    }
}
`}
}).call(this)}).call(this,require('_process'),"/src/node_modules/editor.js")
},{"_process":1,"content":4,"graphic":11,"rellax":2}],9:[function(require,module,exports){
module.exports = fetch_data

async function fetch_data(path) {
    let response = await fetch(path)
    if (response.status == 200) {
        let texts = await response.json()
        return texts
    }
    throw new Error(response.status)
}
},{}],10:[function(require,module,exports){
(function (process,__filename){(function (){
const graphic = require('graphic')
/******************************************************************************
  APP FOOTER COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------
const sheet = new CSSStyleSheet
sheet.replaceSync(get_theme())
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = footer

async function footer(opts) {
    // ----------------------------------------
    // ID + JSON STATE
    // ----------------------------------------
    const id = `${ID}:${count++}` // assigns their own name
    const status = {}
    const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {} } // all state of component instance
    const cache = resources({})
    // ----------------------------------------
    // OPTS
    // ----------------------------------------
    let island = await graphic('island', './src/node_modules/assets/svg/deco-island.svg')
    const graphics = opts.icons.map(icon => graphic('icon', icon.imgURL))
    const icons = await Promise.all(graphics)
    // ----------------------------------------
    // TEMPLATE
    // ----------------------------------------
    const el = document.createElement('div')
    const shadow = el.attachShadow(shopts)
    shadow.adoptedStyleSheets = [sheet]
    shadow.innerHTML = `
    <footer class='footer'>
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
    </footer>
    `
    return el
}

function get_theme () {
  return `
.footer {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 1fr;
    color: var(--footerTextColor);
    padding-top: 4vw;
    padding-bottom: 0.5%;
    background-color: var(--footerBg);
}
.copyright {
    text-align: center;
    align-self: center;
}
.scene {
    position: relative;
    width: 60%;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: repeat(4, 25%);
}
.contacts {
    display: flex;
    justify-content: center;
    align-items: center;
    grid-row-start: 2;
    grid-column-start: 2;
    grid-column-end: 4;
    margin-top: -2%;
}
.contacts a {
    margin: 0 2rem;
}
.icon {
    width: 6vw;
}
.island {
    grid-row-start: 1;
    grid-row-end: 6;
    grid-column-start: 1;
    grid-column-end: 5;
}
@media only screen and (min-width: 1440px) {
    .icon {
        max-width: 10rem;
    }
}
@media only screen and (max-width: 1200px) {
    .contacts a {
        margin: 0 1.5vw;
    }
}
@media only screen and (max-width: 1024px) {
    .scene {
        width: 80%;
    }
    .icon {
        width: 8vw;
    }
}
`
}

// ----------------------------------------------------------------------------
function shadowfy (props = {}, sheets = []) {
  return element => {
    const el = Object.assign(document.createElement('div'), { ...props })
    const sh = el.attachShadow(shopts)
    sh.adoptedStyleSheets = sheets
    sh.append(element)
    return el
  }
}
function use_protocol (petname) {
  return ({ protocol, state, on = { } }) => {
    if (petname in state.aka) throw new Error('petname already initialized')
    const { id } = state
    const invalid = on[''] || (message => console.error('invalid type', message))
    if (protocol) return handshake(protocol(Object.assign(listen, { id })))
    else return handshake
    // ----------------------------------------
    // @TODO: how to disconnect channel
    // ----------------------------------------
    function handshake (send) {
      state.aka[petname] = send.id
      const channel = state.net[send.id] = { petname, mid: 0, send, on }
      return protocol ? channel : Object.assign(listen, { id })
    }
    function listen (message) {
      const [from] = message.head
      const by = state.aka[petname]
      if (from !== by) return invalid(message) // @TODO: maybe forward
      console.log(`[${id}]:${petname}>`, message)
      const { on } = state.net[by]
      const action = on[message.type] || invalid
      action(message)
    }
  }
}
// ----------------------------------------------------------------------------
function resources (pool) {
  var num = 0
  return factory => {
    const prefix = num++
    const get = name => {
      const id = prefix + name
      if (pool[id]) return pool[id]
      const type = factory[name]
      return pool[id] = type()
    }
    return Object.assign(get, factory)
  }
}
}).call(this)}).call(this,require('_process'),"/src/node_modules/footer.js")
},{"_process":1,"graphic":11}],11:[function(require,module,exports){
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
},{"loadSVG":13}],12:[function(require,module,exports){
(function (process,__filename){(function (){
const graphic = require('graphic')
const Rellax = require('rellax')
/******************************************************************************
  HEADER COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------
const sheet = new CSSStyleSheet
sheet.replaceSync(get_theme())
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = header

async function header(data) {
    // ----------------------------------------
    // ID + JSON STATE
    // ----------------------------------------
    const id = `${ID}:${count++}` // assigns their own name
    const status = {}
    const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {} } // all state of component instance
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
    shadow.adoptedStyleSheets = [sheet]
    shadow.innerHTML = `
		<div class='header'>
				<h1 class='title'>${data.title}</h1>
				<section class='scene'>
						<div class='sunCloud'>
						</div>
				</section>
		</div>
		`
    // ----------------------------------------
		const scene = shadow.querySelector('.scene')
		const sunCloud = shadow.querySelector('.sunCloud')
		scene.append(cloud3, cloud4, cloud5, cloud6, cloud7, playIsland)
		sunCloud.append(cloud1, sun, cloud2)
		return el
}

function get_theme () {
  return `
.header {
		position: relative;
		padding-top: 0vw;
		background-image: linear-gradient(0deg, var(--playBgGEnd), var(--playBgGStart));
		overflow: hidden;
}
.scene {
		position: relative;
		margin-top: 5vw;
}
.playIsland {
		position: relative;
		width: 90%;
		margin-top: 0;
		margin-left: 5vw;
		z-index: 2;
}
.sunCloud {
		position: absolute;
		top: -4%;
		width: 12%;
		margin-left: 8vw;
		z-index: 1;
}
.sun {
		width: 100%;
}
[class^="cloud"] {
		transition: left 0.6s, bottom 0.5s, top 0.5s linear;
}
.cloud1 {
		position: absolute;
		z-index: 2;
		width: 7vw;
		left: -3vw;
		bottom: 0;
}
.cloud2 {
		position: absolute;
		z-index: 1;
		width: 7vw;
		left: 10vw;
		top: 25%;
}
.cloud3 {
		position: absolute;
		z-index: 2;
		width: 7vw;
		height: auto;
		top: -2.5%;
		right: 14vw;
}
.cloud4 {
		position: absolute;
		z-index: 1;
		width: 5vw;
		height: auto;
		top: 8%;
		right: 6vw;
}
.cloud5 {
		position: absolute;
		z-index: 1;
		width: 12vw;
		height: auto;
		top: 50%;
		left: 2vw;
}
.cloud6 {
		position: absolute;
		z-index: 3;
		width: 12vw;
		height: auto;
		bottom: 15%;
		left: 15vw;
}
.cloud7 {
		position: absolute;
		z-index: 4;
		width: 18vw;
		height: auto;
		bottom: 25%;
		right: 5vw;
}
.title {
		position: relative;
		z-index: 4;
		font-size: var(--titleSize);
		font-family: var(--titleFont);
		color: var(--titleColor);
		text-align: center;
		margin: 0;
		padding: 2% 2%;
}
.sun {
		will-change: transform;
}
.cloud1, .cloud2, .cloud3, .cloud4, .cloud5, .cloud6, .cloud7 {
		will-change: transform;
}
@media only screen and (min-width: 1680px) {
		.scrollUp .header {
				padding-top: 2.5%;
		}
}
@media only screen and (min-width: 2561px) {
		.scene {
				max-width: 90%;
				margin-left: auto;
				margin-right: auto;
		}
		.title {
				font-size: calc(var(--titleSize) * 1.5);
				margin-bottom: 6vh;
		}
}
@media only screen and (min-width: 4096px) {
		.title {
				font-size: calc(var(--titleSize) * 2.25);
		}
}
@media only screen and (max-width: 1680px) {
		.header {
				padding-top: 2vw;
		}
}
@media only screen and (max-width: 1280px) {
		.header {
				padding-top: 3vw;
		}
		.scrollUp .header {
				padding-top: 6.5vh;
		}
}
@media only screen and (max-width: 1024px) {
		.header {
				padding-top: 0%;
		}
}
@media only screen and (max-width: 812px) {
		.header {
				padding-top: 5vh;
		}
		.title { 
				padding: 0 5%;
				font-size: var(--titleSizeM);
		}
}
@media only screen and (max-width: 414px) {
		.header {
				padding-top: 8vh;
		}
		.title {
				font-size: var(--titlesSizeS);
		}
		.playIsland {
				width: 150%;
				margin-left: -26vw;
		}
		.sunCloud {
				top: -2vh;
				left: -3vw;
		}
		.cloud5 {
				width: 12vw;
				left: -4vw;
				top: 64%;
		}
		.cloud6 {
				width: 15vw;
				left: 5vw;
		}
		.cloud7 {
				width: 20vw;
				right: -5vw;
		}
}
`}

}).call(this)}).call(this,require('_process'),"/src/node_modules/header.js")
},{"_process":1,"graphic":11,"rellax":2}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
(function (process,__filename){(function (){
const graphic = require('graphic')
const Rellax = require('rellax')
const Content = require('content')
const Contributor = require('contributor')
/******************************************************************************
  OUR CONTRIBUTORS COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------
const sheet = new CSSStyleSheet()
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = our_contributors

async function our_contributors (data, port) {
    // ----------------------------------------
    // ID + JSON STATE
    // ----------------------------------------
    const id = `${ID}:${count++}` // assigns their own name
    const status = {}
    const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {} } // all state of component instance
    const on_rx = {
        inject
    }
    // ----------------------------------------
    // OPTS
    // ----------------------------------------
    const graphics = [
      graphic('island','./src/node_modules/assets/svg/waterfall-island.svg'),
      graphic('cloud1', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud2', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud3', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud4', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud5', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud6', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud7', './src/node_modules/assets/svg/cloud.svg'),
    ]

    const [island, cloud1, cloud2, cloud3, cloud4, cloud5, cloud6, cloud7] = await Promise.all(graphics)
    const temp = []
    for (const person of data.contributors) {
        temp.push(await Contributor( person, 'group', await init_ch(person)))
    }
    const contributors = await Promise.all(temp)

    let cloud1Rellax = new Rellax( cloud1, { speed: 0.3})
    let cloud2Rellax = new Rellax( cloud2, { speed: 0.4})
    let cloud3Rellax = new Rellax( cloud3, { speed: 0.3})
    // ----------------------------------------
    // TEMPLATE
    // ----------------------------------------
    const el = document.createElement('div')
    const shadow = el.attachShadow(shopts)
    shadow.innerHTML = `
        <section id="ourContributors" class="section">
            <div class='inner'>
            </div>

            <div class='groups'>
            </div>

            ${cloud4.outerHTML}
            ${cloud5.outerHTML}
            ${cloud6.outerHTML}
            ${cloud7.outerHTML}
        </section>
    `
    // ----------------------------------------
    const inner = shadow.querySelector('.inner')
    const groups = shadow.querySelector('.groups')
    const main = shadow.querySelector('section')
    groups.append(...contributors)
    main.prepend(Content(data))
    inner.append(island, cloud1, cloud2, cloud3)

    const css = await get_theme()
    inject({ data: css })
    return el

    async function init_ch({ name }) {
      port.postMessage({type: 'req_ch', data: name})
      return new Promise(resolve => 
        port.onmessage = event => {
            resolve(event.ports[0])
            port.onmessage = onmessage
        }
      )
    }
    async function onmessage (event) {
      on_rx[event.data.type](event.data)
    }
    async function inject ({ data }) {
      sheet.replaceSync(data)
      shadow.adoptedStyleSheets = [sheet]
    }
    async function get_theme () {
      const pref = JSON.parse(localStorage.pref)['our_contributors']
      let theme
      if(pref){
        if(Object.keys(localStorage).includes(pref))
          theme = JSON.parse(localStorage[pref]).css['our_contributors']
        else
          theme = await (await fetch(`./src/node_modules/css/${pref}/our_contributors.css`)).text()
      }
      else
        theme = await (await fetch('./src/node_modules/css/default/our_contributors.css')).text()
      return theme
    }
}
// ----------------------------------------------------------------------------
function shadowfy (props = {}, sheets = []) {
  return element => {
    const el = Object.assign(document.createElement('div'), { ...props })
    const sh = el.attachShadow(shopts)
    sh.adoptedStyleSheets = sheets
    sh.append(element)
    return el
  }
}
}).call(this)}).call(this,require('_process'),"/src/node_modules/our_contributors.js")
},{"_process":1,"content":4,"contributor":5,"graphic":11,"rellax":2}],15:[function(require,module,exports){
(function (process,__filename){(function (){
const graphic = require('graphic')
const Content = require('content')
/******************************************************************************
  SMARTCONTRACT-CODES COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------
const sheet = new CSSStyleSheet
sheet.replaceSync(get_theme())
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = smartcontract_codes

async function smartcontract_codes (data) {
    // ----------------------------------------
    // ID + JSON STATE
    // ----------------------------------------
    const id = `${ID}:${count++}` // assigns their own name
    const status = {}
    const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {} } // all state of component instance
    // ----------------------------------------
    // OPTS
    // ----------------------------------------
  const graphics = [
    graphic('island', './src/node_modules/assets/svg/floating-island1.svg'),
    graphic('islandMiddle', './src/node_modules/assets/svg/floating-island2.svg'),
    graphic('islandRight', './src/node_modules/assets/svg/floating-island2.svg'),
    graphic('blossom', './src/node_modules/assets/svg/blossom-tree.svg'),
    graphic('tree', './src/node_modules/assets/svg/single-tree.svg'),
    graphic('trees', './src/node_modules/assets/svg/two-trees.svg'),
    graphic('stone', './src/node_modules/assets/svg/stone.svg'),
    graphic('smallStone', './src/node_modules/assets/svg/small-stone.svg'),
  ]

    const [island, islandMiddle, islandRight, blossom, tree, trees, stone, smallStone] = await Promise.all(graphics)

    // ----------------------------------------
    // TEMPLATE
    // ----------------------------------------
    const el = document.createElement('div')
    const shadow = el.attachShadow(shopts)
    shadow.adoptedStyleSheets = [sheet]
    shadow.innerHTML = `
    <section id="smartcontractCodes" class='section'>

      <div class='scene'>
          <div class='deco'>
              <img class='logo' src=${data.logo} alt="${data.title} logo">
              <img class='screenshot' src=${data.image} alt=${data.title}>
              ${trees.outerHTML}
          </div>
          ${island.outerHTML}
      </div>
      <div class='sceneMedium'>
          <div class='deco'>
              <div class='container'>
                  ${smallStone.outerHTML}
                  ${stone.outerHTML}
                  ${blossom.outerHTML}
              </div>
              ${islandMiddle.outerHTML}
          </div>
          <div class='deco'>
              ${tree.outerHTML}
              ${islandRight.outerHTML}
          </div>
      </div>
      
  </section>
  `
  const main = shadow.querySelector('section')
  main.prepend(Content(data))
  return el
}

function get_theme () {
  return `
.section {
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 60% 40%;
    background-image: linear-gradient(0deg, var(--section3BgGEnd), var(--section3BgGStart));
    padding: 3vw 2vw 0 2vw;
}
.content {
    position: relative;
    z-index: 9;
    grid-row-start: 1;
    grid-column-start: 2;
    grid-column-end: 3;
    text-align: center;
    padding: 0 5%;
}
.subTitleColor {
    color: var(--section3TitleColor);
    margin-top: 0;
}
.buttonBg {
    background-image: linear-gradient(0deg, #900df8, #ac1cf6);
}
.scene {
    grid-row-start: span 2;
    grid-column-start: 1;
}
.deco {
    position: relative;
}
.screenshot {
    width: 65%;
    margin-left: 15%;
    margin-bottom: -6%;
}
.trees {
    position: absolute;
    right: 10%;
    bottom: -20%;
    width: 15%;
}
.logo {
    position: absolute;
    left:6%;
    bottom: -20%;
    width: 15%;
}
.island {
}
.sceneMedium {
    grid-row-start: 2;
    grid-column-start: 2;
    display: grid;
    grid-template: 1fr / 65% 35%;
    align-items: center;
}
.container {
    position: relative;
}
.sceneMedium .deco:nth-child(1) {
    width: 80%;
    justify-self: center;
}
.sceneMedium .deco:nth-child(2) {

}
.blossom {
    width: 55%;
    margin: 0  0 -10% 12%;
}
.islandMiddle {

}
.tree {
    position: relative;
    width: 50%;
    margin: 0 auto;
    margin-bottom: -11%;
    z-index: 2;
}
.islandRight {
    
}
.stone {
    position: absolute;
    right: 12%;
    bottom: 3%;
    width: 22%;
}
.smallStone {
    position: absolute;
    left: 7%;
    bottom: 5%;
    width: 14%;
}
@media screen and (min-width: 2561px) {
    .tree {
        margin-bottom: -10.5%;
    }
}
@media screen and (min-width: 1025px) and (max-width: 1200px) {
    .sceneMedium {
        margin-top: 4.5rem;
    }
}
@media screen and (max-width: 1024px) {
    .content {
        grid-column-start: 1;
        margin-bottom: 60px;
    }
}
@media screen and (max-width: 640px) {
    .scene {
        grid-row-start: 2;
        grid-column-end: 3; 
    }
    .sceneMedium {
        grid-row-start: 3;
        grid-column-start: 1;
        grid-column-end: 3;
    }
    .sceneMedium .deco:nth-child(1) {
        width: 90%;
    }
    .sceneMedium .deco:nth-child(2) {
        width: 80%;
        justify-self: center;
        align-self: center;
    }
    .tree {
        bottom: -5.5%;
    }
}
`}
}).call(this)}).call(this,require('_process'),"/src/node_modules/smartcontract_codes.js")
},{"_process":1,"content":4,"graphic":11}],16:[function(require,module,exports){
(function (process,__filename){(function (){
const graphic = require('graphic')
const Rellax = require('rellax')
const crystalIsland = require('crystalIsland')
/******************************************************************************
  SUPPORTERS COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------
const sheet = new CSSStyleSheet
sheet.replaceSync(get_theme())
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = supporters

async function supporters (data) {
    // ----------------------------------------
    // ID + JSON STATE
    // ----------------------------------------
    const id = `${ID}:${count++}` // assigns their own name
    const status = {}
    const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {} } // all state of component instance
    // ----------------------------------------
    // OPTS
    // ----------------------------------------
    let pageTitle = `<div class='title'>${data.title}</div>`
    const paths = {
        island: './src/node_modules/assets/svg/floating-island3.svg',
        tree: './src/node_modules/assets/svg/big-tree.svg',
        tree1: './src/node_modules/assets/svg/single-tree1.svg',
        tree2: './src/node_modules/assets/svg/single-tree2.svg',
        tree3: './src/node_modules/assets/svg/single-tree3.svg',
        yellowCrystal: './src/node_modules/assets/svg/crystal-yellow.svg',
        purpleCrystal: './src/node_modules/assets/svg/crystal-purple.svg',
        blueCrystal: './src/node_modules/assets/svg/crystal-blue.svg',
        stone: './src/node_modules/assets/svg/stone1.svg',
        card: './src/node_modules/assets/svg/card2.svg'
    }

    const graphics = [
      // crystals
      graphic('yellowCrystal','./src/node_modules/assets/svg/crystal-yellow.svg'),
      graphic('purpleCrystal','./src/node_modules/assets/svg/crystal-purple.svg'),
      graphic('blueCrystal','./src/node_modules/assets/svg/crystal-blue.svg'),
      // stone
      graphic('stone','./src/node_modules/assets/svg/stone1.svg'),
      // trees
      graphic('tree','./src/node_modules/assets/svg/big-tree.svg'),
      graphic('tree','./src/node_modules/assets/svg/single-tree1.svg'),
      graphic('tree','./src/node_modules/assets/svg/single-tree3.svg'),
      graphic('treeGold','./src/node_modules/assets/svg/single-tree2.svg'),
      // islands
      graphic('island','./src/node_modules/assets/svg/floating-island3.svg'),
      graphic('island','./src/node_modules/assets/svg/floating-island3.svg'),
      graphic('island','./src/node_modules/assets/svg/floating-island3.svg'),
      graphic('island','./src/node_modules/assets/svg/floating-island3.svg'),
      graphic('island','./src/node_modules/assets/svg/floating-island3.svg'),
      // clouds
      graphic('cloud1', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud2', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud3', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud4', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud5', './src/node_modules/assets/svg/cloud.svg'),
      graphic('cloud6', './src/node_modules/assets/svg/cloud.svg'),
    ]

    const [yellowCrystal, purpleCrystal, blueCrystal, stone, tree, tree1, tree2, tree3, 
      island, island1, island2, island3, island4, cloud1, cloud2, cloud3, cloud4, cloud5, cloud6] = await Promise.all(graphics)
    
    // Parallax effects
    let cloud1Rellax = new Rellax( cloud1, { speed: 1.5})
    let cloud2Rellax = new Rellax( cloud2, { speed: 1})
    let cloud3Rellax = new Rellax( cloud3, { speed: 1.5})
    let cloud4Rellax = new Rellax( cloud4, { speed: 4})
    let cloud5Rellax = new Rellax( cloud5, { speed: 1.5})
    let cloud6Rellax = new Rellax( cloud6, { speed: 3})

    const scenes = await data.supporters.map(async (supporter, i) => 
        await crystalIsland(supporter, supporter.deco.map(async v => await graphic(v.includes('tree') ? 'tree' : v, paths[v])), await graphic('island', paths.island), i ? '' : pageTitle)
    )
    // ----------------------------------------
    // TEMPLATE
    // ----------------------------------------
    const el = document.createElement('div')
    const shadow = el.attachShadow(shopts)
    shadow.adoptedStyleSheets = [sheet]
    shadow.innerHTML = `
        <section id="supporters" class="section">
            
        </section>
    `
    // ----------------------------------------
    const main = shadow.querySelector('section')
    main.append(...(await Promise.all(scenes)).map(v => v), cloud1, cloud2, cloud3, cloud4, cloud5, cloud6)
    return el
}

function get_theme () {
  return `
.section {
    position: relative;
    background-image: linear-gradient(0deg, var(--section4BgGEnd), var(--section4BgGStart));
    display: grid;
    grid-template-rows: repeat(2, auto);
    grid-template-columns: 33% 34% 33%;
    padding-top: 10vw;
    z-index: 1;
}
.cloud1 {
    position: absolute;
    width: 8vw;
    top: 25vw;
    left: 8vw;
    z-index: 5;
}
.cloud2 {
    position: absolute;
    width: 15vw;
    top: 10vw;
    left: 50vw;
    z-index: 6;
}
.cloud3 {
    position: absolute;
    width: 15vw;
    top: 30vw;
    right: 10vw;
    z-index: 5;
}
.cloud4 {
    position: absolute;
    width: 8vw;
    bottom: 28vw;
    right: 5vw;
    z-index: 4;
}
.cloud5 {
    position: absolute;
    width: 12vw;
    bottom: -3vw;
    right: 6vw;
    z-index: 5;
}
.cloud6 {
    position: absolute;
    width: 8vw;
    bottom: -10vw;
    right: 2vw;
    z-index: 6;
}
.deco {
    position: relative;
}
.title {
    position: absolute;
    z-index: 5;
    bottom: -18%;
    right: 23%;
    font-family: var(--titleFont);
    font-size: var(--supportersHeadlline);
    color: var(--section4TitleColor);
}
.content {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    bottom: 24%;
    left: 19%;
    z-index: 2;
    width: 35%;
}
.content h3 {
    font-family: var(--titleFont);
    font-size: var(--supportersTitleSize);
    text-align: center;
    color: var(--supportersTitleColor);
    margin-top: 0;
}
.content p {
    font-size: var(--supportersTextSize);
    text-align: center;
    margin: 0;
}
.tree, .treeGold{
    position: relative;
    width: 36%;
    margin: 0 0 -12% 64%;
    z-index: 1;
}
.yellowCrystal, .blueCrystal, .purpleCrystal, .stone{
    position: absolute;
    width: 5vw;
    bottom: 8px;
    z-index: 2;
}
.purpleCrystal{
    width: 7vw;
}
.stone{
    width: 8vw;
}
.card{
    position: absolute;
    width: 64%;
    left: 17px;
    bottom: 15px;
}
.deco > .card:last-child {
    position: relative;
    margin-bottom: -9%;
    bottom: 0;
}
.scene {
    position: relative;
    width: 30vw;
    margin-top: 6em;
}
.scene:nth-child(3n) {
    grid-column-start: 2;
    transform: translateY(20px);
}
.scene:nth-child(3n + 1) {
    grid-column-start: 3;
}
.scene:nth-child(3n + 2) {
    grid-column-start: 1;
    transform: translateY(-170px);
}
.scene:first-child {
    width: 50vw;
    grid-column-start: 2;
    grid-column-end: 4;
}
.scene:first-child .tree{
    width: 50%;
    margin: 0 0 -11% -12%;
}
.scene:first-child .content{
    left: 38%;
}
.scene:first-child .yellowCrystal{
    width: 20%;
    left: 14%;
    bottom: 0px;
}
.scene:first-child .card{
    left: 20%;
    bottom: 12px;
    width: 73%;
}

@media only screen and (min-width: 3840px) {
    .info h3 {
        margin-bottom: 6px;
        font-size: calc( var(--supportersTitleSizeM) * 2);
    }
    .info p {
        font-size: calc( var(--supportersTextSizeM) * 2);
    }
}

@media only screen and (max-width: 1024px) {
    .section{
        grid-template-columns: 50% 50%;
    }
    .scene{
        width: 40vw;
        margin-left: 14%;
    }
    .scene:nth-child(2n) {
        grid-column-start: 1;
        transform: translateY(0);
    }
    .scene:nth-child(2n + 1) {
        grid-column-start: 2;
        transform: translateY(-35%);
    }
    .scene:first-child {
        width: 70vw;
        grid-column-start: 1;
        grid-column-end: 3;
        transform: translateY(0);
    }
    .content {
        width: 42%;
    }
    .content p {
        font-size: 15px;
    }
}
@media only screen and (max-width: 812px) {
    .info h3 {
        margin-bottom: 6px;
        font-size: var(--supportersTitleSizeM);
    }
    .info p {
        font-size: var(--supportersTextSizeM);
    }
}
@media only screen and (max-width: 640px) {
    .scene:nth-child(2n) {
        grid-column-end: 2;
    }
    .scene:nth-child(2n + 1) {
        transform: translateY(-60%);
    }
    .scene{
        width: 50vw;
        margin-left: 1%;
        margin-top: 9em;
    }   
    .scene:first-child {
        margin-left: 14%;
        transform: translateY(0%);
    }
}

`
}
}).call(this)}).call(this,require('_process'),"/src/node_modules/supporters.js")
},{"_process":1,"crystalIsland":6,"graphic":11,"rellax":2}],17:[function(require,module,exports){
(function (process,__filename){(function (){
/******************************************************************************
  THEME_WIDGET COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------
const sheet = new CSSStyleSheet
sheet.replaceSync(get_theme())
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------

module.exports = theme_widget

async function theme_widget(components, port) {
  port.onmessage = event => on_rx[event.data.type](event.data)
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const id = `${ID}:${count++}` // assigns their own name
  const status = {}
  const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {}, channels: {}} // all state of component instance
  localStorage.pref || (localStorage.pref = '{}')
  status.themes = {
    local: ['default', 'dark'],
    saved: Object.entries(localStorage).filter(entry => JSON.parse(entry[1]).theme && entry[0] ).map(entry => entry[0])
  }
  const on_rx = {
    refresh
  }
  // ----------------------------------------
  // TEMPLATE
  // ----------------------------------------
  const el = document.createElement('div')
  const shadow = el.attachShadow(shopts)
  shadow.adoptedStyleSheets = [sheet]
  shadow.innerHTML = `
  <section>
    <div class="btn">
      ⚙️
    </div>
    <div class="popup">
      <div class="box">
        <div class="stats">
          Active components: 
        </div>
        <div class="list">
        </div>
      </div>
      <div class="editor">
        <h3></h3>
        <textarea></textarea>
        <select></select>
        <button class="inject">
          Inject
        </button>
        <button class="load">
          Load
        </button>
        <button class="save">
          Save
        </button>
        <input placeholder='Enter theme' />
        <button class="add">
          Add
        </button>
      </div>
    </div>
  </section>`
  const btn = shadow.querySelector('.btn')
  const popup = shadow.querySelector('.popup')
  const list = popup.querySelector('.list')
  const stats = popup.querySelector('.stats')
  const editor = popup.querySelector('.editor')
  const title = editor.querySelector('h3')
  const inject_btn = editor.querySelector('.inject')
  const load_btn = editor.querySelector('.load')
  const save_btn = editor.querySelector('.save')
  const add_btn = editor.querySelector('.add')
  const textarea = editor.querySelector('textarea')
  const dropdown = editor.querySelector('select')
  const input = editor.querySelector('input')

  btn.onclick = () => popup.classList.toggle('active')
  inject_btn.onclick = inject
  load_btn.onclick = load
  save_btn.onclick = save
  add_btn.onclick = add
  update_dropdown()
  return el

  async function add () {
    localStorage[input.value] = '{"theme":"true","css":{}}'
    status.themes.saved.push(input.value)
    update_dropdown()
  }
  async function save () {
    const theme = localStorage[dropdown.value] && JSON.parse(localStorage[dropdown.value])
    if(theme){
      theme.css[title.innerHTML] = textarea.value
      localStorage[dropdown.value] = JSON.stringify(theme)
    }
    const pref = JSON.parse(localStorage.pref)
    pref[title.innerHTML] = dropdown.value
    localStorage.pref = JSON.stringify(pref)
  }
  async function inject () {
    port.postMessage({type: 'send', to_type: 'inject', to: status.active_id, data: textarea.value})
  }
  async function load () {
    const name = dropdown.value
    let theme
    if(status.themes.local.includes(name)){
      const temp = await fetch(`./src/node_modules/css/${name}/${title.innerHTML}.css`)
      theme = await temp.text()
    }
    else{
      theme = JSON.parse(localStorage[name]).css[title.innerHTML]
    }
    textarea.value = theme
  }
  async function refresh ({ data }) {
    status.tree = data
    stats.innerHTML = `Active components: ${Object.keys(data).length}`
    list.append(...Object.entries(data).filter(entry => entry[1].hub === '').map(make_node))
  }
  function make_node (component){
    const el = document.createElement('div')
    el.classList.add('item')
    el.innerHTML = `<main><span class='pre'>+</span> <span class='name'>${component[1].name}</span></main> <div class="sub"></div>`
    const pre_btn = el.querySelector('.pre')
    const name = el.querySelector('.name')
    const sub = el.querySelector('.sub')
    pre_btn.onclick = () => {
      pre_btn.innerHTML = pre_btn.innerHTML === '+' ? '-' : '+'
      if(sub.children.length)
        sub.classList.toggle('hide')
      else
        sub.append(...Object.entries(status.tree).filter(entry => entry[1].hub == component[0]).map(make_node))
    }
    name.onclick = async () => {
      title.innerHTML = component[1].name
      editor.classList.toggle('active')
      textarea.value = await get_css(component[1].name)
      status.active_id = component[0]
    }
    return el
  }
  async function get_css (name) {
    const temp = JSON.parse(localStorage.pref)
    const pref = temp[name]
    let theme
    if(pref){
      if(Object.keys(localStorage).includes(pref))
        theme = JSON.parse(localStorage[pref]).css[name]
      else
        theme = await (await fetch(`./src/node_modules/css/${pref}/${name}.css`)).text()
    }
    else
      theme = await (await fetch(`./src/node_modules/css/default/${name}.css`)).text()
    dropdown.value = pref || 'default'
    return theme
  }
  async function update_dropdown () {
    dropdown.innerHTML = `<optgroup label='Local'>${status.themes.local.map(theme => `<option>${theme}</option>`)}</optgroup>` +
    `<optgroup label='Saved'> ${status.themes.saved.map(theme => `<option>${theme}</option>`)}</optgroup>`
  }
}

function get_theme() {
  return `
  *{
    box-sizing: border-box;
  }
  section{
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 50;
    display: flex;
    align-items: end;
  }
  .btn{
    font-size: 30px;
    cursor: pointer;
  }
  .popup{
    display: none;
    position: relative;
    bottom: 44px;
    margin-left: -42px;
    gap: 10px;
    align-items: end;
  }
  .popup.active{
    display: flex;
  }
  .popup .box{
    background: #beb2d7;
    border-radius: 5px;
    padding: 10px;
  }
  .popup .list{
    max-height: 60vh;
    overflow-y: scroll;
  }
  .popup .list .item{
    white-space: nowrap;
    cursor: pointer;
  }
  .popup .list .item > .sub{
    display: block;
    margin-left: 10px;
  }
  .popup .list .item > .sub.hide{
    display: none;
  }
  .popup .list .item > main:hover{
    background: #ada1c6;
  }
  .popup .editor{
    display: none;
    background: #beb2d7;
    position: relative;
    border-radius: 5px;
    padding: 10px;
  }
  .popup .editor.active{
    display: block;
  }
  .popup .editor textarea{
    min-height: 44vh;
    min-width: 100%;
  }
  `
}
}).call(this)}).call(this,require('_process'),"/src/node_modules/theme_widget.js")
},{"_process":1}],18:[function(require,module,exports){
(function (process,__filename){(function (){
const graphic = require('graphic')
/******************************************************************************
  OUR CONTRIBUTORS COMPONENT
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
// ----------------------------------------
const sheet = new CSSStyleSheet
sheet.replaceSync(get_theme())
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = topnav

async function topnav(data, port) {
		// ----------------------------------------
    // ID + JSON STATE
    // ----------------------------------------
    const id = `${ID}:${count++}` // assigns their own name
    const status = {}
    const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {} } // all state of component instance
    // ----------------------------------------
    // OPTS
    // ----------------------------------------

		const playLogo = await graphic('playLogo', './src/node_modules/assets/svg/logo.svg')
		// ----------------------------------------
    // TEMPLATE
    // ----------------------------------------
    const el = document.createElement('div')
    const shadow = el.attachShadow(shopts)
    shadow.adoptedStyleSheets = [sheet]
    shadow.innerHTML = `
			<section class='topnav'>
					<a href="#top">${playLogo.outerHTML}</a>
					<nav class='menu'>
					</nav>
			</section>
		`
		// ----------------------------------------
		const menu = shadow.querySelector('.menu')
		const body = shadow.querySelector('section')
		menu.append(...data.map(make_link))
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
		return el
		function click(url) {
			port.postMessage({ type: 'jump', data: url })
		}
		function make_link(link){
			const a = document.createElement('a')
			a.href = `#${link.url}`
			a.textContent = link.text
			a.onclick = () => click(link.url)
			return a
		}

}

function get_theme () {
  return `
.topnav {
		position: relative;
		width: 100%;
		z-index: 20;
		display: grid;
		grid-template: 1fr / auto;
		background-color: var(--playBgGStart);
		-webkit-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0);
		opacity: 1;
		transition: background-color .6s, -webkit-transform .4s, transform .4s, opacity .3s linear;
}
.playLogo {
		position: absolute;
		top: 10px;
		left: 0;
		width: 15rem;
		z-index: 99;
		transition: width .6s ease-in-out;
}
.menu {
		padding: 2.5rem;
		text-align: right;
}
.menu a {
		font-size: var(--menuSize);
		margin-left: 1.75%;
		color: #575551;
		text-transform: uppercase;
		transition: color .6s linear;
		text-decoration: none;
}
.menu a:hover {
		color: #00acff;
}
.topnav.scrollUp {
		position: fixed;
		background-color: white;
		-webkit-transform: none;
		transform: none;
}
.topnav.scrollDown {
		position: fixed;
		-webkit-transform: translate3d(0, -100%, 0);
		transform: translate3d(0, -100%, 0);
		opacity: 0;
}
.scrollUp .playLogo {
		width: 10rem;
}
 .scrollDown .playLogo {
		width: 10rem;
		top: 0;
}
@media only screen and (min-width: 4096px) {
		.menu a {
				font-size: calc(var(--menuSize) * 1.5);
		}
}
@media only screen and (max-width: 1024px) {
		.playLogo  {
				width: 9vw;
				min-width: 100px;
		}
}
@media only screen and (max-width: 960px) {
		.topnav {
				position: relative;
		}
		.menu {
				padding-top: 3%;
				padding-right: 2.5vw;
		}
		.menu a {
				margin-left: 1.5%;
		}
}
@media only screen and (max-width: 812px) {
		.menu {
				display: none;
		}
		.playLogo  {
				top: 20px;
				min-width: 12vw;
		}
}
@media only screen and (max-width: 414px) {
		.playLogo  {
				min-width: 20vw;
		}
}
`}
}).call(this)}).call(this,require('_process'),"/src/node_modules/topnav.js")
},{"_process":1,"graphic":11}],19:[function(require,module,exports){
(function (process,__filename,__dirname){(function (){
const make_page = require('../') 
const theme = require('theme')
/******************************************************************************
  INITIALIZE PAGE
******************************************************************************/
// ----------------------------------------
// MODULE STATE & ID
var count = 0
const [cwd, dir] = [process.cwd(), __filename].map(x => new URL(x, 'file://').href)
const ID = dir.slice(cwd.length)
const STATE = { ids: {}, net: {} } // all state of component module
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
  const id = `${ID}:${count++}` // assigns their own name
  const status = {}
  const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {} } // all state of component instance
  const cache = resources({})
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
    const protocol = use_protocol('make_page')({ state, on })
    const opts = { page, theme, themes }
    const element = await make_page(opts, protocol)
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
// ----------------------------------------------------------------------------
function shadowfy (props = {}, sheets = []) {
  return element => {
    const el = Object.assign(document.createElement('div'), { ...props })
    const sh = el.attachShadow(shopts)
    sh.adoptedStyleSheets = sheets
    sh.append(element)
    return el
  }
}
function use_protocol (petname) {
  return ({ protocol, state, on = { } }) => {
    if (petname in state.aka) throw new Error('petname already initialized')
    const { id } = state
    const invalid = on[''] || (message => console.error('invalid type', message))
    if (protocol) return handshake(protocol(Object.assign(listen, { id })))
    else return handshake
    // ----------------------------------------
    // @TODO: how to disconnect channel
    // ----------------------------------------
    function handshake (send) {
      state.aka[petname] = send.id
      const channel = state.net[send.id] = { petname, mid: 0, send, on }
      return protocol ? channel : Object.assign(listen, { id })
    }
    function listen (message) {
      const [from] = message.head
      const by = state.aka[petname]
      if (from !== by) return invalid(message) // @TODO: maybe forward
      console.log(`[${id}]:${petname}>`, message)
      const { on } = state.net[by]
      const action = on[message.type] || invalid
      action(message)
    }
  }
}
// ----------------------------------------------------------------------------
function resources (pool) {
  var num = 0
  return factory => {
    const prefix = num++
    const get = name => {
      const id = prefix + name
      if (pool[id]) return pool[id]
      const type = factory[name]
      return pool[id] = type()
    }
    return Object.assign(get, factory)
  }
}
}).call(this)}).call(this,require('_process'),"/web/demo.js","/web")
},{"../":3,"_process":1,"theme":20}],20:[function(require,module,exports){
const font = 'https://fonts.googleapis.com/css?family=Nunito:300,400,700,900|Slackey&display=swap'
const loadFont = `<link href=${font} rel='stylesheet' type='text/css'>`
document.head.innerHTML += loadFont

const defines = {
    fonts: {
        slackey         : `'Slackey', Arial, sans-serif`,
        nunito          : `'Nunito', Arial, sans-serif`,
    },
    sizes: {
        'xx-small'      : '1.2rem',
        'x-small'       : '1.3rem',
        small           : '1.4rem',
        medium          : '1.6rem',
        large           : '2rem',
        'x-large'       : '3rem',
        'xx-large'      : '4rem',
        'xxx-large'     : '5rem',
    },
    colors: {
        white           : '#fff',
        skyblue         : '#b3e2ff',
        turquoise       : '#aae6ed',
        pink            : '#e14365',
        grey            : '#333333',
        lightGrey       : '#999999',
        lightGreen      : '#a1e9da',
        blueGreen       : '#00a6ad',
        purple          : '#b337fb',
        lightBluePurple : '#9db9ee',
        bluePurple      : '#9a91ff',
        lightPurple     : '#beb2d7',
        lightYellow     : '#eddca4',
        lightSky        : '#b4e4fd',
        green           : '#4aa95b',
        lowYellow       : '#fdfbee',
        brown           : '#b06d56',
    }
}

const theme = {
    bodyFont            : defines.fonts.nunito,
    bodyColor           : defines.colors.grey,
    bodyBg              : defines.colors.lightSky,
    menuSize            : defines.sizes.small,
    titleFont           : defines.fonts.slackey,
    titleSize           : defines.sizes['xxx-large'],
    titleSizeM          : '3.6rem',
    titlesSizeS         : '2.8rem',
    titleColor          : defines.colors.white,
    playBgGStart        : defines.colors.skyblue,
    playBgGEnd          : defines.colors.turquoise,
    subTitleSize        : '4.2rem',
    section1TitleColor  : defines.colors.pink,
    section2TitleColor  : defines.colors.blueGreen,
    section3TitleColor  : defines.colors.purple,
    section4TitleColor  : defines.colors.brown,
    section5TitleColor  : defines.colors.green,
    articleSize         : defines.sizes.small,
    articleColor        : defines.colors.grey,
    section1BgGStart    : defines.colors.turquoise,
    section1BgGEnd      : defines.colors.lightGreen,
    section2BgGStart    : defines.colors.lightGreen,
    section2BgGEnd      : defines.colors.lightBluePurple,
    section3BgGStart    : defines.colors.lightBluePurple,
    section3BgGEnd      : defines.colors.bluePurple,
    section4BgGStart    : defines.colors.bluePurple,
    section4BgGEnd      : defines.colors.lightPurple,
    section5BgGStart    : defines.colors.lightPurple,
    section5BgGMiddle   : defines.colors.lightYellow,
    section5BgGEnd      : defines.colors.lightSky,
    sectionButtonSize   : defines.sizes.small,
    roadmapHeadlline    : '4rem',
    roadmapHeadllineM   : '3rem',
    roadmapHeadllineS   : '1.6rem',
    roadmapTitleSize    : defines.sizes.large,
    roadmapTitleSizeM   : defines.sizes.medium,
    roadmapTitleColor   : defines.colors.blueGreen,
    roadmapTextSize     : defines.sizes.medium,
    roadmapTextSizeM    : defines.sizes["x-small"],
    contributorsBg              : defines.colors.lowYellow,
    contributorsTextSize        : defines.sizes.small,
    contributorsTextSizeS       : defines.sizes["xx-small"],
    contributorsCareerColor     : defines.colors.lightGrey,
    footerTextColor     : defines.colors.grey,
    footerBg            : defines.colors.lightSky
}

module.exports = theme

},{}]},{},[19]);
