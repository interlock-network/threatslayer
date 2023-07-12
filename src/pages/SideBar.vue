<template>
    <div id="sidebar-nav">
        <img id="threatslayer-logo" src="/src/assets/images/threatslayer_logo.png">
        <div id="sidebar-earn" v-if="showRegisterPage" class="sidebar-item selected-sidebar-item"
            @click="selectPage('earn')">
            <img class="sidebar-icon" src="/src/assets/images/start_earning.png"><span class=sidebar-text>Start
                Earning</span>
        </div>
        <div id="sidebar-wallet" v-if="showRegisterPage" class="sidebar-item" @click="selectPage('wallet')">
            <img class="sidebar-icon" style="height: 17px; width: 17px; top: 2px;" src="/src/assets/images/wallet.png"><span
                class=sidebar-text>Create Wallet</span>
        </div>
        <div id="sidebar-login" v-if="showLoginPage" class="sidebar-item" @click="selectPage('login')">
            <div style="position: relative">
                <img class="sidebar-icon" src="/src/assets/images/login.png"><span class="sidebar-text">Login</span>
            </div>
        </div>
        <div id="sidebar-collect" class="sidebar-item" @click="selectPage('collect')">
            <img class="sidebar-icon" src="/src/assets/images/home.png">Collect
        </div>
        <div id="sidebar-slayCount" class="sidebar-item" @click="selectPage('slayCount')">
            <img class="sidebar-icon" src="/src/assets/images/slay_count.png">Slay Count
        </div>
        <div id="sidebar-about" class="sidebar-item" @click="selectPage('about')">
            <img class="sidebar-icon" src="/src/assets/images/about.png">About Us
        </div>
        <div id="sidebar-privacy" class="sidebar-item" @click="selectPage('privacy')">
            <img class="sidebar-icon" src="/src/assets/images/privacy.png"
                style="height: 17px; width: 17px; top: 2px;">Privacy <img class="link-button-icon"
                src="/src/assets/images/external_link.png">
        </div>
        <div id="sidebar-options" class="sidebar-item" @click="selectPage('options')">
            <img class="sidebar-icon" src="/src/assets/images/options.png">Options
        </div>
        <!-- TODO delete these two buttons -->
        <br />
        <br />
        <br />
        <button class="hidden-item" @click="_toggleRegistered" style="pointer-events: initial;">Toggle
            Register</button>
        <br />
        <button class="hidden-item" @click="_toggleLogin" style="pointer-events: initial;">Toggle Login</button>
    </div>
</template>
<script>
export default {
    name: 'SideBar',
    props: {
        currentPage: String,
        loggedIn: String,
        registered: String,
        selectPage: Function
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
    }
}
</script>

<style>
#sidebar-nav {
    background: #211037;
    border-top-left-radius: 10px;
    float: left;
    height: 90vh;
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
