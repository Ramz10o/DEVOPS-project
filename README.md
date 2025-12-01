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

