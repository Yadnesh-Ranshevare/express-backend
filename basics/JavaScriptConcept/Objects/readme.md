# content
1. [What are object?](#what-are-object)
2. [How they stored in memory?](#how-they-stored-in-memory)
3. [How to copy an object?](#how-to-copy-an-object)
    - [Create duplicate](#1-creating-the-duplicate-of-the-current-object)
    - [Via reference](#2-copy-via-reference)
    - [Shallow Copy](#3-shallow-copy)
    - [Deep copy](#4-deep-copy)
4. [Object.assign()](#objectassign)

---

# What are object?

An object is a collection of key–value pairs, where:
- Each key (also called a property name) is a string (or Symbol).
- Each value can be anything — a number, string, array, function, or even another object.

### Basic Example
```js
const user = {
  name: "Yadnesh",
  age: 21,
  greet: function() {
    console.log("Hi, I'm " + this.name);
  }
};

console.log(user.name); // "Yadnesh"
user.greet();           // "Hi, I'm Yadnesh"
```
Here:
- `name` and `age` → data (properties)
- `greet()` → behavior (method)

### Ways to Create Objects

**1️⃣ Object Literal (most common)**
```js
const user = { name: "Yadnesh", age: 21 };
```
**2️⃣ Using new Object()**

```js
const user = new Object();
user.name = "Yadnesh";
```
**3️⃣ ES6 Class**
```js
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
}
const u = new User("Yadnesh", 21);
u.greet();
```

### Everything (Almost) Is an Object in JS!
Even arrays and functions are specialized objects:
```js
typeof []       // "object"
typeof function(){}  // "function" (but functions are also objects)
```
You can add custom properties to functions or arrays because they’re still objects:
```js
function greet() {}
greet.lang = "English";
console.log(greet.lang); // English
```

[Go To Top](#content)

---
# How they stored in memory?

### Memory in JS: Stack vs Heap
JavaScript manages memory in two main areas:

| Area         | What’s Stored                              | Example               |
| ------------ | ------------------------------------------ | --------------------- |
| 🧮 **Stack** | Primitive values & variable references     | `let a = 10`          |
| 🧱 **Heap**  | Objects, arrays, functions (non-primitive) | `{ name: "Yadnesh" }` |

So:
- Primitives (like numbers, strings, booleans) → stored directly in stack.
- Objects → stored in the heap, and the variable only stores a reference -(pointer) to that object.

### Example

```js
let a = 10;
let user = { name: "Yadnesh", age: 21 };
```
Memory layout looks like this:
```
Stack:                           Heap:
┌──────────────┐          ┌──────────────────────────────┐
│ a → 10       │          │ { name: "Yadnesh", age: 21 } │
│ user → ●─────┼─────────>│  (object stored here)        │
└──────────────┘          └──────────────────────────────┘
```
`user` doesn’t contain the object — it just points to its location in the heap.

### Nested Objects = Multiple References
```js
const user = {
  name: "Yadnesh",
  address: { city: "Mumbai" }
};
```
Memory:
```
Stack:                            Heap:
┌──────────────┐           ┌────────────────────────┐
│ user → ●─────┼──────────>│ name: "Yadnesh"        │
└──────────────┘           │ address → ●────────────┼───> { city: "Mumbai" }
                           └────────────────────────┘
```

### Garbage Collection
JavaScript automatically removes (collects) objects from memory that are no longer referenced.

**Example 1:**
```js
let user = { name: "Yadnesh" };
user = null;
```
After this line, the `{ name: "Yadnesh" }` object is unreachable, so it’s marked for garbage collection and memory will be freed.

**Example 2:**
```js
function demo() {
  let x = 5;
  let user = { name: "Yadnesh" };
  return user;
}
let result = demo();
```
Memory trace:
```
Stack Frame (for demo):
┌────────────┐
│ x → 5      │
│ user → ●───┼──> Heap: { name: "Yadnesh" }
└────────────┘

After demo() ends:
- Stack frame destroyed
- 'result' still holds the heap reference, so object survives
```
If you didn’t return the object → it would be garbage collected.

[Go To Top](#content)

---

# How to copy an object?

### 1. creating the duplicate of the current object
```js
const user1 = {
    name: "Alice",
};

const user2 = {
    name: "Alice",
};
```
memory reference diagram

```
Stack:                           Heap:
┌──────────────┐          ┌──────────────────────────────┐
│ user1 → ●────┼─────────>│ { name: "Alice" }            │
│ user2 → ●────┼─────────>│ { name: "Alice" }            │
└──────────────┘          └──────────────────────────────┘
```
Here
- we can see two object `user1` and `user2` that hold same data
- even though both users hold the same data in heap we have duplicate objects and each user points to its respective object in heap
- therefor is we check whether both object `user1` and `user2` hold the same data or not we get true(both have same data)
    ```js
    console.log(JSON.stringify(user1) === JSON.stringify(user2)); // true
    ```
- but if we compare the object itself we get false (both object are not same) as both object has different reference than one another
    ```js
    console.log(user1 == user2); // false
    ```
    we compare the object by there reference 
- if we change one object then other one doesn't affected and both hold the different references
    ```js
    user1.age = 25;
    console.log(user1); // { name: 'Alice', age: 25 }
    console.log(user2); // { name: 'Alice' }
    ```
    inside memory
    ```
    Stack:                           Heap:
    ┌──────────────┐          ┌──────────────────────────────┐
    │ user1 → ●────┼─────────>│ { name: "Alice", age:25 }    │
    │ user2 → ●────┼─────────>│ { name: "Alice" }            │
    └──────────────┘          └──────────────────────────────┘
    ```

### 2. Copy via reference  
```js
const user1 = {
    name: "Alice",
};

const user2 = user1
```

memory reference diagram

```
Stack:                           Heap:
┌──────────────┐          ┌──────────────────────────────┐
│ user1 → ●─┬──┼─────────>│ { name: "Alice" }            │
│ user2 → ●─┘  |          |                              │
└──────────────┘          └──────────────────────────────┘
```
Here:
- both `user1` and `user2` hold the same reference in heap
- Therefor is we compare the object we get true(both object are same) as both object holds the same reference
     ```js
    console.log(user1 == user2); // true
    ```
- if we change one object then other one affected and both hold the same references
    ```js
    user1.age = 25;
    console.log(user1); // { name: 'Alice', age: 25 }
    console.log(user2); // { name: 'Alice', age: 25 }
    ```
    **Inside memory**
    ```
    Stack:                           Heap:
    ┌──────────────┐          ┌──────────────────────────────┐
    │ user1 → ●─┬──┼─────────>│ { name: 'Alice', age: 25 }   │
    │ user2 → ●─┘  |          |                              │
    └──────────────┘          └──────────────────────────────┘
    ```
    even though `user1` update the object since `user2` has the reference to same object value of `user2` object will also change 


### 3. Shallow copy
A shallow copy of an object creates a new object and copies all the top-level properties, but it does not recursively copy nested objects.
- Top-level properties → copied
- Nested objects/arrays → still shared by reference

**Example:**
```js
const user = {
    name: "Bob",
    address: {
        city: "New York",
    },
}

const shallowCopy = {...user}

// update the copied version
shallowCopy.name = "Charlie";
shallowCopy.address.city = "Los Angeles";

console.log(user);
console.log(shallowCopy); 
```
**memory reference**
```
# before update

Stack:                             Heap:
┌──────────────┐          ┌─────────────────────────────────────────────────────────┐
│ user → ●─────┼─────────>│ { name: "Bob", address:●─}─┐                            │
│              |          |                            |─────▶{ city: "Mumbai" }   | 
| copy → ●─────┼─────────>│ { name: "Bob", address:●─}─┘                            |
└──────────────┘          └─────────────────────────────────────────────────────────┘

# after update

Stack:                             Heap:
┌──────────────┐          ┌─────────────────────────────────────────────────────────────────┐
│ user → ●─────┼─────────>│ { name: "Bob", address:●─────}─┐                                │
│              |          |                                |─────▶{ city: "Los Angeles" }   | 
| copy → ●─────┼─────────>│ { name: "Charlie", address:●─}─┘                                |
└──────────────┘          └─────────────────────────────────────────────────────────────────┘
```


**Output:**
```
{ name: 'Bob', address: { city: 'Los Angeles', zip: 10001 } }
{ name: 'Charlie', address: { city: 'Los Angeles', zip: 10001 } }
```
> think of it as a spreading one object onto another and as you spread the top level values get spread directly but in case on nested values it spread their reference instead on actual value

### 4. Deep copy
A deep copy creates a completely independent clone of an object,
including all nested objects inside it.

So — the new object does not share any memory reference with the original.

**Example:**
```js
const user1 = {
    name:"Alice"
    address:{
        city:"Mumbai"
    }
}

const user2  = JSON.parse(JSON.stringify(user1))
```
Here:
- first we convert our whole object into the string to avoid the coping the reference
- then we parse it back into the JSON to get our actual payload
- we assign that payload to new object to create deep copy without any reference of original object

**Inside memory**
```
Stack:                           Heap:
┌──────────────┐          ┌─────────────────────────────────────────────────────────────┐
│ user1 → ●────┼─────────>│ { name: "Alice" address:●─}──────>{ city: "Mumbai" }        │
│ user2 → ●────┼─────────>│ { name: "Alice" address:●─}──────>{ city: "Mumbai" }        │
└──────────────┘          └─────────────────────────────────────────────────────────────┘
```
>this is similar to that of [Create duplicate objet](#1-creating-the-duplicate-of-the-current-object) but there we can just creating the identical object and here we are actually using first object to clone the other 

#### structuredClone()
`structuredClone()` is a built-in function that creates a deep copy of almost any JavaScript object — including nested objects, arrays, dates, maps, sets, and more.

**Syntax**

```js
const clone = structuredClone(value);
```
**Example**
```js
const user = {
  name: "Yadnesh",
  address: { city: "Pune", pin: 411001 },
  hobbies: ["coding", "sketching"]
};

const deepCopy = structuredClone(user);

// modify the copy
deepCopy.address.city = "Mumbai";
deepCopy.hobbies.push("anime");

console.log(user);
console.log(deepCopy);
```
**Output:**
```
user = {
  name: "Yadnesh",
  address: { city: "Pune", pin: 411001 },
  hobbies: ["coding", "sketching"]
}

deepCopy = {
  name: "Yadnesh",
  address: { city: "Mumbai", pin: 411001 },
  hobbies: ["coding", "sketching", "anime"]
}
```



[Go To Top](#content)

---

# Object.assign()
- It’s used to copy or merge objects.
- Copies all enumerable (visible) properties from one or more source objects into a target object
- Creates only [shallow copy](#3-shallow-copy) (nested objects share reference) of the source object


### Syntax:

```js
Object.assign(target, source);
```
It copies all properties from source into target.

### Example
```js
const user2 = {
    name: "Yadnesh",
    age: 22,
};

const address = {
    city: "Pune",
    pin: 411001,
};

Object.assign(user2, address);
console.log(user2);
console.log(address);
```
**Output:**
```
{ name: 'Yadnesh', age: 22, city: 'Pune', pin: 411001 }
{ city: 'Pune', pin: 411001 }
```
> Note: it merge the shallow copy of the source object into target

```js
const user2 = {
    name: "Yadnesh",
    age: 22,
};

const address = {
    nation:"india",
    city:{
        name:"pune",
        pin:411001,
    }
};

// shallow copy of the address will be merged into the user2
Object.assign(user2, address);

user2.city.name = "los angeles";    // change in both -> shallow copy
user2.nation = "USA";               // change only in user2

console.log(user2);
console.log(address);
```
**Output:**
```
{
  name: 'Yadnesh',
  age: 22,
  nation: 'USA',
  city: { name: 'los angeles', pin: 411001 }
}
{ nation: 'india', city: { name: 'los angeles', pin: 411001 } }
```

### It can also returns the target object
```js
const user2 = {
    name: "Yadnesh",
    age: 22,
};

const address = {
    city: "Pune",
    pin: 411001,
};

const user3 = Object.assign(user2, address);    // target -> user2
console.log(user3);
console.log(user2);
console.log(address);
```
**Output:**
```
{ name: 'Yadnesh', age: 22, city: 'Pune', pin: 411001 }
{ name: 'Yadnesh', age: 22, city: 'Pune', pin: 411001 }
{ city: 'Pune', pin: 411001 }
```

### Used for shallow copy
> make sure you know about [shallow copy](#3-shallow-copy)
```js
const user = { name: "Alice" };
const copy = Object.assign({}, user);

console.log(copy); // { name: "Alice" }
```
Here:
- we have pass target as a empty object (`{}`) and source as a `user`
- since target is empty whatever value the `user` object have will be copied into this empty object 
- after the value is copied the updated target object will get return creating the shallow copy of the original object

### Summary table:
| Case                        | What it does          | Copy type |
| --------------------------- | --------------------- | --------- |
| `Object.assign({}, obj)`    | makes a new copy      | Shallow   |
| `Object.assign(obj1, obj2)` | merges obj2 into obj1 | Shallow   |



[Go To Top](#content)

---