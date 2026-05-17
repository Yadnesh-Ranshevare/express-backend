# Introduction

UDP stands for User Datagram Protocol. It’s a basic communication protocol used on the internet to send data from one device to another.

Here’s the idea in simple terms:

- UDP sends messages (called datagrams) quickly.
- It does not check if the message arrives.
- It does not resend lost data.
- It does not guarantee order (messages might arrive out of sequence).

UDP is like sending postcards You drop them in the mail and don’t track them—fast, but no guarantees.

### Key features
- Fast – no extra checks or delays
- Unreliable – data can be lost or duplicated
- Connectionless – no setup before sending data

### Where UDP is used

UDP is useful when speed matters more than accuracy, such as:

- Online gaming
- Video streaming
- Voice calls (VoIP)
- Live broadcasts

---

# Datagram

A datagram is a small independent packet of data sent over a network.

In UDP, data is broken into chunks, and each chunk is sent as a separate datagram.

A datagram usually contains:

- Header → networking info (source port, destination port, length, checksum)
- Payload → the actual data/message

A datagram is self-contained that means each datagram carries enough information to travel from sender to receiver independently.

So if you send:
```
Hello World
```
UDP may send it as one datagram like:
```
[Header][Hello World]
```
### What happens during transmission?

Each datagram:

- can take different routes through the internet
- may arrive late
- may arrive out of order
- may never arrive

UDP does not care.

That’s why it’s fast.

### Datagram vs Packet

People casually use both words interchangeably, but technically:

- Packet = generic networking term
- Datagram = packet used in connectionless communication like UDP

--- 

# UDP Transmission Process
Suppose your app sends:

```
"Hello"
```
to:
```
192.168.1.10 : 5000
```

### Step 1 — Your application creates data
Your program generates some data:
```
Hello
```
### Step 2 — UDP adds its header
UDP wraps your data inside a UDP datagram.

UDP header contains:

- Source port
- Destination port
- Length
- Checksum

Like this:
```
[UDP Header][Hello]
```
### Step 3 — IP layer adds IP header
Now the operating system passes this to the IP layer.

IP adds:

- Source IP
- Destination IP
- TTL
- Protocol type

Now it becomes:
```
[IP Header][UDP Header][Hello]
```
This is now an IP packet.

### Step 4 — MAC layer prepares local delivery
Inside a local network, devices communicate using MAC addresses, not IPs.

So the OS asks:
```
Who has IP 192.168.1.10?
```
using ARP (Address Resolution Protocol).

The target device replies with its MAC address:
```
AA:BB:CC:DD:EE:FF
```
### Step 5 — Ethernet/WiFi frame creation
Network hardware wraps everything into a frame:
```
[MAC Header][IP Header][UDP Header][Hello][CRC]
```
This is what physically travels.
### Step 6 — Physical transmission

Now the data travels through actual media:

- Ethernet cable → electrical signals
- Fiber optics → light pulses
- WiFi → radio waves

This is handled by the network card (NIC).

### Step 7 — Routers forward packets
If the destination is outside your local network:

Routers read:
```
Destination IP
```
and decide where to forward the packet next.

Each router only cares about IP routing.

They do NOT care about UDP payload.

### Step 8 — Destination device receives it

The destination NIC receives the frame.

The OS removes layers one by one:
```
Ethernet -> IP -> UDP -> Data
```

This process is called: Decapsulation

### Step 9 — UDP checks destination port

UDP reads:
```
Destination Port = 5000
```
Then asks:
```
Which application is listening on port 5000?
```
The OS gives the data to that app.

### Final result
The receiving app gets:
```
Hello
```
--- 

### Coding Implementation
To implement UAP communication we need to create 2 server one for Reciving and other for sending the data

### Reciver.js
```js
const dgram = require("dgram");

const server = dgram.createSocket("udp4");

const PORT = 5000;  // port where the application is running

server.on("listening", () => {
    console.log(`Server listening on port ${PORT}`);
});

server.on("message", (msg, remote) => {
    console.log(`\nClient says: ${msg}`);
    const reply = "Message received";
    server.send(reply, remote.port, remote.address);
});

server.bind(PORT);
```
### Sender.js
As we are running both sender.js and reciver.js on same device the UDP communication will take place on localhost (127.0.0.1), but you can change it with recivers device IP address
```js
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
```
