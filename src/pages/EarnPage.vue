<template>
    <PageBanner :msg="$i18n('sign_up_for_threat_slayer')">
        <img class="banner-icon" src="/src/assets/images/start_earning.png">
    </PageBanner>
    <WarningTextBox v-if="urlToStake" :msg="$i18n('warning_must_register_before_staking')" />
    <LoginLine :selectPage="selectPage" />
    <CreateWalletLine :selectPage="selectPage" />
    <br />
    <br />
    <UsernameInput @currentUsername="getUsername" @usernameHasError="getUsernameHasError" />
    <EmailInput @currentEmail="getEmail" @emailHasError="getEmailHasError" />
    <SinglePasswordInput @currentPassword="getPassword" @passwordHasError="getPasswordHasError" @inputType="getInputType" />
    <!-- password confirmation -->
    <input class="password-input" :type="passwordInputType" @input="validateReenteredPassword"
        :class="reenteredPasswordInputClass" v-model.trim="reenteredPassword" :placeholder="$i18n('enter_password_again')"
        tabindex="10" required />
    <ErrorMessage v-if="reenteredPasswordErrorMessage.length" :msg="$i18n(reenteredPasswordErrorMessage)" single />
    <!-- AZero wallet address (optional) -->
    <input id="address-input" @input="validateAddress($event, 'azero', 'azeroAddressErrorMessage')"
        v-model.trim="azeroWalletId" :class="addressInputClassAzero"
        :placeholder="$i18n('enter_azero_wallet_address_optional')" tabindex="12" />
    <ErrorMessage v-if="azeroAddressErrorMessage.length" :msg="$i18n(azeroAddressErrorMessage)" single />
    <!-- Polkadot wallet address (optional) -->
    <!-- TODO add this to translation file -->
    <input id="address-input" @input="validateAddress($event, 'pdot', 'pdotAddressErrorMessage')"
        v-model.trim="pdotWalletId" :class="addressInputClassPdot" placeholder="Optional: Paste your Moonbeam wallet here"
        tabindex="14" />
    <ErrorMessage v-if="pdotAddressErrorMessage.length" :msg="$i18n(pdotAddressErrorMessage)" single />
    <!-- referrer (optional) -->
    <input v-model.trim="referrer" tabindex="16" :placeholder="$i18n('enter_referrer_name')" />
    <div class="checkbox-container" style="margin-top: 0.8rem;" @click="focusNextCheckbox">
        <input id="first-box" type="checkbox" v-model="termsOfService" tabindex="18">
        <label for="first-box">{{ $i18n('agree_to_our') }}<a href="https://interlock.network" target="_blank">
                {{ $i18n('terms_of_service') }} </a></label>
    </div>
    <div class="checkbox-container">
        <input id="second-box" type="checkbox" v-model="unitedStates" tabindex="20">
        <label for="second-box" style="display: inline-flex;">{{ $i18n('affirm_not_us_citizen') }}
            <InfoTip :msg="$i18n('crypto_us_warning')" />
        </label>
    </div>
    <CreateUserButton style="margin-top: 1.1rem;" tabindex="22"
        v-bind="{ azeroWalletId, checkState, createUserDisabled, selectPage, email, password, pdotWalletId, referrer, termsOfService, unitedStates, username }" />
</template>
<script>
import { debounce } from 'debounce';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { validateAzero, validateMoonbeam } from "../utilities";
import { hexToU8a, isHex } from '@polkadot/util';

import CreateUserButton from "./components/buttons/CreateUserButton.vue";
import CreateWalletLine from './components/CreateWalletLine.vue';
import EmailInput from "./components/inputs/EmailInput.vue";
import ErrorMessage from "./components/ErrorMessage.vue";
import InfoTip from "./components/InfoTip.vue";
import LineOfText from "./components/LineOfText.vue";
import LoginLine from './components/LoginLine.vue';
import PageBanner from "./components/PageBanner.vue";
import SinglePasswordInput from "./components/inputs/SinglePasswordInput.vue";
import TextComponent from "./components/TextComponent.vue";
import UsernameInput from "./components/inputs/UsernameInput.vue";
import WarningTextBox from "./components/WarningTextBox.vue";

