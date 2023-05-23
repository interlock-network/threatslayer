// File: background.js //

// Called when the user clicks on the browser action.
chrome.action.onClicked.addListener(tab => {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
        chrome.tabs.create({'url': chrome.runtime.getURL("popup.html"), 'active': true});

        // chrome.windows.create({
        //     url: chrome.runtime.getURL("popup.html"),
        //     type: "popup",
        //     height: 800,
        //     width: 800
        // }, function(win) {
        // });

    });
});
