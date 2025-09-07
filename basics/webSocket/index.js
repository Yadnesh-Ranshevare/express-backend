import express from "express";
import { createServer } from "node:http";
import path from "path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server);

app.use(express.static(path.resolve("./public")));

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("chat message", (msg) => {
        console.log("message: " + msg);
        io.emit("chat message", msg);
    });
});

app.get("/", (req, res) => {
    res.sendFile("./public/index.html");
});

const port = 3000;

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
