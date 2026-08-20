import express  from "express";

const app = express();
const port = 3000;

process.title = "node-express";

app.use(express.json({ limit: "1mb" }));

app.get(`/simple`, (req, res) => {
    res.json({ message: "hi" });
});

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});