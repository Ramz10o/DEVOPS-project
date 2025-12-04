const socket = io();

let username = null;
let sender = null;
let receiver = null;
let allMessages = [];

document.addEventListener("DOMContentLoaded", () => {
    while (!username || username.trim() === "") {
        username = prompt("Enter your username:");
    }

    document.getElementById("msgInput").addEventListener("focus", () => {
        socket.emit("typing", { sender, receiver });
    });

    document.getElementById("msgInput").addEventListener("blur", () => {
        socket.emit("stopTyping", { sender, receiver });
    });

    document.getElementById("welcomeText").innerText = `Welcome, ${username}!`;

    socket.emit("registerUser", { username });

    document.getElementById("msgInput").onkeydown = (e) => {
        if (e.key === "Enter") document.getElementById("sendBtn").click();
    };
});

socket.on('socketId', (id) => {
    sender = { username, socketId: id };
});

socket.on("typing", (data) => {
    document.getElementById(`${data.sender.socketId}`).innerText = `${data.sender.username} (typing...)`;
    if (data.sender === receiver.socketId) {
        document.getElementById("currentChat").innerText = `Chatting with: ${receiver.username} (typing...)`;
    }
});

socket.on("stopTyping", (data) => {
    document.getElementById(`${data.sender.socketId}`).innerText = data.sender.username;
    if (data.sender === receiver.socketId) {
        document.getElementById("currentChat").innerText = `Chatting with: ${receiver.username}`;
    }
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

    users.sort((a, b) => a.username.localeCompare(b.username)).forEach(u => {
        if (u.username === username) return;

        let li = document.createElement("li");
        li.className = "userItem";
        li.innerText = u.username;
        li.id = u.socketId;

        li.onclick = () => {
            if (receiver) {
                document.getElementById(receiver.socketId).style.backgroundColor = "#29d4ff";
            }
            receiver = { socketId: u.socketId, username: u.username };
            li.style.backgroundColor = "#24f8b8ff";
            document.getElementById("currentChat").innerText = "Chatting with: " + receiver.username;
            renderMessages();
        };

        list.appendChild(li);
    });
});

socket.on("newMessage", (msg) => {
    allMessages.push(msg);

    if (!receiver) return;

    if (
        (msg.sender === receiver.username && msg.receiver === username) ||
        (msg.sender === username && msg.receiver === receiver.username)
    ) {
        addMessage(formatMessage(msg), msg.sender === username ? "sent" : "received");
    }
});

document.getElementById("sendBtn").onclick = () => {
    if (!receiver) return;

    const content = document.getElementById("msgInput").value;
    if (!content.trim()) return;

    const msg = {
        sender: sender.socketId,
        receiver: receiver.socketId,
        content
    };

    socket.emit("message", msg);
    allMessages.push(msg);

    addMessage(`You : ${content}`, "sent");
    document.getElementById("msgInput").value = "";
};

function addMessage(text, type) {
    let div = document.createElement("div");
    div.className = "message";
    div.innerText = text;
    div.style.borderRadius = "10px";
    div.style.backgroundColor = type === "sent" ? "#86ff94ff" : "#fdffa3ff";
    div.style.alignSelf = type === "sent" ? "flex-end" : "flex-start";
    div.style.margin = "5px";
    div.style.padding = "10px";
    div.style.width = "fit-content";
    div.style.maxWidth = "60%";
    type === "sent" ? div.animate([{ opacity: 0, transform: "translateY(100%)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300, fill: "forwards"  }) 
    : div.animate([{ opacity: 0, transform: "translateY(-100%)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300, fill: "forwards" });   
    document.getElementById("messages").appendChild(div);
    div.scrollIntoView({ behavior: "smooth", block: "end" });
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
            (msg.sender === username && msg.receiver === receiver.username) ||
            (msg.receiver === username && msg.sender === receiver.username)
        )
        .forEach(msg => {
            addMessage(formatMessage(msg), msg.sender === username ? "sent" : "received");
        });
}
