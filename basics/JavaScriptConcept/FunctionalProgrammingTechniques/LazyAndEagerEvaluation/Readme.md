### Eager evaluation

Eager evaluation means expressions are evaluated immediately, as soon as they are encountered, even if the result is not used later.

It’s the default behavior in most programming languages (Java, C, JavaScript, Python, etc.).


### Example: Eager Evaluation in JavaScript
```js
function square(x) {
  console.log("calculating...");
  return x * x;
}

const result = square(5); // "calculating..." runs immediately
console.log("Done!");
```
- Here, `square(5)` is executed right away.
- The value is stored in `result`.



### Problem with Eager Evaluation

```js
function heavyCalculation() {
  console.log("Expensive operation running...");
  return 42;
}

function doSomething(flag) {
  const value = heavyCalculation(); // runs immediately
  if (flag) {
    return value;
  }
  return "Skipped!";
}

console.log(doSomething(false));
// Output: "Expensive operation running..." (but result wasted!)
```
Even though `flag` is `false`, `heavyCalculation()` still runs → wasted computation.

### Problem of Eager Evaluation
1. **Unnecessary work** → It computes values even if you don’t use them.

2. **Performance cost** → Can slow down programs if expensive operations are done upfront.

3. **Memory waste** → Creates big data structures in memory, even if you only need a part of them.

4. **No infinite data** → Can’t handle infinite sequences (tries to evaluate everything at once).


### Lazy Evaluation
Lazy evaluation is a functional programming technique where expressions are not computed immediately.
Instead, they are only evaluated when the result is actually needed.

It’s the opposite of eager evaluation, where everything is calculated right away.


### Example (Lazy Evaluation with Function)
```js
function lazyAdd(a, b) {
  return () => a + b; // returns a function, not value
}

const result = lazyAdd(2, 3); // nothing happens yet
console.log("Before calling");
console.log("Result:", result()); // now it calculates
```
Here, the computation happens only when you call `result()`.

### How lazy evaluation solve the problem of eager evaluation?
```js
function heavyCalculation() {
  console.log("Expensive operation running...");
  return 42;
}

function doSomething(flag) {
  if (flag) {
    const value = heavyCalculation(); 
    return value;
  }
  return "Skipped!";
}

console.log(doSomething(false));
```
In your current version, `heavyCalculation()` is called only when `flag` is true → this is actually a lazy-ish style, because the expensive call is delayed until needed.

### Benefits of Lazy Evaluation
1. **Performance** → avoids unnecessary calculations.

2. **Memory efficiency** → useful for handling large or infinite data sets.

3. **Composability** → combine transformations (like map, filter) without executing them until the final value is needed.



### Difference Between Eager vs Lazy
| Aspect               | **Eager Evaluation**              | **Lazy Evaluation**                          |
| -------------------- | --------------------------------- | -------------------------------------------- |
| When computed?       | Immediately                       | Only when needed                             |
| Default in JS/Java/C | ✅ Yes                             | ❌ No (needs explicit handling)               |
| Efficiency           | May waste work                    | Saves work & memory                          |
| Example              | `const x = f();` → runs instantly | `const x = () => f();` → runs only if called |
