# Content
1. [Introduction](#introduction)
2. [Typescript project setup](#typescript-project-setup)
3. [Basic Syntax](#basic-syntax)

---
# Introduction
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
    Or you can reduce this `"compile"` + `"stat"` command into single 
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
2. run `npm start` to execute freshly compiled `.ts` file

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