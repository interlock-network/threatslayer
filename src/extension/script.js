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
function handleAPIResponse(response) {
    let { href } = window.location;

    if (response === null) {
        console.log(`API Unresponsive. Cannot verify safety of URL ${href} .`);
    } else if (response.malicious === true) {
        console.log(`URL ${href} not classified as malicious.`);
    } else if (response.malicious === false) {
        chrome.runtime.sendMessage("displayWarningBanner");
    }
}

/**
 * This helper function removes parameters from URLs sent to pipeline,
 * in order to protect sensitive user info.
 * From https://stackoverflow.com/questions/12023430/regex-url-path-from-url
 * @param {} url - the complete URL string, including protocol and any params
 */
function removeParams(url) {
    const parser = document.createElement('a');
    parser.href = url;
    const {hostname, protocol, pathname} = parser;

    const result = `${protocol}//${hostname}${pathname}`;

    return result;
}

/**
 * Due to security concerns in content scripts, Chrome requires us to
 * execute cross-origin XHR using a service worker. Therefore, we send
 * a message to our service worker, which then performs the request,
 * and asynchronously provides a response.
 */
chrome.runtime.sendMessage(
    {contentScriptQuery: "queryURL", url: removeParams(window.location.href)},
    function (response) {
        if (response !== undefined && response !== "") {
            handleAPIResponse(response);
        } else {
            handleAPIResponse(null);
        }
    });

