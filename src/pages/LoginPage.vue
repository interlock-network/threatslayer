<template>
    <PageBanner :msg="$i18n('login')">
        <img class="banner-icon" src="/src/assets/images/login.png">
    </PageBanner>
    <WarningTextBox v-if="urlToStake" :msg="$i18n('warning_must_login_before_staking')" />
    <RegisterLine :checkState="checkState" :selectPage="selectPage" />
    <br />
    <br />
    <UsernameInput @currentUsername="getUsername" @usernameHasError="getUsernameHasError" />
    <SinglePasswordInput @currentPassword="getPassword" @passwordHasError="getPasswordHasError" />
    <LoginButton v-bind="{ checkState, loginDisabled, password, selectPage, username }" tabindex="6" />
    <br />
    <br />
    <!-- Forgot username / password flow -->
    <div id="forgot-password-container">
        <TextComponent :msg="$i18n('forgot_password')" class="input-header" bold
            style="margin-top: 3rem; margin-bottom: 1rem;" />
        <EmailInput placeholder="enter_email_to_change_password" @currentEmail="getEmail"
            @emailHasError="getEmailHasError" />
        <ForgotPasswordButton :forgotPasswordDisabled="forgotPasswordDisabled" :email="email" style="margin-top: 0.75rem;"
            tabindex="10" />
    </div>
</template>
<script>
import EmailInput from "./components/inputs/EmailInput.vue";
import ErrorMessage from "./components/ErrorMessage.vue";
import ForgotPasswordButton from "./components/buttons/ForgotPasswordButton.vue";
import LoginButton from "./components/buttons/LoginButton.vue";
import PageBanner from "./components/PageBanner.vue";
import RegisterLine from './components/RegisterLine.vue';
import SinglePasswordInput from "./components/inputs/SinglePasswordInput.vue";
import TextComponent from "./components/TextComponent.vue";
import UsernameInput from "./components/inputs/UsernameInput.vue";
import WarningTextBox from "./components/WarningTextBox.vue";

export default {
    name: 'LoginPage',
    props: {
        checkState: { type: Function, required: true },
        selectPage: { type: Function, required: true },
        urlToStake: { type: String, default: '' }
    },
    components: {
        EmailInput,
        ErrorMessage,
        ForgotPasswordButton,
        LoginButton,
        PageBanner,
        RegisterLine,
        SinglePasswordInput,
        TextComponent,
        UsernameInput,
        WarningTextBox
    },
    data() {
        return {
            email: '',
            emailHasError: '',
            password: '',
            passwordHasError: false,
            username: '',
            usernameHasError: ''
        };
    },
    mounted() {
        // TODO fix this
        // const usernameInput = document.getElementById('login-username-or-email')

        // usernameInput.focus();
    },
    computed: {
        forgotPasswordDisabled() {
            return !this.email || this.emailHasError;
        },
        loginDisabled() {
            const { password, passwordHasError, username, usernameHasError } = this;

            return !password || passwordHasError || !username.length || usernameHasError;
        },
        usernameInputClass() {
            return this.usernameErrorMessage?.length ? 'generic-error' : '';
        }
    },
    methods: {
        getEmail(email) {
            this.email = email;
        },
        getEmailHasError(errorBool) {
            this.emailHasError = errorBool;
        },
        getPassword(password) {
            this.password = password;
        },
        getPasswordHasError(errorBool) {
            this.passwordHasError = errorBool;
        },
        getUsername(username) {
            this.username = username;
        },
        getUsernameHasError(errorBool) {
            this.usernameHasError = errorBool;
        }
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
