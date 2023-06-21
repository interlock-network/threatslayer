<template>
    <PageBanner msg="Start Earning" />
    <WelcomeView :active="welcomeActive">
        <div id="welcome-cta-container" v-if="welcomeActive">
            <br />
            <LineOfText msg="Check these boxes to continue:" instruction />
            <div class="checkbox-container" @click="focusNextCheckbox">
                <input id="first-box" type="checkbox" v-model="termsOfService" tabindex="1">
                <label for="first-box">Agree to our <a href="https://interlock.network" target="_blank">
                        Terms of Service</a></label>
            </div>
            <div class="checkbox-container">
                <input id="second-box" type="checkbox" v-model="unitedStates" tabindex="4">
                <label for="second-box" style="display: inline-flex;">Affirm you are not a US citizen or resident
                    <InfoTip style="padding-right: 2.75rem;" v-if="welcomeActive"
                        msg="Cryptocurrency is considered a security in the US so most US residents cannot purchase them." />
                </label>
            </div>
        </div>
    </WelcomeView>
    <CreateAccountView :active="createAccountActive">
        <br />
        <div style="width: 100%; display: flex;">
            <WalletButton msg="Connect Wallet" :active="connectWalletButtonActive" id="connectWallet"
                :action="connectWallet" tabindex="10" />
            <WalletButton :action="createWallet" msg="Create Wallet" :active="createWalletButtonActive" id="createWallet"
                tabindex="12" />
        </div>
        <div>
            <br />
            <ConnectInstructions v-if="connectAccountSelected && createAccountActive">
                <textarea class="input-field-text" id="address-input" @input="validateAddress" v-model.trim="walletAddress"
                    style="width: 100%" placeholder="Paste your wallet address here" tabindex="14" required />
                <LineOfText error v-if="addressErrorMessage.length" :msg="addressErrorMessage" />
            </ConnectInstructions>
            <CreateInstructions v-if="createAccountSelected" />
        </div>
        <br />
        <!-- email -->
        <LineOfText msg="Email" instruction />
        <input type="email" class="input-field-text" @input="validateEmail" v-model.trim="email" required
            placeholder="We need your email for verification" tabindex="16" />
        <LineOfText :msg="emailErrorMessage" error v-if="emailErrorMessage.length" />
        <br />
        <!-- username -->
        <LineOfText msg="Username" instruction />
        <input class="input-field-text" id="username-input" @input="validateUsername" v-model.trim="username"
            placeholder="Allowed characters are A-Z, a-z and 0-9" tabindex="18" :style="usernameInputStyle" required />
        <LineOfText :msg="usernameErrorMessage" error v-if="usernameErrorMessage.length" />
        <br />
        <!-- password with show/hide button -->
        <LineOfText msg="Password" instruction />
        <div style="width: 100%">
            <input class="input-field-text password-input" :type="passwordInputType" v-model.trim="password"
                placeholder="Enter a password of at least 12 characters" tabindex="20" :style="passwordInputStyle"
                required />
            <button @click="togglePasswordInputType" class="small-button" id="show-toggle-button" style="float: left;">{{
                passwordInputType === 'password' ? 'Show' : 'Hide' }}</button>
        </div>
        <LineOfText :msg="passwordErrorMessage" error v-if="passwordErrorMessage.length" />
        <br />
        <br />
        <!-- password confirmation field -->
        <div style="width: 100%">
            <div>
                <input class="input-field-text password-input" :type="passwordInputType" @input="validateReenteredPassword"
                    v-model.trim="reenteredPassword" placeholder="Confirm Password" tabindex="22"
                    :style="passwordInputStyle" required />
            </div>
            <LineOfText :msg="reenteredPasswordErrorMessage" error v-if="reenteredPasswordErrorMessage.length" />
        </div>
    </CreateAccountView>
    <CreateUserButton :active="submitActive" :address="walletAddress" :password="password" :email='email'
        :termsOfService="termsOfService" :unitedStates="unitedStates" :username="username" tabindex="26" />
    <BailButton v-if="createAccountActive" tabindex="30" />
</template>
<script>
import axios from "axios";
import { debounce } from 'debounce';
import { findEmailError, findNonAlphanumericChars } from "../utilities";
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

import BailButton from "./components/subcomponents/BailButton.vue";
import ConnectInstructions from "./components/ConnectInstructions.vue";
import CreateAccountView from "./components/CreateAccountView.vue";
import CreateInstructions from "./components/CreateInstructions.vue";
import InfoTip from "./components/subcomponents/InfoTip.vue";
import LineOfText from "./components/subcomponents/LineOfText.vue";
import PageBanner from "./components/subcomponents/PageBanner.vue";
import CreateUserButton from "./components/subcomponents/CreateUserButton.vue";
import WalletButton from "./components/subcomponents/WalletButton.vue";
import WelcomeView from "./components/WelcomeView.vue";

const errorStyle = {
    border: "3px solid red",
    color: 'red',
};
const maxPasswordLength = 16; // number of characters


export default {
    name: 'EarnPage',
    components: {
        BailButton,
        ConnectInstructions,
        CreateAccountView,
        CreateInstructions,
        InfoTip,
        LineOfText,
        PageBanner,
        CreateUserButton,
        WalletButton,
        WelcomeView
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
            termsOfService: false,
            unitedStates: false,
            username: '',
            usernameErrorMessage: '',
            walletAddress: ''
        };
    },
    async mounted() {
        const firstCheckBox = document.getElementById('first-box');

        firstCheckBox.focus();
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

input[type="checkbox"]:focus {
    outline: 2px solid #3b8de8;
}

#bail-container {
    display: block;
}

#copy-button {
    background-color: #D0D4D9;
    border: none;
    color: #963cf5;
    float: right;
    position: relative;
}

#seed-container {
    background-color: #D0D4D9;
    display: block;
    height: 4rem;
    margin-bottom: 1rem;
    width: 100%;
}

#seed-text-container {
    height: 4rem;
    position: relative;
}

#seed-button-container {
    background-color: #D0D4D9;
    height: 2rem;
    position: inherit;
}

.password-input {
    float: left;
}

#show-toggle-button {
    border: none;
    color: #963cf5;
    margin-top: 0.35rem;
}

#address-input {
    height: 2rem;
}

.input-field-text {
    background: #060708;
    border: 1px solid #d0d4d9;
    color: #d0d4d9;
    display: block;
    min-width: 275px;
    height: 1.5rem;
    pointer-events: initial;
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
  