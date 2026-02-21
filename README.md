🎯 QuizIQ – Full Stack Quiz Management Platform

A production-ready full-stack quiz platform built for portfolio demonstration and real-world deployment practice.

It supports role-based authentication, quiz creation, auto-scoring, and cloud deployment.

🚀 Live Deployment

Frontend (Vercel)
https://quizapp-vert-zeta.vercel.app

Backend API (Render)
https://quizapp-backend-8zcu.onrender.com

Note: Backend may take 30–60 seconds to wake up on first request (Render free tier behavior).

✨ Features
👩‍🏫 Teacher Role

Register & Login (JWT Authentication)

Create quizzes

Add questions

View submitted responses

View student scores

👨‍🎓 Student Role

Register & Login

Attempt quizzes

Auto-scoring system

View score history

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

Token-based authorization

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
│   ├── student/
│   ├── teacher/
│   ├── login.html
│   ├── signup.html
│   └── index.html
│
└── README.md
⚙️ Local Setup
1️⃣ Clone Repository
git clone https://github.com/vanshjain271/quizapp.git
cd quizapp
2️⃣ Run Backend
cd backend
npm install
npm start

Expected output:

Server running on port 4000
JSON Database loaded

Backend URL:
http://localhost:4000

3️⃣ Run Frontend
cd frontend
python3 -m http.server 5500

Open in browser:

http://localhost:5500/login.html

🔐 Authentication

The application uses:

JWT-based authentication

Role-based access (Teacher / Student)

Authorization header: Bearer <token>

All API requests are handled through a centralized api() helper for consistency.

🗄 Database

This project uses LowDB, a file-based JSON database.

Database file:

backend/data/db.json
⚠ Production Note

LowDB stores data in the local filesystem.

On Render free tier:

The filesystem is ephemeral.

Data may reset on redeploy or restart.

For full production usage, migrate to:

PostgreSQL

MongoDB

Supabase

PlanetScale

🔧 Deployment Configuration
Backend (Render)

Root Directory: backend

Build Command: npm install

Start Command: npm start

PORT handled automatically

Frontend (Vercel)

Root Directory: frontend

Framework Preset: Other

No build step required

📌 Future Improvements

Replace LowDB with PostgreSQL

Add quiz timer functionality

Improve UI/UX design

Add analytics dashboard

Implement refresh-token authentication

Add admin role

👨‍💻 Author

Vansh Jain
Full Stack Developer | AI Enthusiast | Engineering Student

GitHub:
https://github.com/vanshjain271

📜 License

MIT License

Copyright (c) 2026 Vansh Jain

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.