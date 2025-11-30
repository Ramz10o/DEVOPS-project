const path = require("path");
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const port = 6969;

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

let users = [];         
let messages = [];      

app.get('/', (req, res) => {
    res.sendFile("index.html", { root: path.join(__dirname, "../frontend")});
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy', uptime: process.uptime() });
});

app.get('/message/:username', (req, res) => {
    const username = req.params.username;
    
    const userMsgs = messages.filter(msg => 
        msg.sender === username || msg.receiver === username
    );

    res.status(200).json({ messages: userMsgs });
});


app.post('/notifyMessage', (req, res) => {
    const { sender, receiver, content } = req.body;

    const newMessage = { sender, receiver, content, timestamp: new Date() };

    messages.push(newMessage);
    const user = users.find(u => u.username === receiver);

    if (user) {
        io.to(user.socketId).emit('newMessage', newMessage);
    }

    res.status(201).json({ status: 'Message sent', sent: true, message: newMessage });
});

io.on('connection', (socket) => {
    console.log('A user connected : ', socket.id);

    socket.on('registerUser', (user) => {

        const existing = users.find(u => u.username === user.username);
        
        if (!existing) {
            users.push({ socketId: socket.id, username: user.username });
            console.log(`User registered: ${user.username}`);
        } else {
            existing.socketId = socket.id;
            console.log(`User re-registered: ${user.username}`);
        }

        io.emit('userList', users);
        console.log('Registered users: ', users);
    });

    socket.on('message', ({ sender, receiver, content }) => {
        const newMessage = { sender, receiver, content, timestamp: new Date() };

        messages.push(newMessage);

        const user = users.find(u => u.username === receiver)
        
        if (user) {
            io.to(user.socketId).emit('newMessage', newMessage);
        }
    });

    socket.on('disconnect', () => {
        users = users.filter(u => u.socketId !== socket.id);

        io.emit('userList', users);

        console.log('A user disconnected : ', socket.id);
    });
});


httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});