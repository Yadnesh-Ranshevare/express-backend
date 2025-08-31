**A side effect means:**\
The function does something outside its own scope (mutates external variables, logs, API calls, DOM changes, etc.).
> A side effect may or may not change the return value.

### Example 1: Side effect without changing output
```js
function greet(name) {
  console.log("Hello " + name);  // side effect (console)
  return "Hello " + name;
}

console.log(greet("Yadnesh")); // "Hello Yadnesh"
console.log(greet("Yadnesh")); // "Hello Yadnesh"
```
- Same input → same output
- Still has a side effect (console).
```js
function changeTitle(newTitle) {
  document.title = newTitle;  // ❌ side effect (modifies the browser tab title)
  return newTitle;
}

changeTitle("My Website");
```
Even though it might return the same value for the same input,
it changes the page title, which is an external effect.
### Example 2: Side effect causing different output
```js
let count = 0;

function addCount(num) {
  count++;  // side effect (modifies external state)
  return num + count;
}

console.log(addCount(5)); // 6
console.log(addCount(5)); // 7
```
- Same input → different outputs
- This is an impure function because of the side effect.

### Conclusion

- **Side effect** = function touches outside world (mutates variables, logs, DOM, API, etc.)

- Different output for same input = impure function (often due to side effects, but not always).