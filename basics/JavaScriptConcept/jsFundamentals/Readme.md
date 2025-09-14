# Content
1. [Execution Context (EC)](#execution-context-ec)
2. [Scope and Scope Chaining](#scope-and-scope-chaining)
3. [Lexical Environment](#lexical-environment)
4. [Hoisting ](#hoisting)
5. [Temporal Dead Zone (TDZ)](#temporal-dead-zone-tdz)
6. [Closure](#closure)
7. [Call Stack](#call-stack)
8. [Memory Management, Garbage Collection & Memory Leaks](#memory-management-garbage-collection--memory-leaks)

---
# Execution Context (EC)
Think of it as the environment where JS code runs.\
Whenever JavaScript runs a piece of code, it creates an execution context.

### Types of Execution Context:

1. **Global Execution Context (GEC)** → created when your JS file starts.
    - Allocates memory for variables/functions.
    - Sets up a global object (`window` in browser, `global` in Node).
    - Sets this (points to global object).
2. **Function Execution Context (FEC)** → created whenever a function is called.
    - Each function gets its own environment (EC) to run. 
    - Has access to variables inside the function, plus outer ones (via scope chain).
    - When function ends, its EC is destroyed.

> **Global Object in JavaScript:**
> - Every JavaScript environment (Browser, Node.js, etc.) creates a global object by default.
>- This object holds all the globally available functions, variables, and APIs.
>- You can access it directly:
>    - In browser → `window` or `self` or `globalThis`
>    - In Node.js → `global` or `globalThis`

### Lifecycle of Execution Context:
1. **Creation Phase**
    - Memory allocated for variables & functions.
    - `var` → set to `undefined`
    - `let`/`const` → hoisted but kept in Temporal Dead Zone
    - Functions → hoisted with full definition
2. **Execution Phase**
    - Code runs line by line.
    - Assignments are made, functions executed, etc.
> in further topic you'll learn about hoisting in more details

### Example:
```js
console.log(a);   // undefined
sayHi();          // "Hello!"

var a = 10;
function sayHi() {
  console.log("Hello!");
}
```
**Behind the scenes (Creation Phase):**
- `a` reserved in memory → `undefined`
- `sayHi` stored fully in memory

**Execution Phase:**
- `console.log(a)` → prints `undefined`
- `sayHi()` → prints `Hello!`
- `a = 10` assigned

[Go To Top](#content)

---
#   Scope and Scope Chaining

## 1. Scope
Scope means where you can access variables/functions in your code.

#### Types of Scope in JS:
1. **Global Scope** → variables declared outside any function/block (accessible everywhere).
2. **Function Scope** → variables declared inside a function (accessible only inside).
3. **Block Scope (`let` & `const`)** → variables declared inside {} (if, loops, etc.) are accessible only there.


#### Example:
```js
let x = "global";  // Global scope

function test() {
  let y = "function";  // Function scope
  if (true) {
    let z = "block";   // Block scope
    console.log(z);    // ✅ works
  }
  // console.log(z);   // ❌ error
}
```

#### Scop of var
- `var` has function scope, not block scope.
- That means:
    - If declared inside a function, it’s only accessible inside that function.
    - If declared inside a block (if, for, {}), it ignores the block and “escapes” to the nearest function/global scope.

#### Example 1: Function Scope
```js
function test() {
  var x = 10;
  console.log(x); // ✅ 10
}
test();

console.log(x); // ❌ ReferenceError: x is not defined
```
Here `x` is limited to the function.
#### Example 2: No Block Scope
```js
if (true) {
  var y = 20;
}
console.log(y); // ✅ 20
```
Even though `y` is inside `{}`, `var` ignores block scope and becomes global (if not inside a function).


## 2. Scope Chaining
In JavaScript, when you try to access a variable, the engine first looks in the current scope (local scope).
- If it doesn’t find it, it goes to the outer scope,
- and keeps going up until it reaches the global scope.

This path of searching is called the Scope Chain.

#### Example
```js
var globalVar = "I am global";

function outer() {
    var outerVar = "I am outer";

    function inner() {
        var innerVar = "I am inner";

        console.log(innerVar);   // ✅ Found in inner scope
        console.log(outerVar);   // ✅ Not in inner → found in outer
        console.log(globalVar);  // ✅ Not in inner/outer → found in global
    }

    inner();
}

outer();
```
**How JS searches:**
1. `innerVar` → found inside `inner()` (local scope).
2. `outerVar` → not in `inner()`, so JS looks in `outer()` (outer scope).
3. `globalVar` → not in `inner()`, not in `outer()`, found in global scope.

[Go To Top](#content)

---

# Lexical Environment
- A Lexical Environment is a structure that holds:
    1. **Variable Environment** → all variables & functions declared in the current scope.
    2. **Reference to outer (parent) environment**→ so it can use scope chain.
- “Lexical” means based on where the code is written (not where it is called).
- Every Lexical Environment stores its own variables/functions.
- PLUS → it keeps a link (reference/pointer) to the parent environment where it was defined.


### Example 1 (Basic)
```js
function outer() {
  let a = 10;

  function inner() {
    let b = 20;
    console.log(a); // 10 (found in parent lexical environment)
    console.log(b); // 20 (found in inner lexical environment)
  }

  inner();
}

outer();
```

How Lexical Environment is built:
- Global Lexical Environment → has `outer` function, Has no parent (top level)..
- outer’s Lexical Environment → has `a=10`,`inner()`, Reference to global environment (because `outer` was defined in global)..
- inner’s Lexical Environment → has `b=20`, Reference to outer’s environment (because `inner` was defined inside `outer`).

When `inner()` tries to access `a`, it goes:\
inner → outer → global (scope chain).

### Example 2 (Closure)
```js
function makeCounter() {
  let count = 0; // inside makeCounter's lexical environment

  return function () {
    count++;
    return count;
  };
}

const counter1 = makeCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2
```
- `count` lives in makeCounter’s lexical environment.
- The inner function keeps a reference to that environment → closure.
- Even though `makeCounter()` finished, the lexical environment stays alive because of closure.

### In short:
**Lexical Environment = variables defined in the current scope + reference to the parent scope (where it was written, not where called).**

[Go To Top](#content)

---

# Hoisting

### 1. Hoisting
- When JavaScript runs your code, it does two passes:
    1. Preparation (Memory Creation Phase):
        - JS scans your code before running it.
        - It reserves space in memory for variables & functions.
        - JS pull the variable declaration at top of their scope (Hoisting)
    2. Execution Phase:
        - JS now runs the code line by line.
- Hoisting means JavaScript moves declarations (not initializations) to the top of their scope (function or global).
- So you can use variables/functions before they are declared.

### Example:
```js
console.log(x); // ???
var x = 5;
```
You might expect an error because `x` is used before defined.\
But output = `undefined`.

Why?\
Because in preparation phase, JS already **“pulled up”** the declaration:

JS internally treats it like this:
```js
var x;          // moved up (hoisted)
console.log(x); // undefined
x = 5;          // assigned later
```

> **For simple understanding**
>
>Hoisting = JavaScript remembers all variables and functions first (during preparation), before actually running your code.


### Example 1: `var`
```js
console.log(a); // undefined
var a = 10;
console.log(a); // 10
```
Behind the scenes, JS does this:
```js
var a;          // declaration moved to top
console.log(a); // undefined
a = 10;         // initialization stays in place
console.log(a); // 10
```
### Example 2: `let` and `const`
```js
console.log(b); // ❌ ReferenceError
let b = 20;
```
- `let`/`const` are also hoisted,
- but they remain in the Temporal Dead Zone (TDZ) until their declaration line is reached.
- That’s why accessing them early throws an error.
### Example 3: Functions
```js
sayHi(); // "Hello!"

function sayHi() {
  console.log("Hello!");
}
```
Function declarations are fully hoisted with their body, so they work before definition.

But not function expressions:
```js
sayBye(); // ❌ TypeError
var sayBye = function() {
  console.log("Bye!");
};
```
- Here `sayBye` is hoisted as `undefined` (because `var`),
- calling it before assignment gives error.



[Go To Top](#content)

---

# Temporal Dead Zone (TDZ)

TDZ (Temporal Dead Zone) = the time between when a variable is hoisted and when it is actually initialized in code.

During this period, if you try to access it → ReferenceError.

### Example
```js
console.log(a); // ❌ ReferenceError
let a = 10;
```
Why error?
- `a` is hoisted (JavaScript knows it exists).
- But it is in the TDZ from the start of scope until the line `let a = 10`.
- Only after that line, `a` can be used.

### Key Difference with var
```js
console.log(b); // ✅ undefined
var b = 20;
```
- `var` is hoisted and initialized with undefined → no TDZ.
- `let` & `const` are hoisted but not initialized → stuck in TDZ.

### Another Example
```js
{
  // TDZ starts here for `x`
  // console.log(x); // ❌ ReferenceError
  let x = 5;        // TDZ ends here
  console.log(x);   // ✅ 5
}
```



[Go To Top](#content)

---
# Closure

A closure in JavaScript is when a function "remembers" the variables from its outer scope, even after that outer function has finished executing.

### Simple Example:
```js
function outer() {
  let count = 0; // variable in outer function

  function inner() {
    count++; 
    console.log(count);
  }

  return inner;
}

const closureFn = outer(); 
closureFn(); // 1
closureFn(); // 2
closureFn(); // 3
```
Here’s what’s happening:
- `outer()` is called → it creates `count` and returns `inner`.
- Even though `outer()` is done executing, the returned `inner` function remembers the variable `count` from outer.
- Each call to `closureFn()` updates the same `count`.

### Uses of closure
1. Data Privacy (like private variables)\
JS doesn’t have true "private" variables (outside of #private class fields). Closures give that behavior.
```js
function createUser(name) {
  let password = "secret123"; // private

  return {
    getName: () => name,
    checkPassword: (input) => input === password
  };
}

const user = createUser("Alice");

console.log(user.getName());         // Alice
console.log(user.password);          // ❌ undefined
console.log(user.checkPassword("secret123")); // ✅ true
```
2. Stateful Functions (remember values between calls)\
Closures let functions “remember” past data.
```js
function counter() {
  let count = 0;
  return () => ++count;
}

const c = counter();
console.log(c()); // 1
console.log(c()); // 2
console.log(c()); // 3
```
3. Callbacks & Async Programming\
Closures keep values around even when the outer function has finished.
```js
function delayedMessage(msg, delay) {
  setTimeout(() => {
    console.log("Message:", msg); // closure remembers msg
  }, delay);
}

delayedMessage("Hello!", 2000); // prints after 2s
```
4. Rate Limiter (API calls / Button spamming control)\
Prevent a function from being called too often.
```js
function rateLimiter(fn, limit) {
  let lastCall = 0;

  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

const log = rateLimiter(() => console.log("Clicked!"), 2000);

document.getElementById("btn").addEventListener("click", log);
```




[Go To Top](#content)

---
# Call Stack
The Call Stack is a data structure (stack = LIFO: Last In, First Out) that JavaScript uses to keep track of function execution.

Every time a function is called, JavaScript creates a new Execution Context and pushes it onto the call stack.

When the function finishes, its context is popped off the stack.


### Example 1 (Simple)
```js
function first() {
  console.log("First");
}

function second() {
  first();
  console.log("Second");
}

second();
console.log("Global end");
```
Step-by-step with Call Stack:
1. Program starts → Global Execution Context (GEC) is created.\
Stack: [ Global ]
2. `second()` is called → new Execution Context created for `second`.\
Stack: [ Global, second ]

3. Inside `second()`, it calls `first()`.\
Stack: [ Global, second, first ]
4. `first()` executes → prints `"First"` → finishes → popped.\
Stack: [ Global, second ]
5. Continue in `second()`, prints `"Second"` → finishes → popped.\
Stack: [ Global ]
6. Back to global → prints `"Global end"`.\
Stack: [ Global ]

### Example 2 (Recursion)
```js
function countDown(n) {
  if (n === 0) return;
  console.log(n);
  countDown(n - 1);
}

countDown(3);
```
Stack flow:
- `countDown(3)` → [Global, countDown(3)]
- calls `countDown(2)` → [Global, countDown(3), countDown(2)]
- calls `countDown(1)` → [Global, countDown(3), countDown(2), countDown(1)]
- calls `countDown(0)` → returns → stack pops one by one.




[Go To Top](#content)

---
# Memory Management, Garbage Collection & Memory Leaks
## 1. Memory Management in JavaScript
JavaScript, being a high-level language, automatically handles memory for you.
But under the hood, it works in two steps:

1. **Allocation (Memory is reserved)**
    - When you create variables, objects, functions → JS engine allocates memory.\
    Example:
    ```js
    let a = 10;              // number allocated in memory
    let obj = {x: 5};        // object allocated in heap
    function greet() {}      // function allocated
    ```
    - Primitives (`number`, `string`, `boolean`, etc.) → stored in the stack.
    - Objects & functions → stored in the heap (bigger memory pool).
2. **Release (Memory is freed)**
    - Once a variable is no longer reachable (nothing references it anymore), JS engine can automatically delete it → this process is called Garbage Collection (GC).  


## Garbage Collection in JavaScript
JS uses an algorithm called Mark-and-Sweep (simplified):
1. **Mark** → Start from global objects (like window in browsers). Mark all variables & objects reachable from there. 
2. **Sweep** → Anything not marked is considered unreachable → memory is freed.

#### Example
```js
function demo() {
  let user = {name: "Alex"};  // allocated in heap
  user = null;                // old object is now unreachable
}
```
The `{name: "Alex"}` object has no reference → eligible for GC.

> JS does automatic memory management (you don’t manually free memory like in C/C++).


## How Does Garbage Collator Works

#### Example 1: Global Scope
```js
let bigData = { huge: "memory..." };

// you use it only once here
console.log(bigData.huge);

// after this, you never use bigData again
```
1. `bigData` is a global variable (because you used `let` in global scope).
2. It references the object `{ huge: "memory..." }` in the heap.
3. Even if you never use `bigData` again, it still exists in the global lexical environment until the page/program ends.
    - This means the { huge: "memory..." } object is still reachable (because the variable bigData holds it).
4. Since it’s reachable, the Garbage Collector will NOT free it.
    - Why?
        - Garbage Collector frees memory only when no references remain.
        - Here, the reference (`bigData`) still exists in the global scope, so GC assumes “maybe you’ll use it later.”
    - How to free it?
        - If you want the object to be garbage collected early, you must explicitly break the reference:
        ```js
        bigData = null;  // or bigData = undefined;
        ```
        Now, no variable points to `{ huge: "memory..." }`, so GC can safely remove it.

#### Example 2: Functional Scope
```js
function demo() {
  let user = {name: "Alex"};  
  // no further use of user
}
```
- `user` still references `{name: "Alex"}` until the function `demo()` finishes.
- Once `demo()` returns → the Execution Context is destroyed, and all local variables (`user`) are no longer reachable.
- That means `{name: "Alex"}` object automatically becomes unreachable → Garbage Collector will still free it.

#### Example 3: Block Scope
```js
if (true) {
  let a = 4;
  // no longer use `a`
}
```
1. **Memory Allocation**
    - When the `if` block runs, a new block lexical environment is created.
    - Inside it, variable `a` is declared and assigned `4`.
    - Since `a` is a primitive (`number`), it’s stored on the stack.
2. **Block Ends**
    - After the closing brace `}`, the block lexical environment is destroyed.
    - That means variable `a` goes out of scope (you can’t access it anymore).
3. **Garbage Collector’s Role**
    - Since nothing outside the block is referencing `a`, the engine knows it’s unreachable.
    - The memory for `a` (the number `4`) is eligible for garbage collection.

#### Key Insight:
You don’t need to set variables to `null` manually — Garbage Collector handles it once variables go out of scope.

BUT developers sometimes set objects to `null` explicitly to signal early that the object is no longer needed, especially in long-running applications (like servers or SPAs), where the variable might otherwise hang around longer than expected.

## Memory Leak
A memory leak happens when your program keeps holding on to memory that it no longer needs, so the Garbage Collector cannot free it.

careless code can still cause memory leaks, e.g.:
- Global variables that never get cleared ([check the example 1 one how garbage collector work](#example-1-global-scope)).
- Keeping unused objects in arrays/maps.
- Closures that accidentally keep references alive.

#### Example: Keeping unused objects in arrays/maps
```js
let arr = [];
function leak() {
  arr.push(new Array(1000000)); // keep pushing large arrays
}
```
- Even if you never use those arrays again, they stay in memory because `arr` references them.

#### Example: Closure Causing Memory Leak
```js
function createUser() {
  let bigData = new Array(1000000).fill("💾"); // huge array in memory

  return function getUser() {
    // Closure still "remembers" bigData
    console.log("User created");
  };
}

const user = createUser();
// We never use bigData, but it's still in memory!
```
- `createUser()` runs → allocates a huge array `bigData`.
- It returns the `getUser()` function.
- Now, `user` (the returned function) forms a closure over `bigData`.

Even though we never use `bigData`, JS keeps it in memory, because the closure keeps a reference to the outer scope where `bigData` lives.

So the array of 1,000,000 items stays in memory unnecessarily → memory leak.



[Go To Top](#content)

---