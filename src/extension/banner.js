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
    const warningHeadline = document.createElement('h2');
    const bannerTitle = document.createElement('p');
    const bannerText = document.createElement('p');
    const allowButton = document.createElement('button');
    const googleButton = document.createElement('button');
    const stakingHeadline = document.createElement('h2');
    const stakingExplanation = document.createElement('p');
    const stakeButton = document.createElement('button');
    const closeButton = document.createElement('button');

    // link elements to stylesheet
    bannerWrapper.id = 'warningbanner-wrapper';
    box.id = 'box';
    banner.id = 'warningbanner';
    image.id = 'threatslayer_logo';
    warningHeadline.id = 'headline';
    warningHeadline.classList.add('first');
    bannerTitle.classList.add('warningbanner-text');
    bannerTitle.classList.add('first')
    bannerText.classList.add('warningbanner-text');
    bannerText.classList.add('first')
    textBox.id = 'text-box';
    allowButton.id = 'allow-button';
    allowButton.classList.add('first', 'secondary-button');
    googleButton.id = 'safety-button';
    googleButton.classList.add('first', 'left-button', 'primary-button');
    stakingHeadline.id = 'headline';
    stakingHeadline.classList.add('second');
    stakingExplanation.id = 'staking-explanation';
    stakingExplanation.classList.add('second');
    stakeButton.id = 'stake-button';
    stakeButton.classList.add('second', 'primary-button');
    // stakeButton.style.display = 'none';
    closeButton.id = 'close-button';
    closeButton.classList.add('second', 'secondary-button', 'left-button');
    // closeButton.style.display = 'none';

    // add background image
    backgroundImageURL = chrome.runtime.getURL('grid_background.png');
    banner.style.background = `url(${backgroundImageURL}) repeat`;

    // generate logo URL
    imageURL = chrome.runtime.getURL('threatslayer_logo.png');
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

    // on clicking 'Take Me to Safety', go to Google
    googleButton.onclick = function () {
        window.location.href = 'https://google.com/'
    };

    // on click the close button, remove banner and box
    closeButton.onclick = function () {
        body.removeChild(bannerWrapper);
        body.removeChild(boxWrapper);
    }

    // on clicking the stake button, it opens TS+ on the staking page
    stakeButton.onclick = function () {
        chrome.runtime.sendMessage({
            action: 'stakeUrl',
            url: document.URL
        });

        // then remove the warning banner
        body.removeChild(bannerWrapper);
        body.removeChild(boxWrapper);
    }

    // on clicking the allow button, adds URL to local allowlist before sending it to GALACTUS
    allowButton.onclick = function () {
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

        chrome.storage.local.get('allowlist').then((result) => {
            const allowlist = result.allowlist || [];
            const url = document.URL; // this is the current URL to be allowlisted

            // adds URL to local list in Chrome state
            if (!allowlist.includes(url)) {
                allowlist.push(url);
                console.log(`Adding ${url} to allowlist`);

                chrome.storage.local.set({ allowlist });
            }
        });

        // send URL to GALACTUS
        chrome.storage.local.get('apiKey').then(async (result) => {
            const key = result.apiKey;
            const url = document.URL;
            const body = { key, url };
            const allowlistUrl = 'http://159.89.252.13/site-unlock'

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


    };
})();
