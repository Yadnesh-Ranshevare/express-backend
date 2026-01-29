type User1 = { id: number; name: string };

const User1: Partial<User1> = {
    id: 1,
};

type User2 = {
    id?: number;
    name?: string;
};

// const User3: Required<User2> = {    // error -> Property 'name' is missing in type '{ id: number; }' but required in type 'Required<User2>'.
//     id: 1,
// };

const User2: Required<User2> = {
    id: 1,
    name: "Yadnesh",
};

type User3 = {
    id: number;
    name: string;
};

const User3: Readonly<User3> = {
    id: 1,
    name: "Yadnesh",
};

// User3.id = 2;   // error -> Cannot assign to 'id' because it is a read-only property.
// User3.name = "abc";   // error -> Cannot assign to 'name' because it is a read-only property.


type User4 = {
    id: number;
    name: string;
};

// const User4: Pick<User4, "id"> = {
//     id: 1,
//     name:"yadnesh"      // error -> Object literal may only specify known properties, and 'name' does not exist in type 'Pick<User4, "id">'.
// };

const User4: Pick<User4, "id"> = {
    id: 1,
};

type User5 = {
    id: number;
    name: string;
};

// const User5: Omit<User5, "name"> = {
//     id: 1,
//     name: "yadnesh",    // error -> Object literal may only specify known properties, and 'name' does not exist in type 'Omit<User5, "name">'.
// };

const User5: Omit<User5, "name"> = {
    id: 1,
};

type price = number | string | null

// const exc: Exclude<price, string> = "20"    // error -> Type 'string' is not assignable to type 'number'.
const exc: Exclude<price, string> = 20    

// const ext: Extract<price, string> = 20  // error -> Type 'number' is not assignable to type 'string'.
const ext: Extract<price, string> = "20"

// const nul: NonNullable<price> = null    // error -> Type 'null' is not assignable to type 'NonNullable<price>'.

const nul: NonNullable<price> = 20


function demo(name:string, age:number):string{
    return `im ${name}, ${age} years old`
}

type args = Parameters<typeof demo>

const data:args = ["yadnesh", 20]

const res = demo(...data)

async function getUser(){
    //delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    return {
        name: "yadnesh",
        age: 20
    }
}

type promise = ReturnType<typeof getUser>   // here type is promise

const prom: promise = getUser()

prom.then(data => console.log(data))     // { name: 'yadnesh', age: 20 }

type Data = Awaited<ReturnType<typeof getUser>> // here type is type Data = { name: string; age: number; }

const user: Data = await getUser()
console.log(user)       // { name: 'yadnesh', age: 20 }