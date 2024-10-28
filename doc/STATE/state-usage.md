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
    1: { type: '<module1_name>', fallback: {
      <host_module_name>: fallback_<module1_name>_module
    }},
    'data.json': { data: {} || '' }
  }
}
function fallback_<module1_name>_module(data){
  data[0]['new_field'] = 'new_value' //changes to data
  return data
}
```
- **Override level-2**: When an entity overrides the default data of a sub-sub-entity, leaving sub-entity untouched.
```js
function fallback_module(){
  return {
    0: {
      slot1: [1],
      slot2: ['data.json']
    },
    1: { type: '<module1_name>', slot1: [2] },
    2: { type: '<module2_name>', fallback: {
      <host_module_name>: fallback_<module2_name>_module
    }},
    'data.json': { data: {} || '' }
  }
}
function fallback_<module2_name>_module(data){
  data[0]['new_field'] = 'new_value' //changes to data
  return data
}
```
- **Overriding an **: When an entity overrides a sub-sub-entity through a sub-entity.
```js
function fallback_module(){
  return {
    0: {
      slot1: [1],
      slot2: ['data.json']
    },
    1: { type: '<module1_name>', slot1: [2] },
    2: { type: '<module2_name>', fallback: {
      <host_module_name>: fallback_<module_name2>_module,
      <module_name1>: null //module1 will fill this with its override
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
// EXAMPLE:
// define scenario:
// page>app>header>menubar>button
//
// with fallbacks and overrides for:
// * button in almost all modules and instances
// 
// RULES:
// every entity has an id:
// - 0: is for module and or instance state
// - n: is for possible sub instances
// apart from `0:`, module and instance fallbacks are not allowed to re-use a number used in the other fallback for `n:`
// --------------------------------
// web/page.js
function fallback_module () {
  return {
    0: { subs: [1], slotmap: ['inputs', 'output', 'subs', 'hubs'] },
    1: { type: 'app' },
  }
}
function fallback_instance () {
  return {
    0: { subs: [2] },
    2: { idx: 1 },
  }
}
// --------------------------------
// src/app.js
function fallback_module () {
  return {
    0: { subs: [1] },
    1: { type: 'header' },
  }
}
function fallback_instance () {
  return {
    0: { subs: [2] },
    2: { idx: 1 },
  }
}
// --------------------------------
// ********************************
// Overriding an override
// ********************************
// src/node_modules/header/index.js
function fallback_module () {
  return {
    0: { subs: [1] },
    1: { type: 'menubar', subs: [2] },
    2: { type: 'button' }
  }
}
function fallback_instance () {
  return {
    0: { subs: [3] },
    3: { idx: 1, subs: [4] },
    4: { idx: 2, fallback: {
      header: fallback_button, menubar: null
     } }
  }
}
function fallback_button (data) {
  return data.map(() => {})
}
// --------------------------------
// ********************************
// Override level-1
// ********************************
// src/node_modules/menubar/index.js
function fallback_module () {
  return {
    0: { subs: [1] },
    1: { type: "button" },
  }
}
function fallback_instance () {
  return {
    0: { subs: [2, 3, 4, 5], inputs: ["menubar.css", "menubar.json"] },
    "menubar.css": "div{ display: none;}",
    "menubar.json": { some: "data" },
    2: { idx: 1, fallback: { menubar: fallback_button }},
    3: { idx: 1, data: { label: 'news' } },
    4: { idx: 1, data: { label: 'docs' } },
    5: { idx: 1, data: { label: 'help' } },
  }
}
function fallback_button (data) {
  return data.map(() => {})
}
// --------------------------------
// src/node_modules/button/index.js
function fallback_module () {
  return { 0: {} }
}
function fallback_instance () {
  return {
    0: { inputs: ["button.css", "button.json"] },
    "button.css": "div{ display: none;}",
    "button.json": { some: "data" },
  }
}
// --------------------------------