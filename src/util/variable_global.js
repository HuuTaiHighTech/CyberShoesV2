export const URL_API = "https://apistore.cybersoft.edu.vn";
export const TOKEN_CYBERSOFT = "";

// Thay bằng link MockAPI của bạn (resource tên "users")
export const API_URL = "https://xxxxxxxx.mockapi.io/api";

const USER_KEY = "userLogin";

export const saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem(USER_KEY));
export const clearUser = () => localStorage.removeItem(USER_KEY);