# Functional Composition

Functional composition means combining two or more functions to build a new function.
The output of one function becomes the input of the next.

### Example in JavaScript
```js
const add = x => x + 1;
const square = x => x * x;

// compose: square(add(x))
const addThenSquare = x => square(add(x));

console.log(addThenSquare(2)); // (2+1)^2 = 9
```
- `square(add(x))` : the output of `add()` function is feed to `square()`

### Example With a helper compose
```js
const compose = (f, g) => x => f(g(x));

const add1 = x => x + 1;
const double = x => x * 2;

const add1ThenDouble = compose(double, add1);

console.log(add1ThenDouble(3)); // (3+1)*2 = 8
```

### Why it’s useful?

1. **Reusability** → build small functions and chain them together.
2. **Readability** → cleaner code compared to deeply nested calls.
3. **Testability** → small pure functions are easier to test


# Method Chaining

Method chaining is an object-oriented programming technique where you call multiple methods on the same object in a single line, one after another.

### Simple Example
```js
const message = "  hello world  "
  .trim()        // "hello world"
  .toUpperCase() // "HELLO WORLD"
  .slice(0, 5);  // "HELLO"

console.log(message); // HELLO
```
Here:
- `.trim()` returns a new string → you can call `.toUpperCase()` on it.
- `.toUpperCase()` returns another string → you can chain `.slice()`.


# Key Difference Between Functional Composition & Method Chaining
- **Method Chaining** = chaining methods on an object (`obj.method1().method2()`).
- **Function Composition** = chaining functions together (`f(g(h(x)))`).
- Both achieve similar readability, but one is OOP style, the other FP style.