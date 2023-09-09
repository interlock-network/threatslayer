/**
 * This is the main content script used by ThreatSlayer. It is
 * executed every time the user visits a page.
 */

// init
let bannerWrapper, boxWrapper, googleButton, allowButton, stakeButton, closeButton;
const BANNER_CSS = "/assets/style/banner.css";
const SAFETY_ADDRESS = "https://google.com";
const SITE_UNLOCK_ENDPOINT = 'http://159.89.252.13/site-unlock/';

console.log("INTERLOCK NETWORK: THREATSLAYER IS ACTIVE ON THIS PAGE.");

/**
 * Due to security concerns in content scripts, Chrome requires us to
 * execute cross-origin XHR using a service worker. Therefore, we send
 * a message to our service worker, which then performs the request,
 * and asynchronously provides a response.
 *
 * (message only returns if url is calssified malicious)
 */
chrome.runtime.sendMessage({message: "scanUrl", url: removeParams(window.location.href)}, async function (response) {

    if (response == "DANGER") {
        console.log("THREATSLAYER ALERT: THIS A SUSPICIOUS OR KNOWN MALICIOUS WEBSITE.");

        loadBanner().then(result => {
            if (result == "staked") {
                chrome.runtime.sendMessage({
                    action: 'stakeUrl',
                    url: document.URL
                });
            }
        });
    } else {

        console.log("WEBSITE DEEMED SAFE OR UNKNOWN");
        return;
    }
});

/**
 * This injects banner if URL deemed malicious
 */
function loadBanner() {
    return new Promise(async (resolve) => {

        loadCSS();

        // cute as little buttons
        googleButton = document.createElement('button');
        googleButton.id = 'safety-button';
        googleButton.classList.add('first', 'left-button', 'primary-button');

        allowButton = document.createElement('button');
        allowButton.id = 'allow-button';
        allowButton.classList.add('first', 'secondary-button');

        stakeButton = document.createElement('button');
        stakeButton.id = 'stake-button';
        stakeButton.classList.add('second', 'primary-button');
        // stakeButton.style.display = 'none';

        closeButton = document.createElement('button');
        closeButton.id = 'close-button';
        closeButton.classList.add('second', 'secondary-button', 'left-button');
        // closeButton.style.display = 'none';

        // create elements
        boxWrapper = document.createElement('div');
        bannerWrapper = document.createElement('div');
        const body = document.body;
        const box = document.createElement('canvas');
        const banner = document.createElement('div');
        const textBox = document.createElement('div');
        const image = document.createElement('img');
        const warningHeadline = document.createElement('h2');
        const bannerTitle = document.createElement('p');
        const bannerText = document.createElement('p');
        const stakingHeadline = document.createElement('h2');
        const stakingExplanation = document.createElement('p');

        // link elements to stylesheet
        box.id = 'box';
        boxWrapper.id = 'warningbox-wrapper';
        image.id = 'threatslayer_logo';
        textBox.id = 'text-box';
        warningHeadline.id = 'headline';
        warningHeadline.classList.add('first');

        banner.id = 'warningbanner';
        bannerWrapper.id = 'warningbanner-wrapper';
        bannerTitle.classList.add('warningbanner-text');
        bannerTitle.classList.add('first')
        bannerText.classList.add('warningbanner-text');
        bannerText.classList.add('first')

        stakingHeadline.id = 'headline';
        stakingHeadline.classList.add('second');
        stakingExplanation.id = 'staking-explanation';
        stakingExplanation.classList.add('second');

        // add background image
        backgroundImageURL = chrome.runtime.getURL('/assets/images/grid_background.png');
        banner.style.background = `url(${backgroundImageURL}) repeat`;

        // generate logo URL
        imageURL = chrome.runtime.getURL('/assets/images/threatslayer_logo.png');
        image.setAttribute('src', imageURL);

        // "Warning!" / "This website may be malicious." / "Close the tab unless you know this site is safe!"
        warningHeadline.appendChild(document.createTextNode(chrome.i18n.getMessage('warning')));
        bannerTitle.appendChild(document.createTextNode(chrome.i18n.getMessage('warning_header')));
        bannerText.appendChild(document.createTextNode(chrome.i18n.getMessage('warning_text')));

        // "Trust This Site" button
        allowButton.appendChild(document.createTextNode(chrome.i18n.getMessage('trust_this_url')));
        googleButton.appendChild(document.createTextNode(chrome.i18n.getMessage('take_to_safety')));

        // Staking box text and buttons
        stakingHeadline.appendChild(document.createTextNode(chrome.i18n.getMessage('staking')));
        stakingExplanation.appendChild(document.createTextNode(chrome.i18n.getMessage('staking_explanation')));
        stakeButton.appendChild(document.createTextNode(chrome.i18n.getMessage('stake_this_url')));
        closeButton.appendChild(document.createTextNode(chrome.i18n.getMessage('close')));

        // build banner and underlying box
        banner.appendChild(image);
        banner.append(textBox);
        textBox.appendChild(warningHeadline);
        textBox.appendChild(bannerTitle);
        textBox.appendChild(bannerText);
        textBox.appendChild(googleButton);
        textBox.appendChild(stakingHeadline);
        textBox.appendChild(stakingExplanation);
        textBox.appendChild(allowButton);
        textBox.appendChild(closeButton);
        textBox.appendChild(stakeButton);

        bannerWrapper.appendChild(banner);
        boxWrapper.appendChild(box);

        // insert box and banner into page
        body.insertBefore(bannerWrapper, body.childNodes[0]);
        body.insertBefore(boxWrapper, body.childNodes[0]);

        // Setting up event listeners but delegate logic to the promise-based handlers
        googleButton.onclick = async function() {
            let result = await handleGoogleButton();
            resolve(result)
        };
        allowButton.onclick = async function() {
            let result = await handleAllowActions();
            resolve(result);
        };
    });
}

