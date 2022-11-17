/**
 * This script contains logic relating to the UI icon dropdown functionalities
 */

let button1 = document.getElementById("getStats");
let button2 = document.getElementById("goToSite");

function getStats() {

	chrome.storage.sync.get(['visited', 'malicious'], function(result) {

		alert("So far, Threatslayer scanned " + result.test +
		      " websites, and blocked " + result.malicious + " malicious websites.");
	});
}

function goToSite() {
	window.close();
	window.open(
		'https://interlock.network',
		'_blank'
)};

button1.addEventListener('click', getStats);
button2.addEventListener('click', goToSite);
