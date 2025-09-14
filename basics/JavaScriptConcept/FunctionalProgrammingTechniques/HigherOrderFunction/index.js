// //Example 1: Function as Argument
// function greet(name) {
//   return "Hello " + name;
// }

// function processUser(fn, value) {
//   return fn(value);  // fn is a function passed in
// }

// console.log(processUser(greet, "Yadnesh")); 
// // Output: Hello Yadnesh





// // Example 2: Function Returning Another Function
// function multiplier(a) {
//   return function(b) {
//     return a * b;
//   };
// }

// const double = multiplier(2); // returns a new function
// console.log(double(5));       // 10



function isValid(num){
    return [1,2,3,4,5,6,7,8,9].includes(num)
}

function validNum(fun){
    return function(...args){
        console.log(args)
        return fun(...args)
    }
}

const useCheckNum = validNum(isValid)
console.log(useCheckNum(2))  //true
console.log(useCheckNum(10)) //false

