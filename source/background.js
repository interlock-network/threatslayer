/**
 * This is the main background script for Threatslayer.
 */
const APIKey = "threatslayer-api-key";
const baseAPIUrl = `http://octahedron.interlock.network`;
const defaultConfig = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({key: APIKey})
};

/**
 * This listener is responsible for handling messages from content
 * scripts. It is invoked by script.js using
 * `chrome.runtime.sendMessage`.
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.contentScriptQuery === "queryURL") {
            chrome.storage.local.get(["totalURLsVisited"])
                .then((result) => {
                    let totalURLsVisited = result.totalURLsVisited || 0;
                    totalURLsVisited++;

                    chrome.storage.local.set({ "totalURLsVisited": totalURLsVisited })
                        .then(() => {
                            console.log(`Total URLs set to: ${totalURLsVisited}`);
                        });
                });

            fetch("https://octahedron.interlock.network/malicious_p",
                {
                    ...defaultConfig,
                    body: JSON.stringify({key: APIKey,
                        url: request.url})
                }
            )
                .then(response => response.json())
                .then(response => sendResponse(response))
                .catch(error => console.log(`Error getting malicious URL: ${error}`));

            return true;
        } else if (request === "displayWarningBanner") {
            chrome.storage.local.get(["totalMaliciousURLsVisited"])
                .then((result) => {
                    let totalMaliciousURLsVisited = result.totalMaliciousURLsVisited || 0;
                    totalMaliciousURLsVisited++;

                    chrome.storage.local.set({"totalMaliciousURLsVisited": totalMaliciousURLsVisited })
                        .then(() => {
                            console.log("Total malicious URLs set to:" + totalMaliciousURLsVisited);
                        });
                });

            // inject styling
            chrome.scripting.insertCSS(
                {
                    target: {tabId: sender.tab.id},
                    files: ["banner.css"]
                });
            // execute script
            chrome.scripting.executeScript(
                {
                    target: {tabId: sender.tab.id},
                    files: ["banner.js"]
                })
                .then(response => sendResponse(response))
                .catch(error => console.log(error));

            return true;
        }
    });

/**
 * This listener is responsible for getting KPIs from the pipeline.
 */
chrome.runtime.onMessage.addListener(
    function(request, _sender, sendResponse) {
        if (request === "malicious_urls_scanned_count") {
            fetch(`https://octahedron.interlock.network/malicious_urls_scanned_count`, defaultConfig)
                .then(async response => {
                    const total = await response.text();

                    return total;
                })
                .then(response => sendResponse(response))
                .catch(error => {
                    console.log(`Error getting malicious URL count: ${error}`);
                    
                    return 'Error';
                });

            return true;
        } else if (request === "urls_scanned_count") {
            fetch(`https://octahedron.interlock.network/urls_scanned_count`, defaultConfig)
                .then(async response => {
                    const total = await response.text();

                    return total;
                })
                .then(response => sendResponse(response))
                .catch(error => {
                    console.log(`Error getting URL scanned count: ${error}`);
                    
                    return 'Error';
                });

            return true;
        } else if (request === "user_count") {
            fetch(`https://octahedron.interlock.network/user_count`, defaultConfig)
                .then(async response => {
                    const total = await response.text();

                    return total;
                })
                .then(response => sendResponse(response))
                .catch(error => {
                    console.log(`Error getting user count: ${error}`);
                    
                    return 'Error';
                });

            return true;
        }
    });


/**
 * This listener opens our survey in a new tab when users uninstall
 */
chrome.runtime.setUninstallURL(
    'https://docs.google.com/forms/d/e/1FAIpQLSeo1gW6Sg_ITlAXxbTXliQdab2qt1cLBzu45mXpz-XJ8O1KPg/viewform',
);