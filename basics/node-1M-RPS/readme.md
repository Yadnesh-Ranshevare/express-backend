# Content

1. [Resource Monitoring](#resource-monitoring)
2. [Thread](#thread)
3. [AutoCannon](#autocannon)
4. [PM2](#pm2)

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
npx autocannon -m GET -c 20 -d 20 -p 2 -w 1 "http://localhost:3000/simple"
```
here:
- `-m` = HTTP method
- `-c` = number of connection
- `-d` = duration (-d = 20 -> Run the benchmark for 20 seconds.).
- `-p` = number of request per connection (-c = 20 & -p = 2 -> 20*2 = 40 concurrent request at a time)
- `-w` = number of worker (processes/Thread generating the load)

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


### Sending data via AutoCannon

consider you request a PATCH api as follow:
```
"http://localhost:3000/update-something/123/JohnDoe?value1=test&value2=42"
```
with request body
```json
{
  "foo1": "hello"
}
```
and it return data something like:
```json
{
    "id": "123",
    "name": "jhon",
    "value1": "abc",
    "value2": "xyz",
    "total_foo": "HELLO. WORLD. FOO. BAR. SAMPLE. DUMMY. DATA. TESTING. PRODUCTION. API. ",
    "history": [
        {
            "event_id": 123,
            "timestamp": "2026-08-21T14:24:32.096Z",
            "action": "Action performed by jhon",
            "metadata": "This is a string intended to take up space to simulate a medium-sized production API response object.This is a string intended to take up space to simulate a medium-sized production API response object.",
            "status": "success"
        },
        {
            "event_id": 124,
            "timestamp": "2026-08-21T14:24:32.098Z",
            "action": "Action performed by jhon",
            "metadata": "This is a string intended to take up space to simulate a medium-sized production API response object.This is a string intended to take up space to simulate a medium-sized production API response object.",
            "status": "pending"
        }
        .
        .
        .
    ]
}
```

now with AutoCannon:

```
npx autocannon -m PATCH -c 10  -d 30 -p 2 -w 1 -H "Content-Type: application/json" -b '{"foo1":"hello"}'  "http://localhost:3000/update-something/123/JohnDoe?value1=test&value2=42"
```

here AutoCannon provide two specific flags:
- `-H` = use to set HTTP headers
- `-b` = use to set request body

To set multiple headers just use `-H` multiple times

example
```
npx autocannon -m PATCH -c 50 -d 30 -p 2 -w 1 -H "Content-Type: application/json" -H "Authorization: Bearer my-test-token" -H "X-API-Key: test-api-key" -H "X-Custom-Header: hello" -b '{"foo1":"hello"}' "http://localhost:3000/update-something/123/JohnDoe?value1=test&value2=42"
```
Output:
```
┌─────────┬──────┬──────┬───────┬───────┬─────────┬─────────┬─────────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev   │ Max     │
├─────────┼──────┼──────┼───────┼───────┼─────────┼─────────┼─────────┤
│ Latency │ 1 ms │ 5 ms │ 11 ms │ 12 ms │ 6.56 ms │ 55.4 ms │ 5020 ms │
└─────────┴──────┴──────┴───────┴───────┴─────────┴─────────┴─────────┘
┌───────────┬────────┬────────┬────────┬─────────┬─────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%   │ Avg     │ Stdev  │ Min    │
├───────────┼────────┼────────┼────────┼─────────┼─────────┼────────┼────────┤
│ Req/Sec   │ 476    │ 476    │ 738    │ 782     │ 708.14  │ 77.58  │ 476    │
├───────────┼────────┼────────┼────────┼─────────┼─────────┼────────┼────────┤
│ Bytes/Sec │ 905 kB │ 905 kB │ 1.4 MB │ 1.49 MB │ 1.35 MB │ 147 kB │ 904 kB │
└───────────┴────────┴────────┴────────┴─────────┴─────────┴────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 30

0 2xx responses, 21244 non 2xx responses
21k requests in 30.08s, 40.4 MB read
24 errors (0 timeouts)
```

[Go To Top](#content)

---
# PM2
PM2 is a process manager for Node.js applications. It helps you run your JavaScript/Node.js app continuously, especially on a server.

What PM2 does
- Keeps your app running — if it crashes, PM2 can restart it.
- Runs apps in the background — you don't need to keep a terminal open.
- Automatically restarts after server reboot.
- Manages multiple Node.js apps.
- Provides logs for debugging.
- Can use multiple CPU cores with cluster mode.
- Lets you easily start, stop, restart, and monitor applications.

You can install it globally with:

```bash
npm install -g pm2
```
now with PM2:
```
pm2 start src/index.js
```
output:
```
┌────┬──────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name     │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼──────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ index    │ fork     │ 0    │ online    │ 0%       │ 45.0mb   │
└────┴──────────┴──────────┴──────┴───────────┴──────────┴──────────┘
host metrics | cpu: 8.1% | ram usage: 75.5% |
```
to stop:
```bash
pm2 stop 0 # using id
pm2 stop index  # using name
pm2 delete index    # to remove server from pm2
```

now to utilize all CPU core we want to spawn multiple instance in our server that can run on all available cores

and to do that
```bach
npx pm2 start src/index.js -i max 
```
- `-i max` tells PM2 to create one instance per available CPU core.

output:
```
┌────┬──────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name     │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼──────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ index    │ cluster  │ 0    │ online    │ 0%       │ 53.9mb   │
│ 1  │ index    │ cluster  │ 0    │ online    │ 0%       │ 53.5mb   │
│ 2  │ index    │ cluster  │ 0    │ online    │ 0%       │ 53.8mb   │
│ 3  │ index    │ cluster  │ 0    │ online    │ 0%       │ 53.7mb   │
│ 4  │ index    │ cluster  │ 0    │ online    │ 0%       │ 53.7mb   │
│ 5  │ index    │ cluster  │ 0    │ online    │ 0%       │ 53.8mb   │
│ 6  │ index    │ cluster  │ 0    │ online    │ 0%       │ 53.7mb   │
│ 7  │ index    │ cluster  │ 0    │ online    │ 0%       │ 54.2mb   │
│ 8  │ index    │ cluster  │ 0    │ online    │ 0%       │ 53.8mb   │
│ 9  │ index    │ cluster  │ 0    │ online    │ 0%       │ 54.2mb   │
│ 10 │ index    │ cluster  │ 0    │ online    │ 0%       │ 53.9mb   │
│ 11 │ index    │ cluster  │ 0    │ online    │ 0%       │ 54.0mb   │
│ 12 │ index    │ cluster  │ 0    │ online    │ 0%       │ 53.9mb   │
│ 13 │ index    │ cluster  │ 0    │ online    │ 0%       │ 53.7mb   │
│ 14 │ index    │ cluster  │ 0    │ online    │ 0%       │ 54.0mb   │
│ 15 │ index    │ cluster  │ 0    │ online    │ 0%       │ 53.8mb   │
└────┴──────────┴──────────┴──────┴───────────┴──────────┴──────────┘
host metrics | cpu: 11% | ram usage: 77% |
```

mode = cluster : cluster mode means running multiple Node.js processes of the same application so they can share the workload across CPU cores.

To stop all of this cluster
```bash
pm2 delete all
```

now test with AutoCannon whether or not this improve the performance or not

```bash
npx autocannon -m PATCH -c 5 -d 20 -H "content-type: application/json" -b "{\"foo1\":\"hello\"}" "http://localhost:3000/update-something/123/JohnDoe?value1=test&value2=42"
```
output
```
┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼───────┤
│ Latency │ 1 ms │ 2 ms │ 6 ms  │ 9 ms │ 2.37 ms │ 1.81 ms │ 50 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴───────┘
┌───────────┬─────────┬─────────┬───────┬─────────┬──────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%   │ 97.5%   │ Avg      │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼───────┼─────────┼──────────┼─────────┼─────────┤
│ Req/Sec   │ 1,276   │ 1,276   │ 1,771 │ 1,904   │ 1,714.35 │ 178.94  │ 1,276   │
├───────────┼─────────┼─────────┼───────┼─────────┼──────────┼─────────┼─────────┤
│ Bytes/Sec │ 42.6 MB │ 42.6 MB │ 59 MB │ 63.5 MB │ 57.1 MB  │ 5.96 MB │ 42.5 MB │
└───────────┴─────────┴─────────┴───────┴─────────┴──────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 20

34k requests in 20.04s, 1.14 GB read
```
as you can see for same AutoCannon request:
- with single instance we handles approx 710 req/sec
- with multiple instance we handles approx 1715 req/sec

### ecosystem.config.cjs
`ecosystem.config.cjs` is a PM2 configuration file.

Instead of putting all your PM2 options in a long command like:
```bash
npx pm2 start src/index.js -i max
```
you put the configuration in `ecosystem.config.cjs`, and then tell PM2 to use it.

For example;
```js
module.exports = {
  apps: [
    {
      name: "index",
      script: "./src/index.js",
      instances: "max",
      exec_mode: "cluster"
    }
  ]
};
```
Then start it with:
```bash
pm2 start ecosystem.config.cjs
```

[Go To Top](#content)

---