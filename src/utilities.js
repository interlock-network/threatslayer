export const baseUrl = 'https://galactus.interlock.network';

/**
 * This function clears a single value from Chrome local storage.
 * @param {string} key - The key for a value to set to null in Chrome local storage
 * @returns {boolean} - Whether the value for key was cleared from Chrome local storage
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
    const { response: { data: { errors = [] } = {}, status } = {} } = errorObj;
    const result = { errors, status };

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
 * This function formats a value to be logged.
 * @param {string|Object} item - The value to ultimately be console logged
 * @returns {string} - Returns a string to be console logged
 */
const formatValue = (item) => {
    const itemType = typeof item;

    return itemType === 'undefined' ? 'undefined' :
        itemType === 'object' ? JSON.stringify(item) :
            item;
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
            .then(response => {
                const value = response[key];

                console.log(`Chrome state retrieved for ${key}: ${formatValue(value)}`);

                return value;
            });
    } catch (err) {
        console.log(`Error getting Chrome state for ${key}: ${err}`);

        return null;
    }
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

                console.log(`Chrome state set for ${key}: ${formatValue(value)}`);

                return true;
            });
    } catch (err) {
        console.log(`Error setting Chrome state for ${key}: ${value}. Error: ${err}`);

        return false;
    }
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
    { errorArr, errorMsg = 'error', initialMsg, reset = false, submitted, submittedMsg = 'success', submitting, submittingMsg = 'waiting', status }
) {
    let result = '';

    if (reset) {
        result = initialMsg;
    } else if (submitted) {
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
