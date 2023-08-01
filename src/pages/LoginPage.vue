<template>
    <PageBanner msg="Login to ThreatSlayer">
        <img class="banner-icon" src="/src/assets/images/login.png">
    </PageBanner>
    <TextComponent msg="Don't have an account?" subinstruction /><button class="login-button"
        @click="unregister">Register</button>
    <br />
    <br />
    <!-- username field -->
    <TextComponent msg="Username or Email" class="input-header" bold />
    <input class="input-field-text" id="login-username-or-email" v-model.trim="usernameOrEmail"
        placeholder="Username or email" tabindex="2" :style="usernameInputStyle" />
    <TextComponent :msg="usernameErrorMessage" error v-if="usernameErrorMessage.length" />
    <br />
    <!-- password field with show/hide button -->
    <TextComponent msg="Password" class="input-header" bold />
    <input id="login-password" class="input-field-text password-input" :type="passwordInputType" v-model.trim="password"
        placeholder="Password" tabindex="4" :style="passwordInputStyle" />
    <button @click="togglePasswordInputType" class="small-button" id="show-toggle-button" tabindex="5">
        {{ passwordInputType === 'password' ? 'Show' : 'Hide' }}
    </button>
    <TextComponent :msg="passwordErrorMessage" error v-if="passwordErrorMessage.length" />
    <br />
    <LoginButton v-bind="{ password, usernameOrEmail, selectPage }" tabindex="6" />
    <!-- Forgot username / password flow -->
    <br />
    <br />
    <TextComponent msg="Forgot password?" class="input-header" bold style="margin-top: 3rem;" />
    <input type="email" class="input-field-text" id="forgot-info-email" @input="validateEmail" v-model.trim="email" required
        placeholder="Enter your email to change your password" tabindex="8" />
    <TextComponent :msg="emailErrorMessage" error v-if="emailErrorMessage.length" />
    <ForgotPasswordButton :email="email" tabindex="10" />
</template>
<script>
import { debounce } from 'debounce';
import { findEmailError, findNonAlphanumericChars, setChromeStorage } from "../utilities";

import ForgotPasswordButton from "./components/buttons/ForgotPasswordButton.vue";
import LoginButton from "./components/buttons/LoginButton.vue";
import PageBanner from "./components/PageBanner.vue";
import TextComponent from "./components/TextComponent.vue";

const errorStyle = {
    border: "3px solid red",
    color: 'red',
};
const maxPasswordLength = 16; // number of characters

export default {
    name: 'EarnPage',
    props: {
        checkState: Function,
        selectPage: Function
    },
    components: {
        ForgotPasswordButton,
        LoginButton,
        PageBanner,
        TextComponent
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
        togglePasswordInputType() {
            this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
        },
        async unregister() {
            const unregistered = await setChromeStorage({ 'registered': false });

            if (unregistered) {
                // this forces a check to make the "Start Earning" tab appear in the sidebar
                await this.checkState();
            };

            this.selectPage('earn');
        },
        validateEmail() {
            this.emailErrorMessage = findEmailError(this.email);
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

.login-page-submit-button-container {
    color: #d0d4d9;
    margin-top: 2rem;
    width: 400px;
}

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
</style>
