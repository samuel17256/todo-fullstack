function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseApiError(data, fallback = "Request failed.") {
  if (!data) return fallback;
  const detail = data.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((e) => e.msg || JSON.stringify(e)).join(" ");
  }
  return fallback;
}

function showMsgBox(boxId, type, text, theme = "dark") {
  const box = document.getElementById(boxId);
  if (!box) return;
  if (theme === "light") {
    box.className =
      type === "success"
        ? "mt-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "mt-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2 bg-red-50 text-red-600 border border-red-200";
  } else {
    box.className =
      type === "success"
        ? "mt-4 px-4 py-3 rounded-xl text-[13px] flex items-center gap-2 bg-emerald-600/10 text-emerald-400 border border-emerald-600/25"
        : "mt-4 px-4 py-3 rounded-xl text-[13px] flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/25";
  }
  const icon =
    type === "success"
      ? `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
      : `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  box.innerHTML = `${icon}<span>${escapeHtml(text)}</span>`;
}

function setupPasswordToggle(toggleId = "togglePw", passwordId = "password") {
  const toggle = document.getElementById(toggleId);
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const pw = document.getElementById(passwordId);
    const show = document.getElementById("eyeShow");
    const hide = document.getElementById("eyeHide");
    if (!pw) return;
    const isHidden = pw.type === "password";
    pw.type = isHidden ? "text" : "password";
    show?.classList.toggle("hidden", isHidden);
    hide?.classList.toggle("hidden", !isHidden);
  });
}

function updateFooterCount(countElId, count, label = "tasks") {
  const el = document.getElementById(countElId);
  if (el) el.textContent = `${count} ${label}`;
}

function setActiveFilterTab(activeBtn) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active-tab", "text-[#e6edf3]");
    btn.classList.add("text-[#7d8590]");
  });
  activeBtn.classList.add("active-tab", "text-[#e6edf3]");
  activeBtn.classList.remove("text-[#7d8590]");
}
