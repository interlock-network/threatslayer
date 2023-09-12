<template>
    <PageBanner>
        <img class="banner-icon" src="/src/assets/images/account.png">{{ $i18n('account_info_for') }} {{ username }}
    </PageBanner>
    <br />
    <div :style="computedStyle">
        <TextComponent class="left-label" :msg="$i18n('ilock_earned')" bold />
        <TextComponent :msg="tokensEarned + tokensEarnedTotal" mono /> <br />
        <br />
        <TextComponent class="left-label" :msg="$i18n('email')" bold />
        <TextComponent :msg="email" mono /> <br />
        <br />
    </div>
    <!-- 5GrpknVvGGrGH3EFuURXeMrWHvbpj3VfER1oX5jFtuGbfzCE -->
    <!-- view wallet information modal -->
    <WalletInfoModal v-bind="{ address, apiKey, checkState, fadeAccountPage, selectPage, username }" style="opacity:1" />
    <div :style="computedStyle">
        <br />
        <!-- Number of users referred -->
        <TextComponent class="left-label" :msg="$i18n('users_referred')" bold />
        <TextComponent :msg="referred" mono /> <br />
        <br />
        <!-- Tabe of allowlisted URLs -->
        <AllowlistTable :apiKey="apiKey" />
    </div>
    <DeleteUserModal v-bind="{ checkState, fadeAccountPage, selectPage, username }" />
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
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { debounce } from 'debounce';
import { hexToU8a, isHex } from '@polkadot/util';

const errorStyle = {
    border: '3px solid red',
    color: 'red'
};

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
        address: String,
        apiKey: String,
        checkState: Function,
        email: String,
        selectPage: Function,
        username: String
    },
    data() {
        return {
            allowlist: null,
            fadePage: false,
            password: '',
            passwordErrorMessage: '',
            passwordInputType: 'password',
            referred: 0,
            tokensEarned: 0,
            tokensEarnedTotal: 0
        };
    },
    mounted() {
        this.getUserInfo();
    },
    computed: {
        addressInputStyle() {
            return this.newAddressErrorMessage?.length ? errorStyle : {};
        },
        computedStyle() {
            return this.fadePage ? { 'opacity': '5%', 'pointer-events': 'none' } : {};
        }
    },
    methods: {
        fadeAccountPage(bool) {
            this.fadePage = bool;
        },
        async getUserInfo() {
            const { apiKey, username } = this;

            const response = await axios.post(`${baseUrl}/user-get`, { key: apiKey, username })
                .then(res => res)
                .catch(err => err);

            const { data = {} } = response;
            const { referred = 0, tokens_earned = 0, tokens_earned_total = 0 } = data;

            this.referred = referred;
            this.tokensEarned = tokens_earned;
            this.tokensEarnedTotal = tokens_earned_total;
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
        togglePasswordInputType() {
            this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
        },
        validateAddress: debounce(function (event) {
            const address = event?.target?.value;
            this.newAddressErrorMessage = '';

            if (!address || !address.length) {
                this.newAddressErrorMessage = '';
            }

            const addressIsValid = this.legitPolkadot(address);

            // happy case
            if (addressIsValid) {
                this.newAddressErrorMessage = '';
            } else if (!address || !address.length) {
                this.newAddressErrorMessage = '';
            } else {
                this.newAddressErrorMessage = $i18n('error_registering_wallet_address');
            }
        }, 250)
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

.left-label {
    margin-right: 1rem;
}
</style>
