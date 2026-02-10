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
        GREEN: "green",
        YELLOW: "orange",
        RED: "red"
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
