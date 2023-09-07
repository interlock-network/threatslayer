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
    headers: { "Content-Type": "application/json", "mode": "no-cors" }, // no-cors??
    body: JSON.stringify({ key: API_KEY }),
};

/**
 * This listener handles messages from content scripts.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    let selectedBaseAPIUrl = BASE_API_URL;
    const url = request.url;

    // first update local count of total urls visited by interlocker
    if (request.message === 'scanURL') {
        chrome.storage.local.get('totalURLsVisited').then((result) => {
            let totalURLsVisited = result.totalURLsVisited || 0;
            totalURLsVisited++;

            chrome.storage.local
                .set({ totalURLsVisited })
                .then(() => { console.log(`Total URLs set to: ${totalURLsVisited}`); });
        });

    	// then adjust scan endpoint to reflect beta option predicate
        chrome.storage.sync.get('betaAISelected', async function (data) {
            if (data.betaAISelected && data.betaAISelected === true) {
                console.log('Querying beta AI Threat Detection at', BETA_BASE_API_URL);
                selectedBaseAPIUrl = BETA_BASE_API_URL;
            }

	        // make the post request to octahedron
            chrome.storage.local.get('apiKey').then((result) => {
                const key = result.apiKey || API_KEY;

                fetch(`${selectedBaseAPIUrl}/malicious_p`,
				    {...DEFAULT_CONFIG, body: JSON.stringify({ key, url })})
                    .then((response) => response.json())
                    .then((data) => {
		                if (data.malicious == false) {
            	            console.log(`URL ${url} classified as malicious.`);
	    			        sendResponse("DANGER");
	                    } else if (data.malicious == false) {
        		            console.log(`URL ${url} is not classified as malicious.`);
    		    		    sendResponse("SAFE");
	        	        } else {
		                    console.log(`API Unresponsive. Cannot verify safety of URL ${url} .`);
		                }
              	        return
				    })
                    .catch((error) => { console.log(`Error getting malicious URL: ${error}`) });
            });
        });

        return true;

    } else if (request.action === 'stakeUrl') {
        const urlToStake = request.url;

		// if interlocker intends to stake on webpage, handle that here
		// ???? I see no message pass operation from content script ???? is this still relevant?
        chrome.storage.local
            .set({ urlToStake })
            .then(() => {
                console.log(`URL to stake set to: ${urlToStake}`);
                chrome.tabs.create({ 'url': chrome.runtime.getURL('index.html'), 'active': true });
            });
    }
});

/**
 * This listener opens our survey in a new tab when users uninstall
 */
chrome.runtime.setUninstallURL(

    SURVEY_URL
);

/**
 * This listener opens the release notes in a new tab when users update the extension
 */
chrome.runtime.onInstalled.addListener(function (details) {

    if (details.reason == 'update') {
        chrome.tabs.create({ url: RELEASE_NOTES_URL });
    }
});

/**
 * This listener opens up our extension page when the user clicks on the pin
 */
chrome.action.onClicked.addListener(() => {

    // Send a message to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let activeTab = tabs[0];

        chrome.tabs.sendMessage(activeTab.id, { 'message': 'clicked_browser_action' });
        chrome.tabs.create({ 'url': chrome.runtime.getURL('index.html'), 'active': true });
    });
});
