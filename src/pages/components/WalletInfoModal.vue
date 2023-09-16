<template>
    <!-- initial View Wallet Info button -->
    <button v-if="!active" @click="openWalletInfoModal" id="view-wallet-info-button" :class="computedClass">
        {{ $i18n('view_wallet_info') }}
    </button>
    <div v-if="active" id="modal-overlay">
        <div id="modal-container" :style="active ? 'bottom: 40%' : 'display: none'">
            <!-- List of existing wallet addresses, if any -->
            <WalletList v-bind="{ azeroAddress, changeAddressSelected, pdotAddress }" />
            <!-- prompt to add wallet address if there is none -->
            <div v-if="showAddressInput">
                <!-- input field with prompt for new Aleph Zero address -->
                <TextComponent :msg="$i18n(updateAddressMsg)" subinstruction />
                <input @input="validateAddress($event, 'newAzeroAddressErrorMessage')" v-model.trim="newAzeroAddress"
                    :style="addressInputStyle" style="margin-top: 0.5rem;" :placeholder="$i18n('enter_wallet_address')"
                    tabindex="2" />
                <TextComponent v-if="newAzeroAddressErrorMessage.length" :msg="$i18n(newAzeroAddressErrorMessage)" error />
                <!-- TODO update translation here -->
                <input @input="validateAddress($event, 'newPdotAddressErrorMessage')" v-model.trim="newPdotAddress"
                    :style="addressInputStyle" style="margin-top: 0.5rem;"
                    placeholder="Or paste your Moonbeam wallet address here" tabindex="4" />
                <TextComponent v-if="newPdotAddressErrorMessage.length" :msg="$i18n(newPdotAddressErrorMessage)" error />
                <!-- password field with show/hide button -->
                <input id="login-password" class="input-field-text password-input" :type="passwordInputType"
                    v-model.trim="password" placeholder="Password" tabindex="6" :style="passwordInputStyle" />
                <button @click="togglePasswordInputType" class="small-button" id="show-toggle-button" tabindex="8">
                    {{ passwordInputType === 'password' ? $i18n('password_show') : $i18n('password_hide') }}
                </button>
                <div v-if="active">
                    <br />
                    <WarningTextBox v-if="showAddressChangeWarning" :msg="$i18n('warning_changing_wallet_address')" />
                </div>
                <!-- button to update address -->
                <UpdateAddressButton
                    v-bind="{ apiKey, checkState, active, newAzeroAddress, newPdotAddress, password, toggleClickedOnce, username }" />
            </div>
            <div v-if="!showAddressInput">
                <button @click="selectChangeAddress(true)" id="update-address-button" class="modal-button">
                    {{ $i18n('update_wallet_address') }}
                </button><br />
                <br />
            </div>
            <button @click="doneAction" id="done-button" class="modal-button">
                {{ $i18n(cancelDoneButtonText) }}
            </button>
        </div>
    </div>
</template>

<script>
import TextComponent from "./TextComponent.vue";
import UpdateAddressButton from "./buttons/UpdateAddressButton.vue";
import WalletList from "./WalletList.vue";
import WarningTextBox from "./WarningTextBox.vue";

import { debounce } from 'debounce';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

export default {
    name: "WalletInfoModal",
    props: {
        apiKey: String,
        azeroAddress: String,
        checkState: Function,
        fadeAccountPage: Function,
        pdotAddress: String,
        selectPage: Function,
        username: String
    },
    components: {
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
            newAzeroAddressErrorMessage: '',
            newPdotAddress: '',
            newPdotAddressErrorMessage: '',
            password: '',
            passwordInputType: 'password',
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
        showAddress(address) {
            return address?.length && !this.changeAddressSelected;
        },
        showAddressInput() {
            return (!this.azeroAddress?.length && !this.pdotAddress?.length) || this.changeAddressSelected;
        },
        showAddressChangeWarning() {
            return this.azeroAddress?.length;
        },
        updateAddressMsg() {
            return !this.address?.length ? 'warning_must_add_wallet_address' : 'enter_new_wallet_address';
        }
    },
    methods: {
        doneAction() {
            this.fadeAccountPage(false);
            this.active = false;
            this.selectChangeAddress(false);
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
        toggleClickedOnce() {
            this.active = !this.active;
        },
        validateAddress: debounce(function (event, errorKeyName) {
            const address = event?.target?.value;
            this[errorKeyName] = '';

            if (!address || !address.length) {
                this[errorKeyName] = '';
            }

            const addressIsValid = this.legitPolkadot(address);

            // happy case
            if (addressIsValid) {
                this[errorKeyName] = '';
            } else if (!address || !address.length) {
                this[errorKeyName] = '';
            } else {
                this[errorKeyName] = 'error_registering_wallet_address';
            }
        }, 250),
        togglePasswordInputType() {
            this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
        }
    }
};
</script>

<style>
#cancel-delete-user-button {
    font-size: 1.25rem;
    background-color: #0F0818;
    border: none;
    color: red;
    font-size: 1.25rem;
    padding-top: 1rem;
    width: 400px;
}

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
    color: red;
    font-size: 1rem;
    height: 2rem;
    padding-top: 1rem;
    width: 400px;
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
    width: 400px;
}

#view-wallet-info-button {
    background-color: #0F0818;
    border: none;
    color: #963cf5;
    font-size: 1.1rem;
    font-weight: bold;
    padding: 0;
}

.modal-button {
    position: absolute;
    display: inline-block;
}
</style>
