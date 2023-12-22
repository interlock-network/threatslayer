<template>
    <PageBanner :msg="$i18n('sign_up_for_threat_slayer')">
        <img class="banner-icon" src="/src/assets/images/start_earning.png">
    </PageBanner>
    <InstallationModal :pageFaded="pageFaded" :fadeEarnPage="fadeEarnPage" />
    <div :style="computedStyle">
        <WarningTextBox v-if="urlToStake" :msg="$i18n('warning_must_register_before_staking')" />
        <LoginLine :selectPage="selectPage" tabindex="22" />
        <CreateWalletLine :selectPage="selectPage" tabindex="24" />
        <br />
        <br />
        <UsernameInput @currentUsername="getUsername" @usernameHasError="getUsernameHasError"
            :missingSubmitFields="missingSubmitFields" tabindex="2" />
        <EmailInput @currentEmail="getEmail" @emailHasError="getEmailHasError" :missingSubmitFields="missingSubmitFields"
            tabindex="4" />
        <SinglePasswordInput @currentPassword="getPassword" @passwordHasError="getPasswordHasError"
            @inputType="getInputType" :missingSubmitFields="missingSubmitFields" tabindex="6" />
        <!-- password confirmation -->
        <input class="password-input" :type="passwordInputType" @input="validateReenteredPassword"
            :class="reenteredPasswordInputClass" v-model.trim="reenteredPassword"
            :placeholder="$i18n('enter_password_again')" tabindex="8" required />
        <ErrorMessage v-if="reenteredPasswordErrorMessage.length" :msg="$i18n(reenteredPasswordErrorMessage)" single />
        <AddressInput @currentAddress="getAddress" @addressHasError="getAddressHasError" tabindex="10" />
        <!-- referrer (optional) -->
        <UsernameInput placeholder="enter_referrer_name" @currentUsername="getReferrer"
            @usernameHasError="getReferrerHasError" tabindex="14" />
        <div id="checkbox-parent-container" :class="checkboxClass">
            <!-- TODO add missing field check here -->
            <div class="checkbox-container" style="margin-top: 0.8rem;" @click="focusNextCheckbox">
                <input id="first-box" type="checkbox" v-model="termsOfService" tabindex="16">
                <label for="first-box">{{ $i18n('agree_to_our') }}
                    <a href="https://www.interlock.network/terms-of-service" target="_blank">
                        {{ $i18n('terms_of_service') }} </a>
                </label>
            </div>
            <!-- TODO add missing field check here -->
            <div class="checkbox-container">
                <input id="second-box" type="checkbox" v-model="unitedStates" tabindex="18">
                <label for="second-box" style="display: inline-flex;">{{ $i18n('affirm_not_us_citizen') }}
                    <InfoTip :msg="$i18n('crypto_us_warning')" />
                </label>
            </div>
        </div>
        <CreateUserButton style="margin-top: 1.1rem;" tabindex="20" @missingSubmitFields="getMissingSubmitFields"
            v-bind="{ checkState, hasErrors, selectPage, email, password, referrer, termsOfService, unitedStates, username, wallet }" />
    </div>
</template>

<script>
import { debounce } from 'debounce';
import { getChromeStorage } from '../utilities.js';

import AddressInput from "./components/inputs/AddressInput.vue";
import CreateUserButton from "./components/buttons/CreateUserButton.vue";
import CreateWalletLine from './components/CreateWalletLine.vue';
import EmailInput from "./components/inputs/EmailInput.vue";
import ErrorMessage from "./components/ErrorMessage.vue";
import InfoTip from "./components/InfoTip.vue";
import InstallationModal from "./components/InstallationModal.vue";
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
        AddressInput,
        CreateUserButton,
        CreateWalletLine,
        EmailInput,
        ErrorMessage,
        InfoTip,
        InstallationModal,
        LineOfText,
        LoginLine,
        PageBanner,
        SinglePasswordInput,
        TextComponent,
        UsernameInput,
        WarningTextBox
    },
    data() {
        return {
            addressHasError: false,
            connectAccountSelected: true,
            createAccountSelected: false,
            email: '',
            emailHasError: false,
            missingSubmitFields: false,
            pageFaded: false,
            password: '',
            passwordHasError: false,
            passwordInputType: 'password',
            reenteredPassword: '',
            reenteredPasswordErrorMessage: '',
            referrer: '',
            referrerHasError: false,
            termsOfService: false,
            unitedStates: false,
            username: '',
            usernameHasError: false,
            wallet: '',
        };
    },
    async mounted() {
        // this should be true on first installation only
        const justInstalled = await getChromeStorage('justInstalled');

        if (justInstalled) {
            this.fadeEarnPage(true);
        } else {
            const firstInput = document.getElementById('username-input');

            firstInput.focus();
        }
    },
    computed: {
        checkboxClass() {
            const { missingSubmitFields, termsOfService, unitedStates } = this;

            let result = '';

            if (missingSubmitFields && (!termsOfService || !unitedStates)) {
                result = 'generic-error';
            }

            return result;
        },
        computedStyle() {
            return this.pageFaded ? { 'opacity': '5%', 'pointer-events': 'none' } : {};
        },
        hasErrors() {
            const { addressHasError, emailHasError, passwordHasError, referrerHasError, usernameHasError } = this;

            return addressHasError || emailHasError || passwordHasError || referrerHasError || usernameHasError;
        },
        reenteredPasswordInputClass() {
            return this.reenteredPasswordErrorMessage?.length ? 'generic-error' : '';
        }
    },
    methods: {
        fadeEarnPage(bool) {
            this.pageFaded = bool;
        },
        focusNextCheckbox() {
            const firstCheckBox = document.getElementById('first-box');

            if (firstCheckBox.checked) {
                const secondCheckBox = document.getElementById('second-box');

                secondCheckBox.focus();
            }
        },
        getAddress(wallet) {
            this.wallet = wallet;
        },
        getAddressHasError(errorBool) {
            this.addressHasError = errorBool;
        },
        getEmail(email) {
            this.email = email;
        },
        getEmailHasError(errorBool) {
            this.emailHasError = errorBool;
        },
        getMissingSubmitFields(errorBool) {
            this.missingSubmitFields = errorBool;
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
        getReferrer(referrer) {
            this.referrer = referrer;
        },
        getReferrerHasError(errorBool) {
            this.referrerHasError = errorBool;
        },
        getUsername(username) {
            this.username = username;
        },
        getUsernameHasError(errorBool) {
            this.usernameHasError = errorBool;
        },
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

#checkbox-parent-container {
    border-radius: 5px;
    width: 400px;
}

#earn-page-top-line {
    display: block;
    font-size: 1rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

.checkbox-container {
    display: block;
    font-size: 0.9rem;
    pointer-events: initial;
}
</style>
