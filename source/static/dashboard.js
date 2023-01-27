// convenience function to stringify large numbers to local formats with commas etc.
const formatNumber = (num) => new Intl.NumberFormat().format(num);

// takes an integer and returns a string to set font size
const getFontSizeForTotal = (num) => {
    const oneToThreeDigits = '123px';
    const fourDigits = '110px';
    const fiveDigits = '90px';
    const sixDigits = '75px';
    const sevenDigits = '60px';

    let result;

    if (num >= 10**6) {
        result = sevenDigits;
    } else if (num >= 10**5) {
        result = sixDigits;
    }  else if (num >= 10**4) {
        result = fiveDigits;
    } else if (num >= 10**3) {
        result = fourDigits;
    } else {
        result = oneToThreeDigits;
    }

    return result;
};

// takes an integer and returns a string to set font size
const getFontSizeForUnique = (num) => {
    const defaultSize = '56px';
    const sixDigits = '40px';

    let result;

    if (num >= 10**6) {
        result = sixDigits;
    } else {
        result = defaultSize;
    }

    return result;
};

window.addEventListener("load", async function() {
    // get dashboard number for total URLs visited from local storage
    chrome.storage.local.get(["totalURLsVisited"]).then((result) => {
        const {totalURLsVisited = 1} = result;

        // get HTML elements for total and unique URL counts
        const localURLsScannedCount = document.getElementById("local-urls-scanned-count");
        const localUniqueURLsScannedCount = document.getElementById("local-unique-urls-scanned-count");

        // set and format *total* URLs
        const formattedTotalURLsVisited = formatNumber(totalURLsVisited);

        localURLsScannedCount.style.fontSize = getFontSizeForTotal(totalURLsVisited);
        localURLsScannedCount.innerHTML = formattedTotalURLsVisited;

        // set and format unique URLs
        const uniqueURLsVisited = Math.ceil(totalURLsVisited * 0.177) || 1; // Ratio 0.177 based on Interlock data sources
        const formattedUniqueURLsVisited = formatNumber(uniqueURLsVisited);

        localUniqueURLsScannedCount.style.fontSize = getFontSizeForUnique(uniqueURLsVisited);
        localUniqueURLsScannedCount.innerHTML = `≈ ${formattedUniqueURLsVisited}`;
    });

    // get dashboard number for malicious URLs visited from local storage
    chrome.storage.local.get(["totalMaliciousURLsVisited"]).then((result) => {
        const {totalMaliciousURLsVisited = 0} = result;

        const formattedTotalMaliciousURLsVisited = formatNumber(totalMaliciousURLsVisited);
        const localMaliciousURLsCount = document.getElementById("local-malicious-urls-scanned-count");

        localMaliciousURLsCount.innerHTML = formattedTotalMaliciousURLsVisited;
    });

    // localize text on page
    document.getElementById("unique-urls-scanned-text").innerHTML = chrome.i18n.getMessage("unique_urls_scanned")
    document.getElementById("urls-scanned-sub-text").innerHTML = chrome.i18n.getMessage("urls_scanned")
    document.getElementById("malicious-sites-detected-text").innerHTML = chrome.i18n.getMessage("malicious_sites_detected")

});
