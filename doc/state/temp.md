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
This documentation provides a structured approach to using the `STATE` module, ensuring clarity and consistency in module development.

