# Content
1. [Introduction](#introduction)
2. [Memory Management](#memory-management)
2. [Event Flow & Propagation](#event-flow--propagation)
3. Event Delegation

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
“Event Flow & Propagation” is one of the most important and most misunderstood parts of how browser events actually work.

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

### Phases in Event Flow
When you click or trigger an event on an element, the browser sends that event through three phases of flow:
```md
1️⃣ Capturing Phase  →  top → down
2️⃣ Target Phase     →  actual element
3️⃣ Bubbling Phase   →  bottom → up
```

#### 1. Capturing Phase (Trickle Down)
The event starts at the top (`window → document → html → body …`) and travels downward through parent elements until it reaches the element you actually interacted with.

#### 2. Target Phase
When the event reaches the exact element that triggered it (the one you clicked),
that’s the target phase.

#### 3. Bubbling Phase (Bubble Up)
After the target is reached,
the event bubbles back up the DOM tree to the root again.

By default, normal event listeners (`addEventListener('click', handler)`)
are attached in the bubbling phase.

### Parent Event Triggering During Event Flow
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

you can manually set them up for Capturing Phase

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