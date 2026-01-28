function test<T>(arg: T): T[] {
    return [arg];
}

const res1 = test<string>("yadnesh");
// console.log(res1); // [ 'yadnesh' ]

const res2 = test<number>(1);
// console.log(res2); // [ 1 ]

interface type<T> {
    type: T;
}

const res3: type<string> = {
    type: "string",
};
// console.log(res3); // { type: 'string' }

type type2<T> = {
    type: T;
};

const res4: type2<string> = {
    type: "string",
};
// console.log(res4); // { type: 'string' }

interface type3<T extends string> {
    age: number;
    name: T;
}

const res5: type3<"yadnesh"> = {
    age: 1,
    name: "yadnesh",
};
// res5.name = "abc" // error -> Type '"abc"' is not assignable to type '"yadnesh"'.
const res12: type3<string> = {
    age: 1,
    name: "yadnesh",
};
res12.name = "abc"; // no error

type type4<T> = T extends string ? { name: string } : { number: number };

const res6: type4<number> = {
    number: 1,
};
const res7: type4<string> = {
    name: "yadnesh",
};
// console.log(res5); // { number: 1 }
// console.log(res6); // { name: 'yadnesh' }

type type5<T> = {
    prop: T extends string ? string : number;
};

const res8: type5<string> = {
    prop: "string",
};
const res9: type5<number> = {
    prop: 1,
};
// console.log(res8); // { prop: 'string' }
// console.log(res9); // { prop: 1 }

type test2 = {
    name: string;
};

type type6<T extends test2> = {
    name: T;
    age: number;
};

const res10: type6<{ name: "yadnesh" }> = {
    name: { name: "yadnesh" },
    age: 1,
};

// res10.name.name = "abc"     // error -> Type '"abc"' is not assignable to type '"yadnesh"'.
const res11: type6<{ name: string }> = {
    name: { name: "yadnesh" },
    age: 1,
};
res11.name.name = "abc"; // allow

type test3<U> = {
    prop: U;
};
type type7<T> = T extends test3<infer U> ? U : string;

const res13: type7<test3<string>> = "yadnesh";
const res14: type7<number> = "abc";
const res15: type7<{ prop: 1 }> = 1;
// const res16: type7<{ prop: 1 }> = 2;    // error -> Type '2' is not assignable to type '1'.

type test4<U> = {
    prop: U;
};
type type8<T> = T extends test4<infer U> ? test4<U> : T;

const res17: type8<test4<string>> = { prop: "yadnesh" };
const res18: type8<number> = 1;
const res19: type8<{ prop: 1 }> = { prop: 1 };
// console.log(res17, res18, res19);   // { prop: 'yadnesh' } 1 { prop: 1 }

type type9<T> = {
    [K in keyof T]: T[K] extends null ? string : T[K];
};

const res20: type9<{ price: null; name: null }> = {
    price: "100",
    name: "kit kat",
};

const res21: type9<{ price: number; isValid: boolean }> = {
    price: 125,
    isValid: true,
};

// console.log(res20, res21);  // { price: '100', name: 'kit kat' } { price: 125, isValid: true }


