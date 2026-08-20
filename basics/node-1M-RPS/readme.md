# Content

1. [Resource Monitoring](#resource-monitoring)
2. [Thread](#thread)


---

# Resource Monitoring

Resource monitoring means continuously tracking how much of your server/application resources are being used, so you can detect problems, maintain performance, and scale when needed.

Common backend resources include:

- **CPU** — How much processing power your application is using.
- **Memory/RAM** — How much memory the application consumes.
- **Disk** — Storage usage and disk I/O.
- **Network** — Incoming/outgoing traffic, bandwidth, latency.
- **Database** — CPU, memory, connections, query performance, locks, etc.
- **Application resources** — Thread pools, connection pools, queues, cache usage, etc.

### CPU Core

A CPU core is basically an individual processing unit inside a CPU.

Think of a CPU as a worker:

- 1 CPU core → 1 worker
- 4 CPU cores → 4 workers
- 8 CPU cores → 8 workers

Each core can execute instructions and perform calculations.

The operating system tries to distribute work across the available cores.

#### Example

Imagine your backend server has:

```
CPU
├── Core 1
├── Core 2
├── Core 3
└── Core 4
```

That's a 4-core CPU.

If your backend has multiple tasks:

```
Core 1 → API requests
Core 2 → Database-related processing
Core 3 → Background jobs
Core 4 → Other application work
```

More cores generally allow a server to handle more work simultaneously, especially when the application can run tasks in parallel.

### Core Utilization

Core utilization means how much each CPU core is being used by your application/system.

> Core utilization tells us how much of the total time the CPU core was busy working.

#### Mathematically

$$\text{Core Utilization} = \frac{\text{Total Time}- \text{Total Ideal Time}}{\text{Total Time}}  \times 100$$

here:
- Total Time → The entire time period being measured.
- Idle Time → The time when the core was doing nothing.

#### Simple example

If a core is monitored for 10 seconds and stays idle for 2 seconds:

$$Utilization = \frac{10 - 2}{10} \times 100 = 80$$

Core utilization = 80%

### CPU Utilization

Each CPU has multiple cores, therefore to calculate the CPU utilization we just have calculate the sum of all core utilization

$$\text{CPU Utilization} = \frac{\text{Core-1 Utilization} + \text{Core-2 Utilization} + ... + \text{Core-n Utilization}}{\text{Total Number of Cores}}$$

> in some system you might see the CPU utilization above 100% that just a sum of core utilization without dividing number of cores

[Go To Top](#content)

---

# Thread

A thread is a stream of work/instructions that needs to be executed.

A program can have many threads, and the operating system schedules those threads onto CPU cores.

> Cores provide physical processing capacity. Threads provide work that can be scheduled onto that capacity.

### Example

Imagine you have a 4-core CPU:
```
CPU
├── Core 1 ← Thread A
├── Core 2 ← Thread B
├── Core 3 ← Thread C
└── Core 4 ← Thread D
```

Four threads can potentially execute at the same time, one on each core.

### What if you have 8 threads but only 4 cores?

Some CPUs support simultaneous multithreading (SMT), commonly called Hyper-Threading on Intel CPUs.
```
8 threads

T1 ──┐
T2 ──┤
T3 ──┤
T4 ──┼──→ 4 CPU cores
T5 ──┤
T6 ──┤
T7 ──┤
T8 ──┘
```
You only have 4 physical cores, so you can't have all 8 CPU-heavy threads physically executing simultaneously on just those 4 cores.

The operating system schedules them:
```
Time 1:

Core 1 → T1
Core 2 → T2
Core 3 → T3
Core 4 → T4


Time 2:

Core 1 → T5
Core 2 → T6
Core 3 → T7
Core 4 → T8
```
The switching happens extremely quickly.

### Why two thread per core even though each core handel one thread at time

The threads don't always keep a CPU core busy.

Imagine you have 4 workers (cores):
```
Core 1 → Thread 1
Core 2 → Thread 2
Core 3 → Thread 3
Core 4 → Thread 4
```
But suppose Thread 1 needs to download something from the internet.

While it's waiting:
```
Core 1 → 😴 waiting for network
Core 2 → Thread 2
Core 3 → Thread 3
Core 4 → Thread 4
```
Core 1 is being underused.

Now, if you have more threads:
```
Core 1 → Thread 1 (waiting)
       → Thread 5 (can do other work)

Core 2 → Thread 2
       → Thread 6

Core 3 → Thread 3
       → Thread 7

Core 4 → Thread 4
       → Thread 8
```
The CPU has more work available to schedule when one thread is waiting.

### Simple analogy

Think of a kitchen:

- 🍳 Core = cook
- 📝 Thread = recipe/task

Four cooks can work simultaneously, while the remaining recipes wait or get worked on as cooks become available.

### Single Threading
Single threading means a program has one thread of execution doing the work.

Think of it like one worker doing all the tasks:
```
Program
   │
   └── Thread 1
        ├── Task A
        ├── Task B
        ├── Task C
        └── Task D
```

The tasks are generally executed one after another:
```
Task A → Task B → Task C → Task D
```
#### Example 1
```js
function task1():
    console.log("Task 1")

function task2():
    console.log("Task 2")

task1()
task2()
```
Here, the program uses the same execution thread:
```
Thread 1
   ↓
task1()
   ↓
task2()
```
#### Example 2
```js
while(true){}   // this will consume the thread

console.log("hello world")  // since thread is consume this will not execute
```

### Multi Threading

Multi-threading means a single program has multiple threads of execution that can work concurrently.

Think of it like having multiple workers working on different tasks.
```
Program
   │
   ├── Thread 1 → Task A
   ├── Thread 2 → Task B
   ├── Thread 3 → Task C
   └── Thread 4 → Task D
```

#### Example
```js
import { Worker, isMainThread } from "worker_threads";
import { fileURLToPath } from "url";

const numberOfThread = 12   // number of thread available on machine

if (isMainThread) {
    // Spawn 12 system level threads
    for (let i = 0; i < numberOfThread; i++) {
        new Worker(fileURLToPath(import.meta.url));
    }
} else {
    // Run this in each of the threads
    while (true) {}
}
```
> Check the task manager for CPU utilization, you can see the 0 ideal time on CPU


[Go To Top](#content)

---