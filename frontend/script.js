// Point to backend
const socket = io();

// Ask for username
let username = prompt("Enter your name:");
document.getElementById("welcomeText").innerText =
    "You are logged in as: " + username;

// Register user
socket.emit("registerUser", { username });

// Update online users list
socket.on("userList", (users) => {
    const list = document.getElementById("usersList");
    list.innerHTML = "";
    users.forEach(u => {
        let li = document.createElement("li");
        li.innerText = u.username;
        list.appendChild(li);
    });
});

// Handle incoming messages
socket.on("newMessage", (msg) => {
    addMessage(`${msg.sender}: ${msg.content}`);
});

// Send message
document.getElementById("sendBtn").onclick = () => {
    const msg = document.getElementById("msgInput").value;
    const receiver = prompt("Send message to (username):");

    socket.emit("message", {
        sender: username,
        receiver: receiver,
        content: msg
    });

    addMessage(`You -> ${receiver}: ${msg}`);
    document.getElementById("msgInput").value = "";
};

// Clear chat UI
document.getElementById("clearBtn").onclick = () => {
    document.getElementById("messages").innerHTML = "";
};

// Utility
function addMessage(text) {
    let div = document.createElement("div");
    div.className = "message";
    div.innerText = text;
    document.getElementById("messages").appendChild(div);
}