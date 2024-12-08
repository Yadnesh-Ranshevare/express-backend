import express from "express"       //to use this syntax you first need to add "type": "module" in package.json
const app = express()
const port = 3000
app.get('/',(req,res)=>{        //accept request at '/' 
    res.send('hello express')   //will send following response on respective path
})
app.get('/login',(req,res)=>{       //accept request at '/login'
    res.send('please log in')       //will send following response on respective path
})
app.listen(port, ()=>{     // app is listening at respective port
    console.log(`https://localhost:${port}`)
})