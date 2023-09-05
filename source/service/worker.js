/**
 * This is the ThreatSlayer service-worker module.
 */

/**
 * Declare constants.
 */
const SURVEY_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeo1gW6Sg_ITlAXxbTXliQdab2qt1cLBzu45mXpz-XJ8O1KPg/viewform"
const RELEASE_NOTES_URL = "https://github.com/interlock-network/threatslayer/blob/master/docs/release_notes.md"
const API_KEY = "threatslayer-api-key";
const BASE_API_URL = `https://octahedron.interlock.network`;
const BETA_BASE_API_URL = `https://beta.octahedron.interlock.network`;
const DEFAULT_CONFIG = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: API_KEY }),
};

/**
 * This listener handles messages from content scripts.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let selectedBaseAPIUrl = BASE_API_URL;

    // initial url scan request from content script
    if (request.contentScriptQuery === "queryURL") {

        // first update local count of total urls visited by interlocker
        chrome.storage.local.get(["totalURLsVisited"]).then((result) => {
            let totalURLsVisited = result.totalURLsVisited || 0;
            totalURLsVisited++;
            chrome.storage.local
                .set({ totalURLsVisited: totalURLsVisited })
                .then(() => {
                    console.log(`Total URLs set to: ${totalURLsVisited}`);
                })
                .catch((error) => consol.log(`Error setting storage: ${error}`));
        });

        // then adjust scan endpoint to reflect beta option predicate
        chrome.storage.sync.get("betaAISelected", function (data) {
            if (data.betaAISelected && data.betaAISelected === true) {
                console.log("Querying beta AI Threat Detection at", BETA_BASE_API_URL);
                selectedBaseAPIUrl = BETA_BASE_API_URL;
            }

            // make the post request to octahedron
            fetch(`${selectedBaseAPIUrl}/malicious_p`,
                {...DEFAULT_CONFIG, body: JSON.stringify({ key: API_KEY, url: request.url })})
                .then((response) => response.json())
                .then((response) => sendResponse(response.malicious))
                .catch((error) => console.log(`Error getting malicious URL: ${error}`));
        });
    }
    
    // we wish to treat sendResponse asynchronously, thus we return 'true'
    return true;
});

/**
 * This listener opens our survey in a new tab when users uninstall.
 */
chrome.runtime.setUninstallURL(

    SURVEY_URL
);

/**
 * This listener opens the release notes in a new tab when users update the extension.
 */
chrome.runtime.onInstalled.addListener(function (details) {
    
    if (details.reason == "update") {
        chrome.tabs.create({
            url: RELEASE_NOTES_URL
        });
    }
});

