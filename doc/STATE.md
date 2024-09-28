## `STATE` Module Documentation

The `STATE` module is a database management system that enables managing state data across multiple modules or instances. It provides methods for setting up state databases, accessing state data, managing admins, and handling permissions.

---

## Module Functions

### `STATE(...)`
Creates an instance of the state database for a specific module or initializes the root database. Returns methods for interacting with the state data.

```js
  const statedb = STATE({ modulename })
```
- **Params:**
  - `modulename`: *String* (optional)  
    The name of the module to create a state instance for. If not provided, it initializes the root state database.

- **Returns:**  
  `Object` — Returns `statedb`.

---

### `statedb(...)`
Initializes or retrieves a state database for the provided module name. This method will either return the state for the given `modulename` or invoke a fallback function to initialize default data.


```js
  const { id, sdb, getdb, admin } = statedb(db => {
    db.populate(require('data.json'))
  })
```
- **Params:**
  - `fallback`: *Function*  
    A callback function that provides default data when no state exists for the module.

- **Returns:**  
  `Object` — Contains the following properties:
  - `id`: *Number* — The ID of the current module.
  - `sdb`: *Object* — Contains methods (`on`, `sub`, `req_access`) for interacting with state data.
  - `getdb`: *Function* — Method for initializing the instance state data.
---

### `statedb_root(...)`
Initializes the root state database. This is called when no specific `modulename` is provided. It loads or initializes the root database, sets up admin permissions, and populates default data.

```js
  const { id, sdb, getdb } = statedb(async db => {
    db.populate(await fetch('data.json'))
  })
```
- **Params:**
  - `fallback`: *Function*  
    A callback function to provide default data for the root state database.

- **Returns:**  
  `Object` — Contains the following properties:
  - `id`: *Number* — The ID of the root database.
  - `sdb`: *Object* — Methods (`on`, `sub`, `req_access`) for interacting with the state database.
  - `getdb`: *Function* — Retrieves a state database by session ID.
  - `admin`: *Object* — Contains admin-specific methods (`xget`, `add_admins`).

---

## Methods in `sdb`

### `getdb(...)`
Retrieves or initializes a state database for a given session ID (`sid`). If no state exists, it calls the provided fallback function to populate default data.

```js
  const { id, sdb } = await getdb(sid, fallback)
```
- **Params:**
  - `sid`: *Symbol*  
    The session ID of the requested state.
  - `fallback`: *Function*  
    A fallback function to provide default state data if the session ID is not found.

- **Returns:**  
  `Object` — Contains the following properties:
  - `id`: *Number* — The ID of the session.
  - `sdb`: *Object* — Provides methods to interact with the session data.

---

### `sdb.on(...)`
Retrieves the current usage of components in the state. It tracks data for each component by its sub-module IDs.

```js
  const subs = await sdb.on({
  css: function oncss (css) { },
  args: function onargs (args) { },
})
```
- **Params:**
  - `css`: *String* (optional)  
    CSS properties tied to the state data.
  - `data`: *Object* (optional)  
    Any associated data passed along.

- **Returns:**  
  `Object` — Returns the `uses` object that stores component and module mappings.

---

### `sdb.sub(...)`
Returns all the sub-modules associated with the given component `name`.

```js
  const card_sids = sdb.sub('card')
```
- **Params:**
  - `name`: *String*  
    The name of the component whose sub-modules are being requested.

- **Returns:**  
  `Array` — An array of sub-module symbols for the specified component.

---

### `sdb.req_access(...)`
Checks if a given session ID (`sid`) has admin-level access. If the session belongs to an admin, it returns the admin object.
```js
  const admin = sdb.req_access(sid)
```
- **Params:**
  - `sid`: *Symbol*  
    The session ID of the requested state.

- **Returns:**  
  `Object` — Returns the `admin` object if the session has access. Throws an error if access is denied.

---

## Admin Methods

### `admin.xget(...)`
Fetches state data for a given ID from the root database. This is an admin-only operation.

```js
  const data = admin.xget(id) 
```
- **Params:**
  - `id`: *Number*  
    The ID of the state data to retrieve.

- **Returns:**  
  `Object` — The state data associated with the provided ID.

---

### `admin.add_admins(...)`
Adds new admin IDs to the list of authorized admins.

```js
  admin.add_admins(ids || modulename)
```
- **Params:**
  - `ids or modulename`: *Array*  
    An array of admin IDs/Modules to be added to the admin list.

- **Returns:**  
  `void`

---

## Helper Methods

### `populate(...)`
Populates the state database with the given data. This is typically used to initialize or append new data to the state.

```js
  populate(data)
```
- **Params:**
  - `data`: *Object*  
    The state data to be appended to the database.

---

### `symbolfy(...)`
Converts the sub-module IDs into symbols and maps them for internal tracking. This is used to handle references between components and modules.

```js
  symbolfy(data)
```
- **Params:**
  - `data`: *Object*  
    The state data containing components and sub-module IDs.

- **Returns:**  
  `void`

---

## Internal Data Structures

- `s2i`: *Object*  
  Maps symbols to instance IDs.
  
- `i2s`: *Object*  
  Maps instance IDs to symbols.
  
- `admins`: *Array*  
  Stores a list of admin IDs that have special access permissions.

---

This documentation captures the key methods, parameters, and internal workings of the `STATE` module. It's designed for managing state data in modular systems, with provisions for admin management, database access, and component-module mappings.