/**
 * This script is the main content script used by ThreatSlayer. It is
 * executed every time the user visits a page.
 */

/**
 * This function handles the response from the API. If the response
 * indicates that a URL is malicious, the user will be prompted 
 * in a new window. If the URL is *not* malicious,
 * a console message will be logged. If the API is unresponsive, or
 * fails to provide a response for some other reason, a console 
 * message will be logged. 
 *
 * @param {} response - the response from the API, an object with an attribute of `malicious`
 */

// TODO clean up commented cruft here
// function handleAPIResponse() {
function handleAPIResponse(response) {
    let { href } = window.location;
    chrome.runtime.sendMessage({
        action: "displayWarningBanner",
        url: href
    });

    // if (response === null) {
    //     console.log(`API Unresponsive. Cannot verify safety of URL ${url} .`);
    // } else if (response.malicious === false) {
    //     console.log(`URL ${url} not classified as malicious.`);
    // } else if (response.malicious === true) {
    //     chrome.runtime.sendMessage({
    //         action: "displayWarningBanner",
    //         url: url
    //     });
}

/**
 * This function returns the current URL.
 */
function getFormattedUrl() {
    return window.location.href;
}

/**
 * Due to security concerns in content scripts, Chrome requires us to
 * execute cross-origin XHR using a service worker. Therefore, we send
 * a message to our service worker, which then performs the request,
 * and asynchronously provides a response.
 */
chrome.runtime.sendMessage(
    { contentScriptQuery: "queryURL", url: getFormattedUrl() },
    function (response) {
        if (response !== undefined && response !== "") {
            handleAPIResponse(response);
        } else {
            handleAPIResponse(null);
        }
    });

