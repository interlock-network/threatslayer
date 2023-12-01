<template>
    <div id="modal-overlay" @keydown.esc="doneAction">
        <div id="modal-container" style="bottom: 40%">
            <!-- <div id="modal-container" :style="active ? 'bottom: 40%' : 'display: none'"> -->
            <!-- TODO translate this -->
            <TextComponent msg="We emailed you a one-time password. Please enter it below." /> <br />
            <br />
            <div id="modal-password-input">
                <SinglePasswordInput inputId='new-password' @currentPassword="getPassword"
                    @passwordHasError="getPasswordHasError" tabindex="12" />
            </div>
            <div tabindex="14">
                <LoginButton v-bind="{ checkState, loginDisabled, password, selectPage, username }"
                    style="margin-top: 6.5rem;" />
            </div>
            <br />
            <button @click="doneAction" class="secondary-hollow-button" tabindex="16">
                {{ $i18n('cancel') }}
            </button>
        </div>
    </div>
</template>

<script>
import LoginButton from "./buttons/LoginButton.vue";
import SinglePasswordInput from "./inputs/SinglePasswordInput.vue";
import TextComponent from './TextComponent.vue';

export default {
    name: "WalletInfoModal",
    props: {
        checkState: { type: Function, required: true },
        fadeLoginPage: { type: Function, required: true },
        selectPage: { type: Function, required: true },
        username: { type: String, default: '' }
    },
    components: {
        LoginButton,
        SinglePasswordInput,
        TextComponent
    },
    data() {
        return {
            password: '',
            passwordHasError: false
        }
    },
    mounted() {
        const passwordInput = document.getElementById('new-password');
        console.log('passwordInput', passwordInput);

        passwordInput.focus();
    },
    computed: {
        loginDisabled() {
            const { password, passwordHasError } = this;

            return !password || passwordHasError;
        },
    },
    methods: {
        doneAction() {
            this.password = '';

            this.fadeLoginPage(false);
        },
        getPassword(password) {
            this.password = password;
        },
        getPasswordHasError(errorBool) {
            this.passwordHasError = errorBool;
        }
    }
};
</script>

<style>
#modal-container {
    background-color: #0F0818;
    border-radius: 12px;
    color: #FFFFFF;
    padding: 50px;
    position: fixed;
    width: 400px;
    z-index: 2147483643 !important;
}

#modal-overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    background-color: #000000da;
}
</style>
