(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var VERBATIM_TAGS = [
  'code', 'pre', 'textarea'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = document.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes if the current node is not a node
        // where all whitespace must be preserved
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],2:[function(require,module,exports){
var hyperx = require('hyperx')
var appendChild = require('./appendChild')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
]

var COMMENT_TAG = '!--'

var SVG_TAGS = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS.indexOf(key) !== -1) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  appendChild(el, children)
  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"./appendChild":1,"hyperx":23}],3:[function(require,module,exports){
(function (global){(function (){
'use strict';

var csjs = require('csjs');
var insertCss = require('insert-css');

function csjsInserter() {
  var args = Array.prototype.slice.call(arguments);
  var result = csjs.apply(null, args);
  if (global.document) {
    insertCss(csjs.getCss(result));
  }
  return result;
}

module.exports = csjsInserter;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"csjs":8,"insert-css":24}],4:[function(require,module,exports){
'use strict';

module.exports = require('csjs/get-css');

},{"csjs/get-css":7}],5:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs;
module.exports.csjs = csjs;
module.exports.getCss = require('./get-css');

},{"./csjs":3,"./get-css":4}],6:[function(require,module,exports){
'use strict';

module.exports = require('./lib/csjs');

},{"./lib/csjs":12}],7:[function(require,module,exports){
'use strict';

module.exports = require('./lib/get-css');

},{"./lib/get-css":16}],8:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs();
module.exports.csjs = csjs;
module.exports.noScope = csjs({ noscope: true });
module.exports.getCss = require('./get-css');

},{"./csjs":6,"./get-css":7}],9:[function(require,module,exports){
'use strict';

/**
 * base62 encode implementation based on base62 module:
 * https://github.com/andrew/base62.js
 */

var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = function encode(integer) {
  if (integer === 0) {
    return '0';
  }
  var str = '';
  while (integer > 0) {
    str = CHARS[integer % 62] + str;
    integer = Math.floor(integer / 62);
  }
  return str;
};

},{}],10:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

module.exports = function createExports(classes, keyframes, compositions) {
  var keyframesObj = Object.keys(keyframes).reduce(function(acc, key) {
    var val = keyframes[key];
    acc[val] = makeComposition([key], [val], true);
    return acc;
  }, {});

  var exports = Object.keys(classes).reduce(function(acc, key) {
    var val = classes[key];
    var composition = compositions[key];
    var extended = composition ? getClassChain(composition) : [];
    var allClasses = [key].concat(extended);
    var unscoped = allClasses.map(function(name) {
      return classes[name] ? classes[name] : name;
    });
    acc[val] = makeComposition(allClasses, unscoped);
    return acc;
  }, keyframesObj);

  return exports;
}

