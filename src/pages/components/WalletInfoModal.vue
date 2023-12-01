<template>
    <!-- initial View Wallet Info button -->
    <button v-if="!active" @click="openWalletInfoModal" id="view-wallet-info-button" :class="computedClass">
        {{ $i18n(headerText) }}
    </button>
    <!-- wallet info modal contents -->
    <div v-if="active" id="modal-overlay" @keydown.esc="doneAction">
        <div id="modal-container" :style="active ? 'bottom: 40%' : 'display: none'">
            <!-- List of existing wallet addresses, if any -->
            <WalletList v-bind="{ apiKey, azeroAddress, changeAddressSelected, deleteWalletSelected, username }"
                @deleteWalletSelected="getDeleteWalletSelected" />
            <!-- prompt to add wallet address if there is none -->
            <AddWallet v-if="addWallet"
                v-bind="{ apiKey, azeroAddress, checkState, selectChangeAddress, updateAddressMsg, username }" />
            <DeleteWallet v-if="deleteWallet"
                v-bind="{ apiKey, azeroAddress, checkState, deleteWalletSelected, username }" />
            <div v-if="showChangeAddressButton">
                <button @click="selectChangeAddress(true)" id="update-address-button" class="modal-button" tabindex="12">
                    {{ $i18n('update_wallet_address') }}
                </button><br /> <br />
            </div>
            <button v-if="!addWallet && !deleteWallet" @click="doneAction" class="secondary-hollow-button" tabindex="14">
                {{ $i18n('done') }}
            </button>
        </div>
    </div>
</template>

<script>
import { debounce } from 'debounce';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

import AddWallet from "./AddWallet.vue";
import AzeroAddressInput from "./inputs/AzeroAddressInput.vue";
import DeleteWallet from "./DeleteWallet.vue";
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
        selectPage: { type: Function, required: true },
        username: { type: String, default: '' }
    },
    components: {
        AddWallet,
        AzeroAddressInput,
        DeleteWallet,
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
            deleteWallet: false,
            deleting: false,
            errorArr: [],
            newWallet: '',
            newAzeroAddressHasError: '',
            password: '',
            passwordHasError: false
        }
    },
    mounted() {
        // focus this element to encourage users to add their wallet address
        if (!this.azeroAddress?.length) {
            const firstInput = document.getElementById('view-wallet-info-button');

            firstInput.focus();
        }
    },
    computed: {
        addWallet() {
            const { azeroAddress, changeAddressSelected } = this;

            return !azeroAddress?.length || changeAddressSelected;
        },
        showChangeAddressButton() {
            return !this.addWallet && !this.deleteWallet;
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
            return this.newAzeroAddressHasError || this.passwordHasError;
        },
        headerText() {
            return !this.azeroAddress?.length ? 'add_blockchain_address' : 'view_wallet_info';
        },
        showAddressChangeWarning() {
            return this.azeroAddress?.length;
        },
        updateAddressMsg() {
            return !this.azeroAddress?.length ? 'warning_must_add_wallet_address' : 'enter_new_wallet_address';
        }
    },
    methods: {
        deleteWalletSelected(bool) {
            this.deleteWallet = bool;
        },
        doneAction() {
            this.newWallet = '';
            this.newAzeroAddressHasError = '';
            this.password = '';
            this.active = false;
            this.fadeAccountPage(false);
            this.selectChangeAddress(false);
        },
        getPassword(password) {
            this.password = password;
        },
        getPasswordHasError(errorBool) {
            this.passwordHasError = errorBool;
        },
        legitPolkadot(wallet) {
            try {
                encodeAddress(
                    isHex(wallet)
                        ? hexToU8a(wallet)
                        : decodeAddress(wallet)
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
        validateAddress: debounce(function (event, errorKeyName) {
            const wallet = event?.target?.value;
            let result = '';

            if (!wallet?.length) {
                result = '';
            } else {
                const addressIsValid = this.legitPolkadot(wallet);

                // happy case
                if (addressIsValid) {
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

#update-address-button:hover {
    background-color: #4A0064;
}

#update-address-button:active {
    background-color: #261142;
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
