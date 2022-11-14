/**
 * This is the main background script for Threatslayer.
 */

<<<<<<< HEAD
var APIUrl = "https://octahedron.interlock.network/malicious_p";
var APIKey = "threatslayer-api-key";
=======
 const APIUrl = "https://octahedron.interlock.network/malicious_p";
 const APIkey = "threatslayer-api-key";
 
 /**
  * This listener is responsible for handling messages from content
  * scripts. It is invoked by script.js using
  * `chrome.runtime.sendMessage`.
  */
 chrome.runtime.onMessage.addListener(
     function(request, _sender, sendResponse) {
        const {contentScriptQuery, url} = request;
>>>>>>> 21a51af (fixing iframes)

         if (contentScriptQuery == "queryURL") {
             fetch(APIUrl,
                   {
                       method: 'POST',
                       headers: {
                           'Accept': 'application/json',
                           'Content-Type': 'application/json'
                       },
                       body: JSON.stringify({key: APIkey, url})
                   })
                 .then(response => response.json())
                 .then(response => sendResponse(response))
                 .catch(error => console.log(`Error in addListener: ${error}`))

             return true;
         }
     });