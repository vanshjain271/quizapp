# Update API Calls in Login/Signup/Dashboard Scripts

## Overview
Remove usage of res.json() since api() already returns parsed JSON. Change error handling to check data.error instead of res.ok.

## Steps to Complete
- [ ] Update frontend/login.html
- [ ] Update frontend/signup.html
- [ ] Update frontend/student/dashboards.html (loadQuizzes and loadMyQuizzes)
- [ ] Update frontend/student/dashboards_clean.html (loadQuizzes and loadMyQuizzes)
- [ ] Update frontend/student/myquizzes.html
- [ ] Update frontend/student/takequiz.html
- [ ] Update frontend/student/viewResults.html
- [ ] Update frontend/student/viewTest.html
- [ ] Update frontend/student/createquiz.html
- [ ] Update frontend/student/addQuestion.html
- [ ] Update frontend/teacher/dashboard.html
- [ ] Update frontend/teacher/createquiz.html
- [ ] Update frontend/teacher/viewResults.html
- [ ] Update frontend/teacher/viewTest.html
- [ ] Update frontend/teacher/addQuestion.html
- [ ] Test the changes
