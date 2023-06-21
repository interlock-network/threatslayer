<template>
  <div id="app-container">
    <div id="sidebar-nav">
      <h3 id="sidebar-banner"><span class="name-start">Threat</span><span class="name-end">Slayer</span></h3>
      <div id="sidebar-earn" v-if="showRegisterPage" class="sidebar-item selected-sidebar-item"
        @click="selectPage('earn', $event)">Start Earning</div>
      <div id="sidebar-login" v-if="showLoginPage" class="sidebar-item" @click="selectPage('login', $event)">Login</div>
      <div id="sidebar-collect" class="sidebar-item" @click="selectPage('collect', $event)">Collect</div>
      <div id="sidebar-slayCount" class="sidebar-item" @click="selectPage('slayCount', $event)">Slay Count</div>
      <div id="sidebar-about" class="sidebar-item" @click="selectPage('about', $event)">About Us</div>
      <div id="sidebar-privacy" class="sidebar-item" @click="selectPage('privacy', $event)">Privacy <img
          class="link-button-icon" src="/src/assets/images/external_link.png"></div>
      <div id="sidebar-options" class="sidebar-item" @click="selectPage('options', $event)">Options</div>
      <!-- TODO delete these two buttons -->
      <br />
      <br />
      <br />
      <button @click="_toggleRegistered" style="pointer-events: initial;">Toggle Register</button>
      <br />
      <button @click="_toggleLogin" style="pointer-events: initial;">Toggle Login</button>
    </div>
    <div id="page-container">
      <EarnPage v-if="currentPage === 'earn'" />
      <LoginPage v-if="currentPage === 'login'" />
      <SlayCount v-if="currentPage === 'slayCount'" />
      <AboutPage v-if="currentPage === 'about'" />
      <OptionsPage v-if="currentPage === 'options'" />
      <div id="footer-container">
        <PageFooter />
      </div>
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
      return !this.registered;
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
    selectPage(page, event) {
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

        event.target.classList.add('selected-sidebar-item');
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  font-family: Helvetica;
}

a {
  color: inherit;
}

a:focus {
  border: 3px solid #3b8de8;
  outline: none;
}

body {
  background-color: #060708;
  color: #d0d4d9;
  font-size: 1.1rem;
  margin-top: 1rem;
  margin-left: 25%;
  pointer-events: none;
  width: 700px;
}

#app-container {
  width: 100%;
}

#page-container {
  float: right;
  margin-bottom: 2rem;
  width: 75%;
}

#sidebar-banner {
  display: block;
  width: 100%;
}

#sidebar-nav {
  float: left;
  margin-bottom: 2rem;
  width: 25%;
}

#footer-container {
  align-items: flex-start;
  margin-top: 4rem;
  position: absolute;
  width: 100%;
}

.link-button-icon {
  height: 1rem;
  /* padding-left: 0.25rem; */
}

.name-start {
  color: #3b8de8;
}

.name-end {
  color: #963cf5;
}

.sidebar-item {
  line-height: 2rem;
  opacity: 0.9;
  pointer-events: initial;
}

.hidden-item {
  display: none;
}

.selected-sidebar-item {
  font-weight: 900;
  opacity: 1;
}
</style>
