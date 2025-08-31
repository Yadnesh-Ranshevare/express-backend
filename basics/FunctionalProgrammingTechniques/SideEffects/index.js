function greet(name) {
  console.log("Hello " + name);  // side effect (console)
  return "Hello " + name;
}

console.log(greet("Yadnesh")); // "Hello Yadnesh"
console.log(greet("Yadnesh")); // "Hello Yadnesh"



let count = 0;

function addCount(num) {
  count++;  // side effect (modifies external state)
  return num + count;
}

console.log(addCount(5)); // 6
console.log(addCount(5)); // 7
