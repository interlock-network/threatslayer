#### 23a8d5e019c7e2fe4889831987b8b18f64842346
Message: manifest.json: turn service-worker into a module
Justification: worker must be module in order to import modules
(https://developer.chrome.com/docs/extensions/mv3/getstarted/tut-quick-reference/#step-2)[https://developer.chrome.com/docs/extensions/mv3/getstarted/tut-quick-reference/#step-2]

#### 11d4a45c44f7d188c2dbf22ec58b458c2f0c5546
Message: mv banner.js content/banner.js
Justification: manv3 standard
(https://developer.chrome.com/docs/extensions/mv3/architecture-overview/#arch)[https://developer.chrome.com/docs/extensions/mv3/architecture-overview/#arch]

#### 85742b0f0b2b76fb1805ff0a7e2d56eec320e047
Message: mv banner.js content/banner.js
Justification: Same as above. banner script is a content script

#### 42d60058007ea45c94ff5ce3ca96d71c547b07eb
Message: mv background.js -> service/worker.js & update manifest
Justification: manV3 do now have background scripts, rather, they have a single service worker

#### a7de1621bf7d9c9c4e171dfca4fbf2143103dc68
Message: bundle all dashboard-related assets into popup directory per manV3 standard practice
Justification: same as above, standard practice


