import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
const app = express();

app.use(cors());
app.use(express.static("/public"));

const __filename = fileURLToPath(import.meta.url);// current file path from c: (eg, C:\Users\Yadnesh\OneDrive\Desktop\codes\express-backend\basics\ServerSentEvent\src\index.js)
const __dirname = path.dirname(__filename);     // current directory path from c: (eg, C:\Users\Yadnesh\OneDrive\Desktop\codes\express-backend\basics\ServerSentEvent\src)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..','public', 'index.html'));  // ../public/index.html from current directory
});

// Endpoint for SSE
app.get("/events", (req, res) => {
    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send a comment to keep connection alive
    // res.write(": Connected\n\n");

    let i = 0

    // Function to send data
    const sendData = () => {
        const data = JSON.stringify({ count: i });
        i++
        res.write(`data: ${data}\n\n`);
    };

    // Send data every 2 seconds
    const intervalId = setInterval(sendData, 2000);

    // Cleanup on client disconnect
    req.on("close", () => {
        clearInterval(intervalId);
        res.end();
    });
});

app.listen(3000, () => {
    console.log("SSE server running on http://localhost:3000");
});
