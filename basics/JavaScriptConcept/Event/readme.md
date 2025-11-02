# Content
1. [Introduction](#introduction)
2. [Memory Management](#memory-management)
3. [Event Flow & Propagation](#event-flow--propagation)
4. [ Event Bubbling and Event Capturing](#event-bubbling-and-event-capturing)
5. [Event Delegation](#event-delegation)
6. [Custom Events](#custom-events)
7. [Once, Passive, and Signal options](#once-passive-and-signal-options)

---
# Introduction
An event is any action or occurrence that happens in the browser, which the browser can detect and respond to.

In simple words:\
An event is something that happens on a webpage — like a click, a keypress, a scroll, or a form submission — and JavaScript lets you react to it.

### Examples of Events
| Event Type | When it Happens                |
| ---------- | ------------------------------ |
| `click`    | User clicks a button or link   |
| `keydown`  | User presses a key on keyboard |
| `submit`   | User submits a form            |
| `scroll`   | User scrolls a page            |
| `load`     | Page or image finishes loading |
| `change`   | Value in input/select changes  |

### Event Handler
An event handler (also called an event listener) is simply a function that runs in response to an event.

In short:\
An event handler is the code that tells the browser what to do when an event happens.

#### Example
```html
<button id="btn">Click Me</button>

<script>
  function showMessage() {
    alert("Button clicked!");
  }

  // attach event handler
  document.getElementById("btn").addEventListener("click", showMessage);
</script>
```
Here:
- The event → `"click"`
- The target → `<button>`
- The event handler → the function `showMessage`

### Different Ways to Add Event Handlers
1. **Inline HTML (not recommended)**
```html
<button onclick="alert('Clicked!')">Click Me</button>
```
2. **Property-based Handler**
```js
const btn = document.querySelector("#btn");
btn.onclick = () => console.log("Clicked!");
```

3. **Using addEventListener() ✅ (Best Practice)**
```js
btn.addEventListener("click", () => console.log("Clicked!"));
```
### Why addEventListener() is Preferred Over Other Methods

#### 1. You Can Add Multiple Handlers for the Same Event
Problem with `.onclick`: It can only hold one handler — assigning another one overwrites the previous.
```js
const btn = document.querySelector("#btn");

btn.onclick = () => console.log("Handler 1");
btn.onclick = () => console.log("Handler 2"); // ❌ overwrites Handler 1
// Only "Handler 2" runs
```
Solution with `addEventListener`:
```js
btn.addEventListener("click", () => console.log("Handler 1"));
btn.addEventListener("click", () => console.log("Handler 2"));
// ✅ Both handlers run
```
#### 2. Supports Advanced Options
Modern browsers support a third argument (or options object):
```js
btn.addEventListener("click", handler, { once: true, passive: true });
```
| Option    | Meaning                                 |
| --------- | --------------------------------------- |
| `once`    | Runs only once, then auto removes       |
| `passive` | Improves scroll/touch performance       |
| `signal`  | Allows AbortController to stop listener |

`.onclick` cannot do this

#### 3. Can Be Removed Easily
You can remove a listener if you need to clean up memory or temporarily disable an event.
```js
function greet() {
  console.log("Hi Yadnesh!");
}
btn.addEventListener("click", greet);
btn.removeEventListener("click", greet); // ✅ Removed cleanly
```
`.onclick` = null also removes a handler,\
but only if it was assigned to that exact property — not as reusable or modular.


[Go To Top](#content)

---
# Memory Management

### internal event list (or event map/table)
The internal event list (also called the event listener list or event map)
is a hidden data structure that the browser keeps inside every DOM element
to remember which event handlers are attached to that element.

Internally, each DOM element in the browser (which is implemented in C++)
has a data member that stores its event listeners.

It’s not accessible directly in JavaScript — it’s part of the browser’s internal implementation (in C++).


#### How It Works — Conceptually
When you do this:
```js
const btn = document.querySelector("#btn");

function greet() {
  console.log("Hello");
}

btn.addEventListener("click", greet);
```
The browser updates the button’s internal structure like this:
```pgsql
<button id="btn">Click</button>

Internal Event List (not visible to JS):
{
  "click": [ reference to greet() ]
}
```
If you add more handlers:
```js
btn.addEventListener("click", sayBye);
```
Then it becomes:
```
{
  "click": [ greet, sayBye ]
}
```
### What really happens when you attach an event?
When you write:
```js
button.addEventListener('click', handleClick);
```
The browser internally does 3 things:

1. Creates an entry in the button’s internal event listener list (a hidden data structure).
2. Stores a reference to your callback function (handleClick).
3. When a “click” happens, the browser looks into that list and executes the callbacks for that event type.

#### When the Event Fires
When you click the button:
1. Browser detects the event in the rendering engine (C++ level).
2. It looks up that button’s internal event table.
3. Finds the "click" entry.
4. Calls every stored JS function in that array one by one — from the JS heap (where your functions live).

So the function object isn’t copied — just a reference is stored.

[Go To Top](#content)

---
# Event Flow & Propagation
Event Flow & Propagation is one of the most important yet often misunderstood concepts in how browser events work.

### Event Flow
the path or order in which an event travels through the DOM
— from the top (window/document) down to the actual element, and back up again.

It means:
- When you click on something in a webpage, your click doesn’t just “hit” that element directly.
- The browser sends that click through all the elements that surround it, from the outermost (window/document)
    - down to the actual element you clicked,
    - and then back up again to the top.
- That whole journey is called the Event Flow.

**Simple Example**

Imagine this HTML:
```html
<body>
  <div>
    <button>Click me</button>
  </div>
</body>
```
Now, when you click the button the event goes like this:
```md
1. Start from <body>   👈 (outermost parent)
2. Go into <div>
3. Reach <button>      👈 (you clicked this)
4. Then go back up → <div>
5. Then back up → <body>
```
So the event flows down → hits the target → flows up again


> Event Flow describes the path an event takes, not how it behaves internally.
### Event Propagation

Event propagation is the process that defines how an event travels through the DOM —
from the outermost element (like window or document) down to the target element,
and then back up again.

#### Phases of Event Propagation
When you click or trigger an event on an element, the browser sends that event through three phases of flow:
```md
1️⃣ Capturing Phase  →  top → down
2️⃣ Target Phase     →  actual element
3️⃣ Bubbling Phase   →  bottom → up
```

 1. **Capturing Phase (Trickle Down)**\
The event starts at the top (`window → document → html → body …`) and travels downward through parent elements until it reaches the element you actually interacted with.

 2. **Target Phase**\
When the event reaches the exact element that triggered it (the one you clicked),
that’s the target phase.

3. **Bubbling Phase (Bubble Up)**\
After the target is reached,
the event bubbles back up the DOM tree to the root again.\
By default, normal event listeners (`addEventListener('click', handler)`)
are attached in the bubbling phase.

### Difference between Event Flow and Event Propagation
Event Flow and Event Propagation describe the same overall concept,
but are used a bit differently in context.

| Term                  | Meaning                                                                                                                 | Usage Context                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Event Flow**        | Describes the **order or path** an event takes through the DOM (from top → target → bottom → back up).                  | Conceptual — used when explaining *how* the event moves.                  |
| **Event Propagation** | Describes the **mechanism/process** by which an event travels through different phases (capturing → target → bubbling). | Technical — used when explaining *how browsers handle* events internally. |

In Simple Words:

- Event flow → focuses on the direction of travel (down → up).
- Event propagation → focuses on the phases and mechanics of that travel.

> In short: Flow = route, Propagation = process.

[Go To Top](#content)

---


# Event Bubbling and Event Capturing
When an event occurs on a child element, the same event continues to propagate upward, triggering parent event handlers of the same type if they exist.

**Example:**
```html
<div class="parent1" >
    <div class="parent2" >
        <button class="childbut">click me!</button>
    </div>
</div>

<script >
    const p1 = document.querySelector('.parent1');
    const p2 = document.querySelector('.parent2');
    const btn = document.querySelector('.childbut');

    p1.addEventListener('click', () => console.log('parent1'));
    p2.addEventListener('click', () => console.log('parent2'));
    btn.addEventListener('click', () => console.log('child'));
</script>
```

in our code HTML structure looks like:
```
parent1
 └── parent2
      └── child button
```

#### When you click the button
1. You click the child button → browser creates one click event object.
2. That event first triggers the button’s own event handler:
```
→ logs: "child"
```
3. Then the same event bubbles up the DOM:
    - It moves to `<div class="parent2">` → triggers its handler
    ```
    → logs: "parent2"
    ```
    - Then moves further up to `<div class="parent1">` → triggers its handler
    ```
    → logs: "parent1"
    ```
4. Finally, it goes up to document and window (if they had listeners).

Output order in console:
```
child
parent2
parent1
```

> this event get trigger in bubbling phase because by default normal event listeners (`addEventListener('click', handler)`)
are attached in the bubbling phase.

you can manually set them up for Capturing Phase by setting third parameter as true (by default it is set to false)

```html
<div class="parent1">
  <div class="parent2">
    <button class="childbut">Click me!</button>
  </div>
</div>

<script>
  const p1 = document.querySelector('.parent1');
  const p2 = document.querySelector('.parent2');
  const btn = document.querySelector('.childbut');
  
  // Capture phase listeners (notice 'true' at the end)
  p1.addEventListener('click', () => console.log('parent1'), true);
  p2.addEventListener('click', () => console.log('parent2'), true);
  btn.addEventListener('click', () => console.log('child'), true);
</script>
```
Output:
```
parent1
parent2
child
```



[Go To Top](#content)

---
# Event Delegation
Event Delegation is a technique where you attach one event listener to a parent element instead of multiple listeners to individual child elements.

The parent handles events for all its children using [event bubbling](#event-bubbling-and-event-capturing).

### Example
```html
<ul id="list">
  <li>Apple</li>
  <li>Mango</li>
  <li>Banana</li>
</ul>

<script>
  const list = document.getElementById('list');

  list.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
      console.log(`You clicked: ${event.target.textContent}`);
    }
  });
</script>
```
Output (when clicking on an item):
```
You clicked: Mango
```

### Why It’s Useful
- You don’t need to attach separate event listeners to every `<li>`.
- It works even if new `<li>` elements are added dynamically later.
- It saves memory and improves performance.

[Go To Top](#content)

---
# Custom Events
Custom events are user-defined events — events that you create and trigger manually to communicate between parts of your code or components.

They work just like built-in events (click, input, etc.), but you define the event name and data.

### Why Use Custom Events?
Because sometimes you want elements or modules to react to specific actions that aren’t built into the browser.

Example:
- A “cart updated” event when an item is added to a shopping cart.
- A “theme changed” event when a user toggles dark mode.
- A “data loaded” event after fetching data from API.

### Creating and Dispatching a Custom Event
You can create one using the `CustomEvent` constructor.

```html
<button id="btn">Add to Cart</button>
<script>
  const btn = document.getElementById('btn');

  // 1️⃣ Listen for custom event
  document.addEventListener('cartUpdate', (e) => {
    console.log('🛒 Cart updated:', e.detail);
  });

  // 2️⃣ Create & dispatch event when button is clicked
  btn.addEventListener('click', () => {
    const event = new CustomEvent('cartUpdate', {
      detail: { item: 'Laptop', quantity: 1 } // you can send data
    });
    document.dispatchEvent(event);
  });
</script>
```
Output (in console):
```
🛒 Cart updated: { item: "Laptop", quantity: 1 }
```
### How it work
1. **Set Up a Listener for Custom Event**
```js
document.addEventListener('cartUpdate', (e) => {
  console.log('🛒 Cart updated:', e.detail);
});
```
- You’re telling the `document` to listen for an event called `cartUpdate`.
- Whenever that event is triggered, this callback runs.
- The `e.detail` property contains extra information (data) that you send with the event.

2. **When Button Is Clicked — Create Custom Event**
```js
btn.addEventListener('click', () => {
  const event = new CustomEvent('cartUpdate', {
    detail: { item: 'Laptop', quantity: 1 }
  });
  document.dispatchEvent(event);
});
```
- When the button is clicked:
    - A new CustomEvent object is created with the name `'cartUpdate'`.
    - Inside `detail`, you add any custom data (in this case, `{ item: 'Laptop', quantity: 1 }`).
- Then you dispatch (trigger) that event on the document:
    ```js
    document.dispatchEvent(event);
    ```

### Example with DOM Elements
You can dispatch custom events from any DOM element — not just `document`.
```html
<div id="card"></div>
<script>
  const card = document.getElementById('card');

  // Listener
  card.addEventListener('expand', () => {
    console.log('Card expanded!');
  });

  // Trigger event manually
  card.dispatchEvent(new Event('expand'));
</script>
```
### Summary
| Step                               | Description                 |
| ---------------------------------- | --------------------------- |
| `new CustomEvent(name, options)`   | Create a custom event       |
| `.dispatchEvent(event)`            | Trigger it manually         |
| `.addEventListener(name, handler)` | Listen for it               |
| `event.detail`                     | Extra data you passed along |


> Custom Events = Best for modular, independent, and reusable code.
>
>Not needed for small scripts or tightly connected logic.

[Go To Top](#content)

---
# Once, Passive, and Signal options
Besides `true` or `false` for capture/bubble phase,
you can pass an object with extra options:

```js
element.addEventListener("click", handler, {
  once: true,
  passive: true,
  signal: controller.signal
});
```

### `once: true`
**Meaning:**\
The event listener will run only once, then automatically remove itself.

**Example:**
```js
button.addEventListener('click', () => {
  console.log('Button clicked!');
}, { once: true });
```
After the first click, the listener is gone automatically.

**Use when**:\
You only need a handler once (like showing a message or starting an animation).

### `passive: true`
**Meaning:**\
Tells the browser this event listener will never call `preventDefault()`. So, the browser can optimize performance, especially for scroll or touch events

**Example:**
```js
window.addEventListener('scroll', (e) => {
  console.log('Scrolling...');
}, { passive: true });
```
- The browser can scroll smoothly
- If you try e.preventDefault() inside, it will be ignored.

**Use when:**
- You just want to read scroll/touch events
- You don’t need to block browser’s default behavior (like scrolling).

### `signal: controller.signal`
**Meaning:**\
This lets you abort (cancel) an event listener programmatically using the AbortController API.

**Example:**
```js
const controller = new AbortController();

window.addEventListener('click', () => {
  console.log('Click detected!');
}, { signal: controller.signal });

// Later...
controller.abort(); // ❌ removes the listener
```
After `controller.abort()`, the listener is removed automatically.

**Use when:**\
You want to remove listeners dynamically or clean up automatically (for example, when a component unmounts or a request is canceled).


### Summary Table
| Option    | Purpose                                              | Example                         | When to Use                       |
| --------- | ---------------------------------------------------- | ------------------------------- | --------------------------------- |
| `once`    | Runs only one time                                   | `{ once: true }`                | For one-time setup actions        |
| `passive` | Improves performance by not blocking browser default | `{ passive: true }`             | For scroll, touch, wheel events   |
| `signal`  | Allows programmatic removal with `AbortController`   | `{ signal: controller.signal }` | For cleanup or dynamic unmounting |

### In short:

`once` → auto-remove after first run\
`passive` → faster scroll/touch (no preventDefault)\
`signal` → controlled removal via AbortController

[Go To Top](#content)

---



