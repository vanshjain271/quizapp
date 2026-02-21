📘 QuizIQ – Full Stack Quiz Management Platform
🚀 Overview

QuizIQ is a full-stack quiz management platform designed for teachers and students.
Teachers can create and manage quizzes, while students can attempt quizzes and view results.

The application is deployed with:

Backend: Node.js + Express + LowDB → Hosted on Render

Frontend: Static HTML/CSS/JS → Hosted on Vercel

🌐 Live Deployment

Frontend (Vercel):
👉 https://quizapp-vert-zeta.vercel.app

Backend (Render API):
👉 https://quizapp-backend-8zcu.onrender.com

Note: Backend may take 30–60 seconds on first request due to Render free tier sleep policy.

🧱 Tech Stack
Backend

Node.js

Express.js

LowDB (JSON file-based database)

JWT Authentication

CORS enabled

Frontend

HTML5

CSS3

Vanilla JavaScript

Fetch API

Token-based authentication

📁 Project Structure
quizapp/
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── data/
│   │   └── db.json
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── css/
│   ├── js/
│   │   └── common.js
│   ├── student/
│   ├── teacher/
│   ├── login.html
│   ├── signup.html
│   └── index.html
│
└── README.md
🔐 Features
👩‍🏫 Teacher

Register / Login

Create quizzes

Add questions

View results

Share quiz links

🎓 Student

Register / Login

Attempt quizzes

View personal results

🛠 Local Setup
1️⃣ Clone Repository
git clone https://github.com/vanshjain271/quizapp.git
cd quizapp
2️⃣ Run Backend
cd backend
npm install
npm start

Backend runs at:

http://localhost:4000
3️⃣ Run Frontend
cd frontend
python3 -m http.server 5500

Open in browser:

http://localhost:5500/login.html
⚠ Important Notes
🗄 Database Persistence

This project uses LowDB (JSON file-based database).

On Render free tier:

File system is ephemeral.

Data may reset on redeploy or restart.

For production-grade deployment, migrate to:

PostgreSQL

MongoDB

Supabase

PlanetScale

🔧 Deployment Configuration
Backend (Render)

Root directory: backend

Build command: npm install

Start command: npm start

Environment variable: PORT (auto provided)

Frontend (Vercel)

Root directory: frontend

Framework: Other

No build command required

📌 Future Improvements

Migrate from LowDB to PostgreSQL

Add role-based dashboard enhancements

Improve UI/UX

Add analytics and quiz scoring insights

Implement refresh token authentication

👨‍💻 Author

Vansh Jain
Full Stack Developer | AI Enthusiast | Engineering Student

GitHub: https://github.com/vanshjain271

📜 License

MIT License

Copyright (c) 2026 Vansh Jain
