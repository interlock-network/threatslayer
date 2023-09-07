<template>
    <PageBanner>
        <img class="banner-icon" src="../assets/images/account.png">Security Staking
    </PageBanner>
    <BeforeStakingWarning v-if="!loggedIn" :msg="warningText">
        <br />
        <TextComponent msg="Already have an account?" subinstruction /><button class="login-button"
            @click="selectPage('login')">Login</button><br />
        <TextComponent msg="Don't have an account?" subinstruction /><button class="login-button"
            @click="unregister">Register</button><br />
    </BeforeStakingWarning>
    <br />
    <div>
        <TextComponent msg=" $ILOCK Available to Stake" bold /> <br />
        <TextComponent msg="0" mono /> <br />
        <br />
        <br />
        <TextComponent msg="URL to Stake" bold /> <br />
        <div v-if="!url.length">
            <TextComponent :msg="None" mono />
        </div>
        <div v-if="url">
            <table>
                <tr>
                    <td>
                        <ClearAllowlistedURLButton v-bind="{ apiKey, callback: clearUrlToStake, url }" />
                    </td>
                    <td>
                        <TextComponent :msg="url" mono />
                    </td>
                </tr>
            </table>
        </div>
        <br />
        <br />
        <TextComponent msg="URL Staking Status" bold /> <br />
        <TextComponent :msg="stakeStateMessage" mono /> <br />
        <br />
        <br />
        <TextComponent msg="Amount to Stake" bold /> <br />
        <br />
        <br />
        <!-- TODO change language to staked pages -->
        <LineOfText v-if="!showClearButton" msg="No allowlisted sites to show" bold />
        <div v-if="showClearButton" id="url-container">
            <LineOfText @click="sort" msg="Allowlisted Sites" bold>{{ sortHeader }}</LineOfText>
            <TextComponent msg="These are URLs you have marked as safe." subinstruction /><br />
            <TextComponent msg="They will never be blocked by ThreatSlayer." subinstruction />
            <!-- <table style="margin-left: -7px;">
                <tr v-for="url in stakedUrlList" style="margin-bottom: 1rem;">
                    <td class="icon-column">
                        <img @click="clearUrl(url)" class="sidebar-icon" style="padding-left: 1px; padding-bottom: 3px;"
                            src="../assets/images/x-icon.png">
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
import BeforeStakingWarning from "./components/BeforeStakingWarning.vue";
import ClearAllowlistedURLButton from "./components/buttons/ClearAllowlistedURLButton.vue";
import LineOfText from "./components/LineOfText.vue";
import PageBanner from "./components/PageBanner.vue";
import TextComponent from "./components/TextComponent.vue";

import axios from "axios";
import { baseUrl, getChromeStorage, setChromeStorage } from '../utilities.js';

const errorStyle = {
    border: '3px solid red',
    color: 'red'
};

export default {
    name: 'StakingPage',
    components: {
        BeforeStakingWarning,
        ClearAllowlistedURLButton,
        LineOfText,
        PageBanner,
        TextComponent,
    },
    props: {
        apiKey: String,
        checkState: Function,
        loggedIn: Boolean,
        registered: Boolean,
        selectPage: Function,
    },
    data() {
        return {
            allowlist: null,
            currentSortDir: 'chron', // defaults to chronological / API order
            stakedUrlList: [],
            stakeState: null,
            stakeStateMessage: '',
            url: ''
        };
    },
    mounted() {
        this.getStakingUrl();
        this.getSiteInfo();
    },
    computed: {
        showClearButton() {
            return this.allowlist?.length;
        },
        stakedUrlList() {
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
        },
        warningText() {
            let result = '';

            if (!this.registered && !this.loggedIn) {
                result = 'You must register before you can stake on a URL.';
            } else if (!this.loggedIn) {
                result = 'You must login before you can stake on a URL.';
            }

            return result;
        }
    },
    methods: {
        clearUrlToStake() {
            console.log('here');
            this.url = '';
            this.stakeState = null;
            this.stakeStateMessage = 'No URL selected for staking.';

            this.checkState();
        },
        // TODO: revisit this
        async getAllowlist() {
            const allowlist = await getChromeStorage('allowlist');

            this.allowlist = allowlist;
        },
        async getSiteInfo() {
            const { apiKey, url } = this;
            const stakingStatuses = {
                neutral: 'You will be the first to stake this URL.',
                pending: 'Someone else has tried staking this URL. If approved, your stake will be added to theirs. If rejected, you will not lose any $ILOCK.',
                resolved: 'Nobody can stake on this URL at this time.'
            };

            const response = await axios.post(`${baseUrl}/site-get`, { key: apiKey, url })
                .then(res => res)
                .catch(err => err);

            const { data = {} } = response;

            const { stake_state } = data;

            this.stakeState = stake_state;
            this.stakeStateMessage = stakingStatuses[stake_state];
        },
        async getStakingUrl() {
            const urlToStake = await getChromeStorage('urlToStake');

            this.url = urlToStake;
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
</style>
