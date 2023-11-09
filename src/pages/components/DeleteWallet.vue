<template>
    <!-- TODO translate this -->
    <WarningTextBox msg="Warning: Without a wallet address you cannot withdraw $ILOCK that you have earned."
        style="margin-top: 0rem;" />
    <div>
        <TextComponent msg="Enter password to delete wallet address." /><br />
        <br />
        <SinglePasswordInput @currentPassword="getPassword" @passwordHasError="getPasswordHasError" modal tabindex="2" />
        <ErrorMessage v-if="deleteWalletErrors?.length" v-for="error in deleteWalletErrors" :msg="error" single />
        <br />
        <button @click="clearWallet" id="delete-address-button" class="modal-button" :disabled="disabled" tabindex="4">
            <!-- TODO translate this -->
            Delete Wallet Address
        </button> <br />
        <button @click="deleteWalletSelected(false)" class="secondary-hollow-button" style="margin-top: 2rem;" tabindex="6">
            {{ $i18n('cancel') }}
        </button>
    </div>
</template>

<script>
import ErrorMessage from "./ErrorMessage.vue";
import SinglePasswordInput from "./inputs/SinglePasswordInput.vue";
import TextComponent from "./TextComponent.vue";
import WarningTextBox from "./WarningTextBox.vue";

import axios from "axios";
import { baseUrl, extractFromError, formatErrorMessages, setChromeStorage } from '../../utilities.js';
export default {
    name: "DeleteWallet",
    components: {
        ErrorMessage,
        SinglePasswordInput,
        TextComponent,
        WarningTextBox
    },
    props: {
        apiKey: { type: String, default: '' },
        azeroAddress: { type: String, default: '' },
        deleteWalletSelected: { type: Function, required: true },
        username: { type: String, default: '' }
    },
    data() {
        return {
            deleteWalletErrors: [],
            password: '',
            passwordHasError: false,
        }
    },
    computed: {
        disabled() {
            const { password, passwordHasError } = this;

            return !password || passwordHasError?.length;
        }
    },
    methods: {
        async clearWallet() {
            const { apiKey, azeroAddress, password, username } = this;

            this.isClicked = false;

            axios.post(`${baseUrl}/user-bcaddr-delete`, { key: apiKey, password, username, wallet: azeroAddress })
                .then(async _response => {

                    // set wallet address in state with user's new address
                    const setAzeroAddress = await setChromeStorage({ azeroAddress: null });

                    if (setAzeroAddress) {
                        this.checkState();
                    } else {
                        // TODO update this error message
                        this.deleteWalletErrors = ['error_updating_wallet_address_generic'];
                    }
                })
                .catch(error => {
                    const { errors, status } = extractFromError(error);

                    console.log(`Delete wallet address error. Status: ${status}. Error: ${errors}`);

                    this.deleteWalletErrors = formatErrorMessages(errors);
                });
        },
        getPassword(password) {
            this.password = password;
        },
        getPasswordHasError(errorBool) {
            this.passwordHasError = errorBool;
        }
    }
};
</script>

<style>
#delete-address-button {
    background-color: #0F0818;
    border: none;
    color: red;
    font-size: 1rem;
    height: 2rem;
    margin-bottom: 2rem;
    padding: 0.5rem 0.75rem;
    pointer-events: initial;
    width: 400px;
}

#delete-address-button:hover {
    background-color: #4A0064;
}
</style>
