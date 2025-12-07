# TODO: Migrate Backend to LowDB

## 1. Update package.json
- Remove better-sqlite3 from dependencies
- Add lowdb: ^7.0.1 and nanoid: ^4.0.2
- Update scripts to only have "start": "node index.js"

## 2. Update index.js
- Remove SQLite connection code
- Add lowdb initialization with JSONFile
- Initialize db.data with users, quizzes, questions, responses arrays
- Attach db and nanoid to app.locals

## 3. Update routes/auth.js
- Replace SQL INSERT for signup with db.data.users.push({ id: nanoid(), ... })
- Replace SQL SELECT for login with filtering db.data.users
- Handle unique email constraint manually

## 4. Update routes/quizzes.js
- Replace INSERT with push and write for creating quiz
- Replace SELECT with filtering for getting quizzes
- Replace DELETE with filtering out and write for deleting quiz and related questions/responses

## 5. Update routes/questions.js
- Replace INSERT with push and write for adding question
- Replace SELECT with filtering for getting questions
- Replace DELETE with filtering out and write for deleting question
- Handle JSON parsing for options

## 6. Update routes/responses.js
- Replace INSERT with push and write for submitting response
- Replace SELECT with filtering for getting responses
- Handle JSON parsing for answers
- Update scoring logic to use filtered data

## 7. Update routes/studentResponses.js
- Replace SELECT with filtering for getting user's responses
- Update scoring logic

## 8. Create backend/data/db.json
- Ensure the file is created with initial structure if missing

## 9. Test the changes
- Run the server and verify routes work
