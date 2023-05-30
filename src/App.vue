<template>
  <div id="app-container">
    <div id="sidebar-nav">
      <h3 id="sidebar-banner"><span class="name-start">Threat</span><span class="name-end">Slayer</span></h3>
      <div class="sidebar-item" @click="selectPage('earn')">Start Earning</div>
      <div class="sidebar-item" @click="selectPage('collect')">Collect</div>
      <div class="sidebar-item" @click="selectPage('slayCount')">Slay Count</div>
      <div class="sidebar-item" @click="selectPage('about')">About Us</div>
      <div class="sidebar-item" @click="selectPage('privacy')">Privacy and Security</div>
      <div class="sidebar-item" @click="selectPage('options')">Options</div>
      <PageFooter />
    </div>
    <div id="page-container">
      <EarnPage v-if="currentPage === 'earn'" />
      <SlayCount v-if="currentPage === 'slayCount'" />
    </div>
  </div>
</template>
<script>
import EarnPage from "./pages/EarnPage.vue";
import PageFooter from "./pages/components/PageFooter.vue";
import SlayCount from "./pages/SlayCount.vue";

export default {
  name: 'App',
  components: {
    EarnPage,
    PageFooter,
    SlayCount
  },
  data() {
    return {
      currentPage: 'earn'
    };
  },
  mounted() {
    // get registered status from extension storage
    // if unregistered, switch to earn page
    // if registered, show slaycount
  },
  computed: {
  },
  methods: {
    selectPage(page) {
      this.currentPage = page;
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

#app-container {
  width: 100%;
}

#page-container {
  float: right;
  width: 75%;
}

#sidebar-banner {
  display: block;
  width: 100%;
}

#sidebar-nav {
  float: left;
  width: 25%;
}

.name-start {
  color: #3b8de8;
}

.name-end {
  color: #963cf5;
}

.sidebar-item {
  line-height: 2rem;
  pointer-events: initial;
}
</style>
