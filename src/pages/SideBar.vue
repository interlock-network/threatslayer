<template>
    <div id="sidebar-nav">
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
        <div v-if="showLogoutButton" id="bottom-sidebar-items">
            <div id="sidebar-account" class="sidebar-item" :class="currentPage === 'account' ? 'selected-sidebar-item' : ''"
                @click="selectPage('account');">
                <img class="sidebar-icon" src="/src/assets/images/account.png">{{ username }}
            </div>
            <LogoutButton v-bind="{ apiKey, checkState, selectPage, username }" />
        </div>
        <!-- TODO delete these four buttons -->
        <button v-if="devMode" class="" @click="_toggleRegistered" style="pointer-events: initial;">Toggle Register</button>
        <button v-if="devMode" class="" @click="_toggleLoggedIn" style="pointer-events: initial;">Toggle Login</button>
        <button v-if="devMode" class="" @click="_clearLogin" style="pointer-events: initial;">Clear Login</button>
        <button v-if="devMode" class="" @click="checkState" style="pointer-events: initial;">Check State</button>
    </div>
</template>
<script>
import LogoutButton from "./components/buttons/LogoutButton.vue";

import { clearChromeStorage, setChromeStorage } from '../utilities.js';

export default {
    name: 'SideBar',
    props: {
        apiKey: String,
        checkState: Function,
        currentPage: String,
        devMode: Boolean,
        loggedIn: Boolean,
        registered: Boolean,
        selectPage: Function,
        username: String
    },
    components: {
        LogoutButton
    },
    mounted() {
        this.checkState();
    },
    computed: {
        showRegisterPage() {
            return this.registered === false;
        },
        showLoginPage() {
            return this.loggedIn === false || this.registered === false;
        },
        showLogoutButton() {
            return this.loggedIn;
        }
    },
    methods: {
        // TODO delete this
        async _clearLogin() {
            await clearChromeStorage('address');
            await clearChromeStorage('apiKey');
            await clearChromeStorage('email');
            await clearChromeStorage('username');
            await setChromeStorage({ loggedIn: false });
            await setChromeStorage({ allowlist: null });

            this.checkState();
        },
        // TODO delete this
        async _toggleLoggedIn() {
            const address = this.loggedIn ? null : '5GrpknVvGGrGH3EFuURXeMrWHvbpj3VfER1oX5jFtuGbfzCE';
            const email = this.loggedIn ? null : 'alice@example.com';
            const key = this.loggedIn ? null : 'threatslayer-api-key';
            const loggedIn = !this.loggedIn;
            const username = this.loggedIn ? null : 'alice';

            const addressSet = await setChromeStorage({ address }, `Set address as ${address}`, `Error setting key as ${address}`);
            const emailSet = await setChromeStorage({ email }, `Set email as ${email}`, `Error setting email as ${email}`);
            const keySet = await setChromeStorage({ apiKey: key }, `Set key as ${key}`, `Error setting key as ${key}`);
            const loggedInSet = await setChromeStorage({ loggedIn }, `Set loggedIn as ${loggedIn}`, `Error setting loggedIn as ${loggedIn}`);
            const usernameSet = await setChromeStorage({ username }, `Set username as ${username}`, `Error setting key as ${username}`);

            if (emailSet && keySet && loggedInSet && usernameSet && addressSet) this.checkState();
        },
        // TODO delete this
        async _toggleRegistered() {
            const nextRegistered = !this.registered;

            await setChromeStorage({ registered: nextRegistered });
            await setChromeStorage({ loggedIn: nextRegistered });

            if (nextRegistered) {
                await clearChromeStorage('address');
                await clearChromeStorage('apiKey');
                await clearChromeStorage('email');
                await clearChromeStorage('username');
            }

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

#bottom-sidebar-items {
    bottom: 23vh;
    position: absolute;
    width: 240px;
}

.hidden-item {
    display: none;
}

.link-button-icon {
    height: 1rem;
}

.sidebar-item {
    cursor: default;
    line-height: 2rem;
    margin-bottom: 0.5rem;
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
