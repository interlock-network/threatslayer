<template>
    <PageBanner msg="Sign up for ThreatSlayer">
        <img class="banner-icon" src="/src/assets/images/start_earning.png">
    </PageBanner>
    <LineOfText class="subhead" msg="" instruction>
        <span>Already have an account?<button id="login-button" @click="selectPage('login')">Login</button></span>
    </LineOfText>
    <LineOfText class="subhead" msg="" instruction>
        <span>Don't have a wallet?<button id="login-button" @click="selectPage('wallet')">Create one</button></span>
    </LineOfText>
    <br />
    <!-- wallet -->
    <LineOfText msg="Wallet Address" bold />
    <input id="address-input" @input="validateAddress" v-model.trim="address" placeholder="Paste your wallet address here"
        tabindex="2" :style="addressInputStyle" required />
    <LineOfText v-if="addressErrorMessage.length" :msg="addressErrorMessage" error />
    <!-- username -->
    <LineOfText msg="Username" bold />
    <input id="username-input" @input="validateUsername" v-model.trim="username" required tabindex="4"
        placeholder="Allowed characters are A-Z, a-z and 0-9" :style="usernameInputStyle" />
    <LineOfText v-if="usernameErrorMessage.length" :msg="usernameErrorMessage" error />
    <!-- email -->
    <LineOfText msg="Email" bold />
    <input type="email" @input="validateEmail" v-model.trim="email" required tabindex="6" :style="emailInputStyle"
        placeholder="We need your email for verification" />
    <LineOfText v-if="emailErrorMessage.length" :msg="emailErrorMessage" error />
    <!-- password with show/hide button -->
    <LineOfText msg="Password" bold />
    <input class="password-input" :type="passwordInputType" v-model.trim="password" required
        placeholder="Enter a password of at least 12 characters" tabindex="8" :style="passwordInputStyle" />
    <button @click="togglePasswordInputType" class="small-button" id="show-toggle-button" tabindex="9">
        {{ passwordInputType === 'password' ? 'Show' : 'Hide' }}
    </button>
    <LineOfText v-if="passwordErrorMessage.length" :msg="passwordErrorMessage" error />
    <!-- password confirmation field -->
    <input class="password-input" style="margin-top: -0.5rem;" :type="passwordInputType" @input="validateReenteredPassword"
        v-model.trim="reenteredPassword" placeholder="Enter your password again" tabindex="10" :style="passwordInputStyle"
        required />
    <LineOfText v-if="reenteredPasswordErrorMessage.length" :msg="reenteredPasswordErrorMessage" error />
    <!-- referrer -->
    <LineOfText msg="Referred by another user? (Optional)" bold />
    <input v-model.trim="referrer" tabindex="12" placeholder="Enter their username" />
    <div class="checkbox-container" @click="focusNextCheckbox">
        <input id="first-box" type="checkbox" v-model="termsOfService" tabindex="14">
        <label for="first-box">Agree to our <a href="https://interlock.network" target="_blank">
                Terms of Service</a></label>
    </div>
    <div class="checkbox-container" style="margin-top: -0.5rem;">
        <input id="second-box" type="checkbox" v-model="unitedStates" tabindex="16">
        <label for="second-box" style="display: inline-flex;">Affirm you are not a US citizen or resident
            <InfoTip msg="Cryptocurrency is considered a security in the US so most US residents cannot purchase them." />
        </label>
    </div>
    <CreateUserButton :address="address" :selectPage="selectPage" :email='email' :password="password" :referrer="referrer"
        :termsOfService="termsOfService" :unitedStates="unitedStates" :username="username" tabindex="26" />
</template>
<script>
import { debounce } from 'debounce';
import { findEmailError, findNonAlphanumericChars } from "../utilities";
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

import InfoTip from "./components/subcomponents/InfoTip.vue";
import LineOfText from "./components/subcomponents/LineOfText.vue";
import PageBanner from "./components/subcomponents/PageBanner.vue";
import CreateUserButton from "./components/subcomponents/CreateUserButton.vue";

const errorStyle = {
    border: "3px solid red",
    color: 'red',
    // 'margin-bottom': '0rem'
};
const maxPasswordLength = 16; // number of characters


export default {
    name: 'EarnPage',
    props: {
        selectPage: Function,
    },
    components: {
        InfoTip,
        LineOfText,
        PageBanner,
        CreateUserButton,
    },
    data() {
        return {
            address: '',
            addressErrorMessage: '',
            connectAccountSelected: true,
            createAccountSelected: false,
            email: '',
            emailErrorMessage: '',
            password: '',
            passwordErrorMessage: '',
            passwordInputType: 'password',
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
        const firstInput = document.getElementById('address-input');

        firstInput.focus();
    },
    computed: {
        addressInputStyle() {
            return this.addressErrorMessage?.length ? errorStyle : {};
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
        validateAddress: debounce(function (event) {
            const address = event?.target?.value;
            this.addressErrorMessage = '';

            if (!address || !address.length) {
                this.addressErrorMessage = '';
            }

            const addressIsValid = this.legitPolkadot(address);

            // happy case
            if (addressIsValid) {
                this.addressErrorMessage = '';
            } else if (!address || !address.length) {
                this.addressErrorMessage = '';
            } else {
                this.addressErrorMessage = 'Not a valid address';
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
                this.passwordErrorMessage = `Password must be at least ${minLength} characters`;
            } else if (password.length > maxLength) {
                this.passwordErrorMessage = `Password cannot be more than ${maxLength} characters`;
            } else {
                this.passwordErrorMessage = '';
            }

            if (!this.reenteredPassword.length) {
                this.reenteredPasswordErrorMessage = '';
            } else if (password !== this.reenteredPassword) {
                this.reenteredPasswordErrorMessage = 'Your passwords do not match';
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

            const errorMessages = {
                illegalChars: function (chars) { return `Username contains illegal characters: ${chars.join(', ')}` },
                maxLength: `Username too long: Max length is ${maxPasswordLength} characters`
            };

            // TODO make an array of errors?
            const allowedCharsRegex = /^[a-zA-Z0-9_]+$/;
            const containsIllegalChars = !allowedCharsRegex.test(name);

            if (name.length > maxPasswordLength) {
                this.usernameErrorMessage = errorMessages.maxLength;
            } else if (containsIllegalChars) {
                const illegalChars = findNonAlphanumericChars(name);

                this.usernameErrorMessage = errorMessages.illegalChars(illegalChars);
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
    height: 0.9rem;
    margin-right: 0.5rem;
    width: 0.9rem;
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

#login-button {
    background-color: #0F0818;
    border: none;
    color: #963cf5;
    font-size: 1.1rem;
    font-weight: bold;
    pointer-events: initial;
}

#show-toggle-button {
    border: none;
    color: #963cf5;
    margin-top: 0.4rem;
    padding-top: 0.25rem;
    position: absolute;
    right: 30%;
}

.password-input {
    float: left;
}

.subhead {
    margin-top: -1rem;
}

.checkbox-container {
    display: block;
    pointer-events: initial;
}
</style>
  