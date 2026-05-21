let userTodos = [];
let currentFilter = "all";

function getFilteredUserTodos() {
  return userTodos.filter((todo) => {
    if (currentFilter === "active") return todo.status === "PENDING";
    if (currentFilter === "done") return todo.status === "COMPLETED";
    return true;
  });
}

function renderUserTodos() {
  const list = document.getElementById("todoLists");
  const filtered = getFilteredUserTodos();
  list.innerHTML = "";
  updateFooterCount("footerCount", filtered.length);

  if (filtered.length === 0) {
    list.innerHTML = `<p class="mono text-[13px] text-[#484f58] px-4 py-6 text-center">No todos yet. Add one above.</p>`;
    return;
  }

  filtered.forEach((todo) => {
    const done = todo.status === "COMPLETED";
    const item = document.createElement("div");
    item.className =
      "todo-row animate-item-in flex items-start gap-3 px-4 py-3.5 border-b border-[#21262d] last:border-b-0 hover:bg-[#1c2128] transition";
    item.dataset.id = todo.id;
    item.innerHTML = `
      <button type="button" class="toggle-btn mt-0.5 shrink-0 w-4.5 h-4.5 rounded border flex items-center justify-center transition cursor-pointer ${
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
      <button type="button" class="delete-btn shrink-0 p-1.5 rounded-md text-[#484f58] hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer" aria-label="Delete todo">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    `;

    item.querySelector(".toggle-btn").addEventListener("click", () =>
      toggleTodoStatus(todo)
    );
    item.querySelector(".delete-btn").addEventListener("click", () =>
      deleteUserTodo(todo.id)
    );
    list.appendChild(item);
  });
}

async function fetchTodos() {
  try {
    const { response, data } = await apiRequest(API_PATHS.todos, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      userTodos = Array.isArray(data) ? data : [];
      renderUserTodos();
    } else if (response.status === 401) {
      logout();
    } else {
      console.error(parseApiError(data, "Failed to fetch todos"));
    }
  } catch (err) {
    console.error("Network error:", err);
  }
}

async function addTodo() {
  const titleEl = document.getElementById("todoTitleU");
  const bodyEl = document.getElementById("todoBodyU");
  const title = titleEl.value.trim();
  const body = bodyEl.value.trim();

  if (!title) {
    titleEl.focus();
    return;
  }

  try {
    const { response, data } = await apiRequest(API_PATHS.todos, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, body: body || null, status: "PENDING" }),
    });

    if (response.ok) {
      titleEl.value = "";
      bodyEl.value = "";
      await fetchTodos();
    } else if (response.status === 401) {
      logout();
    } else {
      alert(parseApiError(data, "Failed to create todo."));
    }
  } catch {
    alert("Network error. Is the API running?");
  }
}

async function toggleTodoStatus(todo) {
  const newStatus = todo.status === "COMPLETED" ? "PENDING" : "COMPLETED";
  try {
    const { response, data } = await apiRequest(`${API_PATHS.todos}/${todo.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      await fetchTodos();
    } else if (response.status === 401) {
      logout();
    } else {
      alert(parseApiError(data, "Failed to update todo."));
    }
  } catch {
    alert("Network error.");
  }
}

async function deleteUserTodo(todoId) {
  if (!confirm("Delete this todo?")) return;
  try {
    const { response, data } = await apiRequest(`${API_PATHS.todos}/${todoId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      await fetchTodos();
    } else if (response.status === 401) {
      logout();
    } else {
      alert(parseApiError(data, "Failed to delete todo."));
    }
  } catch {
    alert("Network error.");
  }
}

function setFilter(filter, btn) {
  currentFilter = filter;
  setActiveFilterTab(btn);
  renderUserTodos();
}

async function clearDone() {
  const completed = userTodos.filter((t) => t.status === "COMPLETED");
  if (completed.length === 0) return;
  if (!confirm(`Delete ${completed.length} completed todo(s)?`)) return;

  for (const todo of completed) {
    const { response } = await apiRequest(`${API_PATHS.todos}/${todo.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (response.status === 401) {
      logout();
      return;
    }
  }
  await fetchTodos();
}

document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    window.location.href = "./login.html";
    return;
  }
  fetchTodos();
});
