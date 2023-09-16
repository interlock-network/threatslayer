<template>
    <!-- initial View Wallet Info button -->
    <button v-if="!active" @click="openWalletInfoModal" id="view-wallet-info-button" :class="computedClass">
        {{ $i18n('view_wallet_info') }}
    </button>
    <div v-if="active" id="modal-overlay">
        <div id="modal-container" :style="active ? 'bottom: 40%' : 'display: none'">
            <!-- List of existing wallet addresses -->
            <WalletList v-bind="{ azeroAddress, changeAddressSelected, pdotAddress }" />
            <br />
            <!-- prompt to add wallet address if there is none -->
            <div v-if="showAddressInput">
                <!-- input field with prompt for new Aleph Zero address -->
                <TextComponent :msg="$i18n(updateAddressMsg)" subinstruction />
                <button v-if="changeAddressSelected" id="cancel-change-address" @click="selectChangeAddress(false)">
                    {{ $i18n('cancel') }}
                </button>
                <input @input="validateAddress($event, 'newAzeroAddressErrorMessage')" v-model.trim="newAzeroAddress"
                    :style="addressInputStyle" style="margin-top: 0.5rem;" :placeholder="$i18n('enter_wallet_address')"
                    tabindex="2" />
                <TextComponent v-if="newAzeroAddressErrorMessage.length" :msg="newAzeroAddressErrorMessage" error />
                <!-- TODO update translation here -->
                <input @input="validateAddress($event, 'newPdotAddressErrorMessage')" v-model.trim="newPdotAddress"
                    :style="addressInputStyle" style="margin-top: 0.5rem;"
                    placeholder="Or paste your Moonbeam-compatible wallet here" tabindex="4" />
                <TextComponent v-if="newPdotAddressErrorMessage.length" :msg="newPdotAddressErrorMessage" error />
                <!-- password field with show/hide button -->
                <div v-if="active">
                    <TextComponent v-if="showAddressChangeWarning" subinstruction
                        :msg="$i18n('warning_changing_wallet_address')" />
                </div>
                <!-- button to update address -->
                <UpdateAddressButton
                    v-bind="{ apiKey, checkState, active, newAzeroAddress, newPdotAddress, password, toggleClickedOnce, username }" />
            </div>
            <button v-if="!showAddressInput" @click="selectChangeAddress(true)" id="update-address-button"
                class="modal-button">
                {{ $i18n('update_wallet_address') }}
            </button><br />
            <br />
            <button @click="doneAction" id="done-button" class="modal-button">
                {{ $i18n('done') }}
            </button>
        </div>
    </div>
</template>

<script>
import TextComponent from "./TextComponent.vue";
import UpdateAddressButton from "./buttons/UpdateAddressButton.vue";
import WalletList from "./WalletList.vue";

import { debounce } from 'debounce';

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
        WalletList
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
        validateAddress: debounce(function (event, keyName) {
            const address = event?.target?.value;
            this[keyName] = '';

            if (!address || !address.length) {
                this[keyName] = '';
            }

            const addressIsValid = this.legitPolkadot(address);

            // happy case
            if (addressIsValid) {
                this[keyName] = '';
            } else if (!address || !address.length) {
                this[keyName] = '';
            } else {
                this[keyName] = $i18n('error_registering_wallet_address');
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
