export const baseUrl = 'http://159.89.252.13';

/**
 * This function clears a single value from Chrome local storage.
 * @param {string} key - The key for a value to set to null in Chrome local storage
 * @returns {boolean} Whether the value for key was cleared from Chrome local storage
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

/**
 * This convenience function formats an array of API endpoint error messages.
 * @param {Object} errorObj - the error object returned by Axios
 * @param {Object} errorObj.response - the response from the GALACTUS endpoint
 * @param {Number} errorObj.response.status - server status code
 * @param {Object} errorObj.response.data - an object containing data specific to the error
 * @param {Array.<string>} errorObj.response.data.error_message - an array of error messages
 * @returns {{errors: Array.<string>, status: number}} An object with the errors array and server status code
 */
export function extractFromError(errorObj = {}) {
    const { response: { data: { error_message: errors = [] } = {}, status } = {} } = errorObj;
    const result = { errors, status };

    return result;
}

/**
 * This convenience function formats an array of API endpoint error messages.
 * @param {Object} response - the response from the GALACTUS endpoint
 * @param {Number} response.status - server status code
 * @param {Object} response.data - an object containing data specific to the user
 * @param {string} response.data.azero_wallet_id - an Aleph Zero-compatible wallet address
 * @param {string} response.data.email - an email address
 * @param {string} response.data.key - the user's unique API key
 * @param {string} response.data.pdot_wallet_id - an Polkadot-compatible wallet address
 * @param {string} response.data.username - the user's username
 * @returns {{azeroAddress: string, email: string, key: string, pdotAddress: string, status: Number, username: string}} An object with relevant values extracted
 */
export function extractLoginValues(response) {
    const { status, data: { azero_wallet_id: azeroAddress, email, key, pdot_wallet_id: pdotAddress, username } = {} } = response;
    const result = { azeroAddress, email, key, pdotAddress, status, username };

    return result;
}

/**
 * This convenience function finds characters not A-Z, a-z and 0-9
 * @param {string} str - a username string
 * @returns {string} Characters in string that are not A-Z, a-z and 0-9
 */
export function findNonAlphanumericChars(str = '') {
    let result = [];

    if (str?.length) {
        const regex = /[^A-Za-z0-9]/g;
        const matchesArr = str.match(regex);

        if (matchesArr?.length) {
            const illegalChars = matchesArr.map(char =>
                char === ' ' ? 'space' :
                    char === ',' ? 'comma' : char
            );

            // to remove duplicate chars and stringify
            result = [...new Set(illegalChars)].join(', ');
        }
    }

    return result;
}

/**
 * This convenience function formats an array of API endpoint error messages.
 * @param {string[]} errorArr - Array of strings
 * @returns {string[]} An array of error strings populated with at least a default message
 */
export function formatErrorMessages(errorArr) {
    let result = ['Error'];

    if (errorArr.length) {
        result = errorArr.map(v => v);
    }

    return result;
}

/**
 * This convenience function to stringify large numbers to local formats with commas etc.
 * @param {Number} num - Unix time in seconds
 * @returns {string} A number localized based on the user's browser language setting 
 */
export function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

/**
 * This convenience function returns button text for API submit buttons.
 * @param {Object} configObject - Configuration object for this function
 * @param {Array<string>} configObject.errorArr - Array of error strings; may be empty
 * @param {string} configObject.initialMsg - Default i18n button label string (before clicked)
 * @param {boolean} configObject.submitted - Whether the request has been submitted
 * @param {string} configObject.submittedMsg - Submitted request i18n button label string (success)
 * @param {boolean} configObject.submitting - Whether the request is submitting now
 * @param {string} configObject.submittingMsg - Submitting request i18n button label string (waiting)
 * @param {Number} configObject.status - Server status code, 1xx to 5xx
 * @returns {string} A translation key string to show on the submit button
 */
