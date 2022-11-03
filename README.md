<!-- @format -->

# Threatslayer

<img src="docs/icon.png" align="right" width="250" height="250"/>

Threatslayer is a Chrome extension that scans the sites you visit for
malicious activity and neutralizes them. It does this by querying our
database of known-malicious sites. If the site is new, we use our
proprietary visual AI to identify 0-day phishing sites. Setup takes
just a minute or two and it begins protecting you instantly.

Threatslayer is a project of
[Interlock](https://www.interlock.network/), a web3 company that is
decentralizing security. It's free to use in exchange for an
occasional Interlock partnership post. In the future, Threatslayer
will be powered by $ILOCK, Interlock's token launching later this
year.

# Status

Threatslayer is in alpha. It occasionally shows false positives --
safe links marked as dangerous.

# Important files

To understand what Threatslayer does in code, the best place to start is in
`script.js` .

# Behavior
## Detecting a malicious site
If Threatslayer detects a malicious site, it will first show you an
alert at the top of the page:

<img width="421" alt="Threatslayer reacting to a malicious link" src="docs/threatslayer-detect.png">

After the user confirms that they are aware the site is malicious,
they may proceed to interact with it at their own risk. To remind the
user that the site has been classified as malicious, Threatslayer
places a red dotted border around the document body.

<img width="421" alt="Threatslayer reacting to a malicious link" src="docs/threatslayer-danger.png">

## Site cannot be classified
If Threatslayer is unsure about the status of a site, the site is
outlined with a yellow dotted border.

<img width="421" alt="Threatslayer reacting to a malicious link" src="docs/threatslayer-unscanned.png">

# Infrastructure

Threatslayer URL scanning is performed via Interlock's DigitalOcean
droplet, your computer is never at risk from the scanning operation.

# Maintainer

The maintainer for Threatslayer is
[@jmercouris](https://github.com/jmercouris).
