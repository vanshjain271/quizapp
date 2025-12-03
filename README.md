Quiz Management System – Full Stack Project

A fully working quiz platform with:

✔ Teacher & student roles
✔ Authentication with JWT
✔ Create quizzes
✔ Add questions
✔ Attempt quiz & auto scoring
✔ SQLite storage
✔ Browser UI (HTML/CSS/JS frontend)
✔ Node.js backend API

Built for learning purpose & portfolio use.

🚀 Features
👩‍🏫 Teacher Role

✔ Login/signup
✔ Create new quiz
✔ Add questions
✔ View quiz responses & scores

👨‍🎓 Student Role

✔ Login/signup
✔ Attempt quizzes
✔ Auto scoring
✔ View submitted results

🏗️ Tech Stack
Backend:

Node.js

Express.js

SQLite3 (local DB)

JWT Authentication

Frontend:

HTML

CSS

JavaScript (Fetch API calls)

📌 Project Structure
Quiz/
 ├─ backend/               # API server code
 │   ├─ routes/            # API routes
 │   ├─ middleware/        # Auth middleware
 │   ├─ quiz.db            # SQLite database
 │   └─ index.js           # server entry
 │
 ├─ pages/                 # frontend UI screens
 ├─ css/                   # styling
 ├─ index.html             # redirects UI to login
 ├─ README.md              # documentation
└─ package.json

⚙️ Installation & Setup
🔹 1️⃣ Install Node.js (Required)

Download & install from
👉 https://nodejs.org/

🔹 2️⃣ Backend Setup

Open terminal in project folder:

cd backend
npm install
npm start


Expected output:

Server running on port 4000
SQLite database connected.


✔ Keep this terminal open — backend must stay running.

🔹 3️⃣ Run Frontend

Just open index.html

Double-click it
OR

Run:

open index.html


Browser opens → redirects to login page.

🔑 Default Login Credentials
Teacher
Email: test@example.com
Password: 123456


If not created, register a teacher using signup screen.

📌 API Test (Optional for developers)

Example curl request (login):

curl -X POST http://localhost:4000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"123456"}'

📊 Database Used

✔ SQLite
📌 backend/quiz.db auto-creates on first run.

Tables:

users

quizzes

questions

responses

📌 Notes

✔ Works on Windows, Mac & Linux
✔ No external DB needed
✔ Node.js + SQLite = lightweight project

✨ Screenshots (Add yours)

➡ Login page
➡ Teacher dashboard
➡ Student quiz UI

👨‍💻 Developer Guide

Want to extend?

Suggested improvements:

✔ Add admin dashboard
✔ Add quiz timer
✔ Add MCQ UI polish
✔ Export results
✔ Deploy on render/railway

🤝 Contributing

Pull requests welcome.

📄 License

MIT License — free to use & upgrade.

🎉 Done!

Now steps to push git:

1️⃣ Create repo on GitHub
2️⃣ in terminal:
git init
git add .
git commit -m "Initial Quiz project"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main