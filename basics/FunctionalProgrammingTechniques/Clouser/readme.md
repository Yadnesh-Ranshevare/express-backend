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

