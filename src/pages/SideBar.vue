<template>
    <div id="sidebar-nav">
        <!-- Key: {{ key }}, Username: {{ username }} -->
        <img id="threatslayer-logo" src="/src/assets/images/threatslayer_logo.png">
        <div id="sidebar-earn" v-if="showRegisterPage" class="sidebar-item"
            :class="currentPage === 'earn' ? 'selected-sidebar-item' : ''" @click="selectPage('earn')">
            <img class="sidebar-icon" src="/src/assets/images/start_earning.png"><span class=sidebar-text>Start
                Earning</span>
        </div>
        <div id="sidebar-wallet" v-if="showRegisterPage" class="sidebar-item"
            :class="currentPage === 'wallet' ? 'selected-sidebar-item' : ''" @click="selectPage('wallet')">
            <img class="sidebar-icon" src="/src/assets/images/wallet.png"><span class=sidebar-text>Create Wallet</span>
        </div>
        <div id="sidebar-login" v-if="showLoginPage" class="sidebar-item"
            :class="currentPage === 'login' ? 'selected-sidebar-item' : ''" @click="selectPage('login')">
            <div style="position: relative">
                <img class="sidebar-icon" src="/src/assets/images/login.png"><span class="sidebar-text">Login</span>
            </div>
        </div>
        <div id="sidebar-slayCount" class="sidebar-item" :class="currentPage === 'slayCount' ? 'selected-sidebar-item' : ''"
            @click="selectPage('slayCount')">
            <img class="sidebar-icon" src="/src/assets/images/slay_count.png">Slay Count
        </div>
        <div id="sidebar-about" class="sidebar-item" :class="currentPage === 'about' ? 'selected-sidebar-item' : ''"
            @click="selectPage('about')">
            <img class="sidebar-icon" src="/src/assets/images/about.png">About Us
        </div>
        <div id="sidebar-faq" class="sidebar-item" :class="currentPage === 'faq' ? 'selected-sidebar-item' : ''"
            @click="selectPage('faq')">
            <img class="sidebar-icon" src="/src/assets/images/faq.png">FAQ
        </div>
        <div id="sidebar-privacy" class="sidebar-item" :class="currentPage === 'privacy' ? 'selected-sidebar-item' : ''"
            @click="selectPage('privacy')">
            <img class="sidebar-icon" src="/src/assets/images/privacy.png">Privacy <img class="link-button-icon"
                src="/src/assets/images/external_link.png">
        </div>
        <div id="sidebar-options" class="sidebar-item" :class="currentPage === 'options' ? 'selected-sidebar-item' : ''"
            @click="selectPage('options');">
            <img class="sidebar-icon" src="/src/assets/images/options.png">Options
        </div>
        <div style="position: absolute; bottom: 23vh;">
            <div id="sidebar-options" class="sidebar-item" :class="currentPage === 'account' ? 'selected-sidebar-item' : ''"
                @click="selectPage('account');">
                <img class="sidebar-icon" src="/src/assets/images/account.png">{{ username }}
            </div>
            <LogoutButton v-if="showLogoutButton" :checkState="checkState" :selectPage="selectPage" />
        </div>
        <!-- TODO delete these four buttons? -->
        <button v-if="devMode" class="" @click="_toggleRegistered" style="pointer-events: initial;">Toggle Register</button>
        <button v-if="devMode" class="" @click="_toggleLoggedIn" style="pointer-events: initial;">Toggle Login</button>
        <button v-if="devMode" class="" @click="_clearLogin" style="pointer-events: initial;">Clear Login</button>
        <button v-if="devMode" class="" @click="checkState" style="pointer-events: initial;">Check State</button>
    </div>
</template>
<script>
import LogoutButton from "./components/subcomponents/LogoutButton.vue";

import { getChromeStorage, setChromeStorage } from '../utilities.js';

export default {
    name: 'SideBar',
    props: {
        currentPage: String,
        selectPage: Function,
    },
    components: {
        LogoutButton
    },
    data() {
        return {
            devMode: false,
            key: null,
            registered: false,
            username: null
        }
    },
    mounted() {
        this.checkState();
    },
    computed: {
        showRegisterPage() {
            return !this.registered;
        },
        showLoginPage() {
            return !this.showLogoutButton;
        },
        showLogoutButton() {
            return this.key && this.username;
        }
    },
    methods: {
        async checkState() {
            // if logged in, hide register and login pages
            // then navigate to the profile page
            const devMode = await getChromeStorage('devMode');
            const isRegistered = await getChromeStorage('registered');
            const key = await getChromeStorage('key');
            const username = await getChromeStorage('username');

            this.devMode = devMode;
            this.registered = isRegistered;
            this.key = key;
            this.username = username;

            if (key && username) {
                // TODO delete this
                this.selectPage('slayCount');
            } else if (isRegistered) {
                this.selectPage('login');
            } else {
                this.selectPage('earn');
            }
        },
        // TODO delete this
        async _clearLogin() {
            setChromeStorage({ key: null });
            setChromeStorage({ username: null });

            this.checkState();
        },
        // TODO delete this
        async _toggleLoggedIn() {
            const nextKey = this.key ? null : 'abc-456'
            const nextUsername = this.username ? null : 'alice';

            const keySet = await setChromeStorage({ key: nextKey }, `Set key as ${nextKey}`, `Error setting key as ${nextKey}`);
            const usernameSet = await setChromeStorage({ username: nextUsername }, `Set username as ${nextUsername}`, `Error setting key as ${nextUsername}`);

            if (keySet && usernameSet) this.checkState()
        },
        // TODO delete this
        async _toggleRegistered() {
            setChromeStorage({ 'registered': !this.registered });

            this.checkState();
        }
    }
}
</script>

<style>
#sidebar-nav {
    background: #211037;
    border-top-left-radius: 10px;
    float: left;
    height: 83vh;
    padding-left: 2rem;
    margin-top: 2rem;
    width: 250px;
}

#threatslayer-logo {
    height: 250px;
    margin-left: -3rem;
    margin-bottom: -3rem;
    margin-top: -2rem;
    width: 250px;
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
    position: relative;
    top: 5px;
    width: 20px;
}

.sidebar-text {
    left: 25px;
}
</style>
