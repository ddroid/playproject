## Fallbacks

Modules and instances are entities created to have their behavior dictated by the input data. The fallback system is designed to manage this data, allowing each entity (module or instance) to inherit or override functionality from a parent. This system supports multiple levels of overrides and fallbacks, with constraints on how IDs are used to uniquely identify each sub-instance within a hierarchy. Moreover, it makes sure that the website never reaches a situation where entities have no data to be guided.

**Rules**:
- Each entity (module/instance) has a unique ID in a component except for ID `0`.
- ID `0` is reserved for the root module/instance and is responsible for managing the primary state and possible sub-instances `subs`.
- Sub-instances use IDs `n`, which needs to be unique within the fallbacks inside a component.
- Fallbacks allow for cascading behavior, where higher-level modules or instances can define behaviors or structures which can override default behaviors of lower-level elements.

### Format

Each fallback consists of two main parts:
- **Module Fallback**: Defines the hierarchical structure of modules that is critical for defining the next structure.
  ```js
  function fallback_module(){
    return {
      0: {
        slot1: [1, 2, ...],
        slot2: ['data.json', 'style.css', ...],
        .
        .
        .
      },
      1: { type: '<module_name1>'},
      2: { type: '<module_name2>'},
      'data.json': { data: {} || '' },
      'style.css': { data: {} || '' },
      .
      .
      .
    }
  }
  ```
- **Instance Fallback**: Defines the hierarchical structure of instances which are the building blocks of the website.
  ```js
  function fallback_instance(){
    return {
      0: {
        slot1: [3, 4, ...],
        slot2: ['data.json', 'style.css', ...],
        .
        .
        .
      },
      3: { idx: 1 },
      4: { idx: 2 },
      'data.json': { data: {} || '' },
      'style.css': { data: {} || '' },
      .
      .
      .
    }
  }
  ```
**Explanation**:
- entry `0`, the main entry, is always required.
- Number entry represents modules or instances (alive data).
- string entry represents files of any type (dead data).
- IDs except 0 are not been repeated (inside a single component).
- Slot is an array with IDs pointing to other entries (Slotnames and mapping yet to be defined).
- `idx` in instance sub-entries points to modules inside `fallback_module`.
- Both module and instance fallbacks have almost the same structure with the only difference being `type` in module sub-entries and `idx` in instance sub-entries.

## Overrides

Overrides allow specific instances or sub-modules to change the default behavior of their sub-entities. These overrides are defined at the both module and instance level. The behavior of a module or instance is defined the by the data it is fed which is what the overrides will deal with.

### Format

The system supports multiple levels of modules and instances, with each level being able to define its own fallbacks and overrides for lower levels. Since, both module and instance fallback have similar structure, only module's format will be shown. The format involves:
- **Override level-1**: When an entity overrides the default data of a sub-entity.
```js
function fallback_module(){
  return {
    0: {
      slot1: [1],
      slot2: ['data.json']
    },
    1: { type: '<module_name>', fallback: {
      <host_module_name>: fallback_<module_name>_module
    }},
    'data.json': { data: {} || '' }
  }
}
function fallback_<module_name>_module(data){
  data[0]['new_field'] = 'new_value' //changes to data
  return data
}
```
- **Override level-2**: When an entity overrides the default data of a sub-sub-entity.
```js
function fallback_module(){
  return {
    0: {
      slot1: [1],
      slot2: ['data.json']
    },
    1: { type: '<module_name1>', slot1: [2] },
    2: { type: '<module_name2>', fallback: {
      <host_module_name>: fallback_<module_name2>_module
    }},
    'data.json': { data: {} || '' }
  }
}
function fallback_<module_name2>_module(data){
  data[0]['new_field'] = 'new_value' //changes to data
  return data
}
```
- **Overriding an override**: When an entity overrides the overriden data by a sub-entity of a sub-sub-entity.
```js
function fallback_module(){
  return {
    0: {
      slot1: [1],
      slot2: ['data.json']
    },
    1: { type: '<module_name1>', slot1: [2] },
    2: { type: '<module_name2>', fallback: {
      <host_module_name>: fallback_<module_name2>_module, <module_name1>: null
    }},
    'data.json': { data: {} || '' }
  }
}
function fallback_<module_name2>_module(data){
  data[0]['new_field'] = 'new_value' //changes to data
  return data
}
```


