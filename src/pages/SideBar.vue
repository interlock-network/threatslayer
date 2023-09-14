<template>
    <div id="sidebar-nav">
        <img id="threatslayer-logo" src="/src/assets/images/threatslayer_logo.png">
        <div id="sidebar-earn" v-if="showRegisterPage" class="sidebar-item"
            :class="currentPage === 'earn' ? 'selected-sidebar-item' : ''" @click="selectPage('earn')">
            <img class="sidebar-icon" src="/src/assets/images/start_earning.png"><span class=sidebar-text>{{
                $i18n('start_earning') }}</span>
        </div>
        <div id="sidebar-wallet" v-if="showRegisterPage" class="sidebar-item"
            :class="currentPage === 'wallet' ? 'selected-sidebar-item' : ''" @click="selectPage('wallet')">
            <img class="sidebar-icon" src="/src/assets/images/wallet.png"><span class=sidebar-text>{{ $i18n('create_wallet')
            }}</span>
        </div>
        <div id="sidebar-login" v-if="showLoginPage" class="sidebar-item"
            :class="currentPage === 'login' ? 'selected-sidebar-item' : ''" @click="selectPage('login')">
            <div style="position: relative">
                <img class="sidebar-icon" src="/src/assets/images/login.png"><span class="sidebar-text">{{ $i18n('login')
                }}</span>
            </div>
        </div>
        <div v-if="urlToStake" id="sidebar-staking" class="sidebar-item"
            :class="currentPage === 'staking' ? 'selected-sidebar-item' : ''" @click="selectPage('staking')">
            <img class="sidebar-icon" src="/src/assets/images/slay_count.png">{{ $i18n('security_staking') }}
        </div>
        <div id="sidebar-slayCount" class="sidebar-item" :class="currentPage === 'slayCount' ? 'selected-sidebar-item' : ''"
            @click="selectPage('slayCount')">
            <img class="sidebar-icon" src="/src/assets/images/slay_count.png">{{ $i18n('slay_count') }}
        </div>
        <div id="sidebar-about" class="sidebar-item" :class="currentPage === 'about' ? 'selected-sidebar-item' : ''"
            @click="selectPage('about')">
            <img class="sidebar-icon" src="/src/assets/images/about.png">{{ $i18n('about_us') }}
        </div>
        <div id="sidebar-faq" class="sidebar-item" :class="currentPage === 'faq' ? 'selected-sidebar-item' : ''"
            @click="selectPage('faq')">
            <img class="sidebar-icon" src="/src/assets/images/faq.png">{{ $i18n('faq') }}
        </div>
        <div id="sidebar-privacy" class="sidebar-item" :class="currentPage === 'privacy' ? 'selected-sidebar-item' : ''"
            @click="selectPage('privacy')">
            <img class="sidebar-icon" src="/src/assets/images/privacy.png">{{ $i18n('privacy') }}<img
                class="link-button-icon" src="/src/assets/images/external_link.png">
        </div>
        <div id="sidebar-options" class="sidebar-item" :class="currentPage === 'options' ? 'selected-sidebar-item' : ''"
            @click="selectPage('options');">
            <img class="sidebar-icon" src="/src/assets/images/settings.png">{{ $i18n('options') }}
        </div>
        <div v-if="showLogoutButton" id="bottom-sidebar-items">
            <div id="sidebar-account" class="sidebar-item" :class="currentPage === 'account' ? 'selected-sidebar-item' : ''"
                @click="selectPage('account');">
                <img class="sidebar-icon" src="/src/assets/images/account.png">{{ username }}
            </div>
            <LogoutButton v-bind="{ apiKey, checkState, selectPage, username }" />
        </div>
        <div v-if="!showLogoutButton" id="bottom-sidebar-items">
            <div id="sidebar-account" class="sidebar-item"
                :class="currentPage === 'noAccount' ? 'selected-sidebar-item' : ''" @click="selectPage('noAccount');">
                <img class="sidebar-icon" src="/src/assets/images/account.png">{{ $i18n('account_info') }}
            </div>
        </div>
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
        urlToStake: String,
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
            return this.registered === false && this.loggedIn === false;
        },
        showLoginPage() {
            return this.loggedIn === false;
        },
        showLogoutButton() {
            return this.loggedIn;
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
    margin-top: -3rem;
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
    background: #9000CB;
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
