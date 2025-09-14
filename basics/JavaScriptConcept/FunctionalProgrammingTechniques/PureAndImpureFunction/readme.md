### Pure Function 
Functions that always return the same output for the same input and have no side effects.
```js
function square(x) {
  return x * x; // No outside dependency
}

console.log(square(2))      // output -> 4
console.log(square(2))      // output -> 4
```

### Impure Function
An impure function is the opposite of a pure function.

It fails one (or both) of these rules:

1. Same input → same output (determinism)
2. No side effects

So an impure function either:

- Produces different outputs for the same inputs, OR
- Has side effects (changes something outside, like variables, DOM, API calls, etc.)  
```js
let count = 0;

function increaseBy(num) {
  count += num;   // ❌ modifies outside state
  return count;
}

console.log(increaseBy(5)); // 5
console.log(increaseBy(5)); // 10  (same input, different output!)
```