/**
 * This script is the main content script used by ThreatSlayer. It is
 * executed every time the user visits a page.
 */

/**
 * This function handles the response from the API. If the response
 * indicates that a URL is malicious, the user will be prompted
 * in a new window. If the URL is *not* malicious, a console
 * message will be logged. If the API is unresponsive, or fails
 * to provide a response for some other reason, a console
 * message will be logged.
 *
 * @param {Object} response - the response from the API, an object with an attribute of `malicious`
 * @param {boolean} response.malicious - 'true' if URL is potentially malicious, 'false' if not
 */

function handleAPIResponse(response) {
    let { href: url } = window.location;

    if (response === null) {
        console.log(`API Unresponsive. Cannot verify safety of URL ${url} .`);
    } else if (response.malicious === false) {
        console.log(`URL ${url} not classified as malicious.`);
    } else if (response.malicious === true) {
        chrome.runtime.sendMessage({
            action: 'displayWarningBanner',
            url
        });
    }
}

/**
 * Due to security concerns in content scripts, Chrome requires us to
 * execute cross-origin XHR using a service worker. Therefore, we send
 * a message to our service worker, which then performs the request,
 * and asynchronously provides a response.
 */
chrome.runtime.sendMessage(
    { action: 'queryURL', url: window.location.href },
    function (response) {
        if (response !== undefined && response !== '') {
            handleAPIResponse(response);
        } else {
            handleAPIResponse(null);
        }
    });
