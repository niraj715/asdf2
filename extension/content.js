(() => {
  const pageDomain = window.location.hostname;

  document.querySelectorAll("form").forEach(form => {
    const action = form.getAttribute("action");
    if (!action) return;

    const actionUrl = new URL(action, window.location.href);
    if (actionUrl.hostname !== pageDomain) {
      document.body.innerHTML = `
        <div style="
          position:fixed;
          inset:0;
          background:#8b0000;
          color:white;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          font-size:24px;
          z-index:999999;">
          🚨 PHISHING ALERT 🚨
          <p>This page tries to send your data to another domain.</p>
        </div>`;
    }
  });
})();
