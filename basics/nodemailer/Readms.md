## connecting with SMTP server
```js
let transporter = await nodemailer.createTransport({
    host: "your_host",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: 'Host_user',
        pass: 'host_password'
    },
})
```


### some hosts
1. `smtp.gmail.com` : need less secure app user and password
2. [`smtp.ethereal.email`](https://ethereal.email/)   
3. [`sandbox.smtp.mailtrap.io`](https://mailtrap.io/)   

## sending the email
```js
let info = await transporter.sendMail({
    from: '"ranshevaremahendra17@gmail.com" <ranshevaremahendra17@gmail.com>', // sender address
    to: "yranshevare2005@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text:"Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
})
```

### result
```js
console.log("Message sent: %s", info.messageId);
res.json(info)
```