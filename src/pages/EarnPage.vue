<template>
    <PageBanner :msg="$i18n('sign_up_for_threat_slayer')">
        <img class="banner-icon" src="/src/assets/images/start_earning.png">
    </PageBanner>
    <WarningTextBox v-if="urlToStake" :msg="$i18n('warning_must_register_before_staking')" />
    <LoginLine :selectPage="selectPage" />
    <TextComponent :msg="$i18n('dont_have_one')" subinstruction /><button class="login-button"
        @click="selectPage('wallet')">{{ $i18n('create_one') }}</button>
    <br />
    <br />
    <!-- username -->
    <input id="username-input" @input="validateUsername" v-model.trim="username" required tabindex="2"
        :placeholder="$i18n('enter_a_username')" :style="usernameInputStyle" />
    <TextComponent v-if="usernameErrorMessage.length" :msg="$i18n(usernameErrorMessage)" error />
    <!-- email -->
    <input type="email" @input="validateEmail" v-model.trim="email" required tabindex="4" :style="emailInputStyle"
        :placeholder="$i18n('enter_your_email')" />
    <TextComponent v-if="emailErrorMessage.length" :msg="$i18n(emailErrorMessage)" error />
    <!-- password with show/hide button -->
    <div>
        <input class="password-input" :type="passwordInputType" v-model.trim="password" required
            :placeholder="$i18n('enter_a_password')" tabindex="6" :style="passwordInputStyle" />
        <button @click="togglePasswordInputType" class="small-button" id="show-password-toggle-button" tabindex="8">
            {{ passwordInputType === 'password' ? $i18n('password_show') : $i18n('password_hide') }}
        </button>
    </div>
    <TextComponent v-if="passwordErrorMessage.length" :msg="$i18n(passwordErrorMessage)" error />
    <!-- password confirmation field -->
    <input class="password-input" :type="passwordInputType" @input="validateReenteredPassword" :style="passwordInputStyle"
        v-model.trim="reenteredPassword" :placeholder="$i18n('enter_password_again')" tabindex="10" required />
    <TextComponent v-if="reenteredPasswordErrorMessage.length" :msg="$i18n(reenteredPasswordErrorMessage)" error />
    <!-- AZero wallet address (optional) -->
    <input id="address-input" @input="validateAddress($event, 'azero', 'azeroAddressErrorMessage')"
        v-model.trim="azeroWalletId" :style="addressInputStyleAzero"
        :placeholder="$i18n('enter_azero_wallet_address_optional')" tabindex="12" />
    <TextComponent v-if="azeroAddressErrorMessage.length" :msg="$i18n(azeroAddressErrorMessage)" error />
    <!-- Polkadot wallet address (optional) -->
    <!-- TODO add this to translation file -->
    <input id="address-input" @input="validateAddress($event, 'pdot', 'pdotAddressErrorMessage')"
        v-model.trim="pdotWalletId" :style="addressInputStylePdot" placeholder="Optional: Paste your Moonbeam wallet here"
        tabindex="14" />
    <TextComponent v-if="pdotAddressErrorMessage.length" :msg="$i18n(pdotAddressErrorMessage)" error />
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
        v-bind="{ azeroWalletId, checkState, selectPage, email, password, pdotWalletId, referrer, termsOfService, unitedStates, username }" />
</template>
<script>
import { debounce } from 'debounce';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { findEmailError, findNonAlphanumericChars, usernameErrorMessages, validateAzero, validateMoonbeam } from "../utilities";
import { hexToU8a, isHex } from '@polkadot/util';

import WarningTextBox from "./components/WarningTextBox.vue";
import CreateUserButton from "./components/buttons/CreateUserButton.vue";
import InfoTip from "./components/InfoTip.vue";
import LineOfText from "./components/LineOfText.vue";
import LoginLine from './components/LoginLine.vue';
import PageBanner from "./components/PageBanner.vue";
import TextComponent from "./components/TextComponent.vue";

const errorStyle = {
    border: '3px solid red',
    color: 'red'
};
const maxUsernameLength = 16; // number of characters

export default {
    name: 'EarnPage',
    props: {
        checkState: Function,
        selectPage: Function,
        urlToStake: String
    },
    components: {
        WarningTextBox,
        CreateUserButton,
        InfoTip,
        LineOfText,
        LoginLine,
        PageBanner,
        TextComponent
    },
    data() {
        return {
            azeroWalletId: '',
            azeroAddressErrorMessage: '',
            connectAccountSelected: true,
            createAccountSelected: false,
            email: '',
            emailErrorMessage: '',
            password: '',
            passwordErrorMessage: '',
            passwordInputType: 'password',
            pdotWalletId: '',
            pdotAddressErrorMessage: '',
            reenteredPassword: '',
            reenteredPasswordErrorMessage: '',
            referrer: '',
            termsOfService: false,
            unitedStates: false,
            username: '',
            usernameErrorMessage: ''
        };
    },
    async mounted() {
        const firstInput = document.getElementById('username-input');

        firstInput.focus();
    },
    computed: {
        addressInputStyleAzero() {
            return this.azeroAddressErrorMessage?.length ? errorStyle : {};
        },
        addressInputStylePdot() {
            return this.pdotAddressErrorMessage?.length ? errorStyle : {};
        },
        emailInputStyle() {
            return this.emailErrorMessage?.length ? errorStyle : {};
        },
        passwordInputStyle() {
            return this.passwordErrorMessage?.length ? errorStyle : {};
        },
        usernameInputStyle() {
            return this.usernameErrorMessage?.length ? errorStyle : {};
        },
    },
    methods: {
        clearUsernameErrors() {
            this.usernameErrorMessage = '';
        },
        focusNextCheckbox() {
            const firstCheckBox = document.getElementById('first-box');

            if (firstCheckBox.checked) {
                const secondCheckBox = document.getElementById('second-box');

                secondCheckBox.focus();
            }
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
        togglePasswordInputType() {
            this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
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
        validateEmail: debounce(function () {
            this.emailErrorMessage = findEmailError(this.email);
        }, 250),
        validateReenteredPassword: debounce(function () {
            // number of characters
            const minLength = 12;
            const maxLength = 512;

            // validate initial password first
            const password = this.password;

            if (!password?.length) {
                this.passwordErrorMessage = '';
            } else if (password.length < minLength) {
                this.passwordErrorMessage = 'error_password_too_short';
            } else if (password.length > maxLength) {
                this.passwordErrorMessage = 'error_password_too_long';
            } else {
                this.passwordErrorMessage = '';
            }

            if (!this.reenteredPassword.length) {
                this.reenteredPasswordErrorMessage = '';
            } else if (password !== this.reenteredPassword) {
                this.reenteredPasswordErrorMessage = 'error_passwords_dont_match';
            } else {
                this.reenteredPasswordErrorMessage = '';
            }
        }, 250),
        validateUsername: debounce(function (event) {
            const name = event?.target?.value;

            // bail out if no username yet, or else it will show an error and be annoying
            if (!name || !name.length) {
                this.clearUsernameErrors();
                return true;
            }

            // TODO make an array of errors?
            const allowedCharsRegex = /^[a-zA-Z0-9_]+$/;
            const containsIllegalChars = !allowedCharsRegex.test(name);

            if (name.length > maxUsernameLength) {
                this.usernameErrorMessage = usernameErrorMessages.maxLength;
            } else if (containsIllegalChars) {
                const illegalChars = findNonAlphanumericChars(name);

                this.usernameErrorMessage = usernameErrorMessages.illegalChars(illegalChars);
            } else {
                this.clearUsernameErrors();
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
