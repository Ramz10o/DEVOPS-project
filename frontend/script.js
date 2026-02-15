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
        if(!receiver) return;
        socket.emit("typing", { sender, receiver });
    });

    document.getElementById("msgInput").addEventListener("input", () => {
        if(!receiver) return;
        socket.emit("typing", { sender, receiver });
    });

    document.getElementById("msgInput").addEventListener("blur", () => {
        if(!receiver) return;
        socket.emit("stopTyping", { sender, receiver });
    });

    document.getElementById("welcomeText").innerText = `Welcome, ${username}!`;

    socket.emit("registerUser", { username });

    document.getElementById("msgInput").onkeydown = (e) => {
        if (e.key === "Enter") {
            document.getElementById("sendBtn").click();
            document.getElementById("msgInput").blur();
        }
    };
});

socket.on('socketId', (id) => {
    sender = { socketId: id, username };
});

socket.on("duplicteUser", (username) => {
    alert(`Username - ${username} is already taken!`);
    username = prompt("Enter a different username : ");
});

socket.on("typing", (user) => {
    document.getElementById(user.sender.socketId).innerText = `${user.sender.username} (typing...)`;
});

socket.on("stopTyping", (user) => {
    document.getElementById(user.sender.socketId).innerText = user.sender.username;
});

socket.on("userList", (users) => {

    if (receiver && !users.some(u => u.socketId === receiver.socketId)) {
        document.getElementById("currentChat").innerText = "";
        document.getElementById("messages").innerHTML = "";
        allMessages = allMessages.filter(message => message.sender.socketId !== receiver.socketId && message.receiver.socketId !== receiver.socketId);
        receiver = null;
    }


    const list = document.getElementById("usersList");
    list.innerHTML = "";

    users.sort((a, b) => a.username.localeCompare(b.username)).forEach(u => {
        if (u.socketId === sender.socketId) return;

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
    if (receiver) {
        document.getElementById(receiver.socketId).style.backgroundColor = "#24f8b8ff";

    }
});

socket.on("newMessage", (msg) => {
    allMessages.push(msg);

    if (!receiver) return;

    if (
        (msg.sender.socketId === receiver.socketId && msg.receiver.socketId === sender.socketId) ||
        (msg.sender.socketId === sender.socketId && msg.receiver.socketId === receiver.socketId)
    ) {
        addMessage(formatMessage(msg), msg.sender.socketId === sender.socketId ? "sent" : "received");
    }
});

document.getElementById("sendBtn").onclick = () => {
    if (!receiver) return;

    const content = document.getElementById("msgInput").value;
    if (!content.trim()) return;

    const msg = { sender, receiver, content, timestamp: new Date() };

    socket.emit("message", msg);
    allMessages.push(msg);

    addMessage(`You : ${content}`, "sent");
    document.getElementById("msgInput").value = "";
    document.getElementById("msgInput").blur();
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
    type === "sent" ? 
    div.animate([{ opacity: 0, transform: "translateY(100%)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300, fill: "forwards"  }) 
    : div.animate([{ opacity: 0, transform: "translateY(-100%)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300, fill: "forwards" });   
    document.getElementById("messages").appendChild(div);
    div.scrollIntoView({ behavior: "smooth", block: "end" });
}

function formatMessage(msg) {
    return msg.sender.socketId === sender.socketId
        ? `You : ${msg.content}`
        : `${msg.sender.username} : ${msg.content}`;
}

function renderMessages() {
    document.getElementById("messages").innerHTML = "";
    allMessages
        .filter(msg =>
            (msg.sender.socketId === sender.socketId && msg.receiver.socketId === receiver.socketId) ||
            (msg.receiver.socketId === sender.socketId && msg.sender.socketId === receiver.socketId)
        )
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .forEach(msg => {
            addMessage(formatMessage(msg), msg.sender.socketId === sender.socketId ? "sent" : "received");
        });
}
