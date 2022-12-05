window.addEventListener("load", async function() {
    // get HTML elements of dashboard numbers to fill in
    const maliciousURLsScannedCount = document.getElementById("malicious-urls-scanned-count")
    const URLsScannedCount = document.getElementById("urls-scanned-count");
    const userCount = document.getElementById("user-count");

    // fills in the dashboard numbers with the values from the Interlock pipeline API
    maliciousURLsScannedCount.innerHTML = await chrome.runtime.sendMessage('malicious_urls_scanned_count');
    URLsScannedCount.innerHTML = await chrome.runtime.sendMessage('urls_scanned_count');
    userCount.innerHTML = await chrome.runtime.sendMessage('user_count');

    // get dashboard number for total URLs visited from local storage
    chrome.storage.local.get(["totalURLsVisited"]).then((result) => {
        const {totalURLsVisited = 1} = result;
        const localUniqueURLsScannedCount = document.getElementById("local-unique-urls-scanned-count");
        const localURLsScannedCount = document.getElementById("local-urls-scanned-count");

        // Ratio 0.177 based on Interlock data sources
        localUniqueURLsScannedCount.innerHTML = Math.ceil(totalURLsVisited * 0.177) || 1;
        localURLsScannedCount.innerHTML = totalURLsVisited;
    });

    // get dashboard number for malicious URLs visited from local storage
    chrome.storage.local.get(["totalMaliciousURLsVisited"]).then((result) => {
        const {totalMaliciousURLsVisited} = result || 0;
        const localMaliciousURLsCount = document.getElementById("local-malicious-urls-scanned-count");

        localMaliciousURLsCount.innerHTML = totalMaliciousURLsVisited;
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

    toggle.addEventListener("click", toggleReset)
});
