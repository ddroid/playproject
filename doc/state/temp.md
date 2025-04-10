# Using the `STATE` Module

## Initializing `STATE`
```js
const STATE = require('STATE');
const state_db = STATE(__filename);
const { sdb, subs: [get] } = state_db(fallback_module);
```
1. Import `STATE` and pass `__filename` (a built-in variable containing the file's path) to it.
2. The returned `state_db` function registers fallbacks and provides `sdb` (the main interface) and `get` (a function for accessing the staet of an instance).
3. This initialization is consistent across most modules.

---
## Defining Fallbacks
```js
function fallback_module() {
  //.....
}
```
1. Fallbacks provide default data when custom data is absent.
2. Defined as functions instead of objects for flexibility (`@TODO` for further explanation).
3. Two fallback functions are commonly used:
   - `fallback_module()` (module-level fallback)
   - `fallback_instance()` (instance-level fallback)

### Fallback Syntax
The fallback structure follows a specific format:

**Pattern:**
`"name1|name2:*:type1|type2"`
- `:` separates parameters.
- `|` represents an OR condition.
- `*` denotes a required key.

A key consists of three parameters:
1. Allowed key names or reserved keywords (`name1|name2`).
2. Whether the key is required (`*` for required, optional if absent).
3. Allowed value types (`type1|type2`).

#### Rules
```js   
const expected_structure = {
  'api::function': {},
  '_::object': {
    ':*': {
      ':*:function|string': () => {},
    },
  },
  'drive::object': {
    ':*:object|string': {
      'raw|link:*:object|string': {},
      'link': 'string',
    },
  },
};
```

### Fallback Semantics
```js
function fallback_module() {
  return {
    api: fallback_instance,
    _: {
      sub_module: {
        $: '',
        instance_number: override_sub_module,
      },
    },
    drive: {
      dataset_type: {
        file: {
          raw: {},
          link: '',
        },
      },
    },
  };
  
  function fallback_instance() {
    // See template.js
  }
  
  function override_sub_module() {
    // See template.js
  }
}
```

#### Key Descriptions
1. **`_` (Sub-Nodes)**  
   - Represents sub-modules of the current node.
   - Reserved and optional but must always be an object.

   - **`sub_module`**  
     - A required module name.
     - Can be numbered (e.g., `module:1`) if duplicates exist.
     - Used to group instances of a module.
     - Must contain items to be meaningful.

     - **`$`** (Module Creation/Import)
       - Reserved key for creating/importing a module.
       - Accepts a `string` or `function`.
       - Empty string means default data is used.
       - A function allows overriding default data.

     - **Instance Numbers (`number`)**
       - Represents numbered instances (e.g., `1`, `2`).
       - Same behavior as the `$` key.

2. **`drive` (Storage)**
   - Represents stored data accessible by the node.
   - Allows smooth insertion and modification of node data.

   - **`dataset_type`**
     - Represents datasets categorized by type.
     - A node cannot use multiple datasets of the same type.

     - **`file`** (File Storage)
       - **`raw`** (Raw Content)
         - Stores raw file content as an `object` or `string`.
       - **`link`** (External File Link)
         - Stores a link to an external file (any type).

---
## Module Structure and Usage

### Basic Module Setup
```js
module.exports = module_name;
async function module_name(opts) {
  const { id, sdb } = await get(opts.sid);
  // ... module implementation
}
```
1. The module follows a consistent pattern where it exports a function as an instance.
2. `opts` contains the `sid`(Symbol ID) and `type`(Module's ID) of the instance created.
3. The provided `sid` can then be used to access `sdb` interface using get API.
4. `sdb` interface provides access to a number of different API for STATE management.

### State Management
The `STATE` module provides several key features for state management:

#### 1. Instance Isolation
   - Each instance of a module gets its own isolated state
   - State is accessed through the `sdb` interface
   - Instances can be created and destroyed independently

#### 2. sdb Interface
Provides access to following two APIs:

**sdb.watch(onbatch)**
```js
const subs = await sdb.watch(onbatch);
function onbatch(batch) {
  for (const {type, data} of batch) {
    on[type](data)
  }
}
```
- Modules can watch for state changes
- Changes are batched and processed through the `onbatch` handler
- Different types of changes can be handled separately using `on`.
- `type` refers to the `dataset_type` used in fallbacks. The key names need to match. E.g. see `template.js`

**sdb.get_sub**  
  @TODO

### Shadow DOM Integration
   ```js
   const el = document.createElement('div');
   const shopts = { mode: 'closed' };
   const shadow = el.attachShadow(shopts);
   ```
   - Modules can create isolated DOM environments
   - Styles and markup are encapsulated
   - Prevents style leakage between modules

  **Sub-Module Integration**
   ```js
   const sub_module = require('sub_module_address');
   // ...
   shadow.append(await sub_module(subs[0]));
   ```
   - Sub-modules can be dynamically loaded
   - State can be passed down to sub-modules
   - Hierarchical module structure is supported
### Best Practices

1. **State Organization**
   - Keep state structure consistent with fallback definitions
   - Use meaningful names for datasets and files
   - Group related data together

2. **Error Handling**
   - Always handle async operations properly
   - Validate state updates before applying them
   - Provide fallback values for missing data

3. **Performance**
   - Minimize state updates
   - Batch related changes together
   - Clean up watchers when no longer needed


This documentation provides a comprehensive guide to using the `STATE` module effectively in your applications. For more specific examples and advanced usage patterns, refer to the example modules in the codebase.

