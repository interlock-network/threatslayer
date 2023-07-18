<template>
  <div id="app-container">
    <div id="top-container">
      <SideBar :selectPage="selectPage" :currentPage="currentPage" />
      <div id="view-container">
        <EarnPage v-if="currentPage === 'earn'" :selectPage="selectPage" />
        <WalletPage v-if="currentPage === 'wallet'" :selectPage="selectPage" />
        <LoginPage v-if="currentPage === 'login'" :selectPage="selectPage" />
        <SlayCount v-if="currentPage === 'slayCount'" />
        <AboutPage v-if="currentPage === 'about'" />
        <FAQPage v-if="currentPage === 'faq'" />
        <OptionsPage v-if="currentPage === 'options'" />
      </div>
    </div>
    <PageFooter />
  </div>
</template>
<script>
import AboutPage from "./pages/AboutPage.vue";
import EarnPage from "./pages/EarnPage.vue";
import FAQPage from "./pages/FAQPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import OptionsPage from "./pages/OptionsPage.vue";
import PageFooter from "./pages/PageFooter.vue";
import SideBar from "./pages/SideBar.vue";
import SlayCount from "./pages/SlayCount.vue";
import WalletPage from "./pages/WalletPage.vue";

export default {
  name: 'App',
  components: {
    AboutPage,
    EarnPage,
    FAQPage,
    LoginPage,
    OptionsPage,
    PageFooter,
    SideBar,
    SlayCount,
    WalletPage
  },
  data() {
    return {
      currentPage: 'earn',
    };
  },
  methods: {
    selectPage(page) {
      if (page === 'privacy') {
        // TODO update to real privacy page URL
        window.open('https://interlock.network');
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
  height: 2.25rem;
  margin-bottom: 1rem;
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
