# Concept
1. [Introduction](#introduction)
2. [How do I use WebAssembly in my app?](#how-do-i-use-webassembly-in-my-app)
3. [Hello world in WebAssembly](#hello-world-in-webassembly)
4. [Export Function In WebAssembly](#export-function-in-webassembly)


[Acknowledgment](#acknowledgment)

---

# Introduction
WebAssembly (abbreviated as Wasm) is a low-level bytecode format originally designed for the web. It is not primarily intended to be written by hand, rather it is designed to be an effective compilation target for source languages like C, C++, Rust, etc.

This has huge implications for the web platform — it provides a way to run code written in multiple languages on the web at near-native speed, with client apps running on the web that previously couldn't have done so.

What's more, you don't even have to know how to create WebAssembly code to take advantage of it. WebAssembly modules can be imported into a web (or Node.js) app, exposing WebAssembly functions for use via JavaScript. JavaScript frameworks could make use of WebAssembly to confer massive performance advantages and new features while still making functionality easily available to web developers.

### WebAssembly goals
- **Be fast, efficient, and portable** — WebAssembly is designed to use capabilities that many different CPUs already have, so browsers/runtimes can efficiently convert Wasm instructions into the CPU's native instructions.
- **Be readable and debuggable** — WebAssembly is a low-level assembly language, but it does have a human-readable text format (the specification for which is still being finalized) that allows code to be written, viewed, and debugged by hand.
- **Keep secure** — WebAssembly is specified to be run in a safe, sandboxed execution environment. Like other web code, it will enforce the browser's same-origin and permissions policies.
- **Don't break the web** — WebAssembly is designed so that it plays nicely with other web technologies and maintains backwards compatibility.

### How does WebAssembly fit into the web platform?
The web platform can be thought of as having two parts:

- A virtual machine (VM) that runs the Web app's code, e.g., the JavaScript code that powers your apps.
- A set of Web APIs that the Web app can call to control web browser/device functionality and make things happen (DOM, CSSOM, WebGL, IndexedDB, Web Audio API, etc.).

Historically, the VM has been able to load only JavaScript. This has worked well for us as JavaScript is powerful enough to solve most problems people have on the Web today. We have run into performance problems, however, when trying to use JavaScript for more intensive use cases like 3D games, Virtual and Augmented Reality, computer vision, image/video editing, and a number of other domains that demand native performance (see WebAssembly use cases for more ideas).

Additionally, the cost of downloading, parsing, and compiling very large JavaScript applications can be prohibitive. Mobile and other resource-constrained platforms can further amplify these performance bottlenecks.

WebAssembly is a different language from JavaScript, but it is not intended as a replacement. Instead, it is designed to complement and work alongside JavaScript, allowing web developers to take advantage of both languages' strong points:
- JavaScript is a high-level language, flexible and expressive enough to write web applications. It has many advantages — it is dynamically typed, requires no compile step, and has a huge ecosystem that provides powerful frameworks, libraries, and other tools.
- WebAssembly is a low-level assembly-like language with a compact binary format that runs with near-native performance and **provides languages with low-level memory models such as C++ and Rust with a compilation target** so that they can run on the web. (Note that WebAssembly has the high-level goal of supporting languages with garbage-collected memory models in the future.)

With the advent of WebAssembly appearing in browsers, the virtual machine that we talked about earlier will now load and run two types of code — JavaScript AND WebAssembly.

The different code types can call each other as required — the WebAssembly JavaScript API wraps exported WebAssembly code with JavaScript functions that can be called normally, and WebAssembly code can import and synchronously call normal JavaScript functions.

### Meaning of "low-level memory models such as C++ and Rust with a compilation target"

#### Compilation Target:

Think of a compiler as a translator

The compiler translates your code into something the computer can execute.

But there is a problem: different computers use different types of machine code.

So the compiler can have different targets:

```
             C++ program
                  ↓
              Compiler
            ↙     ↓      ↘
        Windows   Linux   WebAssembly
        machine   machine    (.wasm)
         code      code
``` 
In ou case, WebAssembly is a compilation target.

In other words:\
A compilation target is the thing that a compiler produces code for.

#### low-level memory model
languages like C++ and Rust give programmers more direct control over memory.

For example, in C++ you can work with pointers:
```cpp
int x = 10;
int* p = &x;
```
Here, `p` contains the memory address of `x`.

WebAssembly has a memory model that can represent this kind of behavior, so C++ and Rust programs can be compiled into WebAssembly relatively naturally.

#### Imagine you have a C++ game:

Without WebAssembly, getting C++ code to run directly in a browser is difficult because browsers don't directly execute normal C++ machine code.

But with WebAssembly:
```
C++ Game
   ↓
Compile
   ↓
WebAssembly
   ↓
Browser
```


[Go To Top](#concept)

---
# How do I use WebAssembly in my app?

The WebAssembly ecosystem is at a growing stage; more tools will undoubtedly emerge going forward. Right now, there are four main entry points:

- Porting a C/C++ application with Emscripten.
- Writing or generating WebAssembly directly at the assembly level.
- Writing a Rust application and targeting WebAssembly as its output.
- Using AssemblyScript which looks similar to TypeScript and compiles to WebAssembly binary.

Let's talk about these options:

### Porting from C/C++
Two of the many options for creating Wasm code are an online Wasm assembler or [Emscripten](https://emscripten.org/).

The Emscripten tool is able to take just about any C/C++ source code and compile it into a Wasm module, plus the necessary JavaScript "glue" code for loading and running the module, and an HTML document to display the results of the code.

### Writing WebAssembly directly
WebAssembly binary format has a text representation — the two have a 1:1 correspondence. You can write or generate this format by hand and then convert it into the binary format with any of several WebAssembly text-to-binary tools.

1:1 correspondence:
- Every WebAssembly binary instruction has exactly one corresponding text representation, and vice versa.
- A simple real-world analogy

    ```
    Student ID → Student
       101     → Rahul
       102     → Priya
       103     → Amit
    ```
    Each ID corresponds to exactly one student, and each student has exactly one ID.

    That's a 1:1 correspondence.
- In WebAssembly:\
Binary format ↔ Text format

    ```
    Binary format        Text format
         ↓                    ↓
      [binary]    ↔       i32.add
      [binary]    ↔       i32.const 5
      [binary]    ↔       i32.const 10
    ```

### Writing Rust Targeting WebAssembly
It is also possible to write Rust code and compile over to WebAssembly, thanks to the tireless work of the Rust WebAssembly Working Group. You can get started with installing the necessary toolchain, compiling a sample Rust program to a WebAssembly npm package, and using that in a sample web app.

### Using AssemblyScript
For web developers who want to try WebAssembly without needing to learn the details of C or Rust, staying in the comfort of a familiar language like TypeScript, AssemblyScript will be the best option. AssemblyScript compiles a strict variant of TypeScript to WebAssembly, allowing web developers to keep using TypeScript-compatible tooling they are familiar with — such as Prettier, ESLint, VS Code IntelliSense, etc. You can check its documentation on https://www.assemblyscript.org/.

[Go To Top](#concept)

---
# Hello world in WebAssembly

1. Install [Emscripten](https://emscripten.org/docs/getting_started/downloads.html) (to compile `.c` into `.wasm`)
```bash
git clone https://github.com/emscripten-core/emsdk.git
```
```bash
cd emsdk
```
```bash
# Download and install the latest SDK tools.
./emsdk install latest

# Set up the compiler configuration to point to the "latest" SDK.
./emsdk activate latest

# Activate PATH and other environment variables in the current terminal
source ./emsdk_env.sh
```

2. Write your C code
```c
#include <stdio.h>

int main() {
    printf("Hello from WebAssembly!\n");
    return 0;
}
```
3. Compile it to WebAssembly
```bash
emcc hello.c -o hello.html
```
This generates files such as:
```
hello.html
hello.js
hello.wasm
```
4. create the `index.html` file add connect with `hello.js`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="./hello.js"></script>
</body>
</html>
```

that it now if you open this html file with live server and check consol you see message
```
Hello from WebAssembly!
```

> you might get some path issue if you open the html file directly on browser therefore it is recommended to use  server (like live server) to open this html file 


[Go To Top](#concept)

---
# Export Function In WebAssembly
1. Write your `C` code to add two value
    ```c
    int add(int a, int b) {
        return a + b;
    }
    ```
    > we want to call this function using js
2. Compile it with Emscripten

    ```bash
    emcc Test/add.c -o Test/add.wasm \
      -s STANDALONE_WASM=1 \
      -s EXPORTED_FUNCTIONS='["_add"]' \
      --no-entry
    ```
    You should now have:
    ```
    add.c
    add.wasm
    ```

### For web browser
1. Create `main.js`

    ```js
    (async function () {
        const response = await fetch("./add.wasm");
        const bytes = await response.arrayBuffer();

        const { instance } = await WebAssembly.instantiate(bytes);

        const result = instance.exports.add(10, 20);

        console.log(result);    // 30
    })();
    ```
    
2. create `index.html`
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="./main.js"></script>
    </body>
    </html>
    ``` 
    > check console you'll see 30
### For node compiler
1. Create `main.js`
    ```js
    import { readFile } from "node:fs/promises";
    import { fileURLToPath } from "node:url";

    const wasmPath = fileURLToPath(
        new URL("./add.wasm", import.meta.url)
    );

    const bytes = await readFile(wasmPath);

    const { instance } = await WebAssembly.instantiate(bytes);

    console.log(instance.exports.add(10, 20));
    ```
2. run this `main.js`

    ```bash
    node main.js
    ```
    > output = 30

[Go To Top](#concept)

---

# Acknowledgment

1. MDN Web Docs:- https://developer.mozilla.org/en-US/docs/WebAssembly
2. Emscripten compiler:- https://emscripten.org/
3. esmsdk github:- https://github.com/emscripten-core/emsdk.git

[Go To Top](#concept)