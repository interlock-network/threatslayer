
/**
 * This script is injected into website if url is found to be malicious.
 */

// styles used below
const bannerStyles = {
    'border-radius': '0 0 15px 15px',
    'height': '100vh',
    'top': '0',
    'width': '100%'
};

const bannerBodyStyles = {
    'background-color': '#0F0818',
    'color': ' #FFFFFF',
    'font-family': 'sans-serif',
    'font-size': '1.1rem !important',
    'font-weight': 'lighter !important',
    'margin': 0,
    'opacity': 1,
    'padding': 0,
    'position': 'relative !important',
    'z-index': '2147483645'
};

const bannerWrapperStyles = {
    'background': 'transparent',
    'bottom': 'auto',
    'height': '100%',
    'position': 'fixed',
    'text-align': 'center',
    'width': '100%',
    'z-index': '2147483643'
};

const boxStyles = {
    'background-color': '#0F0818',
    'bottom': 'auto',
    'font-family': 'sans-serif',
    'height': '100%',
    'left': '0',
    'margin': '0',
    'padding': '0',
    'position': 'fixed',
    'text-align': 'center',
    'top': '0',
    'width': '100%',
    'z-index': '2147483643'
};

const headlineStyles = {
    'font-family': 'sans-serif',
    'font-size': '2rem',
    'font-weight': 'bold',
    'color': 'white',
    'padding-bottom': '1.75rem',
    'width': '100%'
};

const leftButtonStyles = {
    'margin-right': '2rem'
};

const primaryButtonStyles = {
    'background': 'linear-gradient(216.99deg, #9000CB 22.5%, #51066B 112.78%)',
    'border': 'none',
    'border-radius': '1.5rem',
    'color': '#FFFFFF',
    'cursor': 'pointer',
    'font-size': '0.9rem',
    'margin-top': '1rem',
    'margin-bottom': '0.75rem',
    'padding-bottom': '0.75rem',
    'padding-top': '0.75rem',
    'width': '10rem'
};

const secondaryButtonStyles = {
    'background-color': '#0F0818',
    'border': '#9000CB solid 1px',
    'border-radius': '1.5rem',
    'color': '#FFFFFF',
    'cursor': 'pointer',
    'font-size': '0.9rem',
    'margin-top': '1rem',
    'margin-bottom': '0.75rem',
    'padding-bottom': '0.75rem',
    'padding-top': '0.75rem',
    'width': '10rem'
};

const stakingExplanationStyles = {
    'font-family': 'sans-serif',
    'font-size': '1rem',
    'margin-bottom': '0'
};

const textBoxStyles = {
    'background-color': '#0F0818',
    'border': '#242424 solid 1px',
    'border-radius': '8px',
    'color': 'white',
    'font-family': 'sans-serif',
    'margin': '0 auto',
    'padding-top': '1.5rem',
    'padding-bottom': '1.5rem',
    'padding-left': '4rem',
    'padding-right': '4rem',
    'position': 'auto',
    'text-align': 'left',
    'width': 'fit-content',
    'z-index': '2147483647'
};

const textStyles = {
    'color': 'white',
    'display': 'block',
    'font-family': 'sans-serif',
    'font-size': '1rem',
    'font-weight': 'bold',
    'margin-bottom': '0',
    'z-index': '2147483647'
};

const threatSlayerLogoStyles = {
    'margin': '0',
    'padding': '0',
    'position': 'auto',
    'text-align': 'center',
    'z-index': '2147483647'
};

