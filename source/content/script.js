/**
 * This is the main content script used by ThreatSlayer. It is
 * executed every time the user visits a page.
 */

/**
 * Upon page load in new (or old) tab, initiate url scan call from service worker.
 * If malicious_p, then inject warning banner.
 */
chrome.runtime.sendMessage(
    {contentScriptQuery: "queryURL", url: removeParams(window.location.href)},
    (malicious_p) => {

    url = removeParams(window.location.href);

    // process return predicate
    if (malicious_p == false) {
        console.log(`URL ${url} not classified as malicious.`);
    } else if (malicious_p == true) {
        console.log(`URL ${url} is classified as malicious.`);
        loadBannerCSS()
        loadBannerScript()
    } else {
        console.log(`API Unresponsive. Cannot verify safety of URL ${url} .`);
    }
});

/**
 * This function injects the warning banner styling if malicious_p returns 'true'
 */
function loadBannerCSS() {
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = "malicious_p_banner";
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL("/static/style/banner.css")
    link.media = 'all';
    head.appendChild(link);
}

/**
 * This function injects the warning banner script if malicious_p returns 'true'
 */
function loadBannerScript() {
    
    // adding the script element to the head as suggested before
    var body = document.body;
    var image = document.createElement('img');
    var bannerWrapper = document.createElement('div');
    var box = document.createElement('canvas');
    var boxWrapper = document.createElement('div');
    var banner = document.createElement('div');
    var bannerTitle = document.createElement('p');
    var bannerText = document.createElement('p');
    var closeButton = document.createElement('a');

    // link elements to stylesheet
    bannerWrapper.id = 'warningbanner-wrapper';
    box.id = 'box';
    banner.id = 'warningbanner';
    bannerTitle.id = 'warningbanner-text';
    bannerText.id = 'warningbanner-text';
    closeButton.id = "warningbanner-close";
    image.id = 'hand48';

    // generate logo URL
    imageURL = chrome.runtime.getURL('/static/images/hand48.png');
    image.setAttribute('src', imageURL);

    // warning banner title and text
    bannerTitle.appendChild(document.createTextNode(chrome.i18n.getMessage("warning_header")));
    bannerText.appendChild(document.createTextNode(chrome.i18n.getMessage("warning_text")));

    // build banner and underlying box
    banner.appendChild(image);
    banner.appendChild(bannerTitle);
    banner.appendChild(bannerText);
    banner.appendChild(closeButton);
    bannerWrapper.appendChild(banner);
    boxWrapper.appendChild(box);

    // insert box and banner into page
    body.insertBefore(bannerWrapper, body.childNodes[0]);
    body.insertBefore(boxWrapper, body.childNodes[0]);

    // on click to close banner, remove banner and box
    closeButton.onclick = function() {
        body.removeChild(bannerWrapper);
        body.removeChild(boxWrapper);
    };
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
