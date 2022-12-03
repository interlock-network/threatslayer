window.addEventListener("load", function() {
	
	// console.log('urlsScannedCount', urlsScannedCount);

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
