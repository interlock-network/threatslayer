<template>
  <div id="app-container">
    <div id="top-container">
      <SideBar
        v-bind="{ apiKey, checkState, currentPage, devMode, loggedIn, registered, selectPage, urlToStake, username }" />
      <div id="view-container">
        <StakingPage v-if="currentPage === 'staking'" v-bind="{ apiKey, loggedIn, registered, selectPage, urlToStake }" />
        <EarnPage v-if="currentPage === 'earn'" v-bind="{ checkState, selectPage, urlToStake }" />
        <WalletPage v-if="currentPage === 'wallet'" :selectPage="selectPage" />
        <LoginPage v-if="currentPage === 'login'" v-bind="{ checkState, selectPage, urlToStake }" />
        <SlayCount v-if="currentPage === 'slayCount'" :apiKey="apiKey" :username="username" />
        <AboutPage v-if="currentPage === 'about'" />
        <FAQPage v-if="currentPage === 'faq'" />
        <OptionsPage v-if="currentPage === 'options'" />
        <AccountPage v-if="currentPage === 'account'"
          v-bind="{ address, apiKey, checkState, email, selectPage, username }" />
      </div>
    </div>
    <PageFooter />
  </div>
</template>
<script>
import AboutPage from "./pages/AboutPage.vue";
import AccountPage from "./pages/AccountPage.vue";
import EarnPage from "./pages/EarnPage.vue";
import FAQPage from "./pages/FAQPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import OptionsPage from "./pages/OptionsPage.vue";
import PageFooter from "./pages/PageFooter.vue";
import SideBar from "./pages/SideBar.vue";
import SlayCount from "./pages/SlayCount.vue";
import StakingPage from "./pages/StakingPage.vue";
import WalletPage from "./pages/WalletPage.vue";

import { getChromeStorage } from './utilities.js';

export default {
  name: 'App',
  components: {
    AboutPage,
    EarnPage,
    FAQPage,
    LoginPage,
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
      address: null,
      apiKey: null,
      currentPage: 'account',
      devMode: false,
      email: null,
      loggedIn: false,
      registered: false,
      urlToStake: null,
      username: null
    };
  },
  mounted() {
    this.checkState();
  },
  methods: {
    async checkState() {
      const address = await getChromeStorage('address'); // optional, may be missing
      const apiKey = await getChromeStorage('apiKey');
      const devMode = await getChromeStorage('devMode');
      const email = await getChromeStorage('email');
      const loggedIn = await getChromeStorage('loggedIn');
      const isRegistered = await getChromeStorage('registered');
      const urlToStake = await getChromeStorage('urlToStake');
      const username = await getChromeStorage('username');

      this.devMode = devMode;
      this.loggedIn = loggedIn;
      this.registered = isRegistered;
      this.urlToStake = urlToStake;

      if (isRegistered === false) {
        this.selectPage('earn');
      } else if (loggedIn === false) {
        this.selectPage('login');
      } else if (apiKey && email && username) {
        this.address = address;
        this.apiKey = apiKey;
        this.email = email;
        this.username = username;

        if (urlToStake) {
          this.selectPage('staking');
        } else {
          this.selectPage('slayCount');
        }
      } else if (urlToStake) {
        // TODO add message if users aren't logged in and have a URL to stake
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
  src: url('./extension/static/fonts/TTF/THICCCBOI-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "THICCCBOI";
  src: local("THICCCBOI-ExtraBold");
  src: url('./extension/static/fonts/TTF/THICCCBOI-ExtraBold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
}

/* @font-face {
  font-family: "THICCCBOI";
  src: local("THICCCBOI-ExtraBold");
  src: url('./extension/static/fonts/TTF/THICCCBOI-ExtraBold.ttf') format('truetype');
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
  font-size: 1.1rem;
  /* pointer-events: none; */
}

button {
  cursor: default;
}

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

#show-toggle-button {
  background-color: #0F0818;
  border: none;
  color: #963cf5;
  float: right;
  margin-right: 50px;
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

.login-button {
  background-color: #0F0818;
  border: none;
  color: #963cf5;
  font-size: 1rem;
  font-weight: bold;
  pointer-events: initial;
}

.link-button-icon {
  height: 1rem;
}

.banner-icon {
  height: 20px;
  padding-right: 0.5rem;
  position: relative;
  top: 3px;
  width: 20px;
}

.secondary-hollow-button {
  background-color: #0F0818;
  border: #9000CB solid 1px;
  border-radius: 1.25rem;
  color: #FFFFFF;
  font-size: 1.25rem;
  padding: 0.5rem 0.75rem;
  width: 400px;
}

.small-button {
  background-color: #060708;
  border: 1px solid #d0d4d9;
  color: #FFFFFF;
  pointer-events: initial;
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
