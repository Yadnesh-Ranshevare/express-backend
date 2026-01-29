# Content
1. [Introduction](#introduction)
2. [Typescript project setup](#typescript-project-setup)
3. [Basic Syntax](#basic-syntax)
4. [Types](#types)
5. [Generics, Extend, Infer & Looping](#generics)
6. [Utilities](#utilities)

---
# Introduction
> Prerequisites: User must know javascript (specially syntax, operators and Data Types)

TypeScript is a programming language built on top of JavaScript that adds types to your code.

It can also be consider as superset of JavaScript

> TypeScript = JavaScript + type safety

The issue exists because JavaScript assigns and changes data types at runtime (while the program is running) not before.
```js
let value = 10;     // number
value = "ten";     // now string ✅ allowed
value = true;      // now boolean ✅ allowed
```
JavaScript doesn’t stop you — it trusts the developer.

### Why this causes problems (real example)
```js
function multiply(a, b) {
  return a * b;
}

multiply(5, "2");   // 10 ✅ works
multiply(5, "two"); // NaN ❌ runtime bug
```
> The error appears only when this line runs.

### TypeScript fixes this by adding Compile-Time Checking
TypeScript does NOT change how JavaScript runs.\
It only checks your code before execution.
```ts
function multiply(a: number, b: number): number {
  return a * b;
}

multiply(5, "two"); // ❌ Error while coding
```
> Bug caught before runtime.

### Key Features of TypeScript
1. Static Typing

    ```ts
    let username: string = "Yadnesh";
    let score: number = 100;

    // score = "high"; ❌ Error
    ```
2. Better Code Completion (IntelliSense)\
Your editor knows what properties exist.

    ```ts
    let user = {
      name: "Yadnesh",
      age: 20
    };

    user. // editor suggests name, age
    ```
3. Interfaces (very useful in React / Next.js)

    ```ts
    interface User {
      name: string;
      email: string;
      isAdmin: boolean;
    }

    const user: User = {
      name: "Yadnesh",
      email: "yad@example.com",
      isAdmin: false
    };
    ```
4. Works Everywhere JavaScript Works
    - Browser
    - Node.js
    - React / Next.js
    - MERN stack

### Compilation
TypeScript code is NEVER executed directly it is compiled into JavaScript.
```
TypeScript (.ts)
   ↓
Type checking (compile time)
   ↓
JavaScript (.js)
   ↓
Execution (runtime)
```

**Step 1: You write TypeScript**
```ts
function add(a: number, b: number): number {
  return a + b;
}

add(5, "2"); // ❌
```
At this point:
- Nothing is running
- No JS engine involved
- Just source code

**Step 2: TypeScript Compiler (tsc) checks types**

The compiler:
- Reads types
- Validates variables
- Validates function arguments
- Checks object shapes
```ts
add(5, "2");
```
Compiler says:\
Argument of type 'string' is not assignable to parameter of type 'number'

Compilation stops here\
No JavaScript is produced (unless forced).

**Step 3: TypeScript removes all types**

If no errors:
```ts
function add(a: number, b: number): number {
  return a + b;
}
```
becomes:
```js
function add(a, b) {
  return a + b;
}
```
Types do not exist at runtime.

**Step 4: JavaScript runs normally**
```js
add(5, 2); // works
```
Execution is handled by:
- Browser JS engine (V8, SpiderMonkey)
- or Node.js

TypeScript is already gone.

### Very Important Rule
TypeScript does NOT add runtime checks

This will compile:
```ts
let value: number = JSON.parse("123");
```
But crash at runtime if data is wrong.

Type safety is compile-time only.

### Is Typescript Statically typed language?
Yes — TypeScript is a statically typed language, but only at compile time.

**What “statically typed” means**
- Types are known before the program runs
- Type errors are caught at compile time

TypeScript does exactly this:
```ts
let age: number = 20;
// age = "twenty"; ❌ compile-time error
```
So by definition → TypeScript is statically typed

**Why only at compile time?**

Because JavaScript (the runtime) is dynamically typed.

Remember the flow of compilation:
```
TypeScript (static typing)
        ↓ compile
JavaScript (dynamic typing)
        ↓ run
```
So:
- TypeScript → static typing (development time)
- JavaScript → dynamic typing (runtime)

**Therefor we can say that:**
- TypeScript is a statically typed superset of JavaScript
- Type checking happens at compile time
- It does not enforce types at runtime

### Optionally Statically Typed Language
TypeScript performs static type checking at compile time when types are declared or inferred.

But typing is optional—you can write pure JavaScript without annotations, and the any type lets you bypass checks entirely. 

This contrasts with strictly statically typed languages like Java, where all types must be explicitly defined.   

Therefor TypeScript (TS) is commonly described as an optionally statically typed language.


[Go To Top](#content)

---
# Typescript project setup
1. Initiate a Node project
    ```bash
    npm init -y
    ```
2. Install typescript as dev dependency
    ```bash
    npm i -D typescript
    ```
    this command will install the typescript compiler (`tsc`)
3. add compilation Command into `package.json`
    ```json
    "scripts": {
      "compile": "tsc src/index.ts"
    }
    ```
    now whenever you run `npm run compile` it will compile the  `src/index.ts` file into `src/index.js` file

4. Execute the compiled `.js` file 

    ```json
    "scripts": {
      "compile": "tsc src/index.ts",
      "start":"Node src/index.js"
    }
    ```
    Or you can combine this `"compile"` + `"stat"` command into single line
    ```json
    "scripts": {
      "start":"tsc src/index.ts && Node src/index.js"
    }
    ```
    here the `tsc src/index.ts` command will execute first directly followed by `Node src/index.js`

After following above 4 step you will setup your basic typescript project

### Auto-compile
use `tsc --watch` to auto-compile your `.ts` files
```json
"scripts": {
  "compile": "tsc --watch"
}
```
Now whenever you run `npm run compile` it will continuously watch all of your `.ts` file and whenever any changes are detected it will start compilation automatically

### `tsconfig.json`
`tsconfig.json` configures the TypeScript compiler (`tsc`).

It defines root files, compiler options (like `target ES version`, `strict mode`, `outDir`), and file patterns to include/exclude during compilation. Without it, `tsc` uses defaults or command-line flags.

To generate:
```bash
npx tsc --init
```
[Visit official docs](https://www.typescriptlang.org/tsconfig/) to understand all the customization 

### Clean project setup using `tsconfig.json`
by default `tsc` compile the `.ts` file into the same directory, which can get messy as the project size grows.

Therefor we can define `tsc` such that it will pick the `.ts` file from directory and dump all the compiled `.js` file into the another folder

to do that just add:
```json
"compilerOptions": {
    "rootDir": "./src", // fom where the compiler compiler should pick the .ts file
    "outDir": "./dist", // where to dump the compiled .js file
}
```
Now to run our compiled `.js` file
```json
"scripts": {
    "watch":"tsc --watch",
    "start":"Node dist/index.js"
}
```
Therefor
1. run `npm run watch` command for auto-compilation
2. run `npm start` to execute freshly compiled `.js` file

[Go To Top](#content)

---
# Basic Syntax
TypeScript syntax builds directly on JavaScript with added type annotations.

### Basic Types 
```ts
let name: string = "Yadnesh";      // String
let age: number = 30;              // Number  
let isActive: boolean = true;      // Boolean
let id: number | string = 123;     // Union type
let anything: any = "flexible";    // Any type
```
### Arrays
```ts
let numbers: number[] = [1, 2, 3];
let mixed: (string | number)[] = ["a", 1, "b"];
```
### Functions
```ts
function greet(name: string): string {
  return `Hello ${name}`;
}

const add = (a: number, b: number): number => a + b;
```
### Objects
```ts
const obj: { [key in string]: string } = {
    name: "yadnesh",
    address: "kalyan",
};
```
### Interfaces
```ts
interface User {
  id: number;
  name: string;
  email?: string;  // Optional
}

const user: User = { id: 1, name: "Yadnesh" };
```
### Type Alias
```ts
type User = { id: number; name: string };

const user: User = { id: 1, name: "Yadnesh" }; 
```
### Difference between Interfaces and Type Alias
1. merging by redeclaration
```ts
interface user {name:string}

interface user {age:number}

const a:user = {
    name:"Yadnesh",
    age:21
}
```
```ts
type user = {name:string}
// type user = {age:number} // error -> you can not redeclare Type Alias
```
2. type inheritance
```js
interface user {
    name:string
    age:number
}

interface admin extends user {
    role:string
}

const b:admin = {
    name:"Yadnesh",
    role:"admin",
    age:21
}
```
```ts
type user = {
    name:string
}

type admin = user & {
    role:string
}

const b:admin = {
    name:"Yadnesh",
    role:"admin",
    age:21
}
```



[Go To Top](#content)

---
# Types
At a high level, TypeScript has three fundamental mechanisms for assigning / fixing types.

### 1. Type Annotation
```js
let a: number = 10;
```
You declare the type explicitly\
TS checks assignments against it

Used in:
- variables
- function params
- return types
- object properties
### 2. Type Assertion (`as`)
```js
let b = value as number;
```
You tell TS to trust you\
No checking, no validation

Used when:
- DOM elements
- external APIs
- third-party libraries
- narrowing unions manually

### 3. Generics
```js
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(10);
```
Type is parameterized\
Decided later (at usage time)

Used when:
- writing reusable functions
- reusable components
- collections
- libraries

### Union
In TypeScript, a union type lets a variable (or parameter, or return value) hold one of several possible types instead of just one.

You create a union using the pipe (`|`) symbol.

example
```ts
let id: number | string;

id = 101;       // ✅ allowed
id = "A101";    // ✅ allowed
id = true;      // ❌ error
```
### commonly used types
| **Type**       | **Description**        | **Example**                                     |
| -------------- | ---------------------- | ----------------------------------------------- |
| `string`       | Text values            | `let name: string = "Yadnesh";`                 |
| `number`       | Numbers (int, float)   | `let age: number = 21;`                         |
| `boolean`      | True / False           | `let isAdmin: boolean = false;`                 |
| `array`        | List of values         | `let skills: string[] = ["JS", "TS"];`          |
| `tuple`        | Fixed-size array       | `let user: [string, number] = ["Yadnesh", 21];` |
| `any`          | No type safety         | `let data: any = "hello";`                      |
| `unknown`      | Safer than `any`       | `let res: unknown;`                             |
| `object`       | Structured data        | `let user: { name: string; age: number };`      |
| `type`         | Custom type alias      | `type User = { id: number; name: string };`     |
| `interface`    | Object structure       | `interface User { id: number; name: string }`   |
| `union` (`\|`) | Multiple allowed types | `let id: number \| string;`                     |
| `literal`      | Fixed values           | `let status: "loading" \| "success";`           |
| `function`     | Function typing        | `function add(a: number, b: number): number {}` |
| `optional (?)` | Optional property      | `age?: number`                                  |
| `enum`         | Named constants        | `enum Role { ADMIN, USER }`                     |
| `void`         | No return              | `function log(): void {}`                       |
| `never`        | Never returns          | `function err(): never { throw Error(); }`      |
| `null`         | Null value             | `let value: string \| null = null;`             |
| `undefined`    | Undefined value        | `let data: number \| undefined;`                |
| `Record`       | Key-value object       | `Record<string, number>`                        |
| `readonly`     | Immutable property     | `readonly id: number`                           |

### DOM Element Types
| **DOM Type**          | **Used For**                    | **Example**                                                             |
| --------------------- | ------------------------------- | ----------------------------------------------------------------------- |
| `HTMLElement`         | Base type for all HTML elements | `const el: HTMLElement = document.body;`                                |
| `HTMLDivElement`      | `<div>`                         | `const div = document.querySelector("div") as HTMLDivElement;`          |
| `HTMLSpanElement`     | `<span>`                        | `const span = document.querySelector("span") as HTMLSpanElement;`       |
| `HTMLButtonElement`   | `<button>`                      | `const btn = document.querySelector("button") as HTMLButtonElement;`    |
| `HTMLInputElement`    | `<input>`                       | `const input = document.querySelector("input") as HTMLInputElement;`    |
| `HTMLFormElement`     | `<form>`                        | `const form = document.querySelector("form") as HTMLFormElement;`       |
| `HTMLImageElement`    | `<img>`                         | `const img = document.querySelector("img") as HTMLImageElement;`        |
| `HTMLAnchorElement`   | `<a>`                           | `const link = document.querySelector("a") as HTMLAnchorElement;`        |
| `HTMLSelectElement`   | `<select>`                      | `const select = document.querySelector("select") as HTMLSelectElement;` |
| `HTMLTextAreaElement` | `<textarea>`                    | `const ta = document.querySelector("textarea") as HTMLTextAreaElement;` |
| `HTMLUListElement`    | `<ul>`                          | `const ul = document.querySelector("ul") as HTMLUListElement;`          |
| `HTMLLIElement`       | `<li>`                          | `const li = document.querySelector("li") as HTMLLIElement;`             |
| `HTMLTableElement`    | `<table>`                       | `const table = document.querySelector("table") as HTMLTableElement;`    |
| `HTMLVideoElement`    | `<video>`                       | `const video = document.querySelector("video") as HTMLVideoElement;`    |
| `HTMLAudioElement`    | `<audio>`                       | `const audio = document.querySelector("audio") as HTMLAudioElement;`    |
| `HTMLCanvasElement`   | `<canvas>`                      | `const canvas = document.querySelector("canvas") as HTMLCanvasElement;` |

### Event Types 
| **Event Type**  | **Triggered By** | **Example**          |
| --------------- | ---------------- | -------------------- |
| `Event`         | Base event       | `(e: Event)`         |
| `MouseEvent`    | Click, hover     | `(e: MouseEvent)`    |
| `KeyboardEvent` | Key press        | `(e: KeyboardEvent)` |
| `InputEvent`    | Input change     | `(e: InputEvent)`    |
| `FocusEvent`    | Focus / blur     | `(e: FocusEvent)`    |
| `SubmitEvent`   | Form submit      | `(e: SubmitEvent)`   |


[Go To Top](#content)

---
# Generics
Generics let you write reusable, type-safe code where the type is decided later, not when you write the function/class.

```js
function test<T>(arg: T): T[] {
    return [arg];
}

const res1 = test<string>("yadnesh");
console.log(res1); // [ 'yadnesh' ]

const res2 = test<number>(1);
console.log(res2); // [ 1 ]
```
Generic with Interface
```js
interface type<T> {
    type: T;
}

const res3: type<string> = {
    type: "string",
};
console.log(res3); // { type: 'string' }
```
Generic with Type Alias
```js
type type<T> = {
    type: T;
};

const res4: type<string> = {
    type: "string",
};
console.log(res4); // { type: 'string' }
```

### Extend 
Extend keyword let you inherit other interface
```js
interface user {
    name:string
    age:number
}

interface admin extends user {
    role:string
}

const b:admin = {
    name:"Yadnesh",
    role:"admin",
    age:21
}
```
with generics
```js
interface type3<T extends string> { // T must be a string
    age: number;
    name: T
}

const res5: type3<"yadnesh"> = {
    age: 1,
    name: "yadnesh"
}

// res5.name = "abc" // error -> Type '"abc"' is not assignable to type '"yadnesh"'.

const res12: type3<string> = {
    age: 1,
    name: "yadnesh"
} 
res12.name = "abc"  // no error
```
similarly
```js
type test2 = {
    name: string
}

type type6<T extends test2> = {
    name: T
    age: number
}

const res10: type6<{ name: "yadnesh" }> = {
    name: { name: "yadnesh" },
    age: 1
}

// res10.name.name = "abc"     // error -> Type '"abc"' is not assignable to type '"yadnesh"'.

const res11: type6<{ name: string }> = {
    name: { name: "yadnesh" },
    age: 1
}
res11.name.name = "abc" // no error
```
### Dynamic content inside type using Extend 
```js
type type4<T> = T extends string ? { name: string } : { number: number };

const res6: type4<number> = {
    number: 1,
};

const res7: type4<string> = {
    name: "yadnesh",
};

console.log(res5); // { number: 1 }
console.log(res6); // { name: 'yadnesh' }
```
Or
```js
type type5<T> = {
    prop: T extends string ? string : number;
};

const res8: type5<string> = {
    prop: "string",
};

const res9: type5<number> = {
    prop: 1,
};

console.log(res8); // { prop: 'string' }
console.log(res9); // { prop: 1 }
```

### Infer
infer means “catch the inner type and name it.”
```js
type test3<U> = {
    prop: U
}

type type7<T> = T extends test3<infer U> ? U : string; 

const res13: type7<test3<string>> = "yadnesh";
const res14: type7<number> = "abc"
```
we can simplify above code as 
```js
type test3 = number

type type7<T> = T extends test3 ? test3 : string
```
type `T` extends type `test3`

But as our `test3` type also accept generic(`U`), we can get the by using `infer`

```js
type test3<U> = {
    prop: U
}

type type7<T> = T extends test3<infer U> ? U : string; 
```
this code says that if `type7` extend `test3<U>` then type of `type7` will be `U` else it will be string
``` js
const res13: type7<test3<string>> = "yadnesh";  
```
Here `type7` is extending `test<string>` with `U = string`. Therefor final type will be `U` i.e `string`
```js
const res14: type7<number> = "abc";
```
Here `type7` is not extending `test<U>` therefor, as per the condition final type will be string

Similarly
```js
const res15: type7<{ prop: 1 }> = 1;
// const res16: type7<{ prop: 1 }> = 2;    // error -> Type '2' is not assignable to type '1'.
```
as `{ prop: 1 }` follows the `test3<U>` with `U = 1`

### Example
```js
type test4<U> = {
    prop: U;
};

type type8<T> = T extends test4<infer U> ? test4<U> : T;

const res17: type8<test4<string>> = { prop: "yadnesh" };
const res18: type8<number> = 1;
const res19: type8<{ prop: 1 }> = { prop: 1 };  

console.log(res17, res18, res19);   // { prop: 'yadnesh' } 1 { prop: 1 }
```

### Looping over type
```js
type type9<T> = {
    [K in keyof T]: T[K] extends null ? string : T[K];
}

const res20: type9<{ price: null, name: null }> = {
    price: "100",
    name: "kit kat"
}

const res21: type9<{ price: number, isValid: boolean }> = {
    price: 125,
    isValid: true
}
```
In above code snippet `[K in keyof T]` is a loop that traverse over the type object that pass as generic `T`, where `K` is key and `T` is entire type object

let say our type object is
```js
{ 
    price: number, 
    name: string 
}
```
here `K` will be:
- for first iteration: `k = price` -> `T[K]` is type of `price` i.e, `number`
- for second iteration: `k = name` -> `T[K]` is type of `name` i.e, `string`



[Go To Top](#content)

---
# Utilities

In TypeScript, utilities (utility types) are built-in generic types that help you transform, reuse, or derive new types from existing ones—without rewriting code.

### Common TypeScript Utility Types
There are mainly 4 type of utility in ts i.e, 
| Type | What utilities do            |
| -------- | ---------------------------- |
| Object   | Add/remove/change properties |
| Union    | Filter types                 |
| Function | Extract types                |
| Async    | Unwrap promises              |



### 1. Object-based utilities
- **`Partial<T>`**\
Make all properties optional
    ```ts
    type User1 = { id: number; name: string };

    const User1: Partial<User1> = {     // no error
        id: 1,
    };
    ```

- **`Required<T>`**\
Make all properties required

    ```ts
    type User2 = {
        id?: number;
        name?: string;
    };

    // const User2: Required<User2> = {    // error -> Property 'name' is missing in type '{ id: number; }' but required in type 'Required<User2>'.
    //     id: 1,
    // };

    const User2: Required<User2> = {
        id: 1,
        name: "Yadnesh",
    };
    ```

- **`Readonly<T>`**\
Prevent modification
    ```ts
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
    ```
- **`Pick<T, K>`**\
Pick selected properties
    ```ts
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
    ```

- **`Omit<T, K>`**\
Remove selected properties
    ```ts
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
    ```

### 2. Union-based utilities
- **`Exclude<T, U>`**\
Remove types from a union
    ```ts
    type price = number | string 

    // const exc: Exclude<price, string> = "20"    // error -> Type 'string' is not assignable to type 'number'.

    const exc: Exclude<price, string> = 20    
    ```

- **`Extract<T, U>`**\
Keep matching types
    ```ts
    type price = number | string
    s 
    // const ext: Extract<price, string> = 20  // error -> Type 'number' is not assignable to type 'string'.

    const ext: Extract<price, string> = "20"
    ```
- **`NonNullable<T>`**\
Remove null & undefined
    ```ts
    type price = number | string | null

    // const nul: NonNullable<price> = null    // error -> Type 'null' is not assignable to type 'NonNullable<price>'.

    const nul: NonNullable<price> = 20
    ```
### 3. Function-based utilities
- **`ReturnType<T>`**\
Get function return type

    ```ts
    function demo():string{
        return "hello"
    }

    const ans: ReturnType<typeof demo> = demo()
    ```
- **`Parameters<T>`**\
Get function parameters
    ```ts
    function demo(name:string, age:number):string{
        return `im ${name}, ${age} years old`
    }

    type args = Parameters<typeof demo> // return the type inside array i.e, [string, number]

    const data:args = ["yadnesh", 20]   // as args = [string, number]

    const res = demo(...data)
    ```
### 4. Async utility
- **`Awaited<T>`**\
Unwrap Promise

    Without `Awaited<T>`
    ```ts
    async function getUser(){
        await new Promise(resolve => setTimeout(resolve, 2000))
        return {
            name: "yadnesh",
            age: 20
        }
    }

    type promise = ReturnType<typeof getUser>   // here type is promise

    const prom: promise = getUser()

    prom.then(data => console.log(data))     // { name: 'yadnesh', age: 20 }
    ```
    With `Awaited<T>`
    ```ts
    sync function getUser(){
        await new Promise(resolve => setTimeout(resolve, 2000))
        return {
            name: "yadnesh",
            age: 20
        }
    }

    type Data = Awaited<ReturnType<typeof getUser>> // here type is type Data = { name: string; age: number; }

    const user: Data = await getUser()
    console.log(user)       // { name: 'yadnesh', age: 20 }
    ```



[Go To Top](#content)

---