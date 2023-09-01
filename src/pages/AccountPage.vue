<template>
    <PageBanner>
        <img class="banner-icon" src="/src/assets/images/account.png">Account Info for {{ username }}
    </PageBanner>
    <br />
    <div :style="computedStyle">
        <TextComponent msg="$ILOCK Earned" bold /> <br />
        <TextComponent :msg="tokensEarned + tokensEarnedTotal" mono /> <br />
        <br />
        <br />
        <TextComponent msg="Email" bold /> <br />
        <TextComponent :msg="email" mono /> <br />
        <br />
        <br />
        <!-- 5GrpknVvGGrGH3EFuURXeMrWHvbpj3VfER1oX5jFtuGbfzCE -->
        <TextComponent msg="Wallet Address" bold /> <br />
        <!-- prompt to add wallet address if there is none -->
        <div v-if="showAddressInput">
            <!-- input field with prompt for new address -->
            <TextComponent :msg="updateAddressMsg" subinstruction /><button v-if="changeAddressSelected"
                id="cancel-change-address" @click="toggleChangeAddress">Cancel</button>
            <input @input="validateAddress" v-model.trim="newAddress" :style="addressInputStyle" style="margin-top: 0.5rem;"
                placeholder="Paste your Aleph Zero-compatible wallet address" tabindex="2" />
            <TextComponent v-if="newAddressErrorMessage.length" :msg="newAddressErrorMessage" error />
            <!-- password field with show/hide button -->
            <div v-if="clickedOnce">
                <TextComponent msg="Enter your password to update your wallet address." subinstruction />
            </div>
            <div v-if="clickedOnce">
                <input id="login-password" class="input-field-text password-input" :type="passwordInputType"
                    style="margin-top: 0.5rem;" v-model.trim="password" placeholder="Password" tabindex="4"
                    :style="passwordInputStyle" />
                <button @click="togglePasswordInputType" class="small-button" id="show-toggle-button"
                    style="padding-top: 0.75rem;" tabindex="5">
                    {{ passwordInputType === 'password' ? 'Show' : 'Hide' }}
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
        <br />
        <TextComponent msg="Users Referred" bold /> <br />
        <TextComponent :msg="referred" mono /> <br />
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
        <!-- Note: Commented out until there's a better place for it -->
        <!-- <button v-if="showClearButton" @click="clearAllUrls" id="clear-allowlist">Clear all allowlisted URLs</button> -->
    </div>
    <DeleteUserButton v-bind="{ checkState, fadeAccountPage, selectPage, username }" />
</template>
<script>
import DeleteUserButton from "./components/buttons/DeleteUserButton.vue";
import LineOfText from "./components/LineOfText.vue";
import PageBanner from "./components/PageBanner.vue";
import TextComponent from "./components/TextComponent.vue";
import UpdateAddressButton from "./components/buttons/UpdateAddressButton.vue";

import axios from "axios";
import { baseUrl, getChromeStorage, setChromeStorage } from '../utilities.js';
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
            currentSortDir: 'chron', // defaults to chronological / API order
            deleteAccountClicked: false,
            newAddress: '',
            newAddressErrorMessage: '',
            password: '',
            passwordErrorMessage: '',
            passwordInputType: 'password',
            referred: 0,
            sortedAllowlist: [],
            tokensEarned: 0,
            tokensEarnedTotal: 0
        };
    },
    mounted() {
        this.getAllowlist();
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
        showClearButton() {
            return this.allowlist?.length;
        },
        showAddress() {
            return this.address?.length && !this.changeAddressSelected;
        },
        showAddressInput() {
            return !this.address?.length || this.changeAddressSelected;
        },
        showUpdateAddressButton() {
            return this.newAddress.length && !this.newAddressErrorMessage.length;
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
        },
        updateAddressMsg() {
            return !this.address?.length ? "You must add a wallet address to receive $ILOCK token." : "Enter your new wallet address.";
        }
    },
    methods: {
        async clearAllUrls() {
            setChromeStorage({ allowlist: null });

            this.allowlist = [];
        },
        async clearUrl(urlToClear) {
            // TODO add allowlist code here
            // TODO update URL
            const response = await axios.post(`${baseUrl}/site-forget`, { key: this.apiKey, url: urlToClear })
                .then(res => res)
                .catch(err => err);


            console.log('response', response);
            const allowlist = await getChromeStorage('allowlist');

            if (!allowlist) {
                return;
            }

            const updatedAllowlist = allowlist.filter(url => url !== urlToClear);
            this.allowlist = updatedAllowlist

            setChromeStorage({ allowlist: updatedAllowlist });
        },
        fadeAccountPage(bool) {
            this.deleteAccountClicked = bool;
        },
        async getAllowlist() {
            const allowlist = await getChromeStorage('allowlist');

            this.allowlist = allowlist;
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
        sort() {
            this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' :
                this.currentSortDir === 'desc' ? 'chron' : 'asc';
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
                this.newAddressErrorMessage = 'Not a valid address';
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
