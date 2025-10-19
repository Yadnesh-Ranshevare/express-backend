# content
1. [What are object?](#what-are-object)
2. [How they stored in memory?](#how-they-stored-in-memory)
3. [How to copy an object?](#how-to-copy-an-object)


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
        zip: 10001,
    },
}

const shallowCopy = {...user}

shallowCopy.name = "Charlie";
shallowCopy.address.city = "Los Angeles";

console.log(user);
console.log(shallowCopy); 
```
**memory reference**
```
# Shallow Copy Memory Reference

Stack:                             Heap:
┌──────────────┐          ┌─────────────────────────────────────────────────────────┐
│ user → ●─────┼─────────>│ { name: "Bob", address:●─}─┐                            │
│              |          |                            |─────▶{ city: "Mumbai" }   | 
| copy → ●─────┼─────────>│ { name: "Bob", address:●─}─┘                            |
└──────────────┘          └─────────────────────────────────────────────────────────┘
```


**Output:**
```
{ name: 'Bob', address: { city: 'Los Angeles', zip: 10001 } }
{ name: 'Charlie', address: { city: 'Los Angeles', zip: 10001 } }
```

[Go To Top](#content)

---