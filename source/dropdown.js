/**
 * This script contains logic relating to the UI icon dropdown functionalities
 */

let button1 = document.getElementById("getStats");
let button2 = document.getElementById("goToSite");

function getStats() {
	window.close();
}

function goToSite() {
	window.close();
	window.open(
		'https://interlock.network',
		'_blank'
)};

button1.addEventListener('click', getStats);
button2.addEventListener('click', goToSite);
