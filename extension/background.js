chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SCAN_URL") {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const url = tabs[0].url;

      fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })
      .then(res => res.json())
      .then(data => {
        chrome.storage.local.set({ securityStatus: data.status });
        sendResponse(data);
      })
      .catch(err => {
        console.error(err);
        sendResponse({ status: "UNKNOWN" });
      });
    });

    return true; // VERY IMPORTANT
  }
});