## Example
```js
// -----------------------------------------------------------------
// ## proposal: `version 4` (=draft)
// -----------------------------------------------------------------
// TASK: define scenario `page > app > header > menubar > button`
// * with fallbacks and overrides for button in almost all modules and instances
//
// RULE: for all state IDs
// - 0: for module or instance state
// - n: for possible sub modules/instances
// - in every file, every number `n` across module & instance fallbacks must be unique
// ------
// web/page.js
function fallback_module () {
  return {
    0: { subs: [1] },
    1: { type: 'app' },
    2: { type: 1 },
  }
}
function fallback_instance () {} // no instances
// ------
// src/app.js
const header1 = require('header')
require.cache = undefined
const header2 = require('header')
const { sdb, getsdb } = statedb(fallback_module)
function fallback_module () {
  return {
    0: { subs: [1, 2] },
    1: { type: 'header' },
    2: { type: 'header' },
  }
}
module.exports = function app (opts) {
  const { sdb } = getdb(opts.sid, fallback_instance)
  const el = document.createElement('div')
  const subs = sdb.onbatch(() => {})
  const [sub1, sub2] = subs
  console.log(sub1, sub2)
  // { sid: Symbol(55), type: 'header', idx: 1 }
  // { sid: Symbol(56), type: 'header', idx: 2 }
  el.append( 
    header1({ sid: sub1.sid }),
    header2({ sid: sub2.sid }),
  })
  function fallback_instance () {
    return {
      0: { subs: [3, 4] },
      3: { type: 1 },
      4: { type: 2 },
    }
  }
}
// src/node_modules/header/index.js
const menubar = require('menubar') // @TODO: BEFORE sdb
const sdb = statedb(fallback_module) // @TODO: VS. ...how to count on sub fallbacks defined?
const menubar = require('menubar') // @TODO: AFTER sdb
function fallback_module () {
  return {
    0: { subs: [1] }, // not overrides
    1: { type: "menubar", subs: [2] }, // @TODO: `sub: [2]` is an override in a way..
    2: { type: 'button', fallback: fallback_button_module }, // @TODO: // we WANT to set menubars sub buttons
    // when we know the menubar defaults and those of the buttons
    // also because during development, it allows us to log menubar defaults to see
    // => how they look to know what we can override in a component written by another dev
  }
}
function fallback_button_module (data, fallbacks, sdb) {
  return {
    0: {
      //
    }, 
    1: {
      //
    }
  }
}
// ...
module.exports = function header (sid) {
const { sdb } = getsdb(sid, fallback_instance)
function fallback_instance () {
  return {
    0: { sub: [3], inputs: ["header.css", "header.json"] },
    3: {
      type: 1,
      sub: [4, 5, 6, 7], // // @TODO: subs are also override
      data: { title: 'welcome' }  // @TODO: data: { /* ... */ } // is an override?
    },
    "header.css": "div{ display: none;}",
    "header.json": { some: "data" },
    4: { type: 2, fallback: [
      function fallback_button_instance (data, fallbacks, sdb) { //button instance!
        // sdb.?  ...look up what module instances are available?
        const state = data
        return fallbacks.reduce((data, f) => f(data), {})
        return state
        return { 0: { data: { label: 'main' } }
        }
      }, 'menubar'
    ] },
    5: { type: 2, fallback: [
      function fallback_button_instance (data, fallbacks, sdb) { //button instance!
        // sdb.?  ...look up what module instances are available?
        const state = data
        return fallbacks.reduce((data, f) => f(data), {})
        return state
        return { 0: { data: { label: 'blog' } }
        }
      }, 'menubar'
    ] },
    6: { type: 2, fallback: [
      function fallback_button_instance (data, fallbacks, sdb) { //button instance!
        // sdb.?  ...look up what module instances are available?
        const state = data
        return fallbacks.reduce((data, f) => f(data), {})
        return state
        return { 0: { data: { label: 'plan' } }
        }
      }, 'menubar'
    ] },
    7: { type: 2, fallback: [
      function fallback_button_instance (data, fallbacks, sdb) { //button instance!
        // sdb.?  ...look up what module instances are available?
        const state = data
        return fallbacks.reduce((data, f) => f(data), {})
        return state
        return { 0: { data: { label: 'work' } }
        }
      }, 'menubar'
    ] }
  }
}
}
// src/node_modules/menubar/index.js
function fallback_module () {
  return {
    0: { subs: [1] },
    1: { type: 'button' },
  }
}
function fallback_instance () {
  return {
    0: { subs: [2, 3, 4, 5], inputs: ["menubar.css", "menubar.json"] },
    2: { type: 1, fallback: fallback_button },
    3: { type: 1, data: { label: 'news' } },
    4: { type: 1, data: { label: 'docs' } },
    5: { type: 1, data: { label: 'help' } },
    "menubar.css": "div { display: none; }",
    "menubar.json": { some: "data" },
  }
  function fallback_button (data) {
    return {
      0: { data: { label: 'home' } }
    }
  }
}
// src/node_modules/button/index.js
function fallback_module () {
  return { 0: { } }
}
function fallback_instance () {
  return {
    0: { inputs: ["button.css", "button.json"] },
    "button.css": "div{ display: none;}",
    "button.json": { label: "button" },
  }
}