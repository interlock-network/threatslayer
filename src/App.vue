<template>
  <div id="app-container">
    <div id="sidebar-nav">
      <h3 id="sidebar-banner"><span class="name-start">Threat</span><span class="name-end">Slayer</span></h3>
      <div id="sidebar-earn" v-if="!registered && !loggedIn" class="sidebar-item selected-sidebar-item"
        @click="selectPage('earn', $event)">Start Earning</div>
      <div id="sidebar-login" class="sidebar-item" @click="selectPage('login', $event)">Login</div>
      <div id="sidebar-collect" class="sidebar-item" @click="selectPage('collect', $event)">Collect</div>
      <div id="sidebar-slayCount" class="sidebar-item" @click="selectPage('slayCount', $event)">Slay Count</div>
      <div id="sidebar-about" class="sidebar-item" @click="selectPage('about', $event)">About Us</div>
      <div id="sidebar-privacy" class="sidebar-item" @click="selectPage('privacy', $event)">Privacy & Security</div>
      <div id="sidebar-options" class="sidebar-item" @click="selectPage('options', $event)">Options</div>
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
    this.isRegistered();
    this.isLoggedIn();
  },
  computed: {
  },
  methods: {
    isLoggedIn() {
      // if unregistered, switch to earn page
      try {
        chrome.storage.local.get('loggedIn', response => {
          const { loggedIn = false } = response;

          if (loggedIn) {
            this.loggedIn = loggedIn;
          }
        });
      } catch (err) {
        console.log("isLoggedIn err", err);
      }
    },
    isRegistered() {
      // if registered, show slaycount
      try {
        chrome.storage.local.get('registered', response => {
          const { registered = false } = response;

          if (registered) {
            this.registered = registered;
            this.currentPage = slayCount;
          }
        });
      } catch (err) {
        console.log("isRegistered err", err);
      }
    },
    selectPage(page, event) {
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

.selected-sidebar-item {
  font-weight: 900;
  opacity: 1;
}
</style>