function getClassChain(obj) {
  var visited = {}, acc = [];

  function traverse(obj) {
    return Object.keys(obj).forEach(function(key) {
      if (!visited[key]) {
        visited[key] = true;
        acc.push(key);
        traverse(obj[key]);
      }
    });
  }

  traverse(obj);
  return acc;
}

},{"./composition":11}],11:[function(require,module,exports){
'use strict';

module.exports = {
  makeComposition: makeComposition,
  isComposition: isComposition,
  ignoreComposition: ignoreComposition
};

/**
 * Returns an immutable composition object containing the given class names
 * @param  {array} classNames - The input array of class names
 * @return {Composition}      - An immutable object that holds multiple
 *                              representations of the class composition
 */
function makeComposition(classNames, unscoped, isAnimation) {
  var classString = classNames.join(' ');
  return Object.create(Composition.prototype, {
    classNames: { // the original array of class names
      value: Object.freeze(classNames),
      configurable: false,
      writable: false,
      enumerable: true
    },
    unscoped: { // the original array of class names
      value: Object.freeze(unscoped),
      configurable: false,
      writable: false,
      enumerable: true
    },
    className: { // space-separated class string for use in HTML
      value: classString,
      configurable: false,
      writable: false,
      enumerable: true
    },
    selector: { // comma-separated, period-prefixed string for use in CSS
      value: classNames.map(function(name) {
        return isAnimation ? name : '.' + name;
      }).join(', '),
      configurable: false,
      writable: false,
      enumerable: true
    },
    toString: { // toString() method, returns class string for use in HTML
      value: function() {
        return classString;
      },
      configurable: false,
      writeable: false,
      enumerable: false
    }
  });
}

/**
 * Returns whether the input value is a Composition
 * @param value      - value to check
 * @return {boolean} - whether value is a Composition or not
 */
function isComposition(value) {
  return value instanceof Composition;
}

function ignoreComposition(values) {
  return values.reduce(function(acc, val) {
    if (isComposition(val)) {
      val.classNames.forEach(function(name, i) {
        acc[name] = val.unscoped[i];
      });
    }
    return acc;
  }, {});
}

/**
 * Private constructor for use in `instanceof` checks
 */
function Composition() {}

},{}],12:[function(require,module,exports){
'use strict';

var extractExtends = require('./css-extract-extends');
var composition = require('./composition');
var isComposition = composition.isComposition;
var ignoreComposition = composition.ignoreComposition;
var buildExports = require('./build-exports');
var scopify = require('./scopeify');
var cssKey = require('./css-key');
var extractExports = require('./extract-exports');

module.exports = function csjsTemplate(opts) {
  opts = (typeof opts === 'undefined') ? {} : opts;
  var noscope = (typeof opts.noscope === 'undefined') ? false : opts.noscope;

  return function csjsHandler(strings, values) {
    // Fast path to prevent arguments deopt
    var values = Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
      values[i - 1] = arguments[i];
    }
    var css = joiner(strings, values.map(selectorize));
    var ignores = ignoreComposition(values);

    var scope = noscope ? extractExports(css) : scopify(css, ignores);
    var extracted = extractExtends(scope.css);
    var localClasses = without(scope.classes, ignores);
    var localKeyframes = without(scope.keyframes, ignores);
    var compositions = extracted.compositions;

    var exports = buildExports(localClasses, localKeyframes, compositions);

    return Object.defineProperty(exports, cssKey, {
      enumerable: false,
      configurable: false,
      writeable: false,
      value: extracted.css
    });
  }
}

/**
 * Replaces class compositions with comma seperated class selectors
 * @param  value - the potential class composition
 * @return       - the original value or the selectorized class composition
 */
function selectorize(value) {
  return isComposition(value) ? value.selector : value;
}

/**
 * Joins template string literals and values
 * @param  {array} strings - array of strings
 * @param  {array} values  - array of values
 * @return {string}        - strings and values joined
 */
function joiner(strings, values) {
  return strings.map(function(str, i) {
    return (i !== values.length) ? str + values[i] : str;
  }).join('');
}

/**
 * Returns first object without keys of second
 * @param  {object} obj      - source object
 * @param  {object} unwanted - object with unwanted keys
 * @return {object}          - first object without unwanted keys
 */
function without(obj, unwanted) {
  return Object.keys(obj).reduce(function(acc, key) {
    if (!unwanted[key]) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

},{"./build-exports":10,"./composition":11,"./css-extract-extends":13,"./css-key":14,"./extract-exports":15,"./scopeify":21}],13:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

var regex = /\.([^\s]+)(\s+)(extends\s+)(\.[^{]+)/g;

module.exports = function extractExtends(css) {
  var found, matches = [];
  while (found = regex.exec(css)) {
    matches.unshift(found);
  }

  function extractCompositions(acc, match) {
    var extendee = getClassName(match[1]);
    var keyword = match[3];
    var extended = match[4];

    // remove from output css
    var index = match.index + match[1].length + match[2].length;
    var len = keyword.length + extended.length;
    acc.css = acc.css.slice(0, index) + " " + acc.css.slice(index + len + 1);

    var extendedClasses = splitter(extended);

    extendedClasses.forEach(function(className) {
      if (!acc.compositions[extendee]) {
        acc.compositions[extendee] = {};
      }
      if (!acc.compositions[className]) {
        acc.compositions[className] = {};
      }
      acc.compositions[extendee][className] = acc.compositions[className];
    });
    return acc;
  }

  return matches.reduce(extractCompositions, {
    css: css,
    compositions: {}
  });

};

function splitter(match) {
  return match.split(',').map(getClassName);
}

function getClassName(str) {
  var trimmed = str.trim();
  return trimmed[0] === '.' ? trimmed.substr(1) : trimmed;
}

},{"./composition":11}],14:[function(require,module,exports){
'use strict';

/**
 * CSS identifiers with whitespace are invalid
 * Hence this key will not cause a collision
 */

module.exports = ' css ';

},{}],15:[function(require,module,exports){
'use strict';

var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = extractExports;

function extractExports(css) {
  return {
    css: css,
    keyframes: getExport(css, keyframesRegex),
    classes: getExport(css, classRegex)
  };
}

function getExport(css, regex) {
  var prop = {};
  var match;
  while((match = regex.exec(css)) !== null) {
    var name = match[2];
    prop[name] = name;
  }
  return prop;
}

},{"./regex":18}],16:[function(require,module,exports){
'use strict';

var cssKey = require('./css-key');

module.exports = function getCss(csjs) {
  return csjs[cssKey];
};

},{"./css-key":14}],17:[function(require,module,exports){
'use strict';

/**
 * djb2 string hash implementation based on string-hash module:
 * https://github.com/darkskyapp/string-hash
 */

module.exports = function hashStr(str) {
  var hash = 5381;
  var i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash >>> 0;
};

},{}],18:[function(require,module,exports){
'use strict';

var findClasses = /(\.)(?!\d)([^\s\.,{\[>+~#:)]*)(?![^{]*})/.source;
var findKeyframes = /(@\S*keyframes\s*)([^{\s]*)/.source;
var ignoreComments = /(?!(?:[^*/]|\*[^/]|\/[^*])*\*+\/)/.source;

var classRegex = new RegExp(findClasses + ignoreComments, 'g');
var keyframesRegex = new RegExp(findKeyframes + ignoreComments, 'g');

module.exports = {
  classRegex: classRegex,
  keyframesRegex: keyframesRegex,
  ignoreComments: ignoreComments,
};

},{}],19:[function(require,module,exports){
var ignoreComments = require('./regex').ignoreComments;

module.exports = replaceAnimations;

function replaceAnimations(result) {
  var animations = Object.keys(result.keyframes).reduce(function(acc, key) {
    acc[result.keyframes[key]] = key;
    return acc;
  }, {});
  var unscoped = Object.keys(animations);

  if (unscoped.length) {
    var regexStr = '((?:animation|animation-name)\\s*:[^};]*)('
      + unscoped.join('|') + ')([;\\s])' + ignoreComments;
    var regex = new RegExp(regexStr, 'g');

    var replaced = result.css.replace(regex, function(match, preamble, name, ending) {
      return preamble + animations[name] + ending;
    });

    return {
      css: replaced,
      keyframes: result.keyframes,
      classes: result.classes
    }
  }

  return result;
}

},{"./regex":18}],20:[function(require,module,exports){
'use strict';

var encode = require('./base62-encode');
var hash = require('./hash-string');

module.exports = function fileScoper(fileSrc) {
  var suffix = encode(hash(fileSrc));

  return function scopedName(name) {
    return name + '_' + suffix;
  }
};

},{"./base62-encode":9,"./hash-string":17}],21:[function(require,module,exports){
'use strict';

var fileScoper = require('./scoped-name');
var replaceAnimations = require('./replace-animations');
var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = scopify;

function scopify(css, ignores) {
  var makeScopedName = fileScoper(css);
  var replacers = {
    classes: classRegex,
    keyframes: keyframesRegex
  };

  function scopeCss(result, key) {
    var replacer = replacers[key];
    function replaceFn(fullMatch, prefix, name) {
      var scopedName = ignores[name] ? name : makeScopedName(name);
      result[key][scopedName] = name;
      return prefix + scopedName;
    }
    return {
      css: result.css.replace(replacer, replaceFn),
      keyframes: result.keyframes,
      classes: result.classes
    };
  }

  var result = Object.keys(replacers).reduce(scopeCss, {
    css: css,
    keyframes: {},
    classes: {}
  });

  return replaceAnimations(result);
}

},{"./regex":18,"./replace-animations":19,"./scoped-name":20}],22:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],23:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else if (xstate === COMMENT && opts.comments) {
          reg += String(arg)
        } else if (xstate !== COMMENT) {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      if (opts.createFragment) return opts.createFragment(tree[2])
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else if (x === null || x === undefined) return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":22}],24:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
/**
 * Zenscroll 4.0.2
 * https://github.com/zengabor/zenscroll/
 *
 * Copyright 2015–2018 Gabor Lenard
 *
 * This is free and unencumbered software released into the public domain.
 * 
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 * 
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * For more information, please refer to <http://unlicense.org>
 * 
 */

/*jshint devel:true, asi:true */

/*global define, module */


(function (root, factory) {
	if (typeof define === "function" && define.amd) {
		define([], factory())
	} else if (typeof module === "object" && module.exports) {
		module.exports = factory()
	} else {
		(function install() {
			// To make sure Zenscroll can be referenced from the header, before `body` is available
			if (document && document.body) {
				root.zenscroll = factory()
			} else {
				// retry 9ms later
				setTimeout(install, 9)
			}
		})()
	}
}(this, function () {
	"use strict"


	// Detect if the browser already supports native smooth scrolling (e.g., Firefox 36+ and Chrome 49+) and it is enabled:
	var isNativeSmoothScrollEnabledOn = function (elem) {
		return elem && "getComputedStyle" in window &&
			window.getComputedStyle(elem)["scroll-behavior"] === "smooth"
	}


	// Exit if it’s not a browser environment:
	if (typeof window === "undefined" || !("document" in window)) {
		return {}
	}


	var makeScroller = function (container, defaultDuration, edgeOffset) {

		// Use defaults if not provided
		defaultDuration = defaultDuration || 999 //ms
		if (!edgeOffset && edgeOffset !== 0) {
			// When scrolling, this amount of distance is kept from the edges of the container:
			edgeOffset = 9 //px
		}

		// Handling the life-cycle of the scroller
		var scrollTimeoutId
		var setScrollTimeoutId = function (newValue) {
			scrollTimeoutId = newValue
		}

		/**
		 * Stop the current smooth scroll operation immediately
		 */
		var stopScroll = function () {
			clearTimeout(scrollTimeoutId)
			setScrollTimeoutId(0)
		}

		var getTopWithEdgeOffset = function (elem) {
			return Math.max(0, container.getTopOf(elem) - edgeOffset)
		}

		/**
		 * Scrolls to a specific vertical position in the document.
		 *
		 * @param {targetY} The vertical position within the document.
		 * @param {duration} Optionally the duration of the scroll operation.
		 *        If not provided the default duration is used.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollToY = function (targetY, duration, onDone) {
			stopScroll()
			if (duration === 0 || (duration && duration < 0) || isNativeSmoothScrollEnabledOn(container.body)) {
				container.toY(targetY)
				if (onDone) {
					onDone()
				}
			} else {
				var startY = container.getY()
				var distance = Math.max(0, targetY) - startY
				var startTime = new Date().getTime()
				duration = duration || Math.min(Math.abs(distance), defaultDuration);
				(function loopScroll() {
					setScrollTimeoutId(setTimeout(function () {
						// Calculate percentage:
						var p = Math.min(1, (new Date().getTime() - startTime) / duration)
						// Calculate the absolute vertical position:
						var y = Math.max(0, Math.floor(startY + distance*(p < 0.5 ? 2*p*p : p*(4 - p*2)-1)))
						container.toY(y)
						if (p < 1 && (container.getHeight() + y) < container.body.scrollHeight) {
							loopScroll()
						} else {
							setTimeout(stopScroll, 99) // with cooldown time
							if (onDone) {
								onDone()
							}
						}
					}, 9))
				})()
			}
		}

		/**
		 * Scrolls to the top of a specific element.
		 *
		 * @param {elem} The element to scroll to.
		 * @param {duration} Optionally the duration of the scroll operation.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollToElem = function (elem, duration, onDone) {
			scrollToY(getTopWithEdgeOffset(elem), duration, onDone)
		}

		/**
		 * Scrolls an element into view if necessary.
		 *
		 * @param {elem} The element.
		 * @param {duration} Optionally the duration of the scroll operation.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollIntoView = function (elem, duration, onDone) {
			var elemHeight = elem.getBoundingClientRect().height
			var elemBottom = container.getTopOf(elem) + elemHeight
			var containerHeight = container.getHeight()
			var y = container.getY()
			var containerBottom = y + containerHeight
			if (getTopWithEdgeOffset(elem) < y || (elemHeight + edgeOffset) > containerHeight) {
				// Element is clipped at top or is higher than screen.
				scrollToElem(elem, duration, onDone)
			} else if ((elemBottom + edgeOffset) > containerBottom) {
				// Element is clipped at the bottom.
				scrollToY(elemBottom - containerHeight + edgeOffset, duration, onDone)
			} else if (onDone) {
				onDone()
			}
		}

		/**
		 * Scrolls to the center of an element.
		 *
		 * @param {elem} The element.
		 * @param {duration} Optionally the duration of the scroll operation.
		 * @param {offset} Optionally the offset of the top of the element from the center of the screen.
		 *        A value of 0 is ignored.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollToCenterOf = function (elem, duration, offset, onDone) {
			scrollToY(Math.max(0, container.getTopOf(elem) - container.getHeight()/2 + (offset || elem.getBoundingClientRect().height/2)), duration, onDone)
		}

		/**
		 * Changes default settings for this scroller.
		 *
		 * @param {newDefaultDuration} Optionally a new value for default duration, used for each scroll method by default.
		 *        Ignored if null or undefined.
		 * @param {newEdgeOffset} Optionally a new value for the edge offset, used by each scroll method by default. Ignored if null or undefined.
		 * @returns An object with the current values.
		 */
		var setup = function (newDefaultDuration, newEdgeOffset) {
			if (newDefaultDuration === 0 || newDefaultDuration) {
				defaultDuration = newDefaultDuration
			}
			if (newEdgeOffset === 0 || newEdgeOffset) {
				edgeOffset = newEdgeOffset
			}
			return {
				defaultDuration: defaultDuration,
				edgeOffset: edgeOffset
			}
		}

		return {
			setup: setup,
			to: scrollToElem,
			toY: scrollToY,
			intoView: scrollIntoView,
			center: scrollToCenterOf,
			stop: stopScroll,
			moving: function () { return !!scrollTimeoutId },
			getY: container.getY,
			getTopOf: container.getTopOf
		}

	}


	var docElem = document.documentElement
	var getDocY = function () { return window.scrollY || docElem.scrollTop }

	// Create a scroller for the document:
	var zenscroll = makeScroller({
		body: document.scrollingElement || document.body,
		toY: function (y) { window.scrollTo(0, y) },
		getY: getDocY,
		getHeight: function () { return window.innerHeight || docElem.clientHeight },
		getTopOf: function (elem) { return elem.getBoundingClientRect().top + getDocY() - docElem.offsetTop }
	})


	/**
	 * Creates a scroller from the provided container element (e.g., a DIV)
	 *
	 * @param {scrollContainer} The vertical position within the document.
	 * @param {defaultDuration} Optionally a value for default duration, used for each scroll method by default.
	 *        Ignored if 0 or null or undefined.
	 * @param {edgeOffset} Optionally a value for the edge offset, used by each scroll method by default. 
	 *        Ignored if null or undefined.
	 * @returns A scroller object, similar to `zenscroll` but controlling the provided element.
	 */
	zenscroll.createScroller = function (scrollContainer, defaultDuration, edgeOffset) {
		return makeScroller({
			body: scrollContainer,
			toY: function (y) { scrollContainer.scrollTop = y },
			getY: function () { return scrollContainer.scrollTop },
			getHeight: function () { return Math.min(scrollContainer.clientHeight, window.innerHeight || docElem.clientHeight) },
			getTopOf: function (elem) { return elem.offsetTop }
		}, defaultDuration, edgeOffset)
	}


	// Automatic link-smoothing on achors
	// Exclude IE8- or when native is enabled or Zenscroll auto- is disabled
	if ("addEventListener" in window && !window.noZensmooth && !isNativeSmoothScrollEnabledOn(document.body)) {

		var isHistorySupported = "history" in window && "pushState" in history
		var isScrollRestorationSupported = isHistorySupported && "scrollRestoration" in history

		// On first load & refresh make sure the browser restores the position first
		if (isScrollRestorationSupported) {
			history.scrollRestoration = "auto"
		}

		window.addEventListener("load", function () {

			if (isScrollRestorationSupported) {
				// Set it to manual
				setTimeout(function () { history.scrollRestoration = "manual" }, 9)
				window.addEventListener("popstate", function (event) {
					if (event.state && "zenscrollY" in event.state) {
						zenscroll.toY(event.state.zenscrollY)
					}
				}, false)
			}

			// Add edge offset on first load if necessary
			// This may not work on IE (or older computer?) as it requires more timeout, around 100 ms
			if (window.location.hash) {
				setTimeout(function () {
					// Adjustment is only needed if there is an edge offset:
					var edgeOffset = zenscroll.setup().edgeOffset
					if (edgeOffset) {
						var targetElem = document.getElementById(window.location.href.split("#")[1])
						if (targetElem) {
							var targetY = Math.max(0, zenscroll.getTopOf(targetElem) - edgeOffset)
							var diff = zenscroll.getY() - targetY
							// Only do the adjustment if the browser is very close to the element:
							if (0 <= diff && diff < 9 ) {
								window.scrollTo(0, targetY)
							}
						}
					}
				}, 9)
			}

		}, false)

		// Handling clicks on anchors
		var RE_noZensmooth = new RegExp("(^|\\s)noZensmooth(\\s|$)")
		window.addEventListener("click", function (event) {
			var anchor = event.target
			while (anchor && anchor.tagName !== "A") {
				anchor = anchor.parentNode
			}
			// Let the browser handle the click if it wasn't with the primary button, or with some modifier keys:
			if (!anchor || event.which !== 1 || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) {
				return
			}
			// Save the current scrolling position so it can be used for scroll restoration:
			if (isScrollRestorationSupported) {
				var historyState = history.state && typeof history.state === "object" ? history.state : {}
				historyState.zenscrollY = zenscroll.getY()
				try {
					history.replaceState(historyState, "")
				} catch (e) {
					// Avoid the Chrome Security exception on file protocol, e.g., file://index.html
				}
			}
			// Find the referenced ID:
			var href = anchor.getAttribute("href") || ""
			if (href.indexOf("#") === 0 && !RE_noZensmooth.test(anchor.className)) {
				var targetY = 0
				var targetElem = document.getElementById(href.substring(1))
				if (href !== "#") {
					if (!targetElem) {
						// Let the browser handle the click if the target ID is not found.
						return
					}
					targetY = zenscroll.getTopOf(targetElem)
				}
				event.preventDefault()
				// By default trigger the browser's `hashchange` event...
				var onDone = function () { window.location = href }
				// ...unless there is an edge offset specified
				var edgeOffset = zenscroll.setup().edgeOffset
				if (edgeOffset) {
					targetY = Math.max(0, targetY - edgeOffset)
					if (isHistorySupported) {
						onDone = function () { history.pushState({}, "", href) }
					}
				}
				zenscroll.toY(targetY, null, onDone)
			}
		}, false)

	}


	return zenscroll


}));

},{}],28:[function(require,module,exports){
(function (process,__filename){(function (){

// pages
const topnav = require('topnav')
const Header = require('header')
const datdot = require('datdot')
const editor = require('editor')
const smartcontract_codes = require('smartcontract-codes')
const supporters = require('supporters')
const our_contributors = require('our-contributors')
const Footer = require('footer')
const fetch_data = require('fetch-data')
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

async function make_page(opts, done, lang) {
  // ----------------------------------------
  // ID + JSON STATE
  // ----------------------------------------
  const id = `${ID}:${count++}` // assigns their own name
  const status = {}
  const state = STATE.ids[id] = { id, status, wait: {}, net: {}, aka: {} } // all state of component instance
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
  const { menu, header, section1, section2, section3, section4, section5, footer } = text.pages
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
  main.append(await topnav(menu), await Header(header), await datdot(section1), await editor(section2), await smartcontract_codes(section3), await supporters(section4), await our_contributors(section5), await Footer(footer))
  return el
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
},{"_process":25,"datdot":32,"editor":33,"fetch-data":34,"footer":35,"header":37,"our-contributors":39,"smartcontract-codes":40,"supporters":41,"topnav":42}],29:[function(require,module,exports){
(function (process,__filename){(function (){
const bel = require('bel')
const csjs = require('csjs-inject')
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
},{"_process":25,"bel":2,"csjs-inject":5}],30:[function(require,module,exports){
(function (process,__filename){(function (){
const bel = require('bel')
const csjs = require('csjs-inject')
// Widgets
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

async function contributor(person, className, theme) {
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
},{"_process":25,"bel":2,"csjs-inject":5,"graphic":36}],31:[function(require,module,exports){
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
},{"_process":25}],32:[function(require,module,exports){
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
},{"_process":25,"content":29,"graphic":36,"rellax":26}],33:[function(require,module,exports){
(function (process,__filename){(function (){
const bel = require('bel')
const csjs = require('csjs-inject')
// Widgets
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
},{"_process":25,"bel":2,"content":29,"csjs-inject":5,"graphic":36,"rellax":26}],34:[function(require,module,exports){
module.exports = fetch_data

async function fetch_data(path) {
    let response = await fetch(path)
    if (response.status == 200) {
        let texts = await response.json()
        return texts
    }
    throw new Error(response.status)
}
},{}],35:[function(require,module,exports){
(function (process,__filename){(function (){
// widgets
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
},{"_process":25,"graphic":36}],36:[function(require,module,exports){
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
},{"loadSVG":38}],37:[function(require,module,exports){
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
},{"_process":25,"graphic":36,"rellax":26}],38:[function(require,module,exports){
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
},{}],39:[function(require,module,exports){
(function (process,__filename){(function (){
// Widgets
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
const sheet = new CSSStyleSheet
sheet.replaceSync(get_theme())
const default_opts = { }
const shopts = { mode: 'closed' }
// ----------------------------------------
module.exports = our_contributors

async function our_contributors (data) {
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
    const contributors = await Promise.all(data.contributors.map(person => Contributor( person, 'group')))

    let cloud1Rellax = new Rellax( cloud1, { speed: 0.3})
    let cloud2Rellax = new Rellax( cloud2, { speed: 0.4})
    let cloud3Rellax = new Rellax( cloud3, { speed: 0.3})
    // ----------------------------------------
    // TEMPLATE
    // ----------------------------------------
    const el = document.createElement('div')
    const shadow = el.attachShadow(shopts)
    shadow.adoptedStyleSheets = [sheet]
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
    return el

}
function get_theme () {
  return `
.section {
    position: relative;
    background-image: linear-gradient(0deg, var(--section5BgGEnd), var(--section5BgGMiddle), var(--section5BgGStart));
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: repeat(3, 1fr);
    padding: 5vw 2vw 10vw 2vw;
}
.content {
    position: relative;
    z-index: 9;
    grid-row-start: 1;
    grid-row-end: 2;
    grid-column-start: 3;
    text-align: center;
    padding: 0;
}
.subTitleColor {
    color: var(--section5TitleColor);
    margin: 0;
    padding: 2.5rem 0;
}
.inner {
    position: relative;
    grid-row-start: 1;
    grid-row-end: 3;
    grid-column-start: 1;
    grid-column-end: 4;
}
.island {
    position: relative;
    z-index: 10;
    width: 62%;
}
.groups {
    z-index: 9;
    grid-row-start: 2;
    grid-row-end: 3;
    grid-column-start: 2;
    grid-column-end: 4;
    width: 100%;
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: repeat(12, 12.5%);
    justify-self: end;
    margin-top: 20%;
}
.group {
    position: relative;
    z-index: 4;
    width: 100%;
}
.group:nth-child(4n) {
  grid-column-start: 1;
  grid-column-end: 4;
}
.group:nth-child(4n + 1) {
  grid-column-start: 5;
  grid-column-end: 8;
}
.group:nth-child(4n + 2) {
  grid-column-start: 2;
  grid-column-end: 5;
}
.group:nth-child(4n + 3) {
  grid-column-start: 6;
  grid-column-end: 9;
}

.group:nth-child(1) {
  grid-column-start: 4;
  grid-column-end: 7;
}
@media only screen and (max-width: 1024px) {
    .section {
        grid-template-columns: 1fr;
    }
    .content {
        grid-column-start: 1;
        grid-row-start: 1;
    }
    .inner {
        grid-column-start: 1;
        grid-row-start: 2;
    }
    .inner .island {
        width: 98%;
    }
    .groups {
        position: relative;
        grid-column-start: 1;
        grid-row-start: 3;
        grid-template-columns: 1fr 1fr;
        margin-top: 0;
    }
    .group{
        margin-top: 5%;
    }
    .group:nth-child(2n + 1) {
        grid-column-start: 1;
        grid-column-end: 1;
        margin-top: -35%;
    }
    .group:nth-child(2n) {
        grid-column-start: 2;
        grid-column-end: 2;
    }
}
@media only screen and (max-width: 640px) {
    .groups {
        grid-template-columns: 1fr;
    }
    .group {
        grid-column-end: 1 !important;
        width: 82%;
        margin-top: 2% !important;
        margin-left: 5%;
        grid-column-start: 1 !important;
        grid-column-end: 1 !important;
    }
    .group:nth-child(2n) {
        margin-left: 15%;
    }
}
.avatar {
    position: relative;
    z-index: 2;
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
.cloud1 {
    position: absolute;
    z-index: 2;
    width: 8vw;
    top: 10vw;
    left: 5vw;
}
.cloud2 {
    position: absolute;
    z-index: 3;
    width: 12vw;
    top: 5vw;
    left: 20vw;
}
.cloud3 {
    position: absolute;
    z-index: 4;
    width: 6vw;
    top: 15vw;
    left: 50vw;
}
.cloud4 {
    position: absolute;
    z-index: 5;
    width: 12vw;
    bottom: 12vw;
    left: 5vw;
}
.cloud5 {
    position: absolute;
    z-index: 5;
    width: 8vw;
    bottom: 5vw;
    left: 30vw;
}
.cloud6 {
    position: absolute;
    z-index: 4;
    width: 14vw;
    bottom: 0;
    right: 25vw;
}
.cloud7 {
    position: absolute;
    z-index: 3;
    width: 6vw;
    bottom: 5vw;
    right: 10vw;
}
@media only screen and (min-width: 2561px) {
    .info {
        font-size: calc(var(--contributorsTextSize) * 1.35);
    }
}
    .info {
        font-size: var(--contributorsTextSizeS);
    }
    .cloud1 {
        width: 12vw;
        top: 30vw;
    }
    .cloud2 {
        top: 22vw;
    }
    .cloud3 {
        width: 12vw;
        top: 35vw;
        left: 75vw;
    }
    .cloud4 {
        z-index: 1;
        width: 20vw;
        bottom: 40vw;
    }
    .cloud5 {
        width: 15vw;
        left: 10vw;
        bottom: 20vw;
    }
    .cloud6 {
        width: 30vw;
        bottom: 5vw;
        right: 35vw;
    }
    .cloud7 {
        width: 15vw;
        bottom: 20vw;
    }
}
@media only screen and (max-width: 414px) {
    .groups {
        width: 100%;
    }
    .cloud1 {
        top: 63vw;
    }
    .cloud2 {
        top: 56vw;
    }
    .cloud3 {
        top: 65vw;
    }
    .cloud4 {
        bottom: 30vw;
    }
    .cloud5 {
        bottom: 10vw;
    }
    .cloud6 {
        bottom: 5vw;
    }
    .cloud7 {
        bottom: 8vw;
    }
}
@media only screen and (min-width: 414px)
and (max-width: 736px) and (orientation: landscape) {
    .section {
        margin-top: -1px;
    }
    .cloud1 {
        top: 50vw;
    }
    .cloud2 {
        top: 48vw;
    }
    .cloud3 {
        top: 55vw;
    }
}
`}
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
}).call(this)}).call(this,require('_process'),"/src/node_modules/our-contributors.js")
},{"_process":25,"content":29,"contributor":30,"graphic":36,"rellax":26}],40:[function(require,module,exports){
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
}).call(this)}).call(this,require('_process'),"/src/node_modules/smartcontract-codes.js")
},{"_process":25,"content":29,"graphic":36}],41:[function(require,module,exports){
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
    bottom: 36%;
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
},{"_process":25,"crystalIsland":31,"graphic":36,"rellax":26}],42:[function(require,module,exports){
(function (process,__filename){(function (){
const graphic = require('graphic')
const zenscroll = require('zenscroll')
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

async function topnav(data) {
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
			let id = document.querySelector(`#${url}`)
			console.log("@TODO: Implement scroll to specific component")
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
},{"_process":25,"graphic":36,"zenscroll":27}],43:[function(require,module,exports){
(function (process,__filename,__dirname){(function (){
const bel = require('bel')
const csjs = require('csjs-inject')
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
	const appleTouch = bel`<link rel="apple-touch-icon" sizes="180x180" href="./src/node_modules/assets/images/favicon/apple-touch-icon.png">`
	const icon32 = bel`<link rel="icon" type="image/png" sizes="32x32" href="./src/node_modules/assets/images/favicon/favicon-32x32.png">`
	const icon16 = bel`<link rel="icon" type="image/png" sizes="16x16" href="./src/node_modules/assets/images/favicon/favicon-16x16.png">`
	const webmanifest = bel`<link rel="manifest" href="./src/node_modules/assets/images/favicon/site.webmanifest"></link>`
  html.setAttribute('lang', 'en')
  meta.setAttribute('name', 'viewport')
  meta.setAttribute('content', 'width=device-width,initial-scale=1.0')
  const fonts = new CSSStyleSheet()
  // @TODO: use font api and cache to avoid re-downloading the font data every time
  const font1_url = path('theme/assets/fonts/Silkscreen-Regular.ttf')
  const font2_url = path('theme/assets/fonts/Silkscreen-Bold.ttf')
  fonts.replaceSync(`
  /* latin-ext */
  @font-face {
    font-family: 'Silkscreen';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(${font1_url}) format('truetype');
    unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Silkscreen';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(${font1_url}) format('truetype');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Silkscreen';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url(${font2_url}) format('truetype');
    unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Silkscreen';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url(${font2_url}) format('truetype');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  `)
  document.adoptedStyleSheets = [fonts, sheet]
  document.head.append(meta, appleTouch, icon16, icon32, webmanifest)
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
},{"../":28,"_process":25,"bel":2,"csjs-inject":5,"theme":44}],44:[function(require,module,exports){
const bel = require('bel')
const font = 'https://fonts.googleapis.com/css?family=Nunito:300,400,700,900|Slackey&display=swap'
const loadFont = bel`<link href=${font} rel='stylesheet' type='text/css'>`
document.head.appendChild(loadFont)

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

},{"bel":2}]},{},[43]);