export default {
    name: 'EarnPage',
    props: {
        checkState: { type: Function, required: true },
        selectPage: { type: Function, required: true },
        urlToStake: { type: String, default: '' }
    },
    components: {
        CreateUserButton,
        CreateWalletLine,
        EmailInput,
        ErrorMessage,
        InfoTip,
        LineOfText,
        LoginLine,
        PageBanner,
        SinglePasswordInput,
        TextComponent,
        UsernameInput,
        WarningTextBox,
    },
    data() {
        return {
            azeroWalletId: '',
            azeroAddressErrorMessage: '',
            connectAccountSelected: true,
            createAccountSelected: false,
            email: '',
            emailHasError: false,
            password: '',
            passwordHasError: false,
            passwordInputType: 'password',
            pdotWalletId: '',
            pdotAddressErrorMessage: '',
            reenteredPassword: '',
            reenteredPasswordErrorMessage: '',
            referrer: '',
            termsOfService: false,
            unitedStates: false,
            username: '',
            usernameHasError: ''
        };
    },
    async mounted() {
        const firstInput = document.getElementById('username-input');

        firstInput.focus();
    },
    computed: {
        addressInputClassAzero() {
            return this.azeroAddressErrorMessage?.length ? 'generic-error' : '';
        },
        addressInputClassPdot() {
            return this.pdotAddressErrorMessage?.length ? 'generic-error' : '';
        },
        createUserDisabled() {
            const { email, emailHasError, password, passwordHasError, termsOfService, unitedStates, username, usernameHasError } = this;

            const missingFields = !email.length || !password.length || !username.length;
            const boxesUnchecked = !termsOfService || !unitedStates;
            const hasErrors = emailHasError || passwordHasError || usernameHasError;

            return missingFields || boxesUnchecked || hasErrors;
        },
        reenteredPasswordInputClass() {
            return this.reenteredPasswordErrorMessage?.length ? 'generic-error' : '';
        }
    },
    methods: {
        focusNextCheckbox() {
            const firstCheckBox = document.getElementById('first-box');

            if (firstCheckBox.checked) {
                const secondCheckBox = document.getElementById('second-box');

                secondCheckBox.focus();
            }
        },
        getEmail(email) {
            this.email = email;
        },
        getEmailHasError(errorBool) {
            this.emailHasError = errorBool;
        },
        getPassword(password) {
            this.password = password;
        },
        getPasswordHasError(errorBool) {
            this.passwordHasError = errorBool;
        },
        getInputType(inputType) {
            this.passwordInputType = inputType;
        },
        getUsername(username) {
            this.username = username;
        },
        getUsernameHasError(errorBool) {
            this.usernameHasError = errorBool;
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
        validateAddress: debounce(function (event, addressType, errorKeyName) {
            const address = event?.target?.value;
            this[errorKeyName] = '';

            if (!address || !address.length) {
                this[errorKeyName] = '';
            }

            const addressIsValid = this.legitPolkadot(address);

            if (addressType === 'azero' && !validateAzero(address)) {
                this[errorKeyName] = 'warning_address_not_azero';
            } else if (addressType === 'pdot' && !validateMoonbeam(address)) {
                this[errorKeyName] = 'warning_address_not_moonbeam';
            }
            // happy case
            else if (addressIsValid) {
                this[errorKeyName] = '';
            } else if (!address || !address.length) {
                this[errorKeyName] = '';
            } else {
                this[errorKeyName] = 'error_registering_wallet_address';
            }
        }, 250),
        validateReenteredPassword: debounce(function () {
            const { password, reenteredPassword } = this;

            // validate reentered password next
            if (!reenteredPassword.length) {
                this.reenteredPasswordErrorMessage = '';
            } else if (password !== reenteredPassword) {
                this.reenteredPasswordErrorMessage = 'error_passwords_dont_match';
            } else {
                this.reenteredPasswordErrorMessage = '';
            }
        }, 250)
    }
}
</script>

<style>
input[type="checkbox"] {
    background: #FFFFFF;
    height: 0.7rem;
    margin-right: 0.5rem;
    width: 0.7rem;
}

input[type="checkbox"]:focus {
    outline: 2px solid #3b8de8;
}

input:focus {
    border: 3px solid #3b8de8;
    outline: none;
}

#bail-container {
    display: block;
}

#earn-page-top-line {
    display: block;
    font-size: 1rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

.input-header {
    display: block;
    margin-bottom: 0.5rem;
}

.checkbox-container {
    display: block;
    font-size: 0.9rem;
    pointer-events: initial;
}
</style>
