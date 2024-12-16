import bcrypt from 'bcrypt'


const password = "abc@123"

function passwordEncryption(pass) { //for encoding
    return bcrypt.hash(pass,10) 
}

function checkPasswd(encryptedPassword){    //for decoding
    return bcrypt.compare(encryptedPassword,password)
}


passwordEncryption(password)//will return the promise
.then(encryptedPassword => {
    console.log(encryptedPassword);          // This will log the hashed password


    if(checkPasswd(encryptedPassword)){         //will return the true or false
        console.log("your password was correct")
    }
})
.catch(error => {
    console.log(error);
});
