const GUEST_DONE_KEY = "guestTodoDone";

let guestTodos = [];
let currentFilter = "all";

function getGuestDoneSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(GUEST_DONE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveGuestDoneSet(set) {
  localStorage.setItem(GUEST_DONE_KEY, JSON.stringify([...set]));
}

function isGuestTodoDone(id) {
  return getGuestDoneSet().has(id);
}

function setGuestTodoDone(id, done) {
  const set = getGuestDoneSet();
  if (done) set.add(id);
  else set.delete(id);
  saveGuestDoneSet(set);
}

function getFilteredGuestTodos() {
  const doneSet = getGuestDoneSet();
  return guestTodos.filter((todo) => {
    const done = doneSet.has(todo.id);
    if (currentFilter === "active") return !done;
    if (currentFilter === "done") return done;
    return true;
  });
}

function renderGuestTodos() {
  const list = document.getElementById("todoList");
  const filtered = getFilteredGuestTodos();
  list.innerHTML = "";
  updateFooterCount("footerCount", filtered.length);

  if (filtered.length === 0) {
    list.innerHTML = `<p class="mono text-[13px] text-[#484f58] px-4 py-6 text-center">No todos yet. Add one above.</p>`;
    return;
  }

  const doneSet = getGuestDoneSet();
  filtered.forEach((todo) => {
    const done = doneSet.has(todo.id);
    const item = document.createElement("div");
    item.className =
      "todo-row animate-item-in flex items-start gap-3 px-4 py-3.5 border-b border-[#21262d] last:border-b-0 hover:bg-[#1c2128] transition";
    item.innerHTML = `
      <button type="button" class="mt-0.5 shrink-0 w-4.5 h-4.5 rounded border flex items-center justify-center transition cursor-pointer ${
        done
          ? "bg-emerald-600 border-emerald-600"
          : "border-[#484f58] hover:border-emerald-500"
      }" aria-label="Toggle complete">
        ${done ? '<svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' : ""}
      </button>
      <div class="flex-1 min-w-0 ${done ? "opacity-50" : ""}">
        <p class="mono text-[13px] font-medium text-[#e6edf3] wrap-break-words ${done ? "line-through" : ""}">${escapeHtml(todo.title)}</p>
        ${todo.body ? `<p class="mono text-[12px] mt-1 text-[#7d8590] wrap-break-words">${escapeHtml(todo.body)}</p>` : ""}
      </div>
    `;
    item.querySelector("button").addEventListener("click", () => {
      setGuestTodoDone(todo.id, !done);
      renderGuestTodos();
    });
    list.appendChild(item);
  });
}

async function fetchGuestTodos() {
  try {
    const { response, data } = await apiRequest(API_PATHS.guestTodos, { method: "GET" });
    if (response.ok) {
      guestTodos = Array.isArray(data) ? data : [];
      renderGuestTodos();
    } else {
      console.error(parseApiError(data, "Failed to fetch guest todos"));
    }
  } catch (err) {
    console.error("Network error:", err);
  }
}

async function addGuestTodo() {
  const titleEl = document.getElementById("todoTitle");
  const bodyEl = document.getElementById("todoBody");
  const title = titleEl.value.trim();
  const body = bodyEl.value.trim();

  if (!title) {
    titleEl.focus();
    return;
  }

  try {
    const { response, data } = await apiRequest(API_PATHS.guestTodos, {
      method: "POST",
      body: JSON.stringify({ title, body: body || null }),
    });

    if (response.ok) {
      titleEl.value = "";
      bodyEl.value = "";
      await fetchGuestTodos();
    } else {
      alert(parseApiError(data, "Failed to create todo."));
    }
  } catch {
    alert("Network error. Is the API running?");
  }
}

function setFilter(filter, btn) {
  currentFilter = filter;
  setActiveFilterTab(btn);
  renderGuestTodos();
}

function clearDone() {
  const doneSet = getGuestDoneSet();
  if (doneSet.size === 0) return;
  saveGuestDoneSet(new Set());
  renderGuestTodos();
}

function setupMobileNav() {
  const btn = document.getElementById("navMenuBtn");
  const menu = document.getElementById("navMobileMenu");
  const iconOpen = document.getElementById("navIconOpen");
  const iconClose = document.getElementById("navIconClose");
  if (!btn || !menu) return;

  function setMenuOpen(open) {
    menu.classList.toggle("hidden", !open);
    menu.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    iconOpen?.classList.toggle("hidden", open);
    iconClose?.classList.toggle("hidden", !open);
  }

  btn.addEventListener("click", () => setMenuOpen(menu.classList.contains("hidden")));

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("hidden") && !btn.contains(e.target) && !menu.contains(e.target)) {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 768px)").matches) setMenuOpen(false);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileNav();
  if (isLoggedIn()) {
    window.location.href = "./dashboard.html";
  }
  fetchGuestTodos();
});
