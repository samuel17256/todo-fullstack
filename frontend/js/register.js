function setRegisterError(inputId, errId, show) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  err?.classList.toggle("show", show);
  if (input) {
    if (show) {
      input.classList.remove("border-gray-200", "bg-gray-50");
      input.classList.add("border-red-400", "bg-red-50");
    } else {
      input.classList.remove("border-red-400", "bg-red-50");
      input.classList.add("border-gray-200", "bg-gray-50");
    }
  }
}

async function register() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  let valid = true;
  setRegisterError("firstName", "err-first", !firstName);
  setRegisterError("lastName", "err-last", !lastName);
  if (!firstName) valid = false;
  if (!lastName) valid = false;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setRegisterError("email", "err-email", true);
    valid = false;
  } else setRegisterError("email", "err-email", false);

  if (password.length < 8) {
    setRegisterError("password", "err-pw", true);
    valid = false;
  } else setRegisterError("password", "err-pw", false);

  if (!valid) return;

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  btn.classList.add("loading");
  document.getElementById("msgBox").className = "hidden";

  try {
    const { response, data } = await apiRequest(API_PATHS.register, {
      method: "POST",
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }),
    });

    if (response.ok) {
      localStorage.setItem("todoUser", JSON.stringify(data));
      showMsgBox("msgBox", "success", "Account created! Redirecting to sign in...", "light");
      setTimeout(() => (window.location.href = "./login.html"), 1500);
    } else {
      showMsgBox("msgBox", "error", parseApiError(data, "Registration failed."), "light");
    }
  } catch {
    showMsgBox("msgBox", "error", "Network error. Check your connection and try again.", "light");
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
  ["firstName", "lastName", "email", "password"].forEach((id) => {
    const errMap = {
      firstName: "err-first",
      lastName: "err-last",
      email: "err-email",
      password: "err-pw",
    };
    document.getElementById(id)?.addEventListener("input", () => {
      setRegisterError(id, errMap[id], false);
    });
  });
  document.getElementById("submitBtn")?.addEventListener("click", register);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") register();
  });
});
