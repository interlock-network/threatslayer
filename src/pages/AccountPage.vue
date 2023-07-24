<template>
    <PageBanner>
        <img class="banner-icon" src="/src/assets/images/account.png">Account info for {{ username }}
    </PageBanner>
    <br />
    <LineOfText msg="Email" bold />
    <LineOfText>{{ email }}</LineOfText>
    <br />
    <br />
    <br />
    <LineOfText msg="Wallet Address" bold />
    <LineOfText mono>{{ address }}</LineOfText>
    <br />
    <br />
    <br />
    <LineOfText @click="sort" bold>{{ allowlistHeader }}</LineOfText>
    <div id="url-container">
        <LineOfText v-for="url in sortedAllowlist" mono>
            <button @click="clearUrl(url)" class="x-button">X</button>{{ url }}
        </LineOfText>
        <LineOfText v-if="!showClearButton" msg="No URLs allowlisted" />
        <button v-if="showClearButton" @click="clearAllUrls" id="clear-allowlist">Clear all allowlisted URLs</button>
    </div>
</template>
<script>
import LineOfText from "./components/subcomponents/LineOfText.vue";
import PageBanner from "./components/subcomponents/PageBanner.vue";

import { getChromeStorage, setChromeStorage } from '../utilities.js';

export default {
    name: 'AccountPage',
    components: {
        LineOfText,
        PageBanner
    },
    data() {
        return {
            address: '',
            allowlist: null,
            currentSortDir: 'chron', //defaults to chronological / API order
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
        allowlistHeader() {
            const sortInfo = this.currentSortDir === 'asc' ? '▲' :
                this.currentSortDir === 'desc' ? '▼' : '(click to sort)';

            return `Allowlisted Sites ${sortInfo}`;
        },
        // TODO fix this to update correctly
        showClearButton() {
            return this.allowlist;
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

            this.allowlist = allowlist.filter(url => url !== urlToClear);

            setChromeStorage({ allowlist: this.allowlist });
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
    overflow: scroll;
}

.x-button {
    background-color: inherit;
    border: none;
    color: red;
}
</style>
  