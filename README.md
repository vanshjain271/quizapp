Quiz Management System – Full Stack Project

A fully working quiz platform built for learning, portfolio showcase, and real usage.

✔️ Teacher & student roles
✔️ Authentication with JWT
✔️ Quiz creation & auto-scoring
✔️ SQLite storage
✔️ Browser UI + Node API backend
🚀 Features
👩‍🏫 Teacher Role

✔ Login / Signup
✔ Create quizzes
✔ Add questions
✔ View submitted results & scores

👨‍🎓 Student Role

✔ Login / Signup
✔ Attempt quizzes
✔ Auto-scoring
✔ View score history

🏗️ Tech Stack
🔹 Backend

Node.js

Express.js

SQLite

JWT Authentication

🔹 Frontend

HTML

CSS

JavaScript (Fetch API calls)

📌 Project Structure
quiz/
├── backend/             # API server
│   ├── routes/          # Endpoints
│   ├── middleware/      # Auth logic
│   ├── quiz.db          # SQLite database
│   └── index.js         # Server entry
│
├── pages/               # UI screens
├── css/                 # Styling
├── index.html           # Landing -> redirects login
├── README.md            # Documentation
└── package.json

⚙️ Installation & Setup
🔹 1️⃣ Install Node.js

Download → https://nodejs.org/

🔹 2️⃣ Backend Setup
cd backend
npm install
npm start


Expected output:

Server running on port 4000
SQLite database connected.


➡ Keep this terminal open – backend must stay running!

🔹 3️⃣ Run Frontend

Just open:

index.html


double-click

or open via VS Code Live Server

Frontend redirects to login automatically.

🔑 Default Credentials
👨‍🏫 Teacher Account

Email : test@example.com
Password : 123456

(or simply register a new teacher)

📌 API Test (Optional)

Example login request:

curl -X POST http://localhost:4000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"123456"}'

🗄️ Database

SQLite local — auto-generated file:

backend/quiz.db


Tables include:

users

quizzes

questions

responses

✨ Screenshot Section

(Add UI Pictures here)

Login page

Teacher dashboard

Student quiz UI

👨‍💻 Developer Ideas / Roadmap

✔ Admin role
✔ Quiz timer
✔ UI polish
✔ Export results
✔ Cloud deployment (Render / Railway)

🤝 Contributing

Pull requests welcome ✨

📄 License

MIT License — open for usage & improvement.

🔥 Git Push Instructions (for beginners)
git init
git add .
git commit -m "Initial Quiz project"
git branch -M main
git remote add origin https://github.com/your-repo.git
git push -u origin main
