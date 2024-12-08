const { error, log } = require('console')
const user = require('./MOCK_DATA.json')
const express = require("express")
const fs = require("fs")

const app = express()
const port = 5000
app.use(express.urlencoded({extended:false}))   //middleware.

app.get('/api/user',(req,res)=>{    //will give you a jason data
    return res.json(user)
})
app.get('/user',(req,res)=>{        //will give server side render html page
    const html = 
    `<ul>
        ${user.map(val  => `<li>${val.first_name}</li>`).join("")}
    </ul>`
    res.send(html)
})


/*
        //as route /api/user/:id is same for all this three post, patch and delete we can combine this three method
app.get('/api/user/:id',(req,res)=>{            //fro dynamic routing
    const id = Number(req.params.id)            //ro find out the id value put by the user
    const person = user.find(val => val.id == id)           //find the matching value from the database
    return res.json(person)
})

app.patch('/api/user/:id',(req,res)=>{      //update existing user  
    return res.json({ status:pending })
})

app.delete('/api/user/:id',(req,res)=>{      //delete existing user 
    return res.json({ status:pending })
})

        //in this case you can simply replace above syntax with the following syntax 
app.route("/api/user/:id")
.get((req,res)=> {})        //for get request
.patch((req,res)=> {})        //for update request
.delete((req,res)=> {})     //for delete request

*/


app.route("/api/user/:id")       //use /:(parameter name) for dynamic routing
.get((req,res)=> {
    const id = Number(req.params.id)            //to find out the id value put by the user
    const person = user.find(val => val.id == id)           //find the matching value from the database
    return res.json(person)
})        
.patch((req,res)=> {            //update existing user 
    const id = Number(req.params.id) 
    const person = user.findIndex(val => val.id == id)
    const updatedData = req.body;       // Get the updated data from the request body

    if (person == -1) {     // If the user is not found
        return res.status(404).json({ status: "User not found" });
    } 

    user[person] = {
        ...user[person],        // Spread the existing user data
        ...updatedData      // Apply the updates from the request body
    }

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(user), (error) => {
        if (error) {
            // If there is an error writing to the file, return an error response
            return res.status(500).json({ status: "pending", error: error.message });
        }

        // If the file was written successfully, return a success response
        return res.json({ status: "success", message: "User updated successfully" });
    });

})        
.delete((req,res)=> {        //delete existing user 
    const id = Number(req.params.id) 
    const person = user.findIndex(val => val.id == id) 

    if (person == -1) {
        return res.status(404).json({ status: "User not found" });
    } 

    // const newFile = user.filter(val=> val !== person)

    user.splice(person, 1);        // This will remove the person from the user array

    fs.writeFile("./MOCK_DATA.json",JSON.stringify(user),(error,data)=>{    //writing into the database file
        return res.json({ status:"pending" })       //if we get some error then return the pending status
    })
    console.log(user.length)
})


app.post('/api/user',(req,res)=>{            //create new user
    const body = req.body;          //the data you send will be available in this req.body
    // console.log(body)
    user.push({...body,id:user.length+1})       //assigning id 
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(user),(error,data)=>{    //writing into the database file
        return res.json({ status:"pending" })       //if we get some error then return the pending status
    })
    console.log(user.length)

})

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`)
})
