# Content

1. [Resource Monitoring](#resource-monitoring)
2. [Thread](#thread)
3. [AutoCannon](#autocannon)

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
# AutoCannon

AutoCannon is an HTTP benchmarking/load-testing tool written in Node.js. You use it to generate lots of HTTP requests against your server and measure how well the server performs.

For example, if your Node.js server is running at:
```
http://localhost:3000
```
you can run:
```
npx autocannon -m GET -c 20 -d 20 -p 2 "http://localhost:3000/simple"
```
here:
- `-m` = HTTP method
- `-c` = number of connection
- `-d` = duration (-d = 20 -> Run the benchmark for 20 seconds.).
- `-p` = number of request per connection (-c = 20 & -p = 2 -> 20*2 = 40 concurrent request at a time)

It will send many requests and report things like:

```
Running 20s test @ http://localhost:3000/simple
20 connections with 2 pipelining factor


┌─────────┬──────┬───────┬───────┬───────┬──────────┬─────────┬────────┐
│ Stat    │ 2.5% │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev   │ Max    │
├─────────┼──────┼───────┼───────┼───────┼──────────┼─────────┼────────┤
│ Latency │ 4 ms │ 17 ms │ 26 ms │ 30 ms │ 16.63 ms │ 5.85 ms │ 161 ms │
└─────────┴──────┴───────┴───────┴───────┴──────────┴─────────┴────────┘
┌───────────┬────────┬────────┬────────┬────────┬─────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg     │ Stdev   │ Min    │
├───────────┼────────┼────────┼────────┼────────┼─────────┼─────────┼────────┤
│ Req/Sec   │ 2,083  │ 2,083  │ 2,233  │ 2,879  │ 2,333.7 │ 232.68  │ 2,082  │
├───────────┼────────┼────────┼────────┼────────┼─────────┼─────────┼────────┤
│ Bytes/Sec │ 523 kB │ 523 kB │ 561 kB │ 723 kB │ 586 kB  │ 58.4 kB │ 523 kB │
└───────────┴────────┴────────┴────────┴────────┴─────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 20

47k requests in 20.04s, 11.7 MB read
```
### Lets understand the output

1. **Test configuration**
    ```
    Running 20s test @ http://localhost:3000/simple
    20 connections with 2 pipelining factor
    ```
    This tells us:

    - 20s → the test ran for about 20 seconds.
    - 20 connections → Autocannon maintained up to 20 concurrent HTTP connections.
    - 2 pipelining factor → each connection can have 2 requests in flight at a time.
2. **Latency**
    - Latency = how long it took the server to respond to a request.
    - 50% → 17 ms:\
    means half of the requests completed in 17 ms or less, and half took longer than 17 ms.
    - 97.5% → 26 ms:\
    means approximately 97.5% of requests completed in 26 ms or less.
    - Max → 161 ms:\
    The slowest request took 161 ms
3. **Req/Sec**
    - in the Req/Sec table, Autocannon first measures your requests-per-second
    - Example:
        ```
        1st sec -> 2083 req
        2nd sec -> 2100 req
        .
        .
        .
        20th sec -> 2879 req
        ```
    - Then the percentiles tell you where you are in that sorted list:
        | Percentile | Your value | Meaning                                           |
        | ---------- | ---------: | ------------------------------------------------- |
        | **1%**     |      2,083 | Very near the lowest throughput                   |
        | **2.5%**   |      2,083 | Near the bottom                                   |
        | **50%**    |      2,233 | **Median** — half the samples were below this     |
        | **97.5%**  |      2,879 | Near the top — almost all samples were below this |
        | **Avg**    |      233.7 | Average number of request per second              |  
4. **Bytes/Sec**
    - You have:
        ```
        Bytes/Sec

        Avg → 586 kB
        ```
    - This means your server was sending approximately 586 kilobytes of response data per second



[Go To Top](#content)

---