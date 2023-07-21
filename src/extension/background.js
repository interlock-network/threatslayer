/**
 * This is the main background script for ThreatSlayer.
 */
const baseAPIUrl = `https://octahedron.interlock.network`;
const betaBaseAPIUrl = `https://beta.octahedron.interlock.network`;
const defaultConfig = {
    method: "POST",
    headers: { "Content-Type": "application/json" }
};

/**
 * This listener is responsible for handling messages from content
 * scripts. It is invoked by script.js using
 * `chrome.runtime.sendMessage`.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let selectedBaseAPIUrl = baseAPIUrl;
    const url = request.url;

    if (request.contentScriptQuery === "queryURL") {
        chrome.storage.local.get(["totalURLsVisited"]).then((result) => {
            let totalURLsVisited = result.totalURLsVisited || 0;
            totalURLsVisited++;

            chrome.storage.local
                .set({ totalURLsVisited })
                .then(() => { console.log(`Total URLs set to: ${totalURLsVisited}`); });
        });

        chrome.storage.sync.get("betaAISelected", async function (data) {
            if (data.betaAISelected && data.betaAISelected === true) {
                console.log("Querying beta AI Threat Detection at", betaBaseAPIUrl);
                selectedBaseAPIUrl = betaBaseAPIUrl;
            }

            chrome.storage.local.get(["key"]).then((result) => {
                const key = result.key || 'threatslayer-api-key';

                fetch(`${selectedBaseAPIUrl}/malicious_p`, {
                    ...defaultConfig,
                    body: JSON.stringify({ key, url })
                })
                    .then((response) => response.json())
                    .then((response) => sendResponse(response))
                    .catch((error) => { console.log(`Error getting malicious URL: ${error}`) });
            });
        });

        return true;
    } else if (request.action === "displayWarningBanner") {
        chrome.storage.local.get(["allowlist"]).then((result) => {
            const allowlist = result.allowlist || [];
            // bail condition
            if (allowlist.includes(url)) {
                console.log('URL allowlisted by user:', url);
                return;
            }

            try {
                chrome.storage.local
                    .get(["totalMaliciousURLsVisited"])
                    .then((result) => {
                        let totalMaliciousURLsVisited = result.totalMaliciousURLsVisited || 0;
                        totalMaliciousURLsVisited++;

                        try {
                            chrome.storage.local
                                .set({ totalMaliciousURLsVisited })
                                .then(() => {
                                    console.log(`Total malicious URLs set to: ${totalMaliciousURLsVisited}`);
                                });
                        } catch (err) {
                            console.log('Error in setting totalMaliciousURLsVisited:', err);
                        }
                    });
            } catch (err) { console.log('Error in getting totalMaliciousURLsVisited:', err); }

            // inject styling
            chrome.scripting.insertCSS({
                target: { tabId: sender.tab.id },
                files: ["banner.css"],
            });
            // execute script
            try {
                chrome.scripting
                    .executeScript({
                        target: { tabId: sender.tab.id },
                        files: ["banner.js"],
                    })
                    .then((response) => sendResponse(response));
            } catch (err) { console.log('Error in sendingResponse():', err); }

            return true;
        });
    }
});

/**
 * This listener opens our survey in a new tab when users uninstall
 */
chrome.runtime.setUninstallURL(
    "https://docs.google.com/forms/d/e/1FAIpQLSeo1gW6Sg_ITlAXxbTXliQdab2qt1cLBzu45mXpz-XJ8O1KPg/viewform"
);

/**
 * This listener opens the release notes in a new tab when users update the extension
 */
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "update") {
        chrome.tabs.create({ url: "https://github.com/interlock-network/threatslayer/blob/master/docs/release_notes.md" });
    }
});

/**
 * This listener opens up our extension page when the user clicks on the pin
 */
chrome.action.onClicked.addListener(() => {
    // Send a message to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let activeTab = tabs[0];

        chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action" });
        chrome.tabs.create({ 'url': chrome.runtime.getURL("index.html"), 'active': true });
    });
});
