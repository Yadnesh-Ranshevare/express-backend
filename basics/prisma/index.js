import express from "express"
import prisma from "./prisma/index.js"

const app = express()
const port = 5000
app.use(express.json());


app.get("/", async (req, res) => {
    const users = await prisma.user.findMany()
    return res.json(users)
})

app.post("/saveUser", async(req, res)=>{
    try {
        const body = req.body
        const user = await prisma.user.create({
            data: body
        })
        console.log(user)
        return res.json({message:"user saved"})
    } catch (error) {
        console.log(error.message)
    }
})

app.listen(port, () => {
    console.log(`app listening at port ${port}`)
})