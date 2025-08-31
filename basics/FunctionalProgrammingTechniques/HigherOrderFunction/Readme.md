**A Higher-Order Function (HOF) in JavaScript is a function that does at least one of these:**

1. Takes another function as an argument
2. Returns a function as its result


### Example 1: Function as Argument
```js
function greet(name) {
  return "Hello " + name;
}

function processUser(fn, value) {
  return fn(value);  // fn is a function passed in
}

console.log(processUser(greet, "Yadnesh")); 
// Output: Hello Yadnesh
```
**Here, `processUser` is a higher-order function because it takes `greet` (a function) as an argument.**

### Example 2: Function Returning Another Function
```js
function multiplier(a) {
  return function(b) {
    return a * b;
  };
}

const double = multiplier(2); // returns a new function
console.log(double(5));       // 10
```
**Here, `multiplier` is a higher-order function because it returns a function.**


### Real-world Examples in JavaScript
- `.map`
```js
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
console.log(doubled); // [2, 4, 6]
```
- `.filter`
```js
const nums = [1, 2, 3, 4];
const evens = nums.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]
```

### Deference between Higher Oder Function and Callback function
A callback function is a function that you `pass as an argument` to another function, so it can be “called back” later. 

lets take previous example:
```js
function greet(name) {
  return "Hello " + name;
}

function processUser(fn, value) {
  return fn(value);  // fn is a function passed in
}

console.log(processUser(greet, "Yadnesh")); 
// Output: Hello Yadnesh
```
- here as we learn `processUser` is a ***higher order function*** that accept the other function as a argument
- Whereas `greet` is a ***callback function*** which is pass as a argument into the `processUser` function 

similarly we say in case of:
 - `.map`
```js
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
console.log(doubled); // [2, 4, 6]
```
Here `.map` is a higher order function that accept a callback `n => n * 2`

### Higher Order Function For Hook Creation
```js
function isValid(num){
    return [1,2,3,4,5,6,7,8,9].includes(num)
}

function validNum(fun){
    return function(...args){   // make sure to accept the args first in a function
        console.log(args)   // input = 2 -> args = [2] and input = 10 -> args = [10]
        return fun(...args)
    }
}

const useCheckNum = validNum(isValid)

console.log(useCheckNum(2))  //true
console.log(useCheckNum(10)) //false
```
`...args` is a rest that accept the input pass into the function and store it into a array format

Example:
```js
function demo(...args) {
  console.log(args);
}

demo(1, 2, 3); // [1, 2, 3]
```