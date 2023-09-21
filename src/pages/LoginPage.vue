<template>
    <PageBanner :msg="$i18n('login')">
        <img class="banner-icon" src="/src/assets/images/login.png">
    </PageBanner>
    <WarningTextBox v-if="urlToStake" :msg="$i18n('warning_must_login_before_staking')" />
    <RegisterLine :checkState="checkState" :selectPage="selectPage" />
    <br />
    <br />
    <!-- username field -->
    <input class="input-field-text" @input="validateUsername" id="login-username-or-email" v-model.trim="usernameOrEmail"
        :placeholder="$i18n('enter_your_username')" tabindex="2" :style="usernameInputStyle" />
    <ErrorMessage :msg="$i18n(usernameErrorMessage)" single v-if="usernameErrorMessage.length" />
    <br />
    <!-- password field with show/hide button -->
    <input id="login-password" class="input-field-text password-input" :type="passwordInputType" v-model.trim="password"
        :placeholder="$i18n('password')" tabindex="4" :style="passwordInputStyle" />
    <button @click="togglePasswordInputType" class="small-button" id="show-password-toggle-button" tabindex="5">
        {{ passwordInputType === 'password' ? $i18n('password_show') : $i18n('password_hide') }}
    </button>
    <ErrorMessage :msg="$i18n(passwordErrorMessage)" single v-if="passwordErrorMessage.length" />
    <br />
    <LoginButton :disabled="loginDisabled" v-bind="{ checkState, password, selectPage, usernameOrEmail }" tabindex="6" />
    <!-- Forgot username / password flow -->
    <br />
    <br />
    <TextComponent :msg="$i18n('forgot_password')" class="input-header" bold
        style="margin-top: 3rem; margin-bottom: 1rem;" />
    <input type="email" class="input-field-text" id="forgot-info-email" @input="validateEmail" v-model.trim="email" required
        :placeholder="$i18n('enter_email_to_change_password')" tabindex="8" />
    <ErrorMessage :msg="$i18n(emailErrorMessage)" single v-if="emailErrorMessage.length" />
    <ForgotPasswordButton :disabled="forgotPasswordDisabled" :email="email" style="margin-top: 0.75rem;" tabindex="10" />
</template>
<script>
import { debounce } from 'debounce';
import { findEmailError, findNonAlphanumericChars, usernameErrorMessages } from "../utilities";

import ErrorMessage from "./components/ErrorMessage.vue";
import ForgotPasswordButton from "./components/buttons/ForgotPasswordButton.vue";
import LoginButton from "./components/buttons/LoginButton.vue";
import PageBanner from "./components/PageBanner.vue";
import RegisterLine from './components/RegisterLine.vue';
import TextComponent from "./components/TextComponent.vue";
import WarningTextBox from "./components/WarningTextBox.vue";

const errorStyle = {
    border: "3px solid red",
    color: 'red',
};
const maxPasswordLength = 16; // number of characters

export default {
    name: 'EarnPage',
    props: {
        checkState: Function,
        selectPage: Function,
        urlToStake: String
    },
    components: {
        ErrorMessage,
        ForgotPasswordButton,
        LoginButton,
        PageBanner,
        RegisterLine,
        TextComponent,
        WarningTextBox
    },
    data() {
        return {
            email: '',
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
        forgotPasswordDisabled() {
            const { emailErrorMessage } = this;

            return emailErrorMessage.length > 0;
        },
        loginDisabled() {
            return this.usernameErrorMessage.length > 0;
        },
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
        // TODO add validate password
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

            const allowedCharsRegex = /^[@.a-zA-Z0-9_]+$/;
            const containsIllegalChars = !allowedCharsRegex.test(name);

            if (name.length > maxPasswordLength) {
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
input:focus {
    border: 3px solid #3b8de8;
    outline: none;
}

.password-input {
    float: left;
}

.login-page-submit-button-container {
    color: #FFFFFF;
    margin-top: 2rem;
    width: 400px;
}

.disabled {
    border: 1px solid #d0d4d9;
    opacity: 0.3;
    pointer-events: none;
}

.login-active {
    border: none;
    color: #963cf5;
    pointer-events: initial;
}
</style>
