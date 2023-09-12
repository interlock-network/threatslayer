<template>
    <!-- initial View Wallet Info button -->
    <button v-if="!active" @click="openWalletInfoModal" id="view-wallet-info-button" :class="computedClass">
        {{ $i18n('view_wallet_info') }}
    </button>
    <div v-if="active" id="modal-overlay">
        <div id="modal-container" :style="active ? 'bottom: 40%' : 'display: none'">
            <!-- initial view wallet button -->
            <TextComponent :msg="$i18n('wallet_address')" bold /> <br />
            <!-- prompt to add wallet address if there is none -->
            <div v-if="showAddressInput">
                <!-- input field with prompt for new address -->
                <TextComponent :msg="$i18n(updateAddressMsg)" subinstruction />
                <button v-if="changeAddressSelected" id="cancel-change-address" @click="selectChangeAddress(false)">
                    {{ $i18n('cancel') }}
                </button>
                <input @input="validateAddress" v-model.trim="newAddress" :style="addressInputStyle"
                    style="margin-top: 0.5rem;" :placeholder="$i18n('enter_wallet_address')" tabindex="2" />
                <TextComponent v-if="newAddressErrorMessage.length" :msg="newAddressErrorMessage" error />
                <!-- password field with show/hide button -->
                <div v-if="active">
                    <TextComponent v-if="showAddressChangeWarning" subinstruction
                        :msg="$i18n('warning_changing_wallet_address')" />
                </div>
                <!-- button to update address -->
                <UpdateAddressButton
                    v-bind="{ apiKey, checkState, active, newAddress, password, toggleClickedOnce, username }" />
            </div>
            <TextComponent v-if="showAddress" :msg="address" mono /><br />
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

export default {
    name: "WalletInfoModal",
    props: {
        address: String,
        apiKey: String,
        checkState: Function,
        fadeAccountPage: Function,
        selectPage: Function,
        username: String
    },
    components: {
        TextComponent,
        UpdateAddressButton
    },
    data() {
        return {
            active: false,
            changeAddressSelected: false,
            confirm: false,
            deleting: false,
            errorArr: [],
            newAddress: '',
            newAddressErrorMessage: '',
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
        showAddress() {
            return this.address?.length && !this.changeAddressSelected;
        },
        showAddressInput() {
            return !this.address?.length || this.changeAddressSelected;
        },
        showAddressChangeWarning() {
            return this.address?.length;
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
    height: 600px;
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
