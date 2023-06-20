<template>
    <PageBanner msg="Login" />
    <LoginView :active="!forgotUsernamePassword">
        <br />
        <div v-if="!forgotUsernamePassword">
            <!-- username field -->
            <LineOfText msg="Username" instruction />
            <input class="input-field-text" id="login-username" @input="validateUsername" v-model.trim="username"
                tabindex="1" :style="usernameInputStyle" />
            <LineOfText :msg="usernameErrorMessage" error v-if="usernameErrorMessage.length" />
            <br />
            <!-- password field with show/hide button -->
            <LineOfText msg="Password" instruction />
            <div style="width: 100%">
                <input id="login-password" class="input-field-text password-input" :type="passwordInputType"
                    v-model.trim="password" tabindex="4" :style="passwordInputStyle" />
                <button @click="togglePasswordInputType" class="small-button" id="show-toggle-button" style="float: left;">
                    {{ passwordInputType === 'password' ? 'Show' : 'Hide' }}
                </button>
            </div>
            <LineOfText :msg="passwordErrorMessage" error v-if="passwordErrorMessage.length" />
        </div>
        <LoginButton :active="submitActive" :password="password" :username="username" tabindex="6" />
        <ForgotLoginButton msg="Forgot Username / Password" :action="toggleForgot" tabindex="8" />
    </LoginView>
    <!-- Forgot username / password flow -->
    <ForgotView :active="forgotUsernamePassword" v-if="forgotUsernamePassword">
        <br />
        <br />
        <input type="email" class="input-field-text" id="forgot-info-email" @input="validateEmail" v-model.trim="email"
            required placeholder="Enter your email" tabindex="10" />
        <LineOfText :msg="emailErrorMessage" error v-if="emailErrorMessage.length" />
        <!-- TODO update active -->
        <GetLoginInfoButton :active="true" :email="email" tabindex="12" />
        <ForgotLoginButton msg="Enter Username / Password" :action="toggleForgot" tabindex="14" />
    </ForgotView>
</template>
<script>
import { debounce } from 'debounce';
import { findEmailError, findNonAlphanumericChars } from "../utilities";

import ForgotLoginButton from "./components/subcomponents/ForgotLoginButton.vue";
import LineOfText from "./components/subcomponents/LineOfText.vue";
import LoginView from "./components/LoginView.vue";
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
    components: {
        ForgotLoginButton,
        ForgotView,
        GetLoginInfoButton,
        LineOfText,
        LoginButton,
        LoginView,
        PageBanner,
    },
    data() {
        return {
            emailErrorMessage: '',
            forgotUsernamePassword: false,
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
            const submitActive = !!(this.password.length
                && this.username.length
                && !this.passwordErrorMessage.length
                && !this.usernameErrorMessage.length);

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
                    const usernameInput = document.getElementById('login-username');

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
    min-width: 275px;
    height: 1.5rem;
    pointer-events: initial;
}

.small-button {
    background-color: #060708;
    border: 1px solid #d0d4d9;
    color: #d0d4d9;
    pointer-events: initial;
}
</style>
  