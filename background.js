chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (!tab.url) return;

    const url = new URL(tab.url);
    const domain = url.hostname.replace(/^www\./, "");

    console.log("[INFO] Extracted domain:", domain);

    const username = "info@quiksrch.com";
    const password = "qojbI2-vovmoz-vohmen";
    const authHeader = "Basic " + btoa(username + ":" + password);
    const apiUrl = "https://xszc-5na3-dmnm.n2.xano.io/api:0E8zS8aD/idn_checks?domain_input=" + encodeURIComponent(domain);

    console.log("[INFO] Querying Xano with:", apiUrl);

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Accept": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("[DEBUG] Raw response:", data);

        let row = null;
        if (Array.isArray(data)) row = data[0];
        else if (data.items && Array.isArray(data.items)) row = data.items[0];
        else if (typeof data === "object" && data !== null && !data.code) row = data;

        let score = null;
        let color = "green";

        if (row && row.confusables_score !== undefined) {
          score = row.confusables_score;
          color = score > 0.5 ? "red" : "green";
        }

        console.log(`[INFO] Score: ${score} → Icon: ${color.toUpperCase()}`);

        chrome.action.setIcon({
          tabId: activeInfo.tabId,
          path: {
            "16": `icon-${color}.png`,
            "48": `icon-${color}.png`,
            "128": `icon-${color}.png`
          }
        });
      })
      .catch(err => {
        console.error("[ERROR] Query failed:", err);
        console.log("[INFO] Defaulting to icon GREEN.");
        chrome.action.setIcon({
          tabId: activeInfo.tabId,
          path: {
            "16": "icon-green.png",
            "48": "icon-green.png",
            "128": "icon-green.png"
          }
        });
      });
  });
});