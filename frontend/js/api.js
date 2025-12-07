export const BASE_URL = "https://quizapp-ag92.onrender.com";

export function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    };
}
