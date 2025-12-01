# What is child_process in Node.js
`child_process` lets your Node.js program run another program (another JS file, Python script, system command, etc.).

Your main JS file becomes the parent, and the program you run becomes the child process.

You use it when:
- You want to run shell commands (like `ls`, `dir`, `python script.py`)
- You want to run heavy tasks in another process
- You want your app to stay fast while some work happens in the background

3 Main Functions

1. exec()\
Runs a shell command and returns output as string.

2. spawn()\
Runs a command continuously, best for long-running tasks.

3. fork()\
Runs another Node.js file and communicates using messages.



# exec()
```js
import {exec} from 'child_process'

exec('node --version', (error, stdout, stderr) => {
    console.log(stdout)
})
```
output will be your node version
> stdout means standard output it will display the output of your executing command

```js
// parent.js
import {exec} from 'child_process'

exec('node child.js', (error, stdout, stderr) => {
    console.log(stdout)
})
```
```js
// child.js
console.log("child process")
```

output of parent.js: `child process`

therefor from this example we can see that parent and child doesn't directly communicate they use terminal for communication
```
parent.js -> terminal (node child.js) -> child.js executing

child.js -> console.log("child process") -> terminal output = "child process" -> parent.js -> console.log(stdout) -> print "child process"
```

### we can also execute the other language code with it
```js
// parent.js
import {exec} from 'child_process'

exec('python child.py', (error, stdout, stderr) => {
    console.log(stdout)
})
```
```py
# child.py
print("child process")
```
output of parent.js: `child process`

> it run the child process into a complete separate environment and uses terminal to communicate
### error:
```js
import {exec} from 'child_process'

exec('node -version', (error, stdout, stderr) => { // wrong shell command
    if(error){
        console.log(error)  // this will get trigger
        return
    }
    console.log(stdout)
})
```
output will be error saying `node: bad option: -version`

> the error object hold the error if you shell command crash with an non-zero exit code

### stderr
the stderr object hold the error even if you command executed with zero exit code

```js
// parent.js
import {exec} from 'child_process'

exec('node child.js', (error, stdout, stderr) => {
    if(error){
        console.log(error)
        return
    }
    if(stderr){
        console.log("stderr:", stderr)
        return
    }
    console.log(stdout)
})
```
```js
// child.js
try {
    throw new Error("this is error from child process")
} catch (error) {
    console.error("error in child process:", error.message)
}
```
output of parent is: `stderr: error in child process: this is error from child process`


# spawn()
```js
import {spawn} from 'child_process'

const process = spawn("echo", ['hello', 'world', 'how','are', 'you', "?"])

// echo will run for each value in array
process.stdout.on('data', (data) => {
    console.log(data.toString())
})
```
`data` is a Buffer object that contains whatever bytes the child process wrote to its stdout at that moment.

The first input is the name of the event you want the stream to emit callbacks for — in this case, the `"data"` event of a Readable stream (`process.stdout`).

output: `hello world how are you ?`

### Example 2
```js
const pythonProcess = spawn('python', ['child.py'])

pythonProcess.stdout.on('data', (data)=>{
    console.log("data",data.toString())
})
```
```py
# child.py
print("child process")
```
output of parent.js: `child process`

### How to provide input for python using JS 
```js
const pythonProcess = spawn('python', ['child.py'])

pythonProcess.stdout.on('data', (data)=>{
    console.log("parent says",data.toString())
    pythonProcess.stdin.write("from parent process\n")
})
```
-   `stdin.write()` is used to write inside the terminal where the python script is running
- in terminal where python is running we write `"from parent process"`
- `\n` is used to to submit the the input value (`\n` -> enter)

```py
# child.py
a = input("enter something: ")
print("you entered:", a)
```
output of parent.js:
```
parent says enter something: 
parent says you entered: from parent process
```
### What happen?
1. js scripts create child process that execute python script
2. python script execute line
```py
a = input("enter something: ")
```
3. this line prints `enter something: ` on terminal which get capture by js at line:
```js
console.log("parent says",data.toString())
```
4. meanwhile our python script is still waiting for his input which is provided by js:
```js
pythonProcess.stdin.write("from parent process\n")
```
5. now python get his input it well execute his further script and stop its execution as it get complete:
```py
print("you entered:", a)
```
6. this pints `you entered: from parent process` onto the terminal wich again get capture by js:
```js
console.log("parent says",data.toString())
```
7. we again hit 
```js
pythonProcess.stdin.write("from parent process\n")
```
but as no child process is now running this will not affect any thing


# fork()
it is same as spawn but work only for node.js scripts

here ve communicate through `'message'` event

### Parent.js
```js
//parent.js
const child = fork('child.js')

child.on('message', (msg)=>{
    console.log('from parent',msg)
})

child.send({task:"start"})
```
here:
```js
child.on('message', ()=>{})
```
- we are listing for the event `'message'` from child
- inside the callback we get whatever data is been send by the child script
```js
child.send({task:"start"})
```
- this line will trigger the `'message'` event in child 
- we also sending the data `{task:"start"}` to child 
### Child.js
```js
//child.js
process.on("message", (msg)=>{
    console.log("fom child",msg)
    process.send("task complete")
})
```
here:
- we are also listing for the `'message'` event from parent, which get trigger once parent script execute `process.send()`
- we print `fom child { task: 'start' }` as `msg = {task:"start"}` send by parent
```js
// parent.js
child.send({task:"start"})
```
- child is also sending some data to parent
```js
// child.js
process.send("task complete")
```
- this line will trigger `'message'` event in parent class which is capture by 
```js
child.on('message', (msg)=>{
    console.log('from parent',msg)
})
```
- this will print `from parent task complete`