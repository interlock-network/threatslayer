<template>
  <div id="app-container">
    <div id="top-container">
      <SideBar v-bind="{ apiKey, checkState, currentPage, loggedIn, registered, selectPage, urlToStake, username }" />
      <div id="view-container">
        <StakingPage v-if="currentPage === 'staking'" v-bind="{ apiKey, checkState, loggedIn, registered, selectPage }" />
        <EarnPage v-if="currentPage === 'earn'" v-bind="{ checkState, selectPage, urlToStake }" />
        <WalletPage v-if="currentPage === 'wallet'" :selectPage="selectPage" />
        <LoginPage v-if="currentPage === 'login'" v-bind="{ checkState, selectPage, urlToStake }" />
        <SlayCount v-if="currentPage === 'slayCount'" :apiKey="apiKey" :username="username" />
        <AboutPage v-if="currentPage === 'about'" />
        <FAQPage v-if="currentPage === 'faq'" />
        <OptionsPage v-if="currentPage === 'options'" />
        <AccountPage v-if="currentPage === 'account'"
          v-bind="{ azeroAddress, apiKey, checkState, email, pdotAddress, selectPage, username }" />
        <NoAccountPage v-if="currentPage === 'noAccount'" v-bind="{ checkState, selectPage }" />
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script>
import { getChromeStorage } from './utilities.js';

import AboutPage from "./pages/AboutPage.vue";
import AccountPage from "./pages/AccountPage.vue";
import EarnPage from "./pages/EarnPage.vue";
import FAQPage from "./pages/FAQPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import NoAccountPage from "./pages/NoAccountPage.vue";
import OptionsPage from "./pages/OptionsPage.vue";
import PageFooter from "./pages/PageFooter.vue";
import SideBar from "./pages/SideBar.vue";
import SlayCount from "./pages/SlayCount.vue";
import StakingPage from "./pages/StakingPage.vue";
import WalletPage from "./pages/WalletPage.vue";

export default {
  name: 'App',
  components: {
    AboutPage,
    EarnPage,
    FAQPage,
    LoginPage,
    NoAccountPage,
    OptionsPage,
    PageFooter,
    AccountPage,
    SideBar,
    SlayCount,
    StakingPage,
    WalletPage
  },
  data() {
    return {
      apiKey: null,
      azeroAddress: null,
      currentPage: 'account',
      email: null,
      loggedIn: false,
      pdotAddress: null,
      registered: false,
      urlToStake: null,
      username: null
    }
  },
  mounted() {
    this.checkState();
  },
  methods: {
    async checkState() {
      // these values will all be undefined on first installation
      const apiKey = await getChromeStorage('apiKey') || 'threatslayer-api-key';
      const azeroAddress = await getChromeStorage('azeroAddress'); // optional, may be missing
      const email = await getChromeStorage('email');
      const isRegistered = await getChromeStorage('registered');
      const loggedIn = await getChromeStorage('loggedIn');
      const pdotAddress = await getChromeStorage('pdotAddress'); // optional, may be missing
      const urlToStake = await getChromeStorage('urlToStake');
      const username = await getChromeStorage('username');

      this.loggedIn = loggedIn;
      this.registered = isRegistered;
      this.urlToStake = urlToStake;

      if (!isRegistered) {
        this.selectPage('earn');
      } else if (!loggedIn) {
        this.selectPage('login');
      } else if (apiKey && email && username) {
        this.apiKey = apiKey;
        this.azeroAddress = azeroAddress;
        this.email = email;
        this.pdotAddress = pdotAddress;
        this.username = username;

        if (urlToStake) {
          this.selectPage('staking');
        } else {
          this.selectPage('slayCount');
        }
      } else if (urlToStake) {
        this.selectPage('login');
      }
    },
    selectPage(page) {
      if (page === 'privacy') {
        window.open('https://github.com/interlock-network/knowledgebase-public/blob/main/what/privacy-policy.md');
      } else {
        // change the main page content
        this.currentPage = page;
      }
    }
  }
}
</script>

<style>
@font-face {
  font-family: "THICCCBOI";
  src: local("THICCCBOI");
  src: url('./assets/fonts/TTF/THICCCBOI-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "THICCCBOI";
  src: local("THICCCBOI-ExtraBold");
  src: url('./assets/fonts/TTF/THICCCBOI-ExtraBold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
}

/* @font-face {
  font-family: "THICCCBOI";
  src: local("THICCCBOI-ExtraBold");
  src: url('./assets/fonts/TTF/THICCCBOI-ExtraBold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
} */

#app {
  font-family: "THICCCBOI", Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  font-family: "THICCCBOI";
}

a {
  color: inherit;
}

a:focus {
  border: 3px solid #3b8de8;
  outline: none;
}

body {
  background: url("/src/assets/images/grid_background.png") repeat;
  background-size: 80% 220%;
  background-color: #0F0818;
  color: #FFFFFF;
  font-size: 1.1rem; // why?
}

button {
  cursor: default;
  pointer-events: initial;
}

// Why stop at h3? Also, why even do this? there is a * above for font
family for all elements.

h1,
h2,
h3 {
  font-family: "THICCCBOI";
}

input {
  box-sizing: border-box;
  background: #0F0818;
  border: 1px solid #818181;
  border-radius: 12px;
  color: #818181;
  height: 2rem;
  margin-bottom: 0.75rem;
  margin-right: 50px;
  padding-left: 0.75rem;
  pointer-events: initial;
  width: 400px;
}

#app-container {
  background-color: #0F0818;
  background: url("/src/assets/images/grid_background.png") repeat;
  height: 100%;
  width: 100%;
}

#view-container {
  background-color: #0F0818;
  float: right;
  height: 90vh;
  padding-left: 2rem;
  margin-top: 1rem;
  width: 450px;
}

#top-container {
  margin: auto;
  width: 765px;
}


#url-container {
  min-height: 25vh;
  overflow-y: scroll;
  margin-bottom: 4rem;
}

.login-button {
  background-color: #0F0818;
  border: none;
  color: #963cf5;
  font-size: 1rem;
  font-weight: bold;
  pointer-events: initial;
}

.banner-icon {
  height: 20px;
  padding-right: 0.5rem;
  position: relative;
  top: 3px;
  width: 20px;
}

.generic-error {
  border: "3px solid red";
  color: 'red';
}

.left-label {
  margin-right: 1rem;
}

.secondary-hollow-button {
  background-color: #0F0818;
  border: #9000CB solid 1px;
  border-radius: 1.25rem;
  color: #FFFFFF;
  font-size: 1.25rem;
  padding: 0.5rem 0.75rem;
  pointer-events: initial;
  cursor: pointer;
  width: 400px;
}

.submit-button {
  background: linear-gradient(216.99deg, #B000F7 22.5%, #7400C5 112.78%);
  border: none;
  border-radius: 1.25rem;
  color: #FFFFFF;
  cursor: pointer;
  float: left;
  font-size: 1.25rem;
  padding: 0.5rem 0.75rem;
  width: 400px;
}

.submit-button-active {
  opacity: 1;
  pointer-events: initial;
}

.submit-button-error {
  color: red;
}

.submit-button-disabled {
  color: #FFFFFF;
  opacity: 0.3;
  pointer-events: none;
}
</style>
