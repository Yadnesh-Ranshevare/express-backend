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
