<template>
    <PageBanner>
        <img class="banner-icon" src="/src/assets/images/account.png">Security Staking
    </PageBanner>
    <br />
    <div>
        <TextComponent msg=" $ILOCK Available to Stake" bold /> <br />
        <TextComponent msg="0" mono /> <br />
        <br />
        <br />
        <TextComponent msg="URL to Stake" bold /> <br />
        <TextComponent :msg="urlToStake" mono /> <br />
        <br />
        <br />
        <TextComponent msg="Amount to Stake" bold /> <br />
        <!-- TODO change language to staked pages -->
        <LineOfText v-if="!showClearButton" msg="No allowlisted sites to show" bold />
        <div v-if="showClearButton" id="url-container">
            <LineOfText @click="sort" msg="Allowlisted Sites" bold>{{ sortHeader }}</LineOfText>
            <TextComponent msg="These are URLs you have marked as safe." subinstruction /><br />
            <TextComponent msg="They will never be blocked by ThreatSlayer." subinstruction />
            <!-- <table style="margin-left: -7px;">
                <tr v-for="url in sortedAllowlist" style="margin-bottom: 1rem;">
                    <td class="icon-column">
                        <img @click="clearUrl(url)" class="sidebar-icon" style="padding-left: 1px; padding-bottom: 3px;"
                            src="/src/assets/images/x-icon.png">
                    </td>
                    <td class="url-column">
                        <TextComponent :msg="url" mono />
                    </td>
                </tr>
            </table> -->
            <br />
        </div>
    </div>
</template>
<script>
import LineOfText from "./components/LineOfText.vue";
import PageBanner from "./components/PageBanner.vue";
import TextComponent from "./components/TextComponent.vue";

import axios from "axios";
import { baseUrl, getChromeStorage, setChromeStorage } from '../utilities.js';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

const errorStyle = {
    border: '3px solid red',
    color: 'red'
};

export default {
    name: 'StakingPage',
    components: {
        LineOfText,
        PageBanner,
        TextComponent,
    },
    props: {
        apiKey: String,
        selectPage: Function,
        urlToStake: String
    },
    data() {
        return {
            allowlist: null,
            currentSortDir: 'chron', // defaults to chronological / API order
            sortedAllowlist: [],
        };
    },
    mounted() {
        this.getSiteInfo();
    },
    computed: {
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
        sortHeader() {
            let result;

            if (!this.allowlist?.length || this.allowlist.length === 1) {
                result = '';
            } else {
                result = this.currentSortDir === 'asc' ? ' ▲' :
                    this.currentSortDir === 'desc' ? ' ▼' : ' (click here to sort)';
            }

            return result;
        }
    },
    methods: {
        async getAllowlist() {
            const allowlist = await getChromeStorage('allowlist');

            this.allowlist = allowlist;
        },
        async getSiteInfo() {
            const { apiKey, urlToStake } = this;

            const response = await axios.post(`${baseUrl}/site-get`, { key: apiKey, url: urlToStake })
                .then(res => res)
                .catch(err => err);

            console.log('response', response);
            const { data = {} } = response;
            console.log('data', data);
            // const { referred = 0, tokens_earned = 0, tokens_earned_total = 0 } = data;
        },
        legitPolkadot(address) {
            try {
                encodeAddress(
                    isHex(address)
                        ? hexToU8a(address)
                        : decodeAddress(address)
                );

                return true;
            } catch (_error) {
                return false;
            }
        },
        sort() {
            this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' :
                this.currentSortDir === 'desc' ? 'chron' : 'asc';
        }
    }
}
</script>

<style>
#cancel-change-address {
    background-color: #0F0818;
    border: none;
    color: red;
    float: right;
    font-size: 1rem;
    padding-right: 50px;
}

#clear-allowlist {
    background-color: #0F0818;
    border: #9000CB solid 1px;
    border-radius: 12px;
    color: #FFFFFF;
    font-size: 1.25rem;
    padding: 0.5rem 0rem;
    width: 400px;
}

#update-address-button {
    background-color: #0F0818;
    border: none;
    color: #9000CB;
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
    width: 400px;
}

#url-container {
    min-height: 25vh;
    overflow-y: scroll;
    margin-bottom: 4rem;
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
