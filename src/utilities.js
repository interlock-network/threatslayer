export const baseUrl = 'http://159.89.252.13';

export const usernameErrorMessages = {
    illegalChars: function (_chars) {
        // TODO uncomment when we upgrade translation
        // const chars = chars.join(', ');
        return 'warning_username_contains_illegal_characters';
    },
    maxLength: 'warning_username_too_long'
};

/**
 * This convenience function perforns basic email validation
 * @param {string} email - an email string
 */
export function findEmailError(email) {
    let result = '';
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

    if (!email?.length) {
        result = '';
    } else if (!emailRegex.test(email)) {
        result = 'error_invalid_email_generic';
    } else {
        result = '';
    }

    return result;
}

/**
 * This convenience function finds characters not A-Z, a-z and 0-9
 * @param {string} str - a username string
 */
export function findNonAlphanumericChars(str) {
    const regex = /[^A-Za-z0-9]/g;
    const matchesArr = str.match(regex).map(char =>
        char === ' ' ? 'whitespace' :
            char === ',' ? 'comma' : char
    );

    return [...new Set(matchesArr)]; // to remove duplicate chars
}

/**
 * This convenience function to stringify large numbers to local formats with commas etc.
 * @param {number} num - Unix time in seconds
 */
export function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

/**
 * This convenience function takes an integer and returns a string to set font size
 * @param {number} num - a dashboard value for total number of URLs scanned.
 */
export function getFontSizeForTotal(num) {
    const oneToThreeDigits = '123px';
    const fourDigits = '110px';
    const fiveDigits = '90px';
    const sixDigits = '75px';
    const sevenDigits = '60px';

    let result;

    if (num >= 10 ** 6) {
        result = sevenDigits;
    } else if (num >= 10 ** 5) {
        result = sixDigits;
    } else if (num >= 10 ** 4) {
        result = fiveDigits;
    } else if (num >= 10 ** 3) {
        result = fourDigits;
    } else {
        result = oneToThreeDigits;
    }

    return result;
}

/**
 * This convenience function takes an integer and returns a string to set font size
 * @param {number} num - a dashboard value for number of unique URLs scanned.
 */
export function getFontSizeForSmallerNums(num) {
    const defaultSize = '50px';
    const sixDigits = '40px';

    let result;

    if (num >= 10 ** 6) {
        result = sixDigits;
    } else {
        result = defaultSize;
    }

    return result;
}

/**
 * This function gets a single value from Chrome local storage
 * @param {string} key - The key for a value in Chrome local storage
 */
export function getChromeStorage(key) {
    try {
        return chrome.storage.local
            .get([key])
            .then(async response => {
                const result = await response[key];
                console.log(`Chrome state retrieved for ${key}: ${result}`);

                return result;
            });
    } catch (err) {
        console.log(`Error getting Chrome state for ${key}: ${err}`);

        return null;
    }
}

/**
 * This convenience function perforns basic email validation
 * @param {string} usernameOrPassword - an email string
 */
export function isEmail(usernameOrPassword) {
    let result = true;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

    if (!emailRegex.test(usernameOrPassword)) {
        result = false;
    }

    return result;
}

/**
 * This function gets a single value from Chrome local storage
 * @param {Object} storageObj - A key/value pair to set in Chrome local storage
 * @param {Array.<string>} storageObj.allowlist - A list of URLs
 * @param {string} storageObj.apiKey - User's specific API key
 * @param {Boolean} storageObj.loggedIn - A key/value pair to set in Chrome local storage
 * @param {Boolean} storageObj.registered - A key/value pair to set in Chrome local storage
 */
export function setChromeStorage(storageObj) {
    try {
        return chrome.storage.local
            .set(storageObj)
            .then(() => {
                const key = Object.keys(storageObj);
                const value = storageObj[key];
                console.log(`Chrome state set for ${key}: ${value}`);

                return true;
            });
    } catch (err) {
        console.log(`Error setting Chrome state for ${key}: ${value}. Error: ${err}`);

        return false;
    }
}

/**
 * This function gets a single value from Chrome local storage
 * @param {string} key - The key for a value to set to null in Chrome local storage
 */
export function clearChromeStorage(key) {
    try {
        return chrome.storage.local
            .set({ [key]: null })
            .then(() => {
                console.log(`Chrome state cleared for ${key}`);

                return true;
            });
    } catch (err) {
        console.log(`Error clearing Chrome state for ${key}. Error: ${err}`);

        return false;
    }
}