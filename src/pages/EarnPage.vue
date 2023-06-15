<template>
    <h1 id="page-banner">Start Earning</h1>
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
                <input id="second-box" type="checkbox" v-model="unitedStates" tabindex="2">
                <label for="second-box" style="display: inline-flex;">Affirm you are not a US citizen or resident
                    <InfoTip style="padding-right: 2.75rem;" v-if="welcomeActive"
                        msg="Cryptocurrency is considered a security in the US so most US residents cannot purchase them." />
                </label>
            </div>
            <div class="bail-container">
                <BailLink msg="I can't check these" v-if="welcomeActive" tabindex="4" style="margin-right: 0.5rem;" />
                <br />
            </div>
        </div>
    </WelcomeView>
    <ConnectWalletView :active="connectWalletActive || submitActive">
        <br />
        <div style="width: 100%; display: flex;">
            <WalletButton msg="Connect Account" :active="connectAccountSelected" id="connectAccount"
                :action="connectAccount" tabindex="5" />
            <WalletButton msg="Create New Account" :active="createAccountSelected" id="createAccount"
                :action="createAccount" tabindex="6" />
        </div>
        <div>
            <br />
            <ConnectInstructions v-if="connectAccountSelected && connectWalletActive"
                :active="connectAccountSelected && connectWalletActive">
                <textarea class="input-field-text" id="seed-input" @input="validateMenomic" v-model.trim="existingMnemonic"
                    style="width: 100%" placeholder="12 or 22 word seed phrase here" tabindex="7"
                    :style="mnemonicInputStyle" />
                <LineOfText error v-for="message in mnemonicErrorMessage" :key="message" :msg="message" />
            </ConnectInstructions>
            <CreateInstructions v-if="createAccountSelected" :active="createAccountSelected && connectWalletActive">
                <div id="seed-container">
                    <div id="seed-text-container">
                        <LineOfText :msg="generatedMnemonic" seed />
                    </div>
                    <div id="seed-button-container">
                        <button @click="copy" class="small-button" id="copy-button" v-if="createAccountSelected">
                            Copy
                        </button>
                    </div>
                </div>
            </CreateInstructions>
        </div>
        <br />
        <LineOfText msg="Usernames can have characters A-Z, a-z and 0-9:" instruction />
        <input class="input-field-text" id="username-input" @input="validateUsername" v-model.trim="username"
            placeholder="Username up to 16 characters" tabindex="9" :style="usernameInputStyle" />
        <LineOfText :msg="usernameErrorMessage" error v-if="usernameErrorMessage.length" />
        <br />
        <!-- password field with show/hide button -->
        <LineOfText msg="Enter a password of at least 12 characters:" instruction />
        <div style="width: 100%">
            <input class="input-field-text password-input" :type="passwordInputType" v-model.trim="password"
                placeholder="Password" tabindex="10" :style="passwordInputStyle" />
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
                    v-model.trim="reenteredPassword" placeholder="Confirm Password" tabindex="11"
                    :style="passwordInputStyle" />
                <BailLink msg="Maybe later" v-if="connectWalletActive || submitActive" tabindex="12" />
            </div>
            <LineOfText :msg="reenteredPasswordErrorMessage" error v-if="reenteredPasswordErrorMessage.length" />
        </div>
    </ConnectWalletView>
    <SubmitButton :active="submitActive" :password="password" :termsOfService="termsOfService" :unitedStates="unitedStates"
        :username="username" :mnemonic="selectedMnemonic" tabindex="13" />
</template>
<script>
import axios from "axios";
import { debounce } from 'debounce';
import { findNonAlphanumericChars } from "../utilities";
import { mnemonicGenerate, mnemonicValidate } from '@polkadot/util-crypto';

