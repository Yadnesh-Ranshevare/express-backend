# Content
1. [Introduction](#introduction)
2. [Socket.IO](#socketio)



---
# Introduction
- A WebSocket is a protocol that allows two-way communication between a client (like a web browser) and a server over a single, long-lived connection. 
- Unlike the traditional HTTP request-response model, where the client has to keep asking the server for updates (polling), WebSockets let the server send data to the client instantly whenever there’s new information. 
- This makes it perfect for real-time apps like chat apps, online games, or live notifications.


Here’s the key difference:
| Feature          | HTTP                         | WebSocket                    |
| ---------------- | ---------------------------- | ---------------------------- |
| Communication    | One-way (request → response) | Two-way (full-duplex)        |
| Connection       | Short-lived                  | Long-lived                   |
| Real-time        | No (requires polling)        | Yes                          |
| Example Use Case | Loading a web page           | Chat app, live stock updates |

## Connection Establishment
**A WebSocket connection is established through a process called the WebSocket handshake, which starts as an HTTP request and then “upgrades” to a WebSocket connection. Here’s how it works step by step:**

#### 1. Client Requests WebSocket Upgrade
The client (usually a browser) sends an HTTP request to the server, asking to upgrade the connection to a WebSocket.

Example request headers:
```makefile
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```
- **Upgrade**: websocket → tells the server we want a WebSocket.
- **Connection**: Upgrade → indicates this is a special upgrade request.
- **Sec-WebSocket-Key** → a random base64 key to validate the handshake.
- **Sec-WebSocket-Version** → version of WebSocket protocol (usually 13).


#### 2. Server Accepts the Upgrade
The server responds with a 101 Switching Protocols status if it supports WebSockets:
```makefile
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```
- **101 Switching Protocols** → confirms the upgrade.
- **Sec-WebSocket-Accept** → server hashes the key sent by client to verify the handshake.

#### 3. Connection is Established
**Once the handshake completes:**
- The HTTP connection is upgraded to a WebSocket connection.
- Both client and server can now send messages freely in both directions without re-establishing the connection.


**After the handshake:**
- The connection stays open until either side closes it.
- Messages can be sent in text or binary format.

#### Visual Illustration
```sql
Client                          Server
   | ----- HTTP GET Upgrade ----> |
   |                               |
   | <-- 101 Switching Protocols --|
   |                               |
   | <------ WebSocket Open ------>|
   |                               |
   | <---- Messages go both ways ->|
```

[Go To Top](#content)

---
# Socket.IO
- Socket.IO is a JavaScript library that makes working with WebSockets (and other real-time communication methods) much easier. 
- It allows real-time, bidirectional communication between a browser (client) and a server, just like WebSockets,
- extra features:
    - Automatic fallback to other protocols if WebSockets aren’t supported.
    - Event-based communication (you can emit custom events like `chat message`).
    - Built-in support for rooms and namespaces.
    - Handles reconnection automatically if the connection drops.


## Configuration for backend:
#### 1. Install `socket.oi`
```bash
npm install socket.io
```
#### 2. initialize the basic http express server
```js
import express from "express";
import { createServer } from "node:http";
import path from "path";

const app = express();
const server = createServer(app);   // http server with express

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
    res.sendFile("./public/index.html");        // static frontend
});

const port = 3000;

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
```
#### 3. import server form socket.io
```js
import { Server } from "socket.io";
```

#### 4. create one instance of the socket io server
```js
const io = new Server(server);
```
#### 5. listen for an event
```js
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);
});
```
- `io.on("connection", ...)`:
    - Listens for the special event `"connection"`.
    - This event is triggered every time a new client connects to the server.
- `(socket) => { ... }`:
    - when the `"connection"` event get fired this callback runs 
    - When a client connects, Socket.IO creates a socket object for that client.
    - This `socket` represents the individual connection.
    - Inside, you can:
        - Listen for custom events from that client:
        ```js
        socket.on("chat message", (msg) => {
          console.log("Message from client:", msg);
        });
        ```
        - Send messages back to that client:
        ```js
        socket.emit("welcome", "Hello, you are connected!");
        ```
        - Broadcast to everyone:
        ```js
        io.emit("chat message", "New user joined!");
        ```
## Configuration For frontend
#### 1. since we are using basic html with js for frontend link socket.io cdn
```html
<script src="/socket.io/socket.io.js"></script>
<script src="./app.js"></script>    <!-- frontend script-->
```
#### 2. Initialize the io instance for frontend
```js
const socket = io();
```
frontend will make a webSocket connection request to backend server and fires the `"connection"` event and execute `io.on("connection", ()=>{})` at the server

```js
// server
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);    // once frontend mounted this line will execute
});
```

#### Similar to backend we can use this socket for:
- Listen for custom events from that client:
```js
socket.on("chat message", (msg) => {
  console.log("Message from client:", msg);
});
```
- Send messages back to that client:
```js
socket.emit("welcome", "Hello, you are connected!");
```

## socket.on(eventName, callback)
Listen for an event.
- **eventName** → string (must match between sender & receiver).
- **callback** → function that runs when the event is received.


**Syntax:**
```js
socket.on("event-name", (data1, data2, ...) => {
  // handle data sent with the event
});
```
Example (client listens to server):
```js
socket.on("chat message", (msg) => {
  console.log("New message:", msg);
});
```
##  socket.emit(eventName, data, [acknowledgement])
Send/emit an event.
- **eventName** → string.
- **data** → any JS data (string, object, array, etc.).
- **acknowledgement (optional)** → callback the receiver can call.

**Syntax**
```js
socket.emit("event-name", data1, data2, ..., (response) => {
  // optional acknowledgement callback
});
```
Example (client sends to server):
```js
socket.emit("chat message", "Hello Server!");
```
Server receives:
```js
socket.on("chat message", (msg) => {
  console.log("Message from client:", msg);
});
```





[Go To Top](#content)

---
