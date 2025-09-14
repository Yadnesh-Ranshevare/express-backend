const add = x => x + 1;
const square = x => x * x;

// compose: square(add(x))
const addThenSquare = x => square(add(x));

console.log(addThenSquare(2)); // (2+1)^2 = 9





