<template>
    <div id="forgot-password-container">
        <TextComponent :msg="$i18n('forgot_password')" id="forgot-password-header" bold />
        <br />
        <br />
        <EmailInput placeholder="enter_email_to_change_password" @currentEmail="getEmail" tabindex="8"
            @emailHasError="getEmailHasError" />
        <ForgotPasswordButton v-bind="{ email, fadeLoginPage, forgotPasswordDisabled, resetButtonText }" />
    </div>
</template>

<script>
import EmailInput from "./inputs/EmailInput.vue";
import ForgotPasswordButton from "./buttons/ForgotPasswordButton.vue";
import TextComponent from "./TextComponent.vue";

export default {
    name: 'ForgotPassword',
    props: {
        checkState: { type: Function, required: true },
        fadeLoginPage: { type: Function, required: true },
        resetButtonText: { type: Boolean, required: true },
        selectPage: { type: Function, required: true }
    },
    components: {
        EmailInput,
        ForgotPasswordButton,
        TextComponent
    },
    data() {
        return {
            email: '',
            emailHasError: ''
        }
    },
    computed: {
        forgotPasswordDisabled() {
            return !this.email || this.emailHasError;
        }
    },
    methods: {
        getEmail(email) {
            this.email = email;
        },
        getEmailHasError(errorBool) {
            this.emailHasError = errorBool;
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
    margin-top: 4rem;
}

#forgot-password-header {
    margin-top: 3rem;
    margin-bottom: 1rem;
    display: block;
}

.disabled {
    border: 1px solid #d0d4d9;
    opacity: 0.3;
    pointer-events: none;
}
</style>
