import bcrypt from 'bcrypt'


const user = {      //this is random data from the data base
    id:"tu4f22324023",
    name:"yadnesh",
    age:19,
    address:"kalyan",
    profession:"student",
    password:""     //as we don't store the password in string format without encrypting it
}

const frontendPassword = "abc@123" //password comes from the frontend

function passwordEncryption(pass) { //for encoding
    return bcrypt.hash(pass,10) 
}

function checkPasswd(pass){    //for decoding
    return bcrypt.compare(pass,user.password)
}

// //as both passwordEncryption and checkPasswd is returning a promise they wont execute in proper sequence so to execute them in sequence we use promise chaining 
// passwordEncryption(frontendPassword)//will return the promise
//     .then(encryptedPassword => {
//         console.log(encryptedPassword);          // This will log the hashed password

//         user.password = String(encryptedPassword)       //setting the encrypted pass into the database

//         const newPassword = "abc@123"   //password we want to check is correct or not

//         checkPasswd(newPassword)
//             .then(pass => console.log(pass))        //print true
//             .catch(error => console.log(error))    
    
//     })
// .catch(error => {
//     console.log(error);
// });



 //as both passwordEncryption and checkPasswd is returning a promise they wont execute in proper sequence so to execute them in sequence we use async await
 //as we want to execute this async function right when this file is load we are using IIF( immediately invoke function )
(
    async()=>{
       const encryptedPassword = await passwordEncryption(frontendPassword)  //will return the promise
       console.log(encryptedPassword)   //to see encrypted password

       user.password = String(encryptedPassword)       //setting the encrypted pass into the database

       const newPassword = "abc@123"   //password we want to check is correct or not
       
       const isPasswordCorrect = await checkPasswd(newPassword)
       console.log(isPasswordCorrect);  //to see what is return once it compare
       
    }
)()
