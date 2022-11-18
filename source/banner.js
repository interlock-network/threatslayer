// INTERLOCK NETWORK - THREATSLAYER BROWSER EXTENSION
//
// This script is injected into website if url is found to be malicious.
//
(function() {
    // create elements
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
    image.id = 'icon48';
    // generate logo URL
    imageURL = chrome.runtime.getURL('icon48.png');
    image.setAttribute('src', imageURL);
    // warning banner title
    bannerTitle.appendChild(
        document.createTextNode(
        "THREATSLAYER ALERT!"
    ));
    // warning banner text
    bannerText.appendChild(
        document.createTextNode(
        "This website may be malicious. Close this tab unless you know the site is safe."
    ));
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
})();
