<template>
    <PageBanner msg="Login to ThreatSlayer" />
    <br />
    <!-- username field -->
    <LineOfText msg="Username or Email" bold />
    <input class="input-field-text" id="login-username-or-email" v-model.trim="usernameOrEmail"
        placeholder="Username or email" tabindex="2" :style="usernameInputStyle" />
    <LineOfText :msg="usernameErrorMessage" error v-if="usernameErrorMessage.length" />
    <br />
    <!-- password field with show/hide button -->
    <LineOfText msg="Password" bold />
    <input id="login-password" class="input-field-text password-input" :type="passwordInputType" v-model.trim="password"
        placeholder="Password" tabindex="4" :style="passwordInputStyle" />
    <button @click="togglePasswordInputType" class="small-button" id="show-toggle-button" tabindex="5">
        {{ passwordInputType === 'password' ? 'Show' : 'Hide' }}
    </button>
    <LineOfText :msg="passwordErrorMessage" error v-if="passwordErrorMessage.length" />
    <br />
    <LoginButton :password="password" :usernameOrEmail="usernameOrEmail" :changePage="changePage" tabindex="6" />
    <!-- Forgot username / password flow -->
    <br />
    <br />
    <br />
    <LineOfText msg="Forgot password?" bold style="margin-top: 5rem;" />
    <input type="email" class="input-field-text" id="forgot-info-email" @input="validateEmail" v-model.trim="email" required
        placeholder="Enter your email to change your password" tabindex="8" />
    <LineOfText :msg="emailErrorMessage" error v-if="emailErrorMessage.length" />
    <ForgotPasswordButton :email="email" tabindex="10" />
</template>
<script>
import { debounce } from 'debounce';
import { findEmailError, findNonAlphanumericChars } from "../utilities";

import ForgotLoginButton from "./components/subcomponents/ForgotLoginButton.vue";
import ForgotPasswordButton from "./components/subcomponents/ForgotPasswordButton.vue";
import LineOfText from "./components/subcomponents/LineOfText.vue";
import ForgotView from "./components/ForgotView.vue";
import GetLoginInfoButton from "./components/subcomponents/GetLoginInfoButton.vue";
import LoginButton from "./components/subcomponents/LoginButton.vue";
import PageBanner from "./components/subcomponents/PageBanner.vue";

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
        ForgotLoginButton,
        ForgotPasswordButton,
        ForgotView,
        GetLoginInfoButton,
        LineOfText,
        LoginButton,
        PageBanner,
    },
    data() {
        return {
            emailErrorMessage: '',
            forgotUsernamePassword: false,
            password: '',
            passwordErrorMessage: '',
            passwordInputType: 'password',
            usernameOrEmail: '',
            usernameErrorMessage: '',
        };
    },
    mounted() {

        const usernameInput = document.getElementById('login-username-or-email')

        usernameInput.focus();
    },
    computed: {
        passwordInputStyle() {
            return this.passwordErrorMessage.length ? errorStyle : {};
        },
        usernameInputStyle() {
            return this.usernameErrorMessage?.length ? errorStyle : {};
        },
    },
    methods: {
        clearUsernameErrors() {
            this.usernameErrorMessage = '';
        },
        validateEmail() {
            this.emailErrorMessage = findEmailError(this.email);
        },
        toggleForgot() {
            this.forgotUsernamePassword = !this.forgotUsernamePassword;


            if (this.forgotUsernamePassword) {
                setTimeout(() => {
                    const emailInput = document.getElementById('forgot-info-email');

                    emailInput.focus();
                }, 100);
            } else {
                setTimeout(() => {
                    const usernameInput = document.getElementById('login-username-or-email');

                    usernameInput.focus();
                }, 100);

            }
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
input:focus {
    border: 3px solid #3b8de8;
    outline: none;
}

.password-input {
    float: left;
}

/* #show-toggle-button {
    border: none;
    color: #963cf5;
    margin-top: 0.35rem;
} */

.login-page-submit-button-container {
    color: #d0d4d9;
    width: 400px;
}

/* .login-page-submit-button {
    background: #060708;
    cursor: pointer;
    float: left;
    font-size: 1.5rem;
    pointer-events: initial;
    width: 50%;
    padding: 0.5rem 0.75rem;
} */

.disabled {
    border: 1px solid #d0d4d9;
    opacity: 0.3;
    pointer-events: none;
}

.login-active {
    border: 3px solid #3b8de8;
    color: #963cf5;
    opacity: 1;
    outline: none;
    pointer-events: initial;
}

.submit-button-error {
    color: red;
}

.small-button {
    background-color: #060708;
    border: 1px solid #d0d4d9;
    color: #d0d4d9;
    pointer-events: initial;
}
</style>
  