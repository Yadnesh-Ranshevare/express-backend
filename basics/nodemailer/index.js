import express from "express"
import nodemailer from "nodemailer"


const app = express()
const port = 3000

app.get('/',(req,res)=>{         
    res.send('hello express')   
})


// -------syntax 1 ---------
// function sendmail() {
//     return (req,res) => {
//         res.send("mail sent")
//     }
// }

// const sendmail = () => {
//     return (req,res) => {
//         res.send("mail sent")
//     }
// }

// app.get('/sendmail', sendmail())     //we need to actually execute the function  

// -------syntax 2 ---------

// const sendmail = (req,res) => {
//     res.send("mail sent")
// }

async function sendmail(req,res){


    //connecting with the SMTP server
    let transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: 'your_user',
            pass: 'your_password',
        },
    })

    let info = await transporter.sendMail({
        from: '"ranshevaremahendra17@gmail.com" <ranshevaremahendra17@gmail.com>', // sender address
        to: "yranshevare2005@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text:"Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    })

    console.log("Message sent: %s", info.messageId);
    res.json(info)
}

app.get('/sendmail', sendmail)
 
app.listen(port, ()=>{     
    console.log(`http://localhost:${port}`)
})