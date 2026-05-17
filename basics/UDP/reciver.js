const dgram = require("dgram");

const server = dgram.createSocket("udp4");

const PORT = 5000;

server.on("listening", () => {
    console.log(`Server listening on port ${PORT}`);
});

server.on("message", (msg, remote) => {

    console.log(`\nClient says: ${msg}`);

    // Send reply back
    const reply = "Message received";

    server.send(reply, remote.port, remote.address);
});

server.bind(PORT);