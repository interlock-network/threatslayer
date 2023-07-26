<template>
    <PageBanner>
        <img class="banner-icon" src="/src/assets/images/account.png">Account Info for {{ username }}
    </PageBanner>
    <br />
    <TextComponent msg="Email" bold /> <br />
    <TextComponent :msg="email" />
    <br />
    <br />
    <TextComponent msg="Wallet Address" bold /> <br />
    <TextComponent mono :msg="address" />
    <br />
    <br />
    <LineOfText @click="sort" msg="Allowlisted Sites" bold>{{ sortHeader }}</LineOfText>
    <div id="url-container">
        <LineOfText v-for="url in sortedAllowlist" mono>
            <div style="position: relative">
                <img @click="clearUrl(url)" class="sidebar-icon" src="/src/assets/images/x-icon.png">
                {{ url }}
                <!-- <button @click="clearUrl(url)" class="x-button">X</button> -->
            </div>
        </LineOfText>
        <TextComponent v-if="!showClearButton" msg="No URLs allowlisted" />
        <br />
        <button v-if="showClearButton" @click="clearAllUrls" id="clear-allowlist">Clear all allowlisted URLs</button>
    </div>
</template>
<script>
import LineOfText from "./components/LineOfText.vue";
import PageBanner from "./components/PageBanner.vue";
import TextComponent from "./components/TextComponent.vue";

import { getChromeStorage, setChromeStorage } from '../utilities.js';

export default {
    name: 'AccountPage',
    components: {
        LineOfText,
        PageBanner,
        TextComponent
    },
    data() {
        return {
            address: '',
            allowlist: null,
            currentSortDir: 'chron', // defaults to chronological / API order
            email: '',
            sortedAllowlist: [],
            username: '',
        };
    },
    mounted() {
        this.getUserInfo();
        this.getAllowlist();
    },
    computed: {
        sortHeader() {
            let result;

            if (!this.allowlist?.length || this.allowlist.length === 1) {
                result = '';
            } else {
                result = this.currentSortDir === 'asc' ? ' ▲' :
                    this.currentSortDir === 'desc' ? ' ▼' : ' (click to sort)';
            }

            return result;
        },
        // TODO fix this to update correctly
        showClearButton() {
            return this.allowlist?.length;
        },
        sortedAllowlist() {
            if (!this.allowlist) return [];

            let result = [];

            if (this.currentSortDir === 'asc') {
                result = [...this.allowlist].sort((a, b) => a > b ? -1 : 1);
            } else if (this.currentSortDir === 'desc') {
                result = [...this.allowlist].sort((a, b) => a > b ? 1 : -1);
            } else {
                result = this.allowlist;
            }

            return result;
        },
    },
    methods: {
        async clearAllUrls() {
            setChromeStorage({ allowlist: null });

            this.allowlist = [];
        },
        async clearUrl(urlToClear) {
            const allowlist = await getChromeStorage('allowlist');

            if (!allowlist) {
                return;
            }

            const updatedAllowlist = allowlist.filter(url => url !== urlToClear);
            this.allowlist = updatedAllowlist

            setChromeStorage({ allowlist: updatedAllowlist });
        },
        async getAllowlist() {
            const allowlist = await getChromeStorage('allowlist');

            this.allowlist = allowlist;
        },
        async getUserInfo() {
            const email = await getChromeStorage('email');
            const username = await getChromeStorage('username');
            const address = await getChromeStorage('address');

            this.email = email;
            this.username = username;
            this.address = address;
        },
        sort: function () {
            this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' :
                this.currentSortDir === 'desc' ? 'chron' : 'asc';
        },
    }
}
</script>

<style>
#clear-allowlist {
    background-color: #0F0818;
    border: #BB00FD solid 1px;
    border-radius: 12px;
    color: #d0d4d9;
    font-size: 1.25rem;
    padding: 0.5rem 0.75rem;
    width: 400px;
}

#url-container {
    height: 25vh;
    margin-top: -0.75rem;
    overflow: scroll;
}

.x-button {
    background-color: inherit;
    border: none;
    color: red;
}
</style>
