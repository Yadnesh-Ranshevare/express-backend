const socket = io();


const input = document.querySelector("input");
const button = document.querySelector("button");

button.addEventListener("click", () => {
    socket.emit("chat message", input.value);
    input.value = "";
});

socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    const li = document.createElement("li");
    li.textContent = msg;
    document.querySelector("ul").appendChild(li);
})