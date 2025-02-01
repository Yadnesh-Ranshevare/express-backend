import express from "express"
import fs from "fs"

const app = express()
const port = 3000


const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));  // random data of dishes


app.get('/',(req,res)=>{
    console.log("hello server")
    return res.json(data)
})

app.get('/getData',(req,res)=>{
    // console.log(req.query.search)
    const sendData = []
    data.forEach(val => {
        if (val.name.toLowerCase().includes(req.query.search.toLowerCase())) {
            sendData.push(val)
        }
    });
    return res.json(sendData)
})

// will render the static file present inside the view folder i.e, index.html 
app.use(express.static('./view'))


app.listen(port, () => {
    console.log(`app is running at port ${port}`)
})