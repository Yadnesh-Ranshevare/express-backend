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
