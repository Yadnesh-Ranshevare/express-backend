import {exec, spawn, fork} from 'child_process'


// // run shell commands
// exec('node basics/JavaScriptConcept/child_process/child.js', (error, stdout, stderr) => {
//     if(error){
//         console.log(error)
//         return
//     }
//     if(stderr){
//         console.log("stderr:", stderr)
//         return
//     }
//     console.log(stdout)
// })



// // run shell command continuously
// const process = spawn("echo", ['hello', 'world', 'how','are', 'you', "?"])

// // echo will run for each value in array
// process.stdout.on('data', (data) => {
//     console.log(data.toString())
// })


// un another node process
const child = fork('basics/JavaScriptConcept/child_process/child.js')

child.on('message', (msg)=>{
    console.log('from parent',msg)
})

child.send({task:"start"})


// const pythonProcess = spawn('python', ['basics/JavaScriptConcept/child_process/child.py'])

// pythonProcess.stdout.on('data', (data)=>{
//     console.log("parent says",data.toString())
//     pythonProcess.stdin.write("from parent process\n")
// })

// pythonProcess.stderr.on('data', (data)=>{
//     console.error(data.toString())
// })