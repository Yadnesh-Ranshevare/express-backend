import multer from "multer"

const storage = multer.diskStorage({
    //req:- request, file:- file uploaded by the user, cb:- callback
    //cb(error,path of folder to upload file){}
    destination: function(req,file,cb){     //where to upload the file,info related to destination
        return cb(null,'./public/temp')  
    },
    filename: function(req,file,cb){    //info related to file
        return cb(null,file.originalname)   //to name to each file even if you upload the file with same name
    }
})
  
export const upload = multer({ storage: storage })