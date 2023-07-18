// basic email validation
export function findEmailError(email) {
    let errorMessage = '';
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

    if (!email.length) {
        errorMessage = '';
    } if (!emailRegex.test(email)) {
        errorMessage = 'Invalid email address';
    } else {
        errorMessage = '';
    }

    return errorMessage;
}

// finds characters not A-Z, a-z and 0-9
export function findNonAlphanumericChars(str) {
    const regex = /[^A-Za-z0-9]/g;
    const matchesArr = str.match(regex).map(char =>
        char === ' ' ? 'whitespace' :
            char === ',' ? 'comma' : char
    );

    return [...new Set(matchesArr)]; // to remove duplicate chars
}

// convenience function to stringify large numbers to local formats with commas etc.
export function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

// takes an integer and returns a string to set font size
export function getFontSizeForTotal(num) {
    const oneToThreeDigits = "123px";
    const fourDigits = "110px";
    const fiveDigits = "90px";
    const sixDigits = "75px";
    const sevenDigits = "60px";

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

// takes an integer and returns a string to set font size
export function getFontSizeForUnique(num) {
    const defaultSize = "56px";
    const sixDigits = "40px";

    let result;

    if (num >= 10 ** 6) {
        result = sixDigits;
    } else {
        result = defaultSize;
    }

    return result;
}

export function getChromeStorage(key, successMsg = 'Chrome state succesfully retrieved for', errorMsg = 'Error getting Chrome state for') {
    try {
        return chrome.storage.local
            .get([key])
            .then(response => {
                console.log(`${successMsg} ${key}`);

                return response[key];
            });
    } catch (err) {
        console.log(`${errorMsg} ${key}:`, err);

        return null;
    }
}

export function setChromeStorage(storageObj, successMsg = 'Chrome state succesfully set.', errorMsg = 'Error setting Chrome state.') {
    try {
        return chrome.storage.local
            .set(storageObj)
            .then(() => {
                console.log(successMsg);

                return true;
            });
    } catch (err) {
        console.log(errorMsg, err);

        return false;
    }
}