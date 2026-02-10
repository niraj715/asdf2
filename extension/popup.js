document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {

    if (!tabs || !tabs[0] || !tabs[0].url || !tabs[0].url.startsWith("http")) {
      document.getElementById("status").innerHTML =
        "<b style='color:gray'>UNSUPPORTED PAGE</b>";
      return;
    }

    const url = tabs[0].url;

    fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    })
    .then(res => res.json())
    .then(data => {
      const colors = {
        GREEN: "✅ Safe: You can proceed",
        YELLOW: "⚠️ Suspicious: Proceed with caution",
        RED: "⚠️ Warning: Do safe. Don't proceed"
      };

      document.getElementById("status").innerHTML =
        `<b style="color:${colors[data.status]}">${data.status}</b>`;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("status").innerHTML =
        "<b style='color:gray'>ERROR</b>";
    });
  });
});

// javascript is responsible for fetching the current active tab's URL and sending it to a local server for analysis. Based on the response, it updates the popup's status display with the appropriate color and message. If the page is unsupported or if there's an error during the fetch, it displays a corresponding message.