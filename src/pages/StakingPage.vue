<template>
    <PageBanner>
        <img class="banner-icon" src="/src/assets/images/account.png">{{ $i18n('security_staking') }}
    </PageBanner>
    <WarningTextBox v-if="!loggedIn" :msg="$i18n(warningText)">
        <br />
        <br />
        <RegisterLine :checkState="checkState" :selectPage="selectPage" /><br />
        <LoginLine :selectPage="selectPage" />
    </WarningTextBox>
    <br />
    <div>
        <TextComponent class="left-label" :msg="$i18n('ilock_available_to_stake')" bold />
        <TextComponent msg="0" bigmono /> <br />
        <br />
        <br />
        <TextComponent :msg="$i18n('url_to_stake')" bold /> <br />
        <div v-if="!url.length">
            <TextComponent :msg="None" bigmono />
        </div>
        <div v-if="url">
            <table>
                <tr>
                    <td>
                        <ClearAllowlistedURLButton v-bind="{ apiKey, callback: clearUrlToStake, url }" />
                    </td>
                    <td>
                        <TextComponent :msg="url" bigmono />
                    </td>
                </tr>
            </table>
        </div>
        <br />
        <br />
        <TextComponent class="left-label" :msg="$i18n('url_staking_status')" bold />
        <TextComponent :msg="$i18n(stakeStateMessage)" bigmono /> <br />
        <br />
        <br />
        <WarningTextBox v-if="loggedIn" :msg="$i18n('warning_staking_not_available')" />
    </div>
</template>
<script>
import WarningTextBox from './components/WarningTextBox.vue';
import ClearAllowlistedURLButton from './components/buttons/ClearAllowlistedURLButton.vue';
import LineOfText from './components/LineOfText.vue';
import LoginLine from './components/LoginLine.vue';
import PageBanner from './components/PageBanner.vue';
import RegisterLine from './components/RegisterLine.vue';
import TextComponent from './components/TextComponent.vue';

import axios from 'axios';
import { baseUrl, getChromeStorage } from '../utilities.js';

const errorStyle = {
    border: '3px solid red',
    color: 'red'
};

export default {
    name: 'StakingPage',
    components: {
        WarningTextBox,
        ClearAllowlistedURLButton,
        LineOfText,
        LoginLine,
        PageBanner,
        RegisterLine,
        TextComponent,
    },
    props: {
        apiKey: { type: String, default: '' },
        checkState: { type: Function, required: true },
        loggedIn: { type: Boolean, required: true },
        registered: { type: Boolean, required: true },
        selectPage: { type: Function, required: true },
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

            if (!this.allowlist?.length || this.allowlist?.length === 1) {
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
                result = 'warning_must_register_before_staking';
            } else if (!this.loggedIn) {
                result = 'warning_must_login_before_staking';
            }

            return result;
        }
    },
    methods: {
        clearUrlToStake(_url) {
            this.url = '';
            this.stakeState = null;
            this.stakeStateMessage = 'no_url_selected';

            this.checkState();
        },
        async getSiteInfo() {
            const { apiKey, url } = this;

            axios.post(`${baseUrl}/site-get`, { key: apiKey, url })
                .then(reponse => {
                    const { stake_state } = reponse?.data;

                    // Note: Translations for these are under 'stake_state_neutral', 'stake_state_pending', etc.
                    this.stakeStateMessage = `stake_state_${stake_state}`;
                    this.stakeState = stake_state;
                })
                .catch(error => {
                    console.log(`Error getting site information for URL ${url}: ${error.errors}`);
                });
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

<style></style>
