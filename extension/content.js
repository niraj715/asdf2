// PhishGuard AI — AUTOMATIC DETECTION & BLOCKING
// This runs automatically on every page load

(function () {
  if (!location.href.startsWith("http")) return;

  // Avoid running twice
  if (window.__PHISHGUARD_RAN__) return;
  window.__PHISHGUARD_RAN__ = true;

  fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: location.href })
  })
    .then(res => res.json())
    .then(data => {
      if (!data || !data.status) return;

      if (data.status === "RED") {
        enforceBlock();
      } else if (data.status === "YELLOW") {
        showYellowWarning();
      }
      // GREEN → do nothing
    })
    .catch(() => {
      // Fail silently (never break browsing)
    });
})();

/* ===================== RED: FULL BLOCK ===================== */

function enforceBlock() {
  lockInteractions();
  showRedOverlay();
}

function lockInteractions() {
  const block = e => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  document.addEventListener("click", block, true);
  document.addEventListener("submit", block, true);
  document.addEventListener("keydown", block, true);

  document.querySelectorAll("a").forEach(a => {
    a.removeAttribute("href");
    a.style.pointerEvents = "none";
    a.style.cursor = "not-allowed";
  });

  document.querySelectorAll("button, input, textarea, select").forEach(el => {
    el.disabled = true;
  });
}

function showRedOverlay() {
  if (document.getElementById("phishguard-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "phishguard-overlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(176, 0, 32, 0.97);
    color: white;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: Arial, sans-serif;
    padding: 40px;
  `;

  overlay.innerHTML = `
    <div style="max-width:520px;">
      <h1>⚠️ Phishing Website Blocked</h1>
      <p style="font-size:16px;line-height:1.4;">
        This website has been identified as a phishing attempt.<br>
        All interactions are disabled to protect you.
      </p>

      <button id="phishguard-leave" style="
        margin-top:20px;
        background:white;
        color:#b00020;
        border:none;
        padding:12px 20px;
        font-size:14px;
        font-weight:bold;
        border-radius:6px;
        cursor:pointer;
      ">
        Leave this website
      </button>

      <p style="font-size:12px;opacity:0.8;margin-top:16px;">
        PhishGuard AI · Local Machine Learning Protection
      </p>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("phishguard-leave").onclick = () => {
    window.location.href = "https://www.google.com";
  };
}

/* ===================== YELLOW: WARNING ===================== */

function showYellowWarning() {
  if (document.getElementById("phishguard-warning")) return;

  const banner = document.createElement("div");
  banner.id = "phishguard-warning";
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: orange;
    color: black;
    z-index: 2147483646;
    padding: 12px;
    font-family: Arial, sans-serif;
    font-weight: bold;
    text-align: center;
  `;

  banner.textContent =
    "⚠️ Suspicious website detected. Avoid entering credentials.";

  document.body.appendChild(banner);
}
