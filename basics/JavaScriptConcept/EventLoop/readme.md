# Content
1. [Introduction](#introduction)
2. [Single-threaded Language](#single-threaded-language)

---
# Introduction
In JavaScript, everything runs in a single thread, which means it can do only one thing at a time. So how does it handle things like timers, HTTP requests, or clicks without freezing the whole app? That’s where the event loop comes in.

### 1. Call Stack
This is where JavaScript keeps track of what function is currently running.

Example:
```js
function sayHi() {
  console.log("Hi");
}
sayHi();
```
`sayHi` goes on the call stack, runs, and then is removed.

### 2. Web APIs / Browser APIs
These handle things like `setTimeout`, `fetch`, or DOM events. They run outside the main call stack.

Example:
```js
setTimeout(() => {
  console.log("Hello after 2 seconds");
}, 2000);
```
- The `setTimeout` is sent to the Web API.
- The main thread is free to do other things while waiting.

### 3. Callback Queue / Task Queue
Once the Web API is done (timer ends or HTTP request completes), the callback is put into the queue, waiting to be executed.

### 4. Event Loop
It keeps checking Is the call stack empty?

- If yes, take the first task from the queue and put it on the stack to run.
- If no, wait until the stack is empty.

So, the event loop makes async things happen without blocking the main thread.

The event loop is the system that lets JS look asynchronous while still being single-threaded by carefully scheduling tasks.

![Event loop Image](./Javascript-event-loop.png)

### Example to see it in action: 
```js
console.log("Start");

setTimeout(() => {
  console.log("Middle");
}, 0);

console.log("End");
```
### Output:
```
Start
End
Middle
```
Even though `setTimeout` is 0ms, it still waits because the event loop only executes it after the stack is empty.



[Go To Top](#content)

---

# Single-threaded Language
When we say JavaScript is a single-threaded language, it means JavaScript can do only one thing at a time in the main thread.

Think of it like this:
- Imagine a chef in a kitchen (the JavaScript engine).
- The chef can only cook one dish at a time (run one function at a time).
- If the chef has to wait for water to boil (like waiting for an API response), they can’t just pause everything—they need a way to do other tasks while waiting. That’s where the event loop and Web APIs come in.

### Key points:
1. **Single-threaded** = one call stack → only one thing runs at a time.
2. **Asynchronous tasks** (like `setTimeout`, `fetch`) don’t block the main thread—they’re handled by the browser/node outside the main thread.
3. The **event loop** ensures these async tasks are eventually executed when the stack is free.

### Quick analogy:
```
JavaScript = 1 chef (single thread)
Call Stack = what chef is cooking right now
Web API = oven, timer, or helper (does work outside the chef)
Callback Queue = dishes waiting to be cooked
Event Loop = tells chef "ok, next dish is ready"
```

### In a multithreaded language (like Java)
- You can create a new thread for each async task.
- Example: for a network request, you can spawn a thread that waits for the response.
- The main thread is free to continue executing other tasks.

So here, each async task can literally run in parallel, unlike JS where only one thing executes at a time in the main thread.

### How we can perform async task in Java
Java is multithreaded, so you can create a new thread to mimic `setTimeout`:
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Start");

        // Create a new thread for async task
        new Thread(() -> {
            try {
                Thread.sleep(1000); // wait 1 second
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Async task done");
        }).start();

        System.out.println("End");
    }
}
```
Here:
1. `System.out.println("Start")` → runs immediately.
2. `new Thread(...).start()` → starts a new thread. This thread sleeps 1 second and then prints `"Async task done"`.
3. `System.out.println("End")` → main thread continues immediately.

**Output:**
```
Start
End
Async task done
```


### Final difference
| Feature            | JavaScript (Single-threaded)                  | Java (Multithreaded)                         |
| ------------------ | --------------------------------------------- | -------------------------------------------- |
| Async HTTP request | Sent to Web API → callback queue → event loop | New thread handles request                   |
| Execution          | Only **one function runs at a time**          | Multiple threads can run **simultaneously**  |
| Complexity         | Simple, no race conditions                    | Harder, can have race conditions / deadlocks |
| Parallelism        | Not true parallelism (but looks async)        | True parallelism possible                    |



[Go To Top](#content)

---