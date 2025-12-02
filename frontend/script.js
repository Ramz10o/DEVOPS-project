const socket = io();

let username = null;
let receiver = null;
let allMessages = [];

document.addEventListener("DOMContentLoaded", () => {
    while (!username || username.trim() === "") {
        username = prompt("Enter your username:");
    }

    document.getElementById("welcomeText").innerText = `Welcome, ${username}!`;

    socket.emit("registerUser", { username });

    document.getElementById("msgInput").onkeydown = (e) => {
        if (e.key === "Enter") document.getElementById("sendBtn").click();
    };
});

socket.on("userList", (users) => {

    if (receiver && !users.some(u => u.username === receiver)) {
        document.getElementById("currentChat").innerText = "";
        document.getElementById("messages").innerHTML = "";
        allMessages = allMessages.filter(message => message.sender !== receiver && message.receiver !== receiver);
        receiver = null;
    }

    const list = document.getElementById("usersList");
    list.innerHTML = "";

    users.forEach(u => {
        if (u.username === username) return;

        let li = document.createElement("li");
        li.className = "userItem";
        li.innerText = u.username;

        li.onclick = () => {
            receiver = u.username;
            document.getElementById("currentChat").innerText = "Chatting with: " + receiver;
            renderMessages();
        };

        list.appendChild(li);
    });
});

socket.on("newMessage", (msg) => {
    allMessages.push(msg);

    if (!receiver) return;

    if (
        (msg.sender === receiver && msg.receiver === username) ||
        (msg.sender === username && msg.receiver === receiver)
    ) {
        addMessage(formatMessage(msg), msg.sender === username ? "sent" : "received");
    }
});

document.getElementById("sendBtn").onclick = () => {
    if (!receiver) return;

    const content = document.getElementById("msgInput").value;
    if (!content.trim()) return;

    const msg = {
        sender: username,
        receiver,
        content
    };

    socket.emit("message", msg);
    allMessages.push(msg);

    addMessage(`You : ${content}`, "sent");
    document.getElementById("msgInput").value = "";
};

function addMessage(text, type) {
    let div = document.createElement("div");
    div.scrollIntoView();
    div.className = "message";
    div.innerText = text;
    div.style.borderRadius = "10px";
    div.style.backgroundColor = type === "sent" ? "#86ff94ff" : "#fdffa3ff";
    div.style.alignSelf = type === "sent" ? "flex-end" : "flex-start";
    div.style.margin = "5px";
    div.style.padding = "10px";
    div.style.width = "fit-content";
    div.style.maxWidth = "60%";
    type === "sent" ? div.animate([{ opacity: 0, transform: "translateY(100%)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300 }) 
    : div.animate([{ opacity: 0, transform: "translateY(-100%)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300 });   
    document.getElementById("messages").appendChild(div);
}

function formatMessage(msg) {
    return msg.sender === username
        ? `You : ${msg.content}`
        : `${msg.sender} : ${msg.content}`;
}

function renderMessages() {
    document.getElementById("messages").innerHTML = "";
    allMessages
        .filter(msg =>
            (msg.sender === username && msg.receiver === receiver) ||
            (msg.receiver === username && msg.sender === receiver)
        )
        .forEach(msg => {
            addMessage(formatMessage(msg), msg.sender === username ? "sent" : "received");
        });
}
