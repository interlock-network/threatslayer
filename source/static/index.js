// convenience function to stringify large numbers to local formats with commas etc.
    // also deals with doing the math for calculating unique URLs
const formatRawResponse = (num, multiplier = 1) => {
    if (typeof num !== 'number') {
        return 'Error';
    } else {
        const rawNumber = Math.ceil(num * multiplier) || 1;

        return new Intl.NumberFormat().format(rawNumber) ;
    }
};

window.addEventListener("load", async function() {
    // get HTML elements of dashboard numbers to fill in
    const maliciousURLsScannedElement = document.getElementById("malicious-urls-scanned-count")
    const URLsScannedElement = document.getElementById("urls-scanned-count");
    const userCountElement = document.getElementById("user-count");

    // get API counts from the Interlock pipeline
    const maliciousURLsScannedCount = await chrome.runtime.sendMessage('malicious_urls_scanned_count');
    const URLsScannedCount = await chrome.runtime.sendMessage('urls_scanned_count');
    const userCount = await chrome.runtime.sendMessage('user_count');

    // fills in the dashboard numbers with formatted values
    maliciousURLsScannedElement.innerHTML = formatRawResponse(maliciousURLsScannedCount);
    // URLsScannedElement.innerHTML = formatRawResponse(URLsScannedCount);
    // userCountElement.innerHTML = formatRawResponse(userCount);

    // get dashboard number for total URLs visited from local storage
    chrome.storage.local.get(["totalURLsVisited"]).then((result) => {
        const {totalURLsVisited = 1} = result;

        // get HTML elements of dashboard numbers to fill in
        const localUniqueURLsScannedCount = document.getElementById("local-unique-urls-scanned-count");
        const localURLsScannedCount = document.getElementById("local-urls-scanned-count");

        // Ratio 0.177 based on Interlock data sources
        const formattedTotalURLsVisited = formatRawResponse(totalURLsVisited, 0.177);
        const formattedUniqueURLsVisited = formatRawResponse(uniqueURLsVisited);

        localUniqueURLsScannedCount.innerHTML = `≈ ${formattedUniqueURLsVisited}`;
        // localURLsScannedCount.innerHTML = formattedTotalURLsVisited;
    });

    // get dashboard number for malicious URLs visited from local storage
    chrome.storage.local.get(["totalMaliciousURLsVisited"]).then((result) => {
        const {totalMaliciousURLsVisited = 0} = result;

        const formattedTotalMaliciousURLsVisited = typeof totalMaliciousURLsVisited === 'number' ? formatRawResponse(totalMaliciousURLsVisited) : 'Error';
        const localMaliciousURLsCount = document.getElementById("local-malicious-urls-scanned-count");

        localMaliciousURLsCount.innerHTML = formattedTotalMaliciousURLsVisited;
    });

    const myTabs = document.querySelectorAll("ul.nav-tabs > li");
    const toggle = document.getElementById("switch");
    const toggleLabel = document.getElementById("toggle-label");
    const notYet = document.getElementById("not-yet");

    // adds tab functionality
    function myTabClicks(tabClickEvent) {
        for (let i = 0; i < myTabs.length; i++) {
            myTabs[i].classList.remove("active");
        }

        let clickedTab = tabClickEvent.currentTarget;

        clickedTab.classList.add("active");
        tabClickEvent.preventDefault();

        const myContentPanes = document.querySelectorAll(".tab-pane");

        for (let i = 0; i < myContentPanes.length; i++) {
            myContentPanes[i].classList.remove("active");
        }

        const anchorReference = tabClickEvent.target;
        const activePaneId = anchorReference.getAttribute("href");
        const activePane = document.querySelector(activePaneId);

        activePane.classList.add("active");
    }

    for (let i = 0; i < myTabs.length; i++) {
	    myTabs[i].addEventListener("click", myTabClicks);
    }

    function toggleReset() {
        if (toggle.checked) {
            setTimeout(() => {
            toggle.checked = false;
            toggleLabel.style.opacity = 0.4;
            notYet.style.display = 'inherit';
            }, 250);

        }
    }

    // toggle.addEventListener("click", toggleReset)
});
