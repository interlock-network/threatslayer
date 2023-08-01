<template>
  <div id="app-container">
    <div id="top-container">
      <SideBar v-bind="{ checkState, currentPage, devMode, key, loggedIn, registered, selectPage, username }" />
      <div id="view-container">
        <EarnPage v-if="currentPage === 'earn'" :selectPage="selectPage" />
        <WalletPage v-if="currentPage === 'wallet'" :selectPage="selectPage" />
        <LoginPage v-if="currentPage === 'login'" :checkState="checkState" :selectPage="selectPage" />
        <SlayCount v-if="currentPage === 'slayCount'" />
        <AboutPage v-if="currentPage === 'about'" />
        <FAQPage v-if="currentPage === 'faq'" />
        <OptionsPage v-if="currentPage === 'options'" />
        <AccountPage v-if="currentPage === 'account'" :checkState="checkState" />
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
    WalletPage
  },
  data() {
    return {
      currentPage: 'account',
      devMode: false,
      key: null,
      loggedIn: false,
      registered: false,
      username: null
    };
  },
  methods: {
    async checkState() {
      // if logged in, hide register and login pages
      // then navigate to the profile page
      const devMode = await getChromeStorage('devMode');
      const isRegistered = await getChromeStorage('registered');
      const key = await getChromeStorage('key');
      const loggedIn = await getChromeStorage('loggedIn');
      const username = await getChromeStorage('username');

      this.devMode = devMode;
      this.registered = isRegistered;
      this.key = key;
      this.loggedIn = loggedIn;
      this.username = username;

      if (loggedIn) {
        // TODO delete this
        this.selectPage('slayCount');
      } else if (isRegistered) {
        this.selectPage('login');
      } else {
        this.selectPage('earn');
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
  background-color: #0F0818;
  color: #d0d4d9;
  font-size: 1.1rem;
  /* pointer-events: none; */
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

.clear-button {
  background-color: #0F0818;
  border: #BB00FD solid 1px;
  border-radius: 12px;
  color: #d0d4d9;
  font-size: 1.25rem;
  padding: 0.5rem 0.75rem;
  width: 400px;
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

.small-button {
  background-color: #060708;
  border: 1px solid #d0d4d9;
  color: #d0d4d9;
  pointer-events: initial;
}

.submit-button {
  background: linear-gradient(216.99deg, #BB00FD 22.5%, #51066B 112.78%);
  border: none;
  border-radius: 12px;
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
