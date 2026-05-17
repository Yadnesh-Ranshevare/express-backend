const dgram = require("dgram");
const readline = require("readline");   // For reading user input from the console

const client = dgram.createSocket("udp4");

const SERVER_PORT = 5000;   // receiver's port
const SERVER_IP = "127.0.0.1";  // Localhost (receiver's IP address)

client.on("message", (msg) => {
    console.log(`\nServer replied: ${msg}`);
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function send() {

    rl.question("You: ", (message) => {

        client.send(message, SERVER_PORT, SERVER_IP);

        send();
    });
}

send();