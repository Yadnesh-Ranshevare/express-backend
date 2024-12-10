import express from "express"
import path from 'path' 
import multer from "multer"


const app = express()
const port = 8000

app.set("view engine","ejs")    //need to tell express app which view engine we are using
app.set('views',path.resolve("./view"))     //giving the location of view files to ejs

app.use(express.urlencoded({extended: false}))      //middleware to handle form ( non json ) data

app.get('/',(req,res) => {
    return res.render("homepage")
})


/*
//method 1
//middleware
const upload = multer({dest: "upload/"})        //insert the uploaded file into the upload folder ( multer will create this upload folder itself )

app.post('/upload',upload.single('uploadedFile'),   //will upload the single file / uploadFile is the name of that input felid in ejs file  
    (req,res) => {
        return res.redirect("/")        //redirect to home page
    }
)
*/

//method 2
//step-1: creating storage object
const storage = multer.diskStorage({
    //req:- request, file:- file uploaded by the user, cb:- callback
    //cb(error,path of folder to upload file){}
    destination: function(req,file,cb){     //where to upload the file
        return cb(null,'./upload')  
    },
    filename: function(req,file,cb){    //which name should i give to file once ti uploaded
        return cb(null,`${Date.now()}-${file.originalname}`)   //to give unique name to each file even if you upload the file with same name
    }
})

//step-2: creating upload middleware
const upload = multer({storage:storage})

//step-3:create post request
app.post('/upload',upload.single('uploadedFile'),   //will upload the single file / uploadFile is the name of that input felid in ejs file  
    (req,res) => {
        console.log(req.body)       
        console.log(req.file)
        return res.redirect("/")        //redirect to home page
    }
)

app.listen(port,() => {
    console.log(`app listing at port ${port}`)
})