const API = "https://quizapp-ag92.onrender.com";

async function api(endpoint, method = "GET", data = null) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const config = { method, headers };
    if (data) config.body = JSON.stringify(data);
    const res = await fetch(API + endpoint, config);
    return res;
}

function ensureToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'pages/login.html';
        return false;
    }
    return true;
}

function ensureRole(role) {
    if (!ensureToken()) return false;
    const userRole = localStorage.getItem('role');
    if (userRole !== role) {
        window.location.href = 'pages/login.html';
        return false;
    }
    return true;
}

function ensureStudent() { return ensureRole('student'); }
function ensureTeacher() { return ensureRole('teacher'); }
function ensureAuthenticated() { return ensureToken(); }
