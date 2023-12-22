<template>
    <div @keydown.esc="selectChangeAddress(false)">
        <TextComponent :msg="$i18n(updateAddressMsg)" subinstruction /><br />
        <br />
        <AddressInput @currentAddress="getAddress" @addressHasError="getAddressHasError"
            :missingSubmitFields="missingSubmitFields" tabindex="2" />
        <div style="position: absolute;">
            <SinglePasswordInput @currentPassword="getPassword" @passwordHasError="getPasswordHasError"
                :missingSubmitFields="missingSubmitFields" />
        </div>
        <br />
        <WarningTextBox v-if="showAddressChangeWarning" :msg="$i18n('warning_changing_wallet_address')"
            style="margin-top: 3rem;" />
        <UpdateAddressButton tabindex="4" style="margin-top: 3rem; margin-bottom: 1rem;"
            v-bind="{ apiKey, checkState, hasErrors, newWallet, password, username }"
            @missingSubmitFields="getMissingSubmitFields" />
        <button @click="selectChangeAddress(false)" id="cancel-button" class="modal-button" tabindex="6">
            {{ $i18n('cancel') }}
        </button>
    </div>
</template>

<script>
import AddressInput from "./inputs/AddressInput.vue";
import SinglePasswordInput from "./inputs/SinglePasswordInput.vue";
import TextComponent from "./TextComponent.vue";
import UpdateAddressButton from "./buttons/UpdateAddressButton.vue";
import WarningTextBox from "./WarningTextBox.vue";

export default {
    name: "AddWallet",
    components: {
        AddressInput,
        SinglePasswordInput,
        TextComponent,
        UpdateAddressButton,
        WarningTextBox
    },
    props: {
        apiKey: { type: String, default: '' },
        walletAddress: { type: String, default: '' },
        checkState: { type: Function, required: true },
        selectChangeAddress: { type: Function, required: true },
        updateAddressMsg: { type: String, default: '' },
        username: { type: String, default: '' }
    },
    data() {
        return {
            hasErrors: false,
            isClicked: false,
            deleteWalletErrors: [],
            missingSubmitFields: false,
            password: '',
            passwordHasError: false
        }
    },
    computed: {
        hasErrors() {
            return this.newaddressHasError || this.passwordHasError;
        },
        showAddressChangeWarning() {
            return this.walletAddress?.length;
        }
    },
    methods: {
        getAddress(wallet) {
            this.newWallet = wallet;
        },
        getAddressHasError(errorBool) {
            this.newaddressHasError = errorBool;
        },
        getMissingSubmitFields(errorBool) {
            this.missingSubmitFields = errorBool;
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
#cancel-button {
    background-color: #0F0818;
    border: none;
    border-radius: 6px;
    color: #963cf5;
    font-size: 1rem;
    line-height: 2rem;
    width: 400px;
}

#cancel-button:hover {
    background-color: #4A0064;
}

#cancel-button:active {
    background-color: #261142;
}
</style>
