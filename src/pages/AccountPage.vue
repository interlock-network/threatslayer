<template>
    <PageBanner>
        <img class="banner-icon" src="/src/assets/images/account.png">Account Info for {{ username }}
    </PageBanner>
    <br />
    <TextComponent msg="Email" bold /> <br />
    <TextComponent :msg="email" mono /> <br />
    <br />
    <br />
    <TextComponent msg="Wallet Address" bold /> <br />
    <TextComponent :msg="address" mono /><br />
    <br />
    <br />
    <LineOfText v-if="!showClearButton" msg="No allowlisted sites to show" bold />
    <div v-if="showClearButton" id="url-container">
        <LineOfText @click="sort" msg="Allowlisted Sites" bold>{{ sortHeader }}</LineOfText>
        <TextComponent msg="These are URLs you have marked as safe." subinstruction /><br />
        <TextComponent msg="They will never be blocked by ThreatSlayer." subinstruction />
        <table style="margin-left: -7px;">
            <tr v-for="url in sortedAllowlist" style="margin-bottom: 1rem;">
                <td class="icon-column">
                    <img @click="clearUrl(url)" class="sidebar-icon" style="padding-left: 1px; padding-bottom: 3px;"
                        src="/src/assets/images/x-icon.png">
                </td>
                <td class="url-column">
                    <TextComponent :msg="url" mono />
                </td>
            </tr>
        </table>
        <br />
    </div>
    <button v-if="showClearButton" @click="clearAllUrls" id="clear-allowlist">Clear all allowlisted URLs</button>
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
    props: {
        checkState: Function,
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
    bottom: 10rem;
    color: #d0d4d9;
    font-size: 1.25rem;
    position: absolute;
    padding: 0.5rem 0rem;
    width: 400px;
}

#url-container {
    min-height: 25vh;
    overflow-y: scroll;
}

#url-container::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 4px;
}

#url-container::-webkit-scrollbar-track {
    background: inherit;
    border-radius: 2px;
}

#url-container::-webkit-scrollbar-thumb {
    background: #d0d4d9;
    border-radius: 2px;
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
}

.icon-column {
    margin-left: -3px;
    padding-bottom: 1rem;
    width: 1rem;
}

.url-column {
    max-width: 389px;
    padding-bottom: 1rem;
    width: 389px;
    word-wrap: break-word;
}

.x-button {
    background-color: inherit;
    border: none;
    color: red;
}
</style>