export function submitButtonLabels(
    { errorArr, errorMsg = 'error', initialMsg, submitted, submittedMsg = 'success', submitting, submittingMsg = 'waiting', status }
) {
    let result = '';

    if (submitted) {
        result = submittedMsg;
    } else if (submitting) {
        result = submittingMsg;
    } else if (status >= 500) {
        result = "try_again_later";
    } else if (errorArr.length) {
        result = errorMsg;
    } else {
        result = initialMsg;
    }

    return result;
}

/**
 * This convenience function takes an integer and returns a string to set font size
 * @param {Number} num - a dashboard value for total number of URLs scanned.
 * @returns {string} Pixel size in string for use in CSS
 */
export function getFontSizeForTotal(num) {
    let result = '';
    const oneToThreeDigits = '123px';
    const fourDigits = '110px';
    const fiveDigits = '90px';
    const sixDigits = '75px';
    const sevenDigits = '60px';

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
 * @param {Number} num - a dashboard value for number of unique URLs scanned.
 * @returns {string} Pixel size in string for use in CSS
 */
export function getFontSizeForSmallerNums(num) {
    let result = '';
    const defaultSize = '50px';
    const sixDigits = '40px';

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
 * @returns {Promise} A promise object with the value for the key passed to the function
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
 * @returns {boolean} Whether the string is a valid email address
 */
export function isEmail(usernameOrPassword) {
    let result = true;
    // from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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
 * @returns {boolean} Whether the value for key was set in Chrome local storage
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
 * This convenience function validates whether a wallet address string is Aleph Zero
 * @param {string} address - a wallet address string
 * @returns {boolean} A boolean for whether a wallet address matches Aleph Zero's address type
 */
export function validateAzero(address = '') {
    let result = true;
    const azeroRegex = /^5.*/;

    if (address.length && !azeroRegex.test(address)) {
        result = false;
    }

    return result;
}

/**
 * This convenience function perforns basic email validation
 * @param {string} email - an email string
 * @returns {string} A translation key string to show email error message, if applicable
 */
export function validateEmail(email = '') {
    let result = '';

    if (!email.length) {
        result = '';
    } else if (!isEmail(email)) {
        result = 'error_invalid_email_generic';
    } else {
        result = '';
    }

    return result;
}

/**
 * This convenience function validates whether a wallet address string is Moonbeam
 * @param {string} address - a wallet address string
 * @returns {boolean} A boolean for whether a wallet address matches Moonbeam's address type
 */
export function validateMoonbeam(address = '') {
    let result = true;
    const moonbeamRegex = /^Vd.*/;

    if (address.length && !moonbeamRegex.test(address)) {
        result = false;
    }

    return result;
}

/**
 * This convenience function validates usernames
 * @param {string} password - a password string
 * @returns {string} A translation key string to describe a password validation failure or empty string
 */
export function validatePassword(password = '') {
    let result = '';

    // number of characters
    const minLength = 12;
    const maxLength = 512;

    if (!password.length) {
        result = ''; // no change, empty string === valid
    } else if (password.length < minLength) {
        result = 'error_password_too_short';
    } else if (password.length > maxLength) {
        result = 'error_password_too_long';
    }

    return result;
}

/**
 * This convenience function validates usernames
 * @param {string} username - a username string
 * @returns {string} A translation key string to describe a username validation failure or empty string
 */
export function validateUsername(username = '') {
    let result = '';

    // number of characters
    const maxLength = 16;
    const minLength = 5;

    const allowedCharsRegex = /^[a-zA-Z0-9_]+$/;
    const containsIllegalChars = !allowedCharsRegex.test(username);

    if (!username.length) {
        result = ''; // no change, empty string === valid
    } else if (username.length < minLength) {
        result = 'warning_username_too_short';
    } else if (username.length > maxLength) {
        result = 'warning_username_too_long';
    } else if (containsIllegalChars) {
        result = 'warning_username_contains_illegal_characters';
    }

    return result;
}
