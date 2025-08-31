function square(x) {
  return x * x; // No outside dependency
}

console.log(square(2))      // output -> 4
console.log(square(2))      // output -> 4




let count = 0;
function increase(x) {
  count += x;  // modifies outer state
  return count;
}

console.log(increase(2))    // output -> 2
console.log(increase(2))    // output -> 4