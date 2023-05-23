/**
 * This is the main background script for ThreatSlayer.
 */
const APIKey = "threatslayer-api-key";
const baseAPIUrl = `https://octahedron.interlock.network`;
const betaBaseAPIUrl = `https://beta.octahedron.interlock.network`;
const defaultConfig = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: APIKey }),
};

/**
 * This listener is responsible for handling messages from content
 * scripts. It is invoked by script.js using
 * `chrome.runtime.sendMessage`.
 */

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let selectedBaseAPIUrl = baseAPIUrl;

    if (request.contentScriptQuery === "queryURL") {
        chrome.storage.local.get(["totalURLsVisited"]).then((result) => {
            let totalURLsVisited = result.totalURLsVisited || 0;
            totalURLsVisited++;

            chrome.storage.local
                .set({ totalURLsVisited: totalURLsVisited })
                .then(() => {
                    console.log(`Total URLs set to: ${totalURLsVisited}`);
                });
        });

        chrome.storage.sync.get("betaAISelected", function (data) {
            if (data.betaAISelected && data.betaAISelected === true) {
                console.log(
                    "Querying beta AI Threat Detection at",
                    betaBaseAPIUrl
                );
                selectedBaseAPIUrl = betaBaseAPIUrl;
            }

            fetch(`${selectedBaseAPIUrl}/malicious_p`, {
                ...defaultConfig,
                body: JSON.stringify({ key: APIKey, url: request.url }),
            })
                .then((response) => response.json())
                .then((response) => sendResponse(response))
                .catch((error) =>
                    console.log(`Error getting malicious URL: ${error}`)
                );
        });

        return true;
    } else if (request === "displayWarningBanner") {
        chrome.storage.local
            .get(["totalMaliciousURLsVisited"])
            .then((result) => {
                let totalMaliciousURLsVisited =
                    result.totalMaliciousURLsVisited || 0;
                totalMaliciousURLsVisited++;

                chrome.storage.local
                    .set({
                        totalMaliciousURLsVisited: totalMaliciousURLsVisited,
                    })
                    .then(() => {
                        console.log(
                            "Total malicious URLs set to:" +
                            totalMaliciousURLsVisited
                        );
                    });
            });

        // inject styling
        chrome.scripting.insertCSS({
            target: { tabId: sender.tab.id },
            files: ["banner.css"],
        });
        // execute script
        chrome.scripting
            .executeScript({
                target: { tabId: sender.tab.id },
                files: ["banner.js"],
            })
            .then((response) => sendResponse(response))
            .catch((error) => console.log(error));

        return true;
    }
});

// Called when the user clicks on the browser action.
chrome.action.onClicked.addListener(_tab => {
    // Send a message to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action" });
        chrome.tabs.create({ 'url': chrome.runtime.getURL("dashboard.html"), 'active': true });
    });
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
