import express from "express" 
import path from "path"

const app = express()
const port = 3000


//this is the basic way of doing server ding rendering 
app.get('/test',(req,res) => {     
    return res.send("<h1>basic server side rendering</h1>")
})

//another method of server side rendering by using view 
app.set("view engine","ejs")    //need to tell express app which view engine we are using
app.set('views',path.resolve("./view"))     //giving the location of view files to ejs

app.get('/test/ejs',(req,res) => {
    return res.render('withoutObj')   //need to give the name of file
})

app.get('/redirect', (req, res) => {    //activate on /redirect url
    // Redirect to another route
    res.redirect('/test/ejs');      //this will redirect our url to /test/ejs which open withObj.ejs page
  });

app.get('/test/ejs/:name',(req,res) => {
    const myName = req.params.name
    return res.render('withObj',{user:myName})   //you can also pass an object ( home.ejs will have access to this object )
})

app.listen(port, ()=>{     
    console.log(`http://localhost:${port}`)
})