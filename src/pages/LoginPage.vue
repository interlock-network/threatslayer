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
        :placeholder="$i18n('enter_your_username')" tabindex="2" :class="usernameInputClass" />
    <ErrorMessage :msg="$i18n(usernameErrorMessage)" single v-if="usernameErrorMessage.length" />
    <SinglePasswordInput @currentPassword="getPassword" @passwordHasError="getPasswordHasError" />
    <LoginButton :disabled="loginDisabled" v-bind="{ checkState, password, selectPage, usernameOrEmail }" tabindex="6" />
    <!-- Forgot username / password flow -->
    <br />
    <br />
    <div id="forgot-password-container">
        <TextComponent :msg="$i18n('forgot_password')" class="input-header" bold
            style="margin-top: 3rem; margin-bottom: 1rem;" />
        <input type="email" class="input-field-text" id="forgot-info-email" @input="validateEmail" v-model.trim="email"
            required :placeholder="$i18n('enter_email_to_change_password')" tabindex="8" />
        <ErrorMessage :msg="$i18n(emailErrorMessage)" single v-if="emailErrorMessage.length" />
        <ForgotPasswordButton :disabled="forgotPasswordDisabled" :email="email" style="margin-top: 0.75rem;"
            tabindex="10" />
    </div>
</template>
<script>
import { debounce } from 'debounce';
import { findEmailError, validateUsername } from "../utilities";

import ErrorMessage from "./components/ErrorMessage.vue";
import ForgotPasswordButton from "./components/buttons/ForgotPasswordButton.vue";
import LoginButton from "./components/buttons/LoginButton.vue";
import PageBanner from "./components/PageBanner.vue";
import RegisterLine from './components/RegisterLine.vue';
import SinglePasswordInput from "./components/inputs/SinglePasswordInput.vue";
import TextComponent from "./components/TextComponent.vue";
import WarningTextBox from "./components/WarningTextBox.vue";

export default {
    name: 'LoginPage',
    props: {
        checkState: { type: Function, required: true },
        selectPage: { type: Function, required: true },
        urlToStake: { type: String, default: '' }
    },
    components: {
        ErrorMessage,
        ForgotPasswordButton,
        LoginButton,
        PageBanner,
        RegisterLine,
        SinglePasswordInput,
        TextComponent,
        WarningTextBox
    },
    data() {
        return {
            email: '',
            emailErrorMessage: '',
            forgotUsernamePassword: false,
            password: '',
            passwordHasError: false,
            usernameOrEmail: '',
            usernameErrorMessage: ''
        };
    },
    mounted() {
        const usernameInput = document.getElementById('login-username-or-email')

        usernameInput.focus();
    },
    computed: {
        forgotPasswordDisabled() {
            return !!this.emailErrorMessage.length;
        },
        loginDisabled() {
            return !!this.usernameErrorMessage.length || this.passwordHasError;
        },
        usernameInputClass() {
            return this.usernameErrorMessage?.length ? 'generic-error' : '';
        }
    },
    methods: {
        getPassword(password) {
            this.password = password;
        },
        getPasswordHasError(errorBool) {
            this.passwordHasError = errorBool;
        },
        validateEmail() {
            this.emailErrorMessage = findEmailError(this.email);
        },
        validateUsername: debounce(function (event) {
            const username = event?.target?.value;

            this.usernameErrorMessage = validateUsername(username);
        }, 250)
    }
}
</script>

<style>
input:focus {
    border: 3px solid #3b8de8;
    outline: none;
}

#forgot-password-container {
    bottom: 30vh;
    position: absolute;
}

.password-input {
    float: left;
}

.login-page-submit-button-container {
    color: #FFFFFF;
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
