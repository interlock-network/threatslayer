<template>
    <!-- initial View Wallet Info button -->
    <button v-if="!active" @click="openWalletInfoModal" id="view-wallet-info-button" :class="computedClass">
        {{ $i18n(headerText) }}
    </button>
    <!-- wallet info modal contents -->
    <div v-if="active" id="modal-overlay" @keydown.esc="doneAction">
        <div id="modal-container" :style="active ? 'bottom: 40%' : 'display: none'">
            <!-- List of existing wallet addresses, if any -->
            <WalletList v-bind="{ azeroAddress, changeAddressSelected, pdotAddress }" />
            <!-- prompt to add wallet address if there is none -->
            <div v-if="showAddressInput">
                <TextComponent :msg="$i18n(updateAddressMsg)" subinstruction /><br />
                <br />
                <AzeroAddressInput @currentAzeroAddress="getAzeroAddress" @azeroAddressHasError="getAzeroAddressHasError"
                    tabindex="2" />
                <!-- input field with prompt for new Moonbeam address -->
                <input id="pdot-input" @input="validateAddress($event, 'pdot', 'newPdotErrorMessage')"
                    v-model.trim="newPdotAddress" :style="addressInputStyle" style="margin-top: -0.2rem;"
                    :placeholder="$i18n('enter_pdot_wallet_address')" tabindex="4" />
                <ErrorMessage v-if="newPdotErrorMessage.length" :msg="$i18n(newPdotErrorMessage)" single last />
                <div style="position: absolute;">
                    <SinglePasswordInput @currentPassword="getPassword" @passwordHasError="getPasswordHasError" />
                </div>
                <div v-if="active">
                    <br />
                    <WarningTextBox v-if="showAddressChangeWarning" :msg="$i18n('warning_changing_wallet_address')" />
                </div>
                <UpdateAddressButton tabindex="10" style="margin-top: 3rem; margin-bottom: 1rem;"
                    v-bind="{ apiKey, checkState, hasError, newAzeroAddress, newPdotAddress, password, username }" />
            </div>
            <div v-if="!showAddressInput">
                <button @click="selectChangeAddress(true)" id="update-address-button" class="modal-button" tabindex="12">
                    {{ $i18n('update_wallet_address') }}
                </button><br />
                <br />
            </div>
            <button @click="doneAction" id="done-button" class="modal-button" tabindex="14">
                {{ $i18n(cancelDoneButtonText) }}
            </button>
        </div>
    </div>
</template>

<script>
import { debounce } from 'debounce';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import { validateMoonbeam } from "../../utilities";

import AzeroAddressInput from "./inputs/AzeroAddressInput.vue";
import ErrorMessage from "./ErrorMessage.vue";
import SinglePasswordInput from "./inputs/SinglePasswordInput.vue";
import TextComponent from "./TextComponent.vue";
import UpdateAddressButton from "./buttons/UpdateAddressButton.vue";
import WalletList from "./WalletList.vue";
import WarningTextBox from "./WarningTextBox.vue";

