<template>
    <PageBanner :msg="$i18n('login')">
        <img class="banner-icon" src="/src/assets/images/login.png">
    </PageBanner>
    <WarningTextBox v-if="urlToStake" :msg="$i18n('warning_must_login_before_staking')" />
    <RegisterLine :checkState="checkState" :selectPage="selectPage" tabindex="12" />
    <br />
    <br />
    <UsernameInput @currentUsername="getUsername" @usernameHasError="getUsernameHasError" tabindex="2" focus />
    <SinglePasswordInput @currentPassword="getPassword" @passwordHasError="getPasswordHasError" tabindex="4" />
    <div tabindex="6">
        <LoginButton v-bind="{ checkState, loginDisabled, password, selectPage, username }" style="margin-top: 0.75rem;" />
    </div>
    <br />
    <ForgotPassword v-bind="{ checkState, fadeLoginPage, resetButtonText, selectPage }" />
    <NewPasswordModal v-if="active" v-bind="{ checkState, fadeLoginPage, selectPage, username }" />
</template>

<script>
import ForgotPassword from "./components/ForgotPassword.vue";
import LoginButton from "./components/buttons/LoginButton.vue";
import NewPasswordModal from "./components/NewPasswordModal.vue";
import PageBanner from "./components/PageBanner.vue";
import RegisterLine from './components/RegisterLine.vue';
import SinglePasswordInput from "./components/inputs/SinglePasswordInput.vue";
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
        ForgotPassword,
        LoginButton,
        NewPasswordModal,
        PageBanner,
        RegisterLine,
        SinglePasswordInput,
        UsernameInput,
        WarningTextBox
    },
    data() {
        return {
            active: false,
            password: '',
            passwordHasError: false,
            resetButtonText: false,
            username: '',
            usernameHasError: ''
        };
    },
    computed: {
        loginDisabled() {
            const { password, passwordHasError, username, usernameHasError } = this;

            return !password || passwordHasError || !username.length || usernameHasError;
        },
        usernameInputClass() {
            return this.usernameErrorMessage?.length ? 'generic-error' : '';
        }
    },
    methods: {
        fadeLoginPage(bool) {
            this.active = bool;

            if (bool === true) {
                this.resetButtonText = true;
            }
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

.login-page-submit-button-container {
    color: #FFFFFF;
    width: 400px;
}
</style>
