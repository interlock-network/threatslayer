<template>
    <h1 id="page-banner">Login</h1>
    <!-- username field -->
    <LineOfText msg="Username" instruction />
    <input class="input-field-text" id="login-username" @input="validateUsername" v-model.trim="username" tabindex="1"
        :style="usernameInputStyle" />
    <LineOfText :msg="usernameErrorMessage" error v-if="usernameErrorMessage.length" />
    <br />
    <!-- password field with show/hide button -->
    <LineOfText msg="Password" instruction />
    <div style="width: 100%">
        <input id="login-password" class="input-field-text password-input" :type="passwordInputType" v-model.trim="password"
            tabindex="2" :style="passwordInputStyle" />
        <button @click="togglePasswordInputType" class="small-button" id="show-toggle-button" style="float: left;">
            {{ passwordInputType === 'password' ? 'Show' : 'Hide' }}
        </button>
    </div>
    <LineOfText :msg="passwordErrorMessage" error v-if="passwordErrorMessage.length" />
    <SubmitButton :active="submitActive" :password="password" :username="username" tabindex="3" />
</template>
<script>
import InfoTip from "./components/subcomponents/InfoTip.vue";
import LineOfText from "./components/subcomponents/LineOfText.vue";
import SubmitButton from "./components/subcomponents/SubmitButton.vue";

import { debounce } from 'debounce';
import { findNonAlphanumericChars } from "../utilities";

const errorStyle = {
    border: "3px solid red",
    color: 'red',
};
const maxPasswordLength = 16; // number of characters


export default {
    name: 'EarnPage',
    components: {
        InfoTip,
        LineOfText,
        SubmitButton,
    },
    data() {
        return {
            password: '',
            passwordErrorMessage: '',
            passwordInputType: 'password',
            username: '',
            usernameErrorMessage: '',
        };
    },
    mounted() {
        const usernameInput = document.getElementById('login-username')

        usernameInput.focus();
    },
    computed: {
        passwordInputStyle() {
            return this.passwordErrorMessage.length ? errorStyle : {};
        },
        submitActive() {
            const submitActive = this.password.length
                && this.username.length
                && !this.passwordErrorMessage.length
                && !this.usernameErrorMessage.length;

            return submitActive;
        },
        usernameInputStyle() {
            return this.usernameErrorMessage?.length ? errorStyle : {};
        },
    },
    methods: {
        clearUsernameErrors() {
            this.usernameErrorMessage = '';
        },
        togglePasswordInputType() {
            this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
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
    margin-right: 0.5rem;
}

input:focus {
    border: 3px solid #3b8de8;
    outline: none;
}

input[type="checkbox"]:focus {
    outline: 2px solid #3b8de8;
}

.password-input {
    float: left;
}

#show-toggle-button {
    border: none;
    color: #963cf5;
    margin-top: 0.35rem;
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

.small-button {
    background-color: #060708;
    border: 1px solid #d0d4d9;
    color: #d0d4d9;
    font-size: 1rem;
    pointer-events: initial;
}
</style>
  