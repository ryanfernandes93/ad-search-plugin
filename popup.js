function logMessage(msg) {
  const logsEl = document.getElementById("logs");
  logsEl.textContent += msg + "\n";
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    const domain = url.hostname.replace(/^www\./, "");

    logMessage("[INFO] Extracted domain: " + domain);

    chrome.runtime.sendMessage({ action: "checkDomain", domain }, (response) => {
      // Show simplified result
      document.getElementById("result").textContent =
        `Domain: ${domain}\nScore: ${response.score}\nIcon: ${response.color.toUpperCase()}`;

      // Show raw JSON response
      document.getElementById("raw").textContent = JSON.stringify(response.raw, null, 2);

      // Log summary
      logMessage("[INFO] Backend returned score: " + response.score);
      logMessage("[INFO] Icon color set to: " + response.color.toUpperCase());
    });
  });
});