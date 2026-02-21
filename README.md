# QuizApp – Full Stack Quiz Management System

A complete full-stack quiz platform built with Node.js, Express, and Vanilla JavaScript.

---

## 🚀 Features

### 👩‍🏫 Teacher Role
- Create quizzes
- Add questions
- View student submissions
- View scores

### 👨‍🎓 Student Role
- Register & login
- Attempt quizzes
- Auto-scoring
- View score history

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- LowDB (JSON database)
- JWT Authentication

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

---

## 📂 Project Structure

```
quizapp/
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── data/
│   │   └── db.json
│   └── index.js
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── student/
│   ├── teacher/
│   ├── login.html
│   ├── signup.html
│   └── index.html
│
└── README.md
```

---

## ⚙️ Local Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/vanshjain271/quizapp.git
cd quizapp
```

### 2️⃣ Start Backend

```
cd backend
npm install
npm start
```

Expected output:

```
Server running on port 4000
JSON Database loaded
```

Backend URL:
```
http://localhost:4000
```

### 3️⃣ Start Frontend

```
cd frontend
python3 -m http.server 5500
```

Open in browser:
```
http://localhost:5500/login.html
```

---

## 🌐 Deployment

### Backend
Deployed on Render.

### Frontend
Deployed on Vercel.

⚠ Note: LowDB uses file storage. On free hosting tiers, filesystem is ephemeral and data may reset after redeploy.

---

## 📄 License

MIT License

Copyright (c) 2026 Vansh Jain

---

## 👨‍💻 Author

Vansh Jain  
GitHub: https://github.com/vanshjain271