import BailLink from "./components/subcomponents/BailLink.vue";
import ConnectInstructions from "./components/ConnectInstructions.vue";
import ConnectWalletView from "./components/ConnectWalletView.vue";
import CreateInstructions from "./components/CreateInstructions.vue";
import InfoTip from "./components/subcomponents/InfoTip.vue";
import LineOfText from "./components/subcomponents/LineOfText.vue";
import SubmitButton from "./components/subcomponents/SubmitButton.vue";
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
        BailLink,
        ConnectInstructions,
        ConnectWalletView,
        CreateInstructions,
        InfoTip,
        LineOfText,
        SubmitButton,
        WalletButton,
        WelcomeView
    },
    data() {
        return {
            connectAccountSelected: true,
            createAccountSelected: false,
            existingMnemonic: '',
            generatedMnemonic: '',
            mnemonicErrorMessage: [],
            password: '',
            passwordErrorMessage: '',
            passwordInputType: 'password',
            reenteredPassword: '',
            reenteredPasswordErrorMessage: '',
            termsOfService: false,
            unitedStates: false,
            username: '',
            usernameErrorMessage: '',
        };
    },
    mounted() {
        const firstCheckBox = document.getElementById('first-box')

        firstCheckBox.focus();
    },
    computed: {
        existingMnemonicLength() {
            return this.existingMnemonic.split(" ").filter(word => word.length).length;
        },
        connectWalletActive() {
            const previousStepActive = this.welcomeActive;
            const usernameAndWalletIdValidated = this.validateWalletInputs();

            return !previousStepActive && !usernameAndWalletIdValidated;
        },
        mnemonicInputStyle() {
            return this.mnemonicErrorMessage.length ? errorStyle : {};
        },
        mnemonicIsValid() {
            return mnemonicValidate(this.existingMnemonic);
        },
        passwordInputStyle() {
            return this.passwordErrorMessage.length ? errorStyle : {};
        },
        selectedMnemonic() {
            return this.createAccountSelected ? this.generatedMnemonic : this.existingMnemonic;
        },
        submitActive() {
            const previousStepsComplete = !this.welcomeActive && this.validateWalletInputs();

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
        connectAccount() {
            this.connectAccountSelected = true;
            this.createAccountSelected = false;
        },
        async copy() {
            document.getElementById('createAccount').focus();
            await navigator.clipboard.writeText(this.generatedMnemonic);

            alert('Mnemonic seed phrase phrase copied to clipboard');
        },
        createAccount() {
            this.connectAccountSelected = false;
            this.createAccountSelected = true;

            if (!this.generatedMnemonic.length) {
                this.generatedMnemonic = mnemonicGenerate();
            }
        },
        focusNextCheckbox() {
            const firstCheckBox = document.getElementById('first-box');

            if (firstCheckBox.checked) {
                const secondCheckBox = document.getElementById('second-box');

                secondCheckBox.focus();
            }
        },
        togglePasswordInputType() {
            this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
        },
        validateMenomic: debounce(function (event) {
            const mnemonic = event?.target?.value;
            this.mnemonicErrorMessage = [];

            if (!mnemonic || !mnemonic.length) {
                this.mnemonicErrorMessage = [];

                return true;
            }

            // happy case
            if (this.mnemonicIsValid) {
                this.mnemonicErrorMessage = [];

                return true;
            } else {
                // error cases
                const hasForbiddenChars = /[^A-Za-z ]/.test(mnemonic);

                if (hasForbiddenChars) {
                    this.mnemonicErrorMessage.push('Seed can only have characters A-Z a-z');
                }
                if (this.existingMnemonicLength !== 12 && this.existingMnemonicLength !== 22) {
                    this.mnemonicErrorMessage.push(`Seed should have 12 or 22 words, yours has ${this.existingMnemonicLength}`)
                }
                if (!hasForbiddenChars && this.existingMnemonicLength === 12) {
                    // only shown when the more specific errors above have been eliminated
                    this.mnemonicErrorMessage = ['Invalid seed phrase. Please try again.'];
                }
            }
        }, 250),
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
        validateWalletInputs() {
            const walletIsValid = this.createAccountSelected || this.mnemonicIsValid;
            const passwordIsValid = this.password.length && this.password === this.reenteredPassword && !this.passwordErrorMessage.length && !this.reenteredPasswordErrorMessage.length;

            return !!(walletIsValid && this.username.length > 2 && this.usernameErrorMessage === '' && passwordIsValid);
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
                axios.post('/api/name', { name })
                    .then(() => {
                        console.log('Username ${name} is available');
                    })
                    .catch(e => {
                        const { errorMessage } = e?.response?.data;

                        this.usernameErrorMessage = errorMessage || '';
                    });
            }
        }, 250)
    }
}
</script>
  
<style>
input[type="checkbox"] {
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

#seed-input {
    height: 5rem;
}

.input-field-text {
    background: #060708;
    border: 1px solid #d0d4d9;
    color: #d0d4d9;
    display: block;
    font-size: 1rem;
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
    font-size: 1rem;
    pointer-events: initial;
}
</style>
  