export default {
    name: "WalletInfoModal",
    props: {
        apiKey: { type: String, default: '' },
        azeroAddress: { type: String, default: '' },
        checkState: { type: Function, required: true },
        fadeAccountPage: { type: Function, required: true },
        pdotAddress: { type: String, default: '' },
        selectPage: { type: Function, required: true },
        username: { type: String, default: '' }
    },
    components: {
        AzeroAddressInput,
        ErrorMessage,
        SinglePasswordInput,
        TextComponent,
        UpdateAddressButton,
        WalletList,
        WarningTextBox
    },
    data() {
        return {
            active: false,
            changeAddressSelected: false,
            confirm: false,
            deleting: false,
            errorArr: [],
            newAzeroAddress: '',
            newAzeroAddressHasError: '',
            newPdotAddress: '',
            newPdotErrorMessage: '',
            password: '',
            passwordHasError: false
        }
    },
    mounted() {
        // focus this element to encourage users to add their wallet address
        if (!this.azeroAddress?.length && !this.pdotAddress?.length) {
            const firstInput = document.getElementById('view-wallet-info-button');

            firstInput.focus();
        }
    },
    computed: {
        cancelDoneButtonText() {
            return this.changeAddressSelected ? 'cancel' : 'done';
        },
        computedClass() {
            return this.errorArr.length || this.active ? 'submit-button-error' : '';
        },
        deleteUserButtonText() {
            let result = '';

            if (this.deleting) {
                result = 'deleting_account';
            } else if (this.errorArr.length) {
                result = 'try_again_later';
            } else {
                result = 'delete_account_permanent';
            }

            return result;
        },
        hasError() {
            return this.newAzeroAddressHasError || !!this.newPdotErrorMessage || this.passwordHasError;
        },
        headerText() {
            return !this.azeroAddress?.length && !this.pdotAddress?.length ? 'add_blockchain_address' : 'view_wallet_info';
        },
        showAddress(address) {
            return address?.length && !this.changeAddressSelected;
        },
        showAddressChangeWarning() {
            return this.azeroAddress?.length;
        },
        showAddressInput() {
            const { azeroAddress, changeAddressSelected, pdotAddress } = this;

            return (!azeroAddress?.length && !pdotAddress?.length) || changeAddressSelected;
        },
        updateAddressMsg() {
            return !this.address?.length ? 'warning_must_add_wallet_address' : 'enter_new_wallet_address';
        }
    },
    methods: {
        doneAction() {
            this.newAzeroAddress = '';
            this.newAzeroAddressHasError = '';
            this.password = '';
            this.newPdotAddress = '';
            this.newPdotErrorMessage = '';
            this.active = false;
            this.fadeAccountPage(false);
            this.selectChangeAddress(false);
        },
        getAzeroAddress(walletAddress) {
            this.newAzeroAddress = walletAddress;
        },
        getAzeroAddressHasError(errorBool) {
            this.newAzeroAddressHasError = errorBool;
        },
        getPassword(password) {
            this.password = password;
        },
        getPasswordHasError(errorBool) {
            this.passwordHasError = errorBool;
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
        openWalletInfoModal() {
            this.fadeAccountPage(true);
            this.active = true;
        },
        selectChangeAddress(bool) {
            this.changeAddressSelected = bool;
        },
        validateAddress: debounce(function (event, addressType, errorKeyName) {
            const address = event?.target?.value;
            let result = ''

            if (!address || !address.length) {
                result = '';
            } else {
                const addressIsValid = this.legitPolkadot(address);

                if (addressType === 'pdot' && !validateMoonbeam(address)) {
                    result = 'warning_address_not_moonbeam';
                }
                // happy case
                else if (addressIsValid) {
                    result = '';
                } else {
                    result = 'error_registering_wallet_address';
                }
            }

            this[errorKeyName] = result;
        }, 250)
    }
};
</script>

<style>
#modal-container {
    background-color: #0F0818;
    border-radius: 12px;
    color: #FFFFFF;
    padding: 50px;
    position: fixed;
    width: 400px;
    z-index: 2147483643 !important;

}

#delete-user-confirm-text {
    color: red;
    display: block;
    font-size: 1.25rem;
    text-align: center;
}

#done-button {
    background-color: #0F0818;
    border: none;
    border-radius: 6px;
    color: red;
    font-size: 1rem;
    line-height: 2rem;
    width: 400px;
}

#done-button:hover {
    background-color: #4A0064;
}

#done-button:active {
    background-color: #261142;
}

#delete-user-password-input {
    margin-top: 1rem;
    position: absolute;
}

#delete-user-toggle-button {
    background-color: #0F0818;
    border: none;
    color: #963cf5;
    margin-top: 1.45rem;
    position: absolute;
    right: 4%;
}

#modal-overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    background-color: #000000da;
}

#update-address-button {
    background-color: #0F0818;
    border: none;
    color: #9000CB;
    font-size: 1rem;
    height: 2rem;
    margin-bottom: 2rem;
    padding: 0.5rem 0.75rem;
    pointer-events: initial;
    width: 400px;
}

#view-wallet-info-button {
    background-color: #0F0818;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: #963cf5;
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: -0.5rem;
    margin-left: -1rem;
    margin-top: -0.5rem;
    padding: 1rem;
}

#view-wallet-info-button:hover {
    background-color: #4A0064;
}

#view-wallet-info-button:active {
    background-color: #0F0818;
}

.modal-button {
    position: absolute;
    display: inline-block;
    cursor: pointer;
}
</style>
