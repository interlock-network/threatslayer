<template>
    <PageBanner msg="Sign up for ThreatSlayer" />
    <LineOfText msg="" instruction>
        <span>Already have an account?<button id="login-button" @click="changePage('login')">Login</button></span>
    </LineOfText>
    <br />
    <br />
    <LineOfText msg="Wallet Address" bold />
    <input id="address-input" @input="validateAddress" v-model.trim="walletAddress"
        placeholder="Paste your wallet address here" tabindex="2" required />
    <LineOfText error v-if="addressErrorMessage.length" :msg="addressErrorMessage" />
    <!-- username -->
    <LineOfText msg="Username" bold />
    <input id="username-input" @input="validateUsername" v-model.trim="username" required tabindex="4"
        placeholder="Allowed characters are A-Z, a-z and 0-9" :style="usernameInputStyle" />
    <LineOfText :msg="usernameErrorMessage" error v-if="usernameErrorMessage.length" />
    <br />
    <!-- email -->
    <LineOfText msg="Email" bold />
    <input type="email" @input="validateEmail" v-model.trim="email" required tabindex="6"
        placeholder="We need your email for verification" />
    <LineOfText :msg="emailErrorMessage" error v-if="emailErrorMessage.length" />
    <br />
    <!-- password with show/hide button -->
    <LineOfText msg="Password" bold />
    <div style="width: 100%; position: relative;">
        <input class="password-input" :type="passwordInputType" v-model.trim="password" required
            placeholder="Enter a password of at least 12 characters" tabindex="8" :style="passwordInputStyle" />
        <button @click="togglePasswordInputType" class="small-button" id="show-toggle-button" tabindex="9">
            {{ passwordInputType === 'password' ? 'Show' : 'Hide' }}
        </button>
    </div>
    <LineOfText :msg="passwordErrorMessage" error v-if="passwordErrorMessage.length" />
    <br />
    <br />
    <!-- password confirmation field -->
    <div style="width: 100%">
        <input class="password-input" :type="passwordInputType" @input="validateReenteredPassword"
            v-model.trim="reenteredPassword" placeholder="Enter your password again" tabindex="10"
            :style="passwordInputStyle" required />
        <LineOfText :msg="reenteredPasswordErrorMessage" error v-if="reenteredPasswordErrorMessage.length" />
    </div>
    <!-- referrer -->
    <LineOfText msg="Referred by another user? (Optional)" bold />
    <input v-model.trim="referrer" tabindex="12" placeholder="Enter referrer username" />
    <div class="checkbox-container" @click="focusNextCheckbox">
        <input id="first-box" type="checkbox" v-model="termsOfService" tabindex="14">
        <label for="first-box">Agree to our <a href="https://interlock.network" target="_blank">
                Terms of Service</a></label>
    </div>
    <div class="checkbox-container">
        <input id="second-box" type="checkbox" v-model="unitedStates" tabindex="16">
        <label for="second-box" style="display: inline-flex;">Affirm you are not a US citizen or resident
            <InfoTip style="padding-right: 2.75rem;"
                msg="Cryptocurrency is considered a security in the US so most US residents cannot purchase them." />
        </label>
    </div>
    <CreateUserButton :active="submitActive" :address="walletAddress" :changePage="changePage" :email='email'
        :password="password" :referrer="referrer" :termsOfService="termsOfService" :unitedStates="unitedStates"
        :username="username" tabindex="26" />
    <BailButton v-if="createAccountActive" tabindex="16" />
</template>
<script>
import axios from "axios";
import { debounce } from 'debounce';
import { findEmailError, findNonAlphanumericChars } from "../utilities";
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

import BailButton from "./components/subcomponents/BailButton.vue";
import ConnectInstructions from "./components/ConnectInstructions.vue";
import InfoTip from "./components/subcomponents/InfoTip.vue";
import LineOfText from "./components/subcomponents/LineOfText.vue";
import PageBanner from "./components/subcomponents/PageBanner.vue";
import CreateUserButton from "./components/subcomponents/CreateUserButton.vue";

const errorStyle = {
    border: "3px solid red",
    color: 'red',
};
const maxPasswordLength = 16; // number of characters


