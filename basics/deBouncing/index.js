import express, { query, response } from "express"
import path from "path"
import fs from "fs"
// import data from "./data.json" assert { type: 'json' };

const app = express()
const port = 3000

// import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));



app.set("view engine","ejs")    //need to tell express app which view engine we are using
app.set('views',path.resolve("./view"))     //giving the location of view files to ejs
app.use(express.urlencoded({extended:false})) 


app.get('/',(req,res)=>{
    console.log("hello server")
    return res.json(data)
})

app.get('/getData',(req,res)=>{
    console.log(req.query.search)
    const sendData = []
    data.forEach(val => {
        if (val.name.toLowerCase().includes(req.query.search.toLowerCase())) {
            sendData.push(val)
        }
    });
    return res.json({sendData})
})

// will render the static file present inside the view folder i.e, index.html 
app.use(express.static('./view'))


app.listen(port, () => {
    console.log(`app is running at port ${port}`)
})