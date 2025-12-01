process.on("message", (msg)=>{
    console.log("fom child",msg)
    process.send("task complete")
})

// try {
//     throw new Error("this is error from child process")
// } catch (error) {
//     console.error("error in child process:", error.message)
// }

//  console.log("child process")