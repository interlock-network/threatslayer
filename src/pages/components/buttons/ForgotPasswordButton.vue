<template>
    <div class="login-page-submit-button-container">
        <button class='secondary-hollow-button' @click="submitForgotPassword" :class="computedClass" :disabled="disabled"
            tabindex="99">
            {{ $i18n(forgotPasswordButtonText) }}
        </button>
        <br />
        <br />
        <TextComponent v-for="errorMessage in errorArr" :msg="errorMessage" error />
    </div>
</template>

<script>
import TextComponent from "../TextComponent.vue";

import axios from "axios";
import { baseUrl, formatErrorMessages, isEmail } from '../../../utilities.js';

export default {
    name: "ForgotPasswordButton",
    props: {
        email: String,
    },
    components: {
        TextComponent
    },
    data() {
        return {
            errorArr: [],
            isError: false,
            loggedIn: false,
            loggingIn: false
        }
    },
    computed: {
        computedClass() {
            let className = '';

            if (this.isError) {
                className = 'submit-button-error';
            } else {
                className = 'login-active';
            }

            return className;
        },
        disabled() {
            const { email } = this;

            return !email?.length || !isEmail(email);
        },
        forgotPasswordButtonText() {
            const { errorArr, loggedIn, loggingIn } = this;
            let result = '';

            if (loggedIn) {
                result = 'success';
            } else if (loggingIn) {
                result = 'waiting';
            } else if (errorArr.length) {
                result = "try_again_later";
            } else {
                result = 'change_password';
            }

            return result;
        }
    },
    methods: {
        async submitForgotPassword() {
            this.errorArr = [];
            this.loggingIn = true;

            axios.post(`${baseUrl}/user-password-forgot`, { email: this.email })
                .then(_response => {
                    console.log('Password forget request submitted.');

                    this.loggedIn = true;
                    this.loggingIn = false;
                })
                .catch(error => {
                    this.isError = true;
                    const { data: { error_message: errors = [] }, status } = error.response;

                    console.log(`Forgot password error. Status: ${status}. Error: ${errors}`);

                    this.loggedIn = false;
                    this.loggingIn = false;

                    if (errors.length) {
                        this.errorArr = formatErrorMessages(errors);
                    }
                });
        }
    }
};
</script>

<style></style>
