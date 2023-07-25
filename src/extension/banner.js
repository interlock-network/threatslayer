/**
 * This script is injected into website if url is found to be malicious.
 */
(function () {
    // create elements
    const body = document.body;
    const bannerWrapper = document.createElement('div');
    const box = document.createElement('canvas');
    const boxWrapper = document.createElement('div');
    const banner = document.createElement('div');
    const textBox = document.createElement('div');
    const image = document.createElement('img');
    const bannerTitle = document.createElement('p');
    const bannerText = document.createElement('p');
    const warning = document.createElement('p');
    const button = document.createElement('button');

    // link elements to stylesheet
    bannerWrapper.id = 'warningbanner-wrapper';
    box.id = 'box';
    banner.id = 'warningbanner';
    textBox.id = 'text-box';
    image.id = 'threatslayer_logo';
    warning.id = 'warning';
    bannerTitle.class = 'warningbanner-text';
    bannerText.class = 'warningbanner-text';
    button.id = 'dismiss-button';

    // add background image
    backgroundImageURL = chrome.runtime.getURL('grid_background.png');
    banner.style.background = `url(${backgroundImageURL}) repeat`;

    // generate logo URL
    imageURL = chrome.runtime.getURL('threatslayer_logo.png');
    image.setAttribute('src', imageURL);

    // "Warning!" / "This website may be malicious." / "Close the tab unless you know this site is safe!"
    warning.appendChild(document.createTextNode(chrome.i18n.getMessage("warning")));
    bannerTitle.appendChild(document.createTextNode(chrome.i18n.getMessage("warning_header")));
    bannerText.appendChild(document.createTextNode(chrome.i18n.getMessage("warning_text")));

    // "Trust This Site" button
    button.innerHTML = '<span id="dismiss-button-text">Trust This Site</span>';

    // build banner and underlying box
    banner.appendChild(image);
    banner.append(textBox);
    textBox.appendChild(warning);
    textBox.appendChild(bannerTitle);
    textBox.appendChild(bannerText);
    textBox.appendChild(button);
    bannerWrapper.appendChild(banner);
    boxWrapper.appendChild(box);

    // insert box and banner into page
    body.insertBefore(bannerWrapper, body.childNodes[0]);
    body.insertBefore(boxWrapper, body.childNodes[0]);

    // on click to close banner, remove banner and box
    button.onclick = function () {
        chrome.storage.local.get(["allowlist"]).then((result) => {
            const allowlist = result.allowlist || [];
            const currentURL = document.URL;

            if (!allowlist.includes(currentURL)) {
                allowlist.push(currentURL);
                console.log(`Adding ${currentURL} to allowlist`);

                chrome.storage.local.set({ allowlist }).then(() => {
                    body.removeChild(bannerWrapper);
                    body.removeChild(boxWrapper);
                })
            } else {
                body.removeChild(bannerWrapper);
                body.removeChild(boxWrapper);
            }
        });
    };
})();
