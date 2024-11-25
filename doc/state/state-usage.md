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
- **Overriding an override**: When an entity overrides a sub-sub-entity through a sub-entity.
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
// given: demo > app > foo > head > nav > menu > (btn | btm.small) > icon

// 7. make demo (=`FB_MD`) redo the menu override
// demo.js
function FB_MD () {
  return {
    0: {
      subs: ['app/foo/head/nav/1']
    },
    '1': {
      type: 'menu',
      override: [override_menu]
    }
  }
}
function override_menu (data) {
  data.menu.items.push('demo')
  return data
}
// app.js
// foo.js
// head.js

// 6. make nav (=`FB_IN`) undo the menu overide for button module instances
// nav.js
function FB_IN () {
  return {
    0: {
      subs: ['1']
    },
    '1': {
      type: 'menu',
      override: [override_menu]
    },
  }
}
function override_menu (data) {
  Object.entries(data).forEach(([id, value]) => {
    if(value.type.includes('btn'))
      data[id].override = null
  })
  return data
}

// 5. make menu code require 2 button module instances, one for small button, one for normal button
// 4. make menu (=`FB_IM`) override button label + reset icon back to original from what button changed
// menu.js
function FB_MM () {
  return {
    0: {
      subs: ['btn']
    }
  }
}
function FB_IM () {
  return {
    0: {
      subs: ['1', '2']
    },
    '1': {
      type: 'btn:small',
      override: [override_btn]
    },
    '2': {
      type: 'btn:normal',
      override: [override_btn]
    }
  }
}
function override_btn (data) {
  data.label = 'beep boop'
  Object.entries(data).forEach(([id, value]) => {
    if(value.type.includes('icon'))
      data[id].override = null
  })
}

// 3. make button override icon `image.svg`
// 2. set button default fallback (=`FB_IB1` + `FB_IB2`) to `label/size`
// btn.js
// FB_MB
function FB_IB () {
  return {
    0: {
      subs: [1],
      data: {
        label: 'button',
        size: 'small',
      }
    },
    1: {
      type: 'icon',
      override: [override_icon]
    }
  }
}
function override_icon (data) {
  data[0].data['image.svg'] = `<svg>🧸</svg>`
  return data
}

// 1. make icon set its default fallback (=`FB_II`) using the `image.svg` in the above snippet
// icon.js
// FB_MI
function FB_II () {
  return { 
    0: {
      data: {
        'image.svg': `<svg>▶️</svg>` 
      }
    }
}