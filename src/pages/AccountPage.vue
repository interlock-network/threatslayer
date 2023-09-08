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
        <!-- 5GrpknVvGGrGH3EFuURXeMrWHvbpj3VfER1oX5jFtuGbfzCE -->
        <TextComponent :msg="$i18n('wallet_address')" bold /> <br />
        <!-- prompt to add wallet address if there is none -->
        <div v-if="showAddressInput">
            <!-- input field with prompt for new address -->
            <TextComponent :msg="$i18n(updateAddressMsg)" subinstruction />
            <button v-if="changeAddressSelected" id="cancel-change-address" @click="toggleChangeAddress">
                {{ $i18n('cancel') }}
            </button>
            <input @input="validateAddress" v-model.trim="newAddress" :style="addressInputStyle" style="margin-top: 0.5rem;"
                :placeholder="$i18n('enter_wallet_address')" tabindex="2" />
            <TextComponent v-if="newAddressErrorMessage.length" :msg="newAddressErrorMessage" error />
            <!-- password field with show/hide button -->
            <div v-if="clickedOnce">
                <TextComponent v-if="showAddressChangeWarning" subinstruction
                    :msg="$i18n('warning_changing_wallet_address')" />
            </div>
            <div v-if="clickedOnce">
                <input id="login-password" class="input-field-text password-input" :type="passwordInputType"
                    style="margin-top: 0.5rem;" v-model.trim="password"
                    :placeholder="$i18n('enter_password_to_update_wallet_address')" tabindex="4"
                    :style="passwordInputStyle" />
                <button @click="togglePasswordInputType" class="small-button" id="show-toggle-button" tabindex="5">
                    {{ passwordInputType === 'password' ? $i18n('password_show') : $i18n('password_hide') }}
                </button>
                <TextComponent :msg="passwordErrorMessage" error v-if="passwordErrorMessage.length" />
                <!-- button to update address -->
            </div>
            <UpdateAddressButton :disabled="disableUpdateAddressButton"
                v-bind="{ checkState, clickedOnce, apiKey, newAddress, password, toggleClickedOnce, username }" />
        </div>
        <TextComponent v-if="showAddress" :msg="address" mono /><br />
        <button v-if="showAddress" id="update-address-button" @click="toggleChangeAddress">Update
            Address</button>
        <br />
        <!-- Number of users referred -->
        <TextComponent class="left-label" :msg="$i18n('users_referred')" bold />
        <TextComponent :msg="referred" mono /> <br />
        <br />
        <!-- Tabe of allowlisted URLs -->
        <AllowlistTable :apiKey="apiKey" />
    </div>
    <DeleteUserButton v-bind="{ checkState, fadeAccountPage, selectPage, username }" />
</template>
<script>
import AllowlistTable from "./components/AllowlistTable.vue";
import DeleteUserButton from "./components/buttons/DeleteUserButton.vue";
import LineOfText from "./components/LineOfText.vue";
import PageBanner from "./components/PageBanner.vue";
import TextComponent from "./components/TextComponent.vue";
import UpdateAddressButton from "./components/buttons/UpdateAddressButton.vue";

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
        DeleteUserButton,
        LineOfText,
        PageBanner,
        TextComponent,
        UpdateAddressButton
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
            changeAddressSelected: false,
            clickedOnce: false,
            deleteAccountClicked: false,
            newAddress: '',
            newAddressErrorMessage: '',
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
            return this.deleteAccountClicked ? { opacity: '10%' } : {};
        },
        disableUpdateAddressButton() {
            return !this.clickedOnce;
        },
        showAddress() {
            return this.address?.length && !this.changeAddressSelected;
        },
        showAddressInput() {
            return !this.address?.length || this.changeAddressSelected;
        },
        showAddressChangeWarning() {
            return this.address?.length;
        },
        // TODO delete this?
        // showUpdateAddressButton() {
        //     return this.newAddress.length && !this.newAddressErrorMessage.length;
        // },
        updateAddressMsg() {
            return !this.address?.length ? 'warning_must_add_wallet_address' : 'enter_new_wallet_address';
        }
    },
    methods: {
        fadeAccountPage(bool) {
            this.deleteAccountClicked = bool;
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
        toggleChangeAddress() {
            this.changeAddressSelected = !this.changeAddressSelected;
        },
        toggleClickedOnce() {
            this.clickedOnce = true;
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

.left-label {
    margin-right: 1rem;
}
</style>
