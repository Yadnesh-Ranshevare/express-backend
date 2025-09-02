Currying is a functional programming technique where a function that takes multiple arguments is transformed into a sequence of functions, each taking one argument.

Simply currying is breaking a multi-argument function into smaller functions, each handling one argument.

### Example Without Curring
```js
function add(a, b, c) {
  return a + b + c;
}

console.log(add(1, 2, 3)); // 6
```
### Example with Curring
```js
function curryAdd(a) {
    console.log(a);     // 1
    return function (b) {
        console.log(b);     // 2
        return function (c) {
            console.log(c);     // 3
            return a + b + c;
        };
    };
}

console.log(curryAdd(1)(2)(3)); // 6
```
Here:
- first we call `curryAdd(1)` it return the function that accept `(2)`  
- the next function then return another function which take input `(3)`

### some practical use cases of currying
1. Event Handling (DOM / React)
```js
const handleEvent = type => message => {
  console.log(`${type}: ${message}`);
};

// Reusable handlers
const errorHandler = handleEvent("Error");
const successHandler = handleEvent("Success");

// Example usage
errorHandler("Something went wrong");   // Error: Something went wrong
successHandler("Data saved");          // Success: Data saved
```

2. API Calls with Fixed Base URL
```js
const fetchFromAPI = baseURL => endpoint => fetch(`${baseURL}${endpoint}`);

const githubAPI = fetchFromAPI("https://api.github.com");

githubAPI("/users/octocat")
  .then(res => res.json())
  .then(data => console.log(data));
```