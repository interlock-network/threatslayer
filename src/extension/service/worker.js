/**
 * This is the main background script for ThreatSlayer.
 */
const allowlistAPIUrl = 'https://galactus.interlock.network/allowlist-add'
const baseAPIUrl = 'https://galactus.interlock.network';
// const betaBaseAPIUrl = 'https://beta.octahedron.interlock.network';
const surveyUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeo1gW6Sg_ITlAXxbTXliQdab2qt1cLBzu45mXpz-XJ8O1KPg/viewform';
const releaseNotes = 'https://github.com/interlock-network/threatslayer/blob/master/docs/release_notes.md';
const defaultConfig = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};

/**
 * This listener is responsible for handling messages from content
 * scripts. It is invoked by script.js using `chrome.runtime.sendMessage`.
 * @param {Object} request - the error object returned by Axios
 * @param {string} request.action - one of: allowlistUrl, clearMaliciousUrlObject, displayWarningBanner, queryURL, stakeUrl
 * @param {string} request.url - stringified URL with protocol, i.e. 'https://www.yahoo.com/'
 * @param {Object} sender - the error object returned by Axios
 * @param {Object} sender.tab - an object including the tab's numeric ID
 * @param {Number} sender.tab.id - unique ID number for a tab
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const { action, url } = request;
    const { tab: { id: tabId } } = sender;
    let selectedBaseAPIUrl = baseAPIUrl;

    if (action === 'allowlistUrl') {
        chrome.storage.local.get('apiKey').then((result) => {
            const key = result.apiKey;

            // bail if user has no personal API key i.e. is logged out
            if (key?.length) {
                try {
                    fetch(allowlistAPIUrl, {
                        ...defaultConfig,
                        body: JSON.stringify({ key, url })
                    });
                    console.log(`URL ${url} added to allowlist`);
                } catch (error) {
                    console.log(`Error sending allowlisted URL ${url} to server: ${error}`);
                }
            }
        });
    } else if (action === 'clearMaliciousUrlObject') {
        // clears '!!' and red background from ThreatSlayer logo
        chrome.action.setBadgeBackgroundColor({ tabId, color: '' })
        chrome.action.setBadgeText({ tabId, text: '' });

        chrome.storage.local.get('maliciousUrlObjects').then((result) => {
            const { maliciousUrlObjects = [] } = result;
            const maliciousUrlRemoved = maliciousUrlObjects.filter(maliciousUrlObject => maliciousUrlObject.tabId === tabId)[0].url;
            const newMaliciousUrlObjects = maliciousUrlObjects.filter(maliciousUrlObject => maliciousUrlObject.tabId !== tabId);

            chrome.storage.local
                .set({ maliciousUrlObjects: newMaliciousUrlObjects })
                .then(() => {
                    console.log(`Removed ${maliciousUrlRemoved} from malicious URL queue.`);
                });
        });
    } else if (action === 'displayWarningBanner') {
        chrome.storage.local.get('allowlist').then((result) => {
            const allowlist = result.allowlist || [];

            // bail condition
            if (allowlist?.includes(url)) {
                console.log(`URL allowlisted by user: ${url}`);

                return;
            }

            // add '!!' and a red background to the ThreatSlayer icon
            chrome.action.setBadgeBackgroundColor({ tabId, color: '#FF0000' });
            chrome.action.setBadgeText({ tabId, text: '!!' });

            chrome.storage.local.get('maliciousUrlObjects').then((result) => {
                const { maliciousUrlObjects = [] } = result;

                const addMaliciousUrl = !maliciousUrlObjects.length
                    || !maliciousUrlObjects.map(urlObject => urlObject.url).includes(url);

                if (addMaliciousUrl) {
                    const newMaliciousUrlObjects = [...maliciousUrlObjects, { tabId, url }];

                    chrome.storage.local
                        .set({ maliciousUrlObjects: newMaliciousUrlObjects })
                        .then(() => {
                            console.log(`Added ${url} to malicious URL queue.`);
                        });
                }
            });

            chrome.storage.local.get('totalMaliciousURLsVisited').then((result) => {
                const totalMaliciousURLsVisited = result.totalMaliciousURLsVisited || 0;
                const newTotalMaliciousURLsVisited = totalMaliciousURLsVisited + 1;

                chrome.storage.local
                    .set({ totalMaliciousURLsVisited: newTotalMaliciousURLsVisited })
                    .then(() => {
                        console.log(`Total malicious URLs set to: ${totalMaliciousURLsVisited}`);
                    });
            });

            // execute script
            try {
                chrome.scripting
                    .executeScript({
                        target: { tabId },
                        files: ['banner.js']
                    })
                    .then((response) => sendResponse(response));
            } catch (err) { console.log(`Error in sendingResponse(): ${err}`); }
        });
    }
    else if (action === 'queryURL') {
        chrome.storage.local.get('totalURLsVisited').then((result) => {
            const totalURLsVisited = result.totalURLsVisited || 0;
            const newTotalURLsVisited = totalURLsVisited + 1;

            chrome.storage.local
                .set({ totalURLsVisited: newTotalURLsVisited })
                .then(() => { console.log(`Total URLs set to: ${newTotalURLsVisited}`); });
        });

        chrome.storage.local.get('apiKey').then((result) => {
            const body = { url };
            const key = result.apiKey;

            if (key?.length) {
                body.key = key;
            }

            fetch(`${selectedBaseAPIUrl}/malicious-p`, {
                ...defaultConfig,
                body: JSON.stringify(body)
            })
                .then((response) => response.json())
                .then((response) => {
                    sendResponse(response);
                })
                .catch((error) => { console.log(`Error getting malicious URL: ${error}`) });
        });

        return true;
    } else if (action === 'stakeUrl') {
        const urlToStake = request.url;

        chrome.storage.local.set({ urlToStake }).then(() => {
            console.log(`URL to stake set to: ${urlToStake}`);

            chrome.tabs.create({ 'url': chrome.runtime.getURL('index.html'), 'active': true });
        });
    }
});

/**
 * This listener opens our survey in a new tab when users uninstall
 */
chrome.runtime.setUninstallURL(surveyUrl);

/**
 * This listener opens the release notes in a new tab when users update the extension
 */
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == 'update') {
        chrome.tabs.create({ url: releaseNotes });
    }
});

/**
 * This listener opens up our extension page when the user clicks on the pin
 */
chrome.action.onClicked.addListener(() => {
    // Send a message to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];

        chrome.tabs.sendMessage(activeTab.id, { 'message': 'clicked_browser_action' });
        chrome.tabs.create({ 'url': chrome.runtime.getURL('index.html'), 'active': true });
    });
});
