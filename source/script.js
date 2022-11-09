/** This script is the main content script used by ThreatSlayer. It is
 * executed every time the user visits a page.
 */


/**
 * This function handles the response from the API. If the response
 * indicates that a URL is malicious, the user will be prompted, and
 * the page will be bordered with red. If the URL is *not* malicious,
 * a console message will be logged. If the API is unresponsive, or
 * fails to provide a response for some other reason, the page is
 * bordered in yellow to inform the user to proceed with caution.
 *
 * @param {} response - the response from the API, an object with an attribute of `malicious`
 */
function handleAPIResponse(response) {
    const { href = undefined } = window.location;
    if (response == null) {
        console.log(`API unresponsive. Cannot verify safety of: ${href}.`);
        document.body.style.border = "4px dashed yellow";
    } else if (response.malicious == false) {
        console.log(`URL ${href} not classified as malicious.`);
    } else if (response.malicious == true) {
        alert(`The URL you are visiting ${href} is potentially malicious! Proceed at your own risk.`);
        document.body.style.border = "4px dashed red";
    }
}

/**
 * Due to security concerns in content scripts, Chrome requires us to
 * execute cross-origin XHR using a service worker. Therefore, we send
 * a message to our service worker, which then performs the request,
 * and asynchronously provides a response.
 */
chrome.runtime.sendMessage(
    {contentScriptQuery: "queryURL", url: window.location.href},
    function (response) {
        if (response?.length) {
            handleAPIResponse(response);
        } else {
            handleAPIResponse(null);
        }
    });
