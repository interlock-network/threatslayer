/**
 * This script contains logic relating to the UI icon dropdown functionalities
 */

let button1 = document.getElementById("getStats");
let button2 = document.getElementById("goToSite");

button1.addEventListener('click', getStats);
button2.addEventListener('click', goToSite);


function getStats() {

    chrome.storage.sync.get(['visited', 'malicious'], function(result) {
        let malicious;
        let visited;
        if (result.malicious == undefined) {
            malicious = 0;
        } else {
            malicious = result.malicious;
        }

        if (result.visited == undefined) {
            visited = 0;
        } else {
            visited = result.visited
        }
        alert("So far, Threatslayer scanned " + visited +
              " websites, and blocked " + malicious + " malicious websites.");
    
        })}

function goToSite() {
    window.close();
    window.open(
        'https://interlock.network',
        '_blank'
)};

