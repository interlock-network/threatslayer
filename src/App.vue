<template>
  <div id="app-container">
    <div id="sidebar-nav">
      <img id="threatslayer-logo" src="/src/assets/images/threatslayer_logo.png">
      <div id="sidebar-earn" v-if="showRegisterPage" class="sidebar-item selected-sidebar-item"
        @click="selectPage('earn')">
        <img class="sidebar-icon" src="/src/assets/images/home.png"><span class=sidebar-text>Start Earning</span>
      </div>
      <div id="sidebar-login" v-if="showLoginPage" class="sidebar-item" @click="selectPage('login')">
        <div style="position: relative">
          <img class="sidebar-icon" src="/src/assets/images/home.png"><span class="sidebar-text">Login</span>
        </div>
      </div>
      <div id="sidebar-collect" class="sidebar-item" @click="selectPage('collect')">
        <img class="sidebar-icon" src="/src/assets/images/home.png">Collect
      </div>
      <div id="sidebar-slayCount" class="sidebar-item" @click="selectPage('slayCount')">
        <img class="sidebar-icon" src="/src/assets/images/home.png">Slay Count
      </div>
      <div id="sidebar-about" class="sidebar-item" @click="selectPage('about')">
        <img class="sidebar-icon" src="/src/assets/images/home.png">About Us
      </div>
      <div id="sidebar-privacy" class="sidebar-item" @click="selectPage('privacy')">
        <img class="sidebar-icon" src="/src/assets/images/home.png">Privacy <img class="link-button-icon"
          src="/src/assets/images/external_link.png">
      </div>
      <div id="sidebar-options" class="sidebar-item" @click="selectPage('options')">
        <img class="sidebar-icon" src="/src/assets/images/home.png">Options
      </div>
      <!-- TODO delete these two buttons -->
      <br />
      <br />
      <br />
      <button class="hidden-item" @click="_toggleRegistered" style="pointer-events: initial;">Toggle Register</button>
      <br />
      <button class="hidden-item" @click="_toggleLogin" style="pointer-events: initial;">Toggle Login</button>
    </div>
    <div id="view-container">
      <EarnPage v-if="currentPage === 'earn'" :changePage="changePage" />
      <LoginPage v-if="currentPage === 'login'" :changePage="changePage" />
      <SlayCount v-if="currentPage === 'slayCount'" />
      <AboutPage v-if="currentPage === 'about'" />
      <OptionsPage v-if="currentPage === 'options'" />
    </div>
    <div id="footer-container">
      <PageFooter />
    </div>
  </div>
</template>
<script>
import AboutPage from "./pages/AboutPage.vue";
import EarnPage from "./pages/EarnPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import OptionsPage from "./pages/OptionsPage.vue";
import PageFooter from "./pages/components/PageFooter.vue";
import SlayCount from "./pages/SlayCount.vue";

export default {
  name: 'App',
  components: {
    AboutPage,
    EarnPage,
    LoginPage,
    OptionsPage,
    PageFooter,
    SlayCount
  },
  data() {
    return {
      currentPage: 'earn',
      loggedIn: false,
      registered: false,
    };
  },
  mounted() {
    this.isLoggedIn();
    this.isRegistered();
  },
  computed: {
    showRegisterPage() {
      return !this.registered && !this.loggedIn;
    },
    showLoginPage() {
      return !this.loggedIn;
    }
  },
  methods: {
    // TODO delete this
    _toggleLogin() {
      chrome.storage.local.set({ 'loggedIn': !this.loggedIn });
      this.isLoggedIn();
    },
    // TODO delete this
    _toggleRegistered() {
      chrome.storage.local.set({ 'registered': !this.registered });
      this.isRegistered();
    },
    changePage(pageName) {
      this.currentPage = pageName;
      this.selectPage(pageName);
    },
    async isLoggedIn() {
      // if logged in, hide register and login pages
      // then navigate to the profile page

      try {
        const storageLoggedIn = await chrome.storage.local.get('loggedIn')
          .then(response => {
            const { loggedIn } = response;
            console.log('loggedIn', loggedIn);
            return loggedIn;
          });

        this.loggedIn = storageLoggedIn;
        // TODO uncomment
        // if (storageLoggedIn) {
        //   this.currentPage = 'profile';
        // }
      } catch (err) {
        console.log("isLoggedIn err", err);
      }
    },
    async isRegistered() {
      try {
        const storageRegistered = await chrome.storage.local.get('registered')
          .then(response => {
            const { registered } = response;

            return registered;
          });

        this.registered = storageRegistered;

        // if registered (but not logged in), switch to login page
        // otherwise user stays on the "earn" page via the mounted() lifecycle call
        if (storageRegistered) {
          this.currentPage = 'login';
        }
      } catch (err) {
        console.log("isRegistered err", err);
      }
    },
    selectPage(page) {
      if (page === 'privacy') {
        // TODO update to real privacy page URL
        window.open('https://interlock.network');
      } else {
        // change the main page content
        this.currentPage = page;

        // highlight the selected sidebar item
        const sidebarItems = document.getElementsByClassName('sidebar-item');

        for (let i = 0; i < sidebarItems.length; i++) {
          const item = sidebarItems[i];
          item.classList.remove('selected-sidebar-item');
        }

        const targetId = `sidebar-${page}`;
        console.log('targetId', targetId);
        const targetElement = document.getElementById(targetId);
        targetElement.classList.add('selected-sidebar-item');
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
  pointer-events: none;
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
  height: 90%;
  left: 18rem;
  padding-left: 2rem;
  position: absolute;
  top: 4rem;
  width: 450px;
}

#sidebar-nav {
  background: #211037;
  border-radius: 10px;
  left: 2rem;
  height: 90%;
  padding-left: 2rem;
  position: absolute;
  top: 4rem;
  width: 250px;
}

#threatslayer-logo {
  height: 250px;
  margin-left: -3rem;
  margin-bottom: -3rem;
  margin-top: -2rem;
  width: 250px;
}

#footer-container {
  background-color: #0F0818;
  bottom: 0;
  left: 2rem;
  height: 15%;
  position: absolute;
  width: 750px;
}

.clear-button {
  background-color: #0F0818;
  border: #d0d4d9 solid 1px;
  border-radius: 12px;
  color: #d0d4d9;
  font-size: 1.25rem;
  padding: 0.5rem 0.75rem;
  width: 400px;
}

.hidden-item {
  display: none;
}

.link-button-icon {
  height: 1rem;
}

.sidebar-item {
  line-height: 2rem;
  margin-bottom: 1rem;
  pointer-events: initial;
}

.selected-sidebar-item {
  background: #BB00FD;
  border-radius: 6px;
  margin-left: -0.5rem;
  padding-left: 0.5rem;
  width: 80%;
}

.sidebar-icon {
  height: 20px;
  padding-right: 0.5rem;
  /* position: absolute; */
  top: 5px;
  width: 20px;
}

.sidebar-text {
  /* position: absolute; */
  left: 25px;
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
  /* border: 3px solid #3b8de8; */
  /* color: #963cf5; */
  opacity: 1;
  /* outline: none; */
  pointer-events: initial;
}

.submit-button-error {
  color: red;
}

.submit-button-disabled {
  /* border: 1px solid #d0d4d9; */
  color: #FFFFFF;
  opacity: 0.3;
  pointer-events: none;
}
</style>
