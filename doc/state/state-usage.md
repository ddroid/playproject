## Fallbacks

Modules and instances are entities created to have their behavior dictated by the input data. The fallback system is designed to manage this data, allowing each node (module or instance) to inherit or override functionality from a parent. This system supports multiple levels of overrides and fallbacks, with constraints on how IDs are used to uniquely identify each sub-instance within a hierarchy. Moreover, it makes sure that the website never reaches a situation where entities have no data to be guided.

**Rules**:
- Each node (module/instance) has a unique ID in a component except for ID `0`.
- ID `0` is reserved for the root module/instance and is responsible for managing the primary state and possible sub-instances `subs`.
- Sub-instances use IDs `n`, which needs to be unique within the fallbacks inside a component.
- Fallbacks allow for cascading behavior, where higher-level modules or instances can define behaviors or structures which can override default behaviors of lower-level elements.

### Format

Each fallback consists of two main parts:
- **Module Fallback**: Defines the hierarchical structure of modules that is critical for defining the next structure.
  ```js
  function fallback_module(){
    return {
      _: {
        "<submodule1>": {
          0: override_function || '',
          1: override_function || '',
          ...
          mapping: {
            sub_dataset1: dataset1,
            sub_dataset2: dataset2,
            ...
          }
        }
        "<submodule2>": {
          ...
        }
      },
      drive: {
        dataset1: {
          file1,
          file2,
          ...
        },
        dataset2: {
          ...
        }
      }
    }
  }
  ```
- **Instance Fallback**: Defines the hierarchical structure of instances which are the building blocks of the website.
  ```js
  function fallback_instance(){
    return {
      _: {
        "<submodule1>": {
          0: override_function || '',
          1: override_function || '',
          ...
          mapping: {
            sub_dataset1: dataset1,
            sub_dataset2: dataset2,
            ...
          }
        },
        "<submodule2>": {
          ...
        },
        ...
      },
      drive: {
        dataset1: {
          file1,
          file2,
          ...
        },
        dataset2: {
          ...
        },
        ...
      }
    }
  }
  ```
**Explanation**:
- Root props `_` and `drive` are optional
- `_` represents sub-modules.
- `drive` represents the local drive.
- The direct sub-entries of `_` are always sub-modules.
- Sub-modules contains their instances which may consist of an override function
- Mapping is required to match a dataset being passed down to sub-node's dataset having same type but differnet name.
- `drive` contains datasets which are similar to folders but have amazing capabilities of groupiing and switch same kind of data.
- `dataset` contains files.


## Overrides

Overrides allow specific instances or sub-modules to change the default behavior of their sub-nodes. These overrides are defined at the both module and instance level. The behavior of a module or instance is defined the by the data it is fed which is what the overrides will deal with.

### Format

The system supports multiple levels of modules and instances, with each level being able to define its own fallbacks and overrides for lower levels. Since, both module and instance fallback have similar structure, only module's format will be shown. The format involves:
- **Shallow Override**: When an node overrides the default data of a sub-node.
```js
function fallback_module () { 
	return {
    _: {
      "submodule": override_submodule
    }
  }
  function override_submodule ([submodule]) {
    const state = submodule()
    state.drive.dataset = {
      new_file: {
        raw: 'content'
      }
    }
    return state
  }
}
```
- **Deep Override**: When a node overrides deep sub-nodes using the component tree provided by STATE.
```js
function fallback_module () { 
	return {
    _: {
      "submodule": override_submodule
    }
  }
  function override_submodule ([submodule]) {
    const state = submodule()
    state._.sub_module1._sub_module2 = deep_override_submodule
    return state
  }
  function deep_override_submodule ([deep_submodule]) {
    const state = deep_submodule()
    state.drive.dataset = {
      new_file: {
        raw: 'content'
      }
    }
    return state
  }
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