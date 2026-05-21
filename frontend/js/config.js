/** Deployed API on Render. Override in dev: localStorage.setItem('TODO_API_BASE', 'http://localhost:8000') */
const DEFAULT_API_BASE = "https://todo-api-dre8.onrender.com";

function getApiBaseUrl() {
  const override = localStorage.getItem("TODO_API_BASE");
  if (override) return override.replace(/\/$/, "");
  return DEFAULT_API_BASE;
}

const API_PATHS = {
  register: "/api/v1/auth/register",
  login: "/api/v1/auth/login",
  todos: "/api/v1/todos",
  guestTodos: "/api/v1/guest/todos",
};
