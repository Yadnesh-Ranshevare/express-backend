console.log(this);


let x = "global";  // Global scope

function test() {
  let y = "function";  // Function scope
  if (true) {
    let z = "block";   // Block scope
    console.log(z);    // ✅ works
  }
  // console.log(z);   // ❌ error
}



function test() {
  var x = 10;
  console.log(x); // ✅ 10
}
test();

console.log(x); // ❌ ReferenceError: x is not defined


if (true) {
  var y = 20;
}
console.log(y); // ✅ 20


console.log(a); // undefined
var a = 10;
console.log(a); // 10


// console.log(b); // ❌ ReferenceError
let b = 20;



sayHi(); // "Hello!"

function sayHi() {
  console.log("Hello!");
}



sayBye(); // ❌ TypeError
var sayBye = function() {
  console.log("Bye!");
};



function hooisting(){
    function print(){
        console.log(a)
        if(true){
            var a = 10
            console.log(a)
        }
    }
    print()
    console.log(a)
}

hooisting()



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