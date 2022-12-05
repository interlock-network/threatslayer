/**
 * This is the main background script for Threatslayer.
 */
	const baseAPIUrl = `http://octahedron.interlock.network`;
    const APIKey = "threatslayer-api-key";

/**
 * This listener is responsible for handling messages from content
 * scripts. It is invoked by script.js using
 * `chrome.runtime.sendMessage`.
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.contentScriptQuery === "queryURL") {

            chrome.storage.local.get(["key"]).then((result) => {
                let totalURLsVisited = result.key || 0;
                totalURLsVisited++;
                chrome.storage.local.set({ key: totalURLsVisited }).then(() => {
                    console.log("Total URLs set to:" + totalURLsVisited);
                });
            });

            fetch("https://octahedron.interlock.network/malicious_p",
                {
                     method: 'POST',
                     headers: {
                         'Accept': 'application/json',
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify({key: APIKey,
                                           url: request.url})
                })
                .then(response => response.json())
                .then(response => sendResponse(response))
                .catch(error => console.log(error));

            return true;
        } else if (request === "displayWarningBanner") {
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
        if (request === "urls_scanned_count") {
            fetch(`https://octahedron.interlock.network/urls_scanned_count`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({key: APIKey})
                })
                .then(async response => {
                    const total = await response.text();

                    return total;
                })
                .then(response => sendResponse(response))
                .catch(error => {
                    console.log('error', error);
        
                    return 'Error';
                });

            return true;
        } else if (request === "malicious_urls_scanned_count") {
            fetch(`https://octahedron.interlock.network/malicious_urls_scanned_count`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({key: APIKey})
                })
                .then(async response => {
                    const total = await response.text();

                    return total;
                })
                .then(response => sendResponse(response))
                .catch(error => {
                    console.log('error', error);
        
                    return 'Error';
                });

            return true;
        }
    });
    
        
