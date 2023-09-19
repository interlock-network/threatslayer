<template>
    <PageBanner>
        <img class="banner-icon" src="/src/assets/images/account.png">{{ $i18n('account_info_for') }} {{ username }}
    </PageBanner>
    <br />
    <div :style="computedStyle">
        <TextComponent class="left-label" :msg="$i18n('ilock_earned')" bold />
        <TextComponent v-if="ilockEarned > 0" :msg="ilockEarned" bigmono />
        <div v-if="ilockEarned === 0">
            <TextComponent msg="Keep browsing with ThreatSlayer to earn $ILOCK!" />
        </div>
        <br />
        <br />
        <TextComponent class="left-label" :msg="$i18n('email')" bold />
        <TextComponent :msg="email" bigmono /> <br />
        <br />
    </div>
    <!-- view wallet information modal -->
    <WalletInfoModal v-bind="{ azeroAddress, apiKey, checkState, fadeAccountPage, pdotAddress, selectPage, username }"
        style="opacity: 1" />
    <div :style="computedStyle">
        <br />
        <!-- Number of users referred -->
        <TextComponent class="left-label" :msg="$i18n('users_referred')" bold />
        <TextComponent :msg="referred" bigmono /> <br />
        <br />
        <!-- Tabe of allowlisted URLs -->
        <AllowlistTable :apiKey="apiKey" />
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
import { baseUrl } from '../utilities.js';

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
        azeroAddress: String,
        apiKey: String,
        checkState: Function,
        email: String,
        pdotAddress: String,
        selectPage: Function,
        username: String
    },
    data() {
        return {
            allowlist: null,
            pageFaded: false,
            password: '',
            passwordErrorMessage: '',
            passwordInputType: 'password',
            referred: 0,
            tokensEarned: 0,
            tokensEarnedTotal: 0
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
            const tokenTotal = this.tokensEarned + this.tokensEarnedTotal;

            return tokenTotal;
        }
    },
    methods: {
        fadeAccountPage(bool) {
            this.pageFaded = bool;
        },
        async getStatsFromApi() {
            const { apiKey, username } = this;

            axios.post(`${baseUrl}/user-get`, { key: apiKey, username })
                .then(response => {
                    const { referred = 0, tokens_earned = 0, tokens_earned_total = 0 } = response?.data;

                    this.referred = referred;
                    this.tokensEarned = tokens_earned;
                    this.tokensEarnedTotal = tokens_earned_total;
                })
                .catch(error => {
                    const { errors = [] } = error;

                    console.log('Error getting user stats from API:', errors);
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