(function () {
    // create elements
    const bannerBody = document.body;
    const bannerWrapper = document.createElement('div');
    const box = document.createElement('canvas');
    const boxWrapper = document.createElement('div');
    const banner = document.createElement('div');
    const textBox = document.createElement('div');
    const threatSlayerLogo = document.createElement('img');
    const warningHeadline = document.createElement('h1');
    const bannerTitle = document.createElement('p');
    const bannerText = document.createElement('p');
    const trustSiteButton = document.createElement('button');
    const googleButton = document.createElement('button');
    const stakingHeadline = document.createElement('h1');
    const stakingExplanation = document.createElement('p');
    const stakeButton = document.createElement('button');
    const closeButton = document.createElement('button');

    // add styling to the elements
    Object.assign(trustSiteButton.style, secondaryButtonStyles);
    Object.assign(banner.style, bannerStyles);
    Object.assign(bannerBody.style, bannerBodyStyles);
    Object.assign(bannerText.style, textStyles);
    Object.assign(bannerTitle.style, textStyles);
    Object.assign(bannerWrapper.style, bannerWrapperStyles);
    Object.assign(box.style, boxStyles);
    Object.assign(closeButton.style, leftButtonStyles, secondaryButtonStyles, { display: 'none' });
    Object.assign(googleButton.style, primaryButtonStyles, leftButtonStyles);
    Object.assign(stakeButton.style, primaryButtonStyles, { display: 'none' });
    Object.assign(stakingExplanation.style, stakingExplanationStyles, { display: 'none' });
    Object.assign(stakingHeadline.style, headlineStyles, { display: 'none' });
    Object.assign(textBox.style, textBoxStyles);
    Object.assign(threatSlayerLogo.style, threatSlayerLogoStyles);
    Object.assign(warningHeadline.style, headlineStyles);

    // assign random strings to elements to hide and show them as needed
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const firstRandomClassNameLength = Math.round(Math.random() * 8) + 4;
    const secondRandomClassNameLength = Math.round(Math.random() * 8) + 4;

    const generateRandomString = (num) => {
        let result = '';

        for (let i = 0; i < num; i++) {
            const randomChar = chars[Math.round(Math.random() * chars.length)];

            result += randomChar;
        }

        return result;
    };

    const firstRandomClassName = generateRandomString(firstRandomClassNameLength);
    const secondRandomClassName = generateRandomString(secondRandomClassNameLength);

    trustSiteButton.classList.add(firstRandomClassName);
    bannerTitle.classList.add(firstRandomClassName)
    bannerText.classList.add(firstRandomClassName)
    googleButton.classList.add(firstRandomClassName);
    warningHeadline.classList.add(firstRandomClassName);

    closeButton.classList.add(secondRandomClassName);
    stakeButton.classList.add(secondRandomClassName);
    stakingExplanation.classList.add(secondRandomClassName);
    stakingHeadline.classList.add(secondRandomClassName);

    // add background image
    backgroundImageURL = chrome.runtime.getURL('grid_background.png');
    banner.style.background = `url(${backgroundImageURL}) repeat`;

    // generate logo URL
    threatSlayerLogoURL = chrome.runtime.getURL('threatslayer_logo.png');
    threatSlayerLogo.setAttribute('src', threatSlayerLogoURL);

    // "Warning!" / "This website may be malicious." / "Close the tab unless you know this site is safe!"
    warningHeadline.appendChild(document.createTextNode(chrome.i18n.getMessage('warning')));
    bannerTitle.appendChild(document.createTextNode(chrome.i18n.getMessage('warning_header')));
    bannerText.appendChild(document.createTextNode(chrome.i18n.getMessage('warning_text')));

    // "Trust This Site" button
    trustSiteButton.appendChild(document.createTextNode(chrome.i18n.getMessage('trust_this_url')));

    // "Take me to Safety" button
    googleButton.appendChild(document.createTextNode(chrome.i18n.getMessage('take_to_safety')));

    // Staking box text and buttons
    stakingHeadline.appendChild(document.createTextNode(chrome.i18n.getMessage('staking')));
    stakingExplanation.appendChild(document.createTextNode(chrome.i18n.getMessage('staking_explanation')));
    stakeButton.appendChild(document.createTextNode(chrome.i18n.getMessage('stake_this_url')));
    closeButton.appendChild(document.createTextNode(chrome.i18n.getMessage('close')));

    // build banner and underlying box
    banner.appendChild(threatSlayerLogo);
    banner.append(textBox);
    textBox.appendChild(warningHeadline);
    textBox.appendChild(bannerTitle);
    textBox.appendChild(bannerText);
    textBox.appendChild(googleButton);
    textBox.appendChild(stakingHeadline);
    textBox.appendChild(stakingExplanation);
    textBox.appendChild(trustSiteButton);
    textBox.appendChild(closeButton);
    textBox.appendChild(stakeButton);

    bannerWrapper.appendChild(banner);
    boxWrapper.appendChild(box);

    // insert box and banner into page
    bannerBody.insertBefore(bannerWrapper, bannerBody.childNodes[0]);
    bannerBody.insertBefore(boxWrapper, bannerBody.childNodes[0]);

    // on clicking 'Take Me to Safety', go to Google
    googleButton.onclick = function () {
        chrome.runtime.sendMessage({ action: 'clearMaliciousUrlObject' });

        window.location.href = 'https://google.com/'
    };

    // on click the close button, remove banner and box
    closeButton.onclick = function () {
        bannerBody.removeChild(bannerWrapper);
        bannerBody.removeChild(boxWrapper);
    }

    // on clicking the stake button, it opens TS+ on the staking page
    stakeButton.onclick = function () {
        chrome.runtime.sendMessage({
            action: 'stakeUrl',
            url: document.URL
        });

        // then remove the warning banner
        bannerBody.removeChild(bannerWrapper);
        bannerBody.removeChild(boxWrapper);
    }

    // on clicking the allow button, adds URL to local allowlist before sending it to GALACTUS
    trustSiteButton.onclick = function () {
        chrome.runtime.sendMessage({ action: 'clearMaliciousUrlObject' });

        // hide initial items on text box
        const firstItemsLength = document.getElementsByClassName(firstRandomClassName).length;

        for (let i = 0; i < firstItemsLength; i++) {
            const firstScreenItem = document.getElementsByClassName(firstRandomClassName)[0];

            firstScreenItem.parentNode.removeChild(firstScreenItem);
        }

        // reveal staking items on second screen
        const secondItemsLength = document.getElementsByClassName(secondRandomClassName).length;

        for (let i = 0; i < secondItemsLength; i++) {
            const secondScreenItem = document.getElementsByClassName(secondRandomClassName)[i];

            if (i < 2) {
                secondScreenItem.style.display = 'block';
            } else {
                secondScreenItem.style.display = 'inline-block';
            }
        }

        chrome.storage.local.get('allowlist').then((result) => {
            const allowlist = result.allowlist || [];
            const url = document.URL; // this is the current URL to be allowlisted

            // adds URL to local list in Chrome state
            if (!allowlist.includes(url)) {
                const newAllowlist = [...allowlist, url];

                chrome.storage.local.set({ allowlist: newAllowlist });

                console.log(`Adding ${url} to allowlist`);
            }
        });

        // send URL to GALACTUS
        chrome.storage.local.get('apiKey').then(async (result) => {
            const key = result.apiKey;
            const url = document.URL;
            const body = { key, url };
            const allowlistUrl = 'https://galactus.interlock.network/site-allowlist'

            try {
                fetch(allowlistUrl, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                console.log(`URL ${url} added to allowlist`);
            } catch (error) {
                console.log('Error sending allowlisted URL:', error);
            }
        });
    };
})();
