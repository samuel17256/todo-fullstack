function setLoginError(inputId, errId, show) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  err?.classList.toggle("show", show);
  if (input) {
    if (show) {
      input.classList.remove("border-[#30363d]");
      input.classList.add("border-red-500/60");
    } else {
      input.classList.add("border-[#30363d]");
      input.classList.remove("border-red-500/60");
    }
  }
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  let valid = true;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setLoginError("email", "err-email", true);
    valid = false;
  } else setLoginError("email", "err-email", false);

  if (!password) {
    setLoginError("password", "err-pw", true);
    valid = false;
  } else setLoginError("password", "err-pw", false);

  if (!valid) return;

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  btn.classList.add("loading");
  document.getElementById("msgBox").className = "hidden";

  try {
    const { response, data } = await apiRequest(API_PATHS.login, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.ok && data?.access_token) {
      localStorage.setItem("token", data.access_token);
      showMsgBox("msgBox", "success", "Signed in successfully! Redirecting...");
      setTimeout(() => (window.location.href = "./dashboard.html"), 1000);
    } else {
      showMsgBox("msgBox", "error", parseApiError(data, "Invalid email or password."));
    }
  } catch {
    showMsgBox("msgBox", "error", "Network error. Check your connection and try again.");
  } finally {
    btn.disabled = false;
    btn.classList.remove("loading");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (isLoggedIn()) {
    window.location.href = "./dashboard.html";
    return;
  }
  setupPasswordToggle();
  ["email", "password"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", () => {
      const errMap = { email: "err-email", password: "err-pw" };
      setLoginError(id, errMap[id], false);
    });
  });
  document.getElementById("submitBtn")?.addEventListener("click", login);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") login();
  });
});