export default {
    name: 'EarnPage',
    props: {
        changePage: Function,
    },
    components: {
        BailButton,
        ConnectInstructions,
        InfoTip,
        LineOfText,
        PageBanner,
        CreateUserButton,
    },
    data() {
        return {
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
            usernameErrorMessage: '',
            walletAddress: ''
        };
    },
    async mounted() {
        const firstInput = document.getElementById('address-input');

        firstInput.focus();
    },
    computed: {
        connectWalletActive() {
            const previousStepActive = this.welcomeActive;
            const usernameAndWalletIdValidated = this.validateAccountInputs();

            return !previousStepActive && !usernameAndWalletIdValidated;
        },
        connectWalletButtonActive() {
            return this.createAccountActive && this.connectAccountSelected;
        },
        createAccountActive() {
            return (this.connectWalletActive || this.submitActive);
        },
        createWalletButtonActive() {
            return this.createAccountActive && this.createAccountSelected;
        },
        passwordInputStyle() {
            return this.passwordErrorMessage.length ? errorStyle : {};
        },
        submitActive() {
            const previousStepsComplete = !this.welcomeActive && this.validateAccountInputs();
            return previousStepsComplete;
        },
        usernameInputStyle() {
            return this.usernameErrorMessage?.length ? errorStyle : {};
        },
        welcomeActive() {
            const notCompletedYet = this.termsOfService && this.unitedStates;

            return !notCompletedYet;
        },
    },
    methods: {
        clearUsernameErrors() {
            this.usernameErrorMessage = '';
        },
        connectWallet() {
            this.connectAccountSelected = true;
            this.createAccountSelected = false;
        },
        createWallet() {
            this.connectAccountSelected = false;
            this.createAccountSelected = true;
            window.open('https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn');
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
            } else {
                this.addressErrorMessage = 'Not a valid address';
            }
        }, 250),
        validateEmail() {
            this.emailErrorMessage = findEmailError(this.email);
        },
        validateReenteredPassword() {
            // number of characters
            const minLength = 12;
            const maxLength = 512;

            // validate initial password first
            const password = this.password;

            // bail out if no username yet, or else it will show an error and be annoying
            if (!password || !password.length) {
                this.passwordErrorMessage = '';
            }

            if (password.length < minLength) {
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
        },
        validateAccountInputs() {
            const walletIsValid = !this.addressErrorMessage.length && this.walletAddress.length > 0;
            const emailIsValid = this.email.length > 2 && !this.emailErrorMessage.length;
            const usernameIsValid = this.username.length > 2 && !this.usernameErrorMessage.length;
            const passwordsMatch = this.password === this.reenteredPassword;
            const noPasswordErrors = !this.passwordErrorMessage.length && !this.reenteredPasswordErrorMessage.length;

            const passwordIsValid = this.password.length && passwordsMatch && noPasswordErrors;

            return walletIsValid && emailIsValid && usernameIsValid && passwordIsValid;
        },
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

                // TODO update with endpoint URL
                // axios.post('/api/name', { name })
                //     .then(() => {
                //         console.log('Username ${name} is available');
                //     })
                //     .catch(e => {
                //         const { errorMessage } = e?.response?.data;

                //         this.usernameErrorMessage = errorMessage || '';
                //     });
            }
        }, 250)
    }
}
</script>
  
<style>
input[type="checkbox"] {
    height: 0.75rem;
    margin-right: 0.5rem;
}

input:focus {
    border: 3px solid #3b8de8;
    outline: none;
}

input[type="checkbox"] {
    width: 10px;
    height: 10px;
    background: #FFFFFF;
}

input[type="checkbox"]:focus {
    outline: 2px solid #3b8de8;
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

.password-input {
    float: left;
}

#show-toggle-button {
    border: none;
    color: #963cf5;
    float: left;
    margin-top: 0.35rem;
    padding-top: 0.25rem;
    position: absolute;
    right: 3.5rem;
}

#address-input {
    height: 2rem;
}

.checkbox-container {
    display: block;
    pointer-events: initial;
}

.small-button {
    background-color: #060708;
    border: 1px solid #d0d4d9;
    color: #d0d4d9;
    pointer-events: initial;
}
</style>
  