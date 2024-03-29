<template>
    <PageBanner>
        <img class="banner-icon" src="/src/assets/images/account.png">{{ $i18n('account_info_for') }} {{ username }}
    </PageBanner>
    <br />
    <div :style="computedStyle">
        <TextComponent class="left-label" :msg="$i18n('ilock_earned')" bold />&nbsp;
        <TextComponent v-if="ilockEarned > 0" :msg="ilockEarned" bigmono> $ILOCK</TextComponent>
        <div v-if="ilockEarned === 0">
            <TextComponent :msg="$i18n('ilock_keep_browsing_to_earn')" />
        </div>
        <br />
        <br />
        <TextComponent v-if="nextTokenDrop > 0" class="left-label" :msg="$i18n('next_ilock_drop')" bold />&nbsp;
        <TextComponent v-if="nextTokenDrop > 0" :msg="nextTokenDropString" bigmono></TextComponent>
        <br />
        <br />
        <TextComponent class="left-label" :msg="$i18n('email')" bold />&nbsp;
        <TextComponent :msg="email" bigmono /> <br />
        <br />
    </div>
    <!-- view wallet information modal -->
    <WalletInfoModal v-bind="{ azeroAddress, apiKey, checkState, fadeAccountPage, selectPage, username }"
        style="opacity: 1" />
    <div :style="computedStyle">
        <!-- Names of user who referred this user -->
        <div v-if="!pageFaded && referrer.length">
            <TextComponent class="left-label" :msg="$i18n('referred_by')" bold />
            <TextComponent :msg="referrer" bigmono />
        </div>
        <br />
        <!-- Names of users referred -->
        <div v-if="!pageFaded && referred?.length">
            <TextComponent class="left-label" :msg="$i18n('users_referred')" bold /><br />
            <TextComponent :msg="referredList" bigmono />
        </div>
        <!-- Tabe of allowlisted URLs -->
        <AllowlistTable v-if="!pageFaded" :apiKey="apiKey" />
    </div>
    <DeleteUserModal v-bind="{ checkState, fadeAccountPage, pageFaded, selectPage, username }" />
</template>

<script>
import AllowlistTable from "./components/AllowlistTable.vue";
import DeleteUserModal from "./components/DeleteUserModal.vue";
import LineOfText from "./components/LineOfText.vue";
import PageBanner from "./components/PageBanner.vue";
import TextComponent from "./components/TextComponent.vue";
import WalletInfoModal from "./components/WalletInfoModal.vue";

import axios from "axios";
import { baseUrl, extractFromError } from '../utilities.js';

export default {
    name: 'AccountPage',
    components: {
        AllowlistTable,
        DeleteUserModal,
        LineOfText,
        PageBanner,
        TextComponent,
        WalletInfoModal
    },
    props: {
        azeroAddress: { type: String, default: '' },
        apiKey: { type: String, default: '' },
        checkState: { type: Function, required: true },
        email: { type: String, default: '' },
        selectPage: { type: Function, required: true },
        username: { type: String, default: '' }
    },
    data() {
        return {
            allowlistSet: false,
            nextTokenDrop: 0, // Unix timestamp
            pageFaded: false,
            referred: [],
            referrer: '',
            tokenEarnedBalance: 0,
            tokenEarnedTotal: 0
        };
    },
    mounted() {
        this.getStatsFromApi();
    },
    computed: {
        computedStyle() {
            return this.pageFaded ? { 'opacity': '5%', 'pointer-events': 'none' } : {};
        },
        ilockEarned() {
            const tokenTotal = this.tokenEarnedBalance + this.tokenEarnedTotal;

            return tokenTotal;
        },
        nextTokenDropString() {
            const date = new Date(this.nextTokenDrop * 1000);

            return date.toLocaleString();
        },
        referredList() {
            return this.referred.join(', ');
        }
    },
    methods: {
        fadeAccountPage(bool) {
            this.pageFaded = bool;
        },
        async getStatsFromApi() {
            const { apiKey, username } = this;

            axios.post(`${baseUrl}/user-get`, { key: apiKey, username })
                .then(async response => {
                    const { wallet = '', allowlist = [], email, malicious_urls = 0, next_token_drop = 0, referred = [], referrer = '', slay_count = 0,
                        token_earned_balance = 0, token_earned_total = 0, unique_urls = 0, unlocked_urls_confirmed = 0, user_since = 0 } = response?.data;

                    this.referred = referred;
                    // TODO delete this
                    // this.tokenEarnedBalance = 0;
                    // this.tokenEarnedTotal = 1337;
                    // this.nextTokenDrop = 1698508800;
                    this.tokenEarnedBalance = token_earned_balance;
                    this.tokenEarnedTotal = token_earned_total;
                    this.nextTokenDrop = next_token_drop;
                })
                .catch(error => {
                    const { errors, status } = extractFromError(error);

                    // console.log(`Error getting user stats from API. Status: ${status}. Error: ${errors}`);
                });
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
</style>
