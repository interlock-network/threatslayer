window.addEventListener("load", async function() {
    const URLsScannedCount = document.getElementById("urls-scanned-count");
    const maliciousURLsScannedCount = this.document.getElementById("malicious-urls-scanned-count")

    URLsScannedCount.innerHTML = await chrome.runtime.sendMessage('urls_scanned_count');
    maliciousURLsScannedCount.innerHTML = await chrome.runtime.sendMessage('malicious_urls_scanned_count');

    chrome.storage.local.get(["totalURLsVisited"]).then((result) => {
        const localURLsScannedCount = document.getElementById("local-urls-scanned-count");
        localURLsScannedCount.innerHTML = result.totalURLsVisited;

        const localUniqueURLsScannedCount = document.getElementById("local-unique-urls-scanned-count");
        // Ratio 0.177 based on Interlock data sources
        localUniqueURLsScannedCount.innerHTML = Math.ceil(result.totalURLsVisited * 0.177);
    });

    chrome.storage.local.get(["totalMaliciousURLsVisited"]).then((result) => {
        const totalMaliciousURLsVisited = document.getElementById("local-malicious-urls-scanned-count");
        totalMaliciousURLsVisited.innerHTML = result.totalMaliciousURLsVisited || 0;
    });

    const myTabs = document.querySelectorAll("ul.nav-tabs > li");
    const toggle = this.document.getElementById("switch");
    const toggleLabel = this.document.getElementById("toggle-label");
    const notYet = this.document.getElementById("not-yet");

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
	myTabs[i].addEventListener("click", myTabClicks)
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
