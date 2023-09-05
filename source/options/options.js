/**
 * This is the ThreatSlayer options panel.
 */

const betaAICheckbox = document.getElementById("betaAICheckbox");

// Load the user's preference for beta AI Threat Detection from storage
chrome.storage.sync.get("betaAISelected", function(data) {
    betaAICheckbox.checked = data.betaAISelected;
});

// Add an event listener for changes to the beta AI Threat Detection checkbox
betaAICheckbox.addEventListener("change", function(event) {
    const betaAISelected = event.target.checked;

    // Store the user's preference for beta AI Threat Detection in storage
    chrome.storage.sync.set({betaAISelected: betaAISelected}, function() {
        console.log('Setting betaAISelected set to', betaAISelected);
    });

    // Modify the "dark_mode_enabled" setting in the Chrome browser
    // chrome.settingsPrivate.setPref("dark_mode_enabled", betaAISelected;
    // ...(commented out because broken)
});