// this handler processes button event to trust website and present stake and close buttons for final decision
function handleAllowActions() {
    return new Promise(async (resolve) => {

        // hide initial items on text box
        const firstItemsLength = document.getElementsByClassName('first').length;

        for (let i = 0; i < firstItemsLength; i++) {
            const firstScreenItem = document.getElementsByClassName('first')[0];

            firstScreenItem.parentNode.removeChild(firstScreenItem);
        }

        // reveal staking items on second screen
        const secondItemsLength = document.getElementsByClassName('second').length;

        for (let i = 0; i < secondItemsLength; i++) {
            const secondScreenItem = document.getElementsByClassName('second')[0];

            secondScreenItem.classList.toggle("second");
        }

        // on clicking the allow button, adds URL to local allowlist before sending it to GALACTUS
        //
        // send URL to GALACTUS
        chrome.storage.local.get('apiKey').then(async (result) => {
            const key = result.apiKey;
            const url = document.URL;
            const body = { key, url };
            const allowlistUrl = SITE_UNLOCK_ENDPOINT;
            try {
                const allowlistResult = await fetch(allowlistUrl, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });
                console.log('result in allowlist sending', { allowlistResult }.json());
                console.log(`URL ${url} added to allowlist`);

            } catch (error) {

                console.log('Error sending allowlisted URL:', error);
            }
        });

        // update the local allow list
        chrome.storage.local.get('allowlist').then((result) => {

            const allowlist = result.allowlist || [];
            const url = document.URL; // this is the current URL to be allowlisted

            // adds URL to local list in Chrome state
            if (!allowlist.includes(url)) {
                allowlist.push(url);
                console.log(`Adding ${url} to allowlist`);

                chrome.storage.local.set({ allowlist });
            }

            // now wait for choice to stake or close
            handleAllowButton().then((result) => {

                resolve(result)
            });
        });
    });
}


// wait for close or stake button events
function handleAllowButton() {
    return new Promise((resolve) => {

        // on clicking the stake button, it opens TS+ on the staking page
        stakeButton.onclick = function () {

            closeBanner()
            resolve("staked");
        }

        // on click the close button, remove banner and box
        closeButton.onclick = function () {

            closeBanner();
            resolve("closed");
        }
    });
}

// run away to the safe space of papa google
function handleGoogleButton() {
    return new Promise((resolve) => {

        window.location.href = SAFETY_ADDRESS;
        resolve("navigated-to-safety");
    });
}

/**
 * This function injects banner styling if malicious_p returns 'true'
 */
async function loadCSS() {
    let head  = document.getElementsByTagName('head')[0];
    let link  = document.createElement('link');
    link.id   = "malicious_p_banner";
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.media = 'all';
    link.href = chrome.runtime.getURL(BANNER_CSS)
    head.appendChild(link);
}

/**
 * This function closes the warning banner and removes styling
 **/
function closeBanner() {
    const head = document.head;
    const body = document.body;
    const style = document.getElementById("malicious_p_banner");
    bannerWrapper = document.getElementById("warningbanner-wrapper");
    boxWrapper = document.getElementById("warningbox-wrapper");

    if (style) head.removeChild(style);
    if (bannerWrapper) body.removeChild(bannerWrapper);
    if (boxWrapper) body.removeChild(boxWrapper);
}

/**
 * This helper function removes parameters from URLs sent to pipeline,
 * in order to protect sensitive user info.
 * From https://stackoverflow.com/questions/12023430/regex-url-path-from-url
 * @param {} url - the complete URL string, including protocol and any params
 */
function removeParams(url) {
    console.log(url)
    const parser = document.createElement('a');
    parser.href = url;
    const {hostname, protocol, pathname} = parser;

    const result = `${protocol}//${hostname}${pathname}`;

    return result
}

