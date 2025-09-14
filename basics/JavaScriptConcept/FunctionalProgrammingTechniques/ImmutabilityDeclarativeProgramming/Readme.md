# Immutability
- Data should not be changed after creation.
- Instead of modifying objects/arrays, create new ones.
```js
const arr = [1, 2, 3];
const newArr = [...arr, 4]; // Add element immutably
console.log(arr); // [1,2,3]  original remains unchanged
console.log(newArr); // [1,2,3,4]
```
# Declarative Programming
- Focus on what to do, not how to do it.
- Example: Using filter instead of a for loop.
```js
const numbers = [1,2,3,4,5];
const evens = numbers.filter(n => n % 2 === 0); 
console.log(evens); // [2,4]
```