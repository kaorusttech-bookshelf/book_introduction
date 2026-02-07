const grid = document.getElementById("grid");
const tabs = document.querySelectorAll(".tab");

let allWorks = [];
let currentFilter = "long";

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

// URLはHTMLエスケープだけでも最低限OK（自分で管理する前提）
function safeAttr(str) {
  return escapeHtml(str ?? "");
}

function render() {
  const items = allWorks.filter(w =>
    currentFilter === "all" ? true : w.type === currentFilter
  );

  grid.innerHTML = items.map(w => `
    <article class="card">
      ${w.statusLabel ? `
        <span class="status-badge"
              style="background:${escapeHtml(w.statusColor || "#64748b")}">
          ${escapeHtml(w.statusLabel)}
        </span>
      ` : ""}

      <h2>${escapeHtml(w.title)}</h2>

      ${w.catch ? `
        <p class="catch"
           style="color:${escapeHtml(w.catchColor || "#7aa2ff")}">
          ${escapeHtml(w.catch)}
        </p>
      ` : ""}

      <p class="desc">${escapeHtml(w.desc || "")}</p>

      <div class="links">
        ${(w.links || []).map(l => `
          <a href="${safeAttr(l.url)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(l.label)}
          </a>
        `).join("")}
      </div>
    </article>
  `).join("");
}

tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

fetch("./works.json")
  .then(r => r.json())
  .then(data => {
    allWorks = data;
    render();
  })
  .catch(() => {
    grid.innerHTML = "<p>読み込み失敗。works.jsonある？</p>";
  });
