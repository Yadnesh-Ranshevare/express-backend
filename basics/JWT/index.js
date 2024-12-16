import jwt from "jsonwebtoken"

const user = {      //this is random data from the data base
    id:"tu4f22324023",
    name:"yadnesh",
    age:19,
    address:"kalyan",
    profession:"student"
}

const payload = {       //payload required to create the jwt token
    id : user.id,
    // ...user      //we can give as many info fromm the user as we want
}


const tokenSecrete = "any-secrete-key-you-want" //secrete required to create the jwt token

const jwtToken = jwt.sign(payload,tokenSecrete) //creating the token

const verifyToken = jwt.verify(jwtToken,tokenSecrete)   //verifying the token
if(verifyToken){    //if verifyToken exist condition will be true
    console.log("this is what your token is made of", verifyToken)
}

console.log("this is your token:- ",jwtToken)