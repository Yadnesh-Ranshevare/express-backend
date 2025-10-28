# content
1. [What are object?](#what-are-object)
2. [How they stored in memory?](#how-they-stored-in-memory)
3. [How to copy an object?](#how-to-copy-an-object)
    - [Create duplicate](#1-creating-the-duplicate-of-the-current-object)
    - [Via reference](#2-copy-via-reference)
    - [Shallow Copy](#3-shallow-copy)
    - [Deep copy](#4-deep-copy)
4. [Reference Breaking](#reference-breaking)
5. [Object.assign()](#objectassign)
6. [Object.create() and Prototype Inheritance](#objectcreate-and-prototype-inheritance)

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

### Object methods are also treated as nested object
```js
const user = {
  name: "Alice",
  greet() {
    console.log("Hello");
  }
};
```
**Memory-wise**
```
Stack:                  Heap:
┌──────────────┐     ┌────────────────────────────────────────────────────┐
│ user → ●─────┼────>│ { name: "Alice",                                   │
│              │     │   greet: ●────────}─────────▶{ [Function greet] } │
└──────────────┘     └────────────────────────────────────────────────────┘
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
# Reference Breaking
Reference breaking happens when you reassign a property of an object that was shared by reference, so that the new object no longer points to the original object’s value.

In simpler words:
- Two objects initially share the same reference (like a pointer to the same value).
- If you overwrite one of them, it breaks the link, and now they point to different values.

### Example
```js
//  reference breaking
const user = {
    name: "Yadnesh",
    address:{
        city:"pune",
    }
};

const copy = { ...user }; // shallow copy

copy.address = { city:"mumbai"}; // breaking reference for nested object

console.log(user);
console.log(copy);
```
- Shallow copy copies references for nested objects.
- Reference breaking happens when you reassign a nested object to a new object.
- if you just change the value then you go inside that reference object and then change the value, but when you reassign the nested object it create the new reference by breaking the older one 

**Inside memory**
```
# Before braking the reference

Stack:                             Heap:
┌──────────────┐          ┌─────────────────────────────────────────────────────────────┐
│ user → ●─────┼─────────>│ { name: "Yadnesh", address:●─}─┐                            │
│              |          |                                |─────▶{ city: "pune" }     | 
| copy → ●─────┼─────────>│ { name: "Yadnesh", address:●─}─┘                            |
└──────────────┘          └─────────────────────────────────────────────────────────────┘

# copy.address = { city:"mumbai"};

Stack:                           Heap:
┌─────────────┐          ┌─────────────────────────────────────────────────────────────┐
│ user → ●────┼─────────>│ { name: "Yadnesh" address:●─}──────>{ city: "pune" }        │
│ copy → ●────┼─────────>│ { name: "Yadnesh" address:●─}──────>{ city: "Mumbai" }      │
└─────────────┘          └─────────────────────────────────────────────────────────────┘
```


**Output:**
```
{ name: 'Yadnesh', address: { city: 'pune' } }
{ name: 'Yadnesh', address: { city: 'mumbai' } }
```

### It also wok similarly with object methods
```js
const user = {
    speak: function() {
        console.log("Hello!");
    }
}

const admin = {...user}

// update the admin function
admin.speak = function() {
    console.log("Hi there!");
}
admin.speak(); // Hi there!
user.speak()   // Hello!
```
**Inside memory**

```
# before update

Stack:                             Heap:
┌──────────────┐          ┌──────────────────────────────────────────┐
│ user → ●─────┼─────────>│ { speak:●─}─┐                            │
│              |          |             |─────▶[Function: Hello]    | 
| admin → ●────┼─────────>│ { speak:●─}─┘                            |
└──────────────┘          └──────────────────────────────────────────┘

# after update

Stack:                             Heap:
┌──────────────┐          ┌────────────────────────────────────────────────┐
│ user → ●─────┼─────────>│ { speak:●─}────▶[Function: Hello!]            │
│              |          |                                                │
| admin → ●────┼─────────>│ { speak:●─}────▶[Function: Hello there!]      |
└──────────────┘          └────────────────────────────────────────────────┘
```
> think of it like: in case of nested object you go inside that object and then update its property therefor every other objet referring that nested object gets updated value, but in case of function referencing you change the function code without going inside its main body which lead to creation of new function with new referencing


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
# Object.create() and Prototype Inheritance
- Creates a new object whose prototype points to the original object.
- The new object does not copy the properties of the original — it inherits them.
- If the original object changes after creating the new object, the new object can see those changes via the prototype chain.
- Memory efficient because methods are shared.
### Syntax

```js
const newObj = Object.create(proto);
```
`proto` → the object that will become the prototype of `newObj`.

### Example

```js
const person = {
    greet() {
        console.log("Hello!");
    },
};
const student = Object.create(person);

// overriding greet method of person object
person.greet = function () {
    console.log("Hi there!");
};

student.greet(); // "Hi there!" → inherited from person
```
### Inside memory
```
Stack:                           Heap:
┌──────────────┐          ┌───────────────────────────────────────┐
│ student → ●──┼─────────>│ {}                                    │
│ person → ●───┼─────────>│ { greet: ●──▶ [Function: Hi there!] } │
└──────────────┘          └───────────────────────────────────────┘
```
### Explanation:
- `person` is an object stored in heap, with a `greet` method.
- `student` is created via `Object.create(person)`:
    - It’s an empty object in heap.
    - Its prototype points to `person`.
- When you call `student.greet()`, JS looks up the prototype chain:
    - `student` itself doesn’t have `greet()`.
    - Checks `person` → finds `greet()` → executes it.
- After overriding `person.greet`, `student.greet()` uses the new function because it’s inherited via prototype.

### How it is differed from copying

1. in deep copy we create complete independent version of original object
    ```
    Stack:                           Heap:
    ┌──────────────┐          ┌─────────────────────────────────────────────────────────────┐
    │ user1 → ●────┼─────────>│ { name: "Alice" address:●─}──────>{ city: "Mumbai" }        │
    │ user2 → ●────┼─────────>│ { name: "Alice" address:●─}──────>{ city: "Mumbai" }        │
    └──────────────┘          └─────────────────────────────────────────────────────────────┘
    ```
2. shallow copy we duplicate the top level data and share the reference for nested objects
    ```
    Stack:                             Heap:
    ┌──────────────┐          ┌─────────────────────────────────────────────────────────┐
    │ user → ●─────┼─────────>│ { name: "Bob", address:●─}─┐                            │
    │              |          |                            |─────▶{ city: "Mumbai" }   | 
    | copy → ●─────┼─────────>│ { name: "Bob", address:●─}─┘                            |
    └──────────────┘          └─────────────────────────────────────────────────────────┘
    ```
3. copy via reference we shear the same reference for every object
    ```
    Stack:                           Heap:
    ┌──────────────┐          ┌──────────────────────────────┐
    │ user1 → ●─┬──┼─────────>│ { name: "Alice" }            │
    │ user2 → ●─┘  |          |                              │
    └──────────────┘          └──────────────────────────────┘
    ```
4. in object.create() we creates a new object whose prototype points to the original object
    ```
    Stack:                           Heap:
    ┌──────────────┐          ┌───────────────────────────────────────┐
    │ student → ●──┼─────────>│ {}                                    │
    │ person → ●───┼─────────>│ { greet: ●──▶ [Function: Hi there!] } │
    └──────────────┘          └───────────────────────────────────────┘
    ```

**In most of the copying technique changing the property of copied object may affect the property of original object**
```js
const person = {
    greet() {
        console.log("Hi there!");
    },
};

// copy via reference
const student = person

student.name = "Yadnesh";

console.log(person);
console.log(student);
```
**Output:**
```
{ greet: [Function (anonymous)], name: 'Yadnesh' }
{ greet: [Function (anonymous)], name: 'Yadnesh' }
```
- as they both hold the same reference
- they same memory place is sheared among them and make changes at that sheared place
- therefor changes made by one can be visible by other
- Therefor adding an extra property into the copied version  affected the original also

**This dose not happen in prototype inheritance**
```js
const person = {
    greet() {
        console.log("Hi there!");
    },
};
const student = Object.create(person);

student.name = "Yadnesh";

console.log(person);
console.log(student);
student.greet();
```
**Output:**
```
{ greet: [Function: greet] }
{ name: 'Yadnesh' }
Hi there!
```
**Reason:**
- Prototype inheritance creates a new object whose prototype points to the original object.
- The new object does not copy the properties of the original — it inherits them.

### Multiple levels of prototype inheritance
- JavaScript supports multiple levels of prototype inheritance.
- You can have a chain of objects, where each object inherits from another — forming multiple levels.
- you can have as many prototype levels as you want.
- Each level can pass down its properties and methods to the next.

**Example**
```js
const grandParent = {
  sayHi() {
    console.log("Hi from GrandParent!");
  },
};

const parent = Object.create(grandParent);
parent.walk = function () {
  console.log("Walking...");
};

const child = Object.create(parent);
child.name = "Yadnesh";

child.sayHi(); // 👈 comes from grandParent
child.walk();  // 👈 comes from parent
```

### Prototype Chaining
Prototype chaining is the process JavaScript uses to look up properties or methods that are not found directly on an object — it keeps going “up the chain” through each object’s prototype until it finds the property or reaches `null`.

**Example**
```js
const person = {
  greet() {
    console.log("Hello from person!");
  }
};

const student = Object.create(person);
student.name = "Yadnesh";

student.greet(); // "Hello from person!"
```

- JS first checks inside the student object — ❌ not found
- Then it looks at the object that student was created from (person) — ✅ found
- So it stops searching and runs person.greet()
- If it didn’t find it even in person, it would continue checking further up the chain (like Object.prototype)

### `__proto__`
- `__proto__` is a special hidden property that exists on every JavaScript object.
- It points to the object’s prototype, i.e., the object it inherits from.
- Think of it as a bridge that connects one object to another in the prototype chain.
- it exist because JavaScript uses prototype-based inheritance, not class-based like Java or C++.

**Example**
```js
const person = {
  greet() {
    console.log("Hello!");
  },
};

const student = Object.create(person);

console.log(student.__proto__ === person); // true
student.greet(); // "Hello!"
```
What happens:

- `student.__proto__` points to `person`
- So when JS doesn’t find `greet()` inside `student`,
it looks at `student.__proto__` (which is `person`)
and finds `greet()` there 

>You can manually link one object to another by setting its `__proto__` property.
```js
const person = {
  greet() {
    console.log("Hello from person!");
  },
};

const student = {
  name: "Yadnesh",
};

// manually set inheritance
student.__proto__ = person;

student.greet(); // "Hello from person!"
```

### Global Prototype or `Object.prototype`
- Every object in JavaScript is built on top of another object called `Object.prototype`.
- This is the global (root) prototype — the topmost parent in the prototype chain.

**Example**
```js
const user = { name: "Yadnesh" };

console.log(user.__proto__ === Object.prototype); // true
```
Output → `true`\
That means your user object inherits from `Object.prototype`.

**The Prototype Chain**
```js
user → Object.prototype → null
```
- Your object (`user`) doesn’t directly have all methods like `.toString()` or `.hasOwnProperty()`.
- It inherits them from `Object.prototype`.

That’s why this works 👇
```js
user.hasOwnProperty("name"); // true
```
Even though you never defined hasOwnProperty — it comes from the global prototype!



### Why `__proto__` is not safe or recommended
- `__proto__` works, but it has performance, security, and reliability issues — that’s why modern JavaScript recommends avoiding it.

1. **It’s not part of the original JavaScript spec**
    - `__proto__` was added later by browsers for compatibility.
    - Different browsers used to implement it differently.
    - So it was never guaranteed to behave the same everywhere.

2. **It’s slow**
    - Changing `__proto__` dynamically forces the JavaScript engine (like V8) to re-optimize internal object structures.
    - That hurts performance — especially in large apps.
    ```js
    obj.__proto__ = anotherObj; // ❌ slow, breaks optimization
    ```
    That’s why `Object.create()` is preferred — it sets the prototype once at creation, efficiently.
3. **It can break objects accidentally**
    - Because `__proto__` is a real property name, you can accidentally overwrite it or mess up the prototype chain.
    ```js
    const obj = {};
    obj.__proto__ = "not an object"; // ❌ breaks inheritance
    ```
    Now, JS can’t use that string as a prototype — your object might behave unpredictably.

4. `It’s a security risk`
    - Attackers can use prototype pollution — a vulnerability that changes built-in prototypes like Object.prototype via `__proto__`.
    ```js
    let userInput = JSON.parse('{"__proto__": {"isAdmin": true}}');
    console.log({}.isAdmin); // true → polluted global prototype
    ```
    - It parses a JSON string that contains a key named `"__proto__"`.
    - So userInput becomes:
    ```js
    { __proto__: { isAdmin: true } }
    ```
    - When this object is created, JS treats `"__proto__"` specially — it doesn’t store it as a normal key.
    - Instead, it sets the object’s prototype (`Object.prototype`) to `{ isAdmin: true }`.
    - So, it silently modifies the global prototype.
    > modern JavaScript and JSON parsers (since around ES2019 / Node 12+) fixed this vulnerability — they no longer treat `__proto__` as a special property inside JSON.

**Solution:**

Instead of `__Proto__` use:
- `Object.getPrototypeOf(obj)` -> Get prototype
- `Object.setPrototypeOf(obj, proto)` -> Set prototype
- `Object.create(proto)` -> Create object with prototype
### `Object.getPrototypeOf(obj)`
It’s a built-in JavaScript method that returns the prototype (the parent object) of a given object.

**Example**
```js
const person = {
  greet() {
    console.log("Hello!");
  }
};

const student = Object.create(person);

console.log(Object.getPrototypeOf(student) === person); // true
```
Here:
- student was created from person
- So Object.getPrototypeOf(student) returns person — the object it inherits from

**`__Proto__` vs `Object.getPrototypeOf()`**

| `__proto__`                     | `Object.getPrototypeOf()` |
| ------------------------------- | ------------------------- |
| Old and less safe               | Modern and standardized   |
| Can be modified accidentally    | Read-only and safe        |
| Slower (affects performance)    | Optimized by JS engines   |
| Should be avoided in production | Recommended to use        |


### `Object.setPrototypeOf(obj, proto)`
It’s a built-in JS method that sets (changes) the prototype of an existing object.

**Syntax**
```js
Object.setPrototypeOf(targetObject, prototypeObject)
```
- `targetObject` → the object's prototype you want to change
- `prototypeObject` → the object to be set as its prototype

**Example**
```js
const person = {
  greet() {
    console.log("Hello from person!");
  },
};

const student = { name: "Yadnesh" };

// Set student's prototype to person
Object.setPrototypeOf(student, person);

student.greet(); // "Hello from person!"
```
Here:
- Initially, `student` had no `greet()` method.
- After setting `person` as its prototype, it inherits from `person`.

| Feature / Aspect         | `__proto__`                                      | `Object.setPrototypeOf()`                    |
| ------------------------ | ------------------------------------------------ | -------------------------------------------- |
| **Type**                 | Property on every object                         | Built-in method in `Object`                  |
| **Safety**               | ⚠️ Unsafe (can cause prototype pollution)        | ✅ Safer (explicit and controlled)            |
| **Modification**         | Can be changed accidentally                      | Must be intentionally called                 |
| **Effect Range**         | Can affect global prototype                      | Only affects the specified object            |
| **Security Risk**        | High — attackers can inject malicious prototypes | Low — requires explicit function call        |
| **Performance**          | Slower and inconsistent across engines           | More optimized and predictable               |
| **Standardization**      | Legacy and non-standard                          | Modern ECMAScript standard                   |
| **Usage Recommendation** | ❌ Avoid in production                            | ✅ Preferred for controlled prototype changes |



[Go To Top](#content)

---
