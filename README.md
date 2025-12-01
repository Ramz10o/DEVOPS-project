# 🚀 Real-Time Chat Microservice (Node.js + Socket.IO + Docker + Kubernetes + CI/CD)

A fully containerized **real-time chat microservice** built using **Node.js**, **Express**, **Socket.IO**, and a lightweight **HTML/CSS/JS frontend**.  
The project is production-ready with **Docker**, **GitHub Actions CI/CD**, and **Kubernetes deployment support (Minikube)**.  
Additionally, the app is live and hosted on **Render** for public access.

---

## 🧠 Features

### 🔹 **Real-Time Messaging**
- Seamless WebSocket-based chat using Socket.IO.
- Instant message delivery with no delay.

### 🔹 **User Presence Detection**
- Automatically updates user list when someone joins/leaves.
- Chat view resets when chatting user goes offline.

### 🔹 **In-Memory Message History**
- Messages stored temporarily for the active session.
- Client-side filtering for per-user conversations.

### 🔹 **Frontend Served From Backend**
- Express serves a built-in chat UI.
- No need for separate frontend deployment.

### 🔹 **Containerized with Docker**
- Lightweight Node.js image (`node:18-alpine`).
- Production-ready Dockerfile.

### 🔹 **Kubernetes Deployment**
- Deployment + Service YAML provided.
- Runs seamlessly on Minikube.

### 🔹 **CI/CD with GitHub Actions**
- Auto builds & pushes Docker image to Docker Hub.
- Triggered on every push to main/master.

### 🔹 **Cloud Hosting**
- Fully deployed to Render (free hosting).
- Supports WebSockets without any configuration.

---

## 🏛️ Architecture Overview
```
 ┌──────────────────────┐
 │ Client Browser       │
 │ (HTML + JS Frontend) │
 └───────────▲──────────┘
             │ HTTP + WS
             │
 ┌───────────┴───────────┐
 │ Express Server        │
 │ (Node.js Backend)     │
 │ REST + Socket.IO      │
 └───────────▲───────────┘
             │
             │ Docker Image
 ┌───────────┴───────────┐
 │ Docker Engine         │
 │ (Local / Render / K8s)│
 └───────────▲───────────┘
             │
             │ kubectl apply
┌────────────┴───────────┐
│ Kubernetes             │
│ Deployment + Service   │ 
└────────────────────────┘
```


---

## 📂 Folder Structure

```
chat-microservice/
│
├── src/
│ └── main.js # Backend (Express + Socket.IO)
│
├── frontend/
│ ├── index.html # UI
│ ├── script.js # Chat logic
│ └── style.css # Styling
│
├── Dockerfile # Docker configuration
├── package.json
├── package-lock.json
│
├── k8s/
│ ├── deployment.yaml # Kubernetes Deployment
│ └── service.yaml # Kubernetes Service (NodePort)
│
└── .github/
└── workflows/
└── ci-cd.yml # GitHub Actions CI/CD Pipeline
```

---

## 🧩 Tech Stack

- **Node.js**
- **Express.js**
- **Socket.IO**
- **HTML/CSS/JavaScript**
- **Docker**
- **Kubernetes (Minikube)**
- **GitHub Actions**
- **Render Hosting**

---

## 🔧 Installation & Running Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/chat-microservice.git
cd chat-microservice
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Run the Server
```bash
node src/index.js
```

### 4️⃣ Open in Browser
```bash
http://localhost:6969/
```

## 🐳 Docker Setup

### **Build Image**
```bash
docker build -t chat-microservice .
```

### **Run Container**
```bash
docker run -p 6969:6969 chat-microservice
```

### **Open App**
```bash
http://localhost:6969/
```

## ☸️ Kubernetes Deployment (Minikube)

### **Apply Deployment**
```bash 
kubectl apply -f k8s/deployment.yaml
```

### **Apply Service**
```bash
kubectl apply -f k8s/service.yaml
```

### **Get Minikube IP**
```bash
minikube ip
```

### **Access Your App**
```bash
http://<minikube-ip>:30020/
```

## 🤖 GitHub Actions CI/CD

This project includes an automated CI/CD pipeline using **GitHub Actions**.  
The workflow performs the following steps:

- 🏗️ Builds the Docker image  
- 🔑 Logs in to Docker Hub using repository secrets  
- 📤 Pushes the image to the Docker registry  
- 🚀 Automatically triggers on commits to `main` or `master`  

📁 **Workflow File Location**

.github/workflows/ci-cd.yml


---

## 🌐 Live Deployment (Render)

The application is deployed on **Render**, providing a fully hosted and publicly accessible chat service.

🔗 **Live App:**  
👉 [Live Chat App](https://livechat-ca94.onrender.com/)

Render automatically redeploys the service whenever new commits are pushed.

---

## 📡 API Endpoints

### **Health Check**

GET /health

### **Get Messages for a User**

GET /message/:username

### **Send Message (REST Fallback)**

POST /notifyMessage


---

## 🔌 WebSocket Events

| Event Name      | Direction         | Description                     |
|-----------------|------------------|---------------------------------|
| `registerUser`  | Client → Server  | Registers a new connected user |
| `userList`      | Server → Client  | Sends updated list of online users |
| `message`       | Client → Server  | Sends a real-time chat message |
| `newMessage`    | Server → Client  | Delivers a received message     |

---

## 🔮 Future Enhancements

These features can make the project even more powerful:

- ⏱️ **Message timestamps**
- ✍️ **Typing indicator**
- 🔔 **Notification sound for new messages**
- 🟢 **Online/offline status indicators**
- 👥 **Group chat support**
- 💾 **Persistent chat history using MongoDB**
- 🔐 **JWT-based authentication**
- 🌙 **Dark mode**
- 📱 **Mobile-friendly UI**
- 📦 **Microservices split (Auth, Chat, Presence)**

---

## 🤝 Contributing

Contributions are welcome!

Steps:

1. Fork the repository  
2. Create a new branch  
3. Commit changes  
4. Push the branch  
5. Create a Pull Request  

---

## 📜 License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute it as needed.

---

## 👨‍💻 Author

**Ramz**
Full-Stack Developer & DevOps Engineer  
Real-time microservices | Kubernetes | CI/CD | Cloud Deployment  

For queries or collaboration:  
📧 *ramzpaianaguppam@gmail.com*

---

