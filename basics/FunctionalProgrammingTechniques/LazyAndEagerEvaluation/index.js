

function square(x) {
  console.log("calculating...");
  return x * x;
}

const result1 = square(5); // "calculating..." runs immediately
console.log("Done!");









function heavyCalculation() {
  console.log("Expensive operation running...");
  return 42;
}

function doSomething(flag) {
  const value = heavyCalculation(); // runs immediately
  if (flag) {
    return value;
  }
  return "Skipped!";
}

console.log(doSomething(false));





function lazyAdd(a, b) {
  return () => a + b; // returns a function, not value
}

const result = lazyAdd(2, 3); // nothing happens yet
console.log("Before calling");
console.log("Result:", result()); // now it calculates







function heavyCalculation() {
  console.log("Expensive operation running...");
  return 42;
}

function doSomething(flag) {
  if (flag) {
    const value = heavyCalculation(); 
    return value;
  }
  return "Skipped!";
}

console.log(doSomething(false));