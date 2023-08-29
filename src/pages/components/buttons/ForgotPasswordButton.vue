<template>
    <div class="login-page-submit-button-container">
        <button class='secondary-hollow-button' @click="submitForgotPassword" :class="computedClass" :disabled="disabled"
            tabindex="99">
            {{ forgotPasswordButtonText }}
        </button>
        <br />
        <br />
        <TextComponent v-for="errorMessage in errorArr" :msg="errorMessage" error />
    </div>
</template>

<script>
import TextComponent from "../TextComponent.vue";

import axios from "axios";
import { baseUrl, isEmail } from '../../../utilities.js';

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
            loggedIn: false,
            loggingIn: false
        }
    },
    computed: {
        computedClass() {
            let className = '';

            if (this.errorArr.length) {
                className = 'submit-button-error';
            } else {
                className = 'login-active';
            }

            return className;
        },
        disabled() {
            const { email, loggedIn, loggingIn, password } = this;

            return !email?.length || !isEmail(email);
        },
        forgotPasswordButtonText() {
            const { errorArr, loggedIn, loggingIn } = this;
            let result = '';

            if (loggedIn) {
                result = 'Success!';
            } else if (loggingIn) {
                result = 'Waiting...';
            } else if (errorArr.length) {
                result = "Try again later";
            } else {
                result = 'Change Password';
            }

            return result;
        }
    },
    methods: {
        async submitForgotPassword() {
            this.errorArr = [];
            this.loggingIn = true;

            // TODO update with endpoint URL
            const response = await axios.post(`${baseUrl}/user-password-reset`, { email: this.email })
                .then(res => res)
                .catch(err => err);

            const { errors = [], response: { status = 200, statusText = '' } = {} } = response;
            console.log('response', response);
            console.log('status', status);

            if (status >= 400) {
                console.log(`Forgot password error. Code: ${status}, status text: ${statusText}`)

                this.loggedIn = false;
                this.loggingIn = false;
                this.errorArr.push(`Error: ${statusText}`);
            } else if (status === 200) {
                console.log('Password forget request submitted.');

                this.loggedIn = true;
                this.loggingIn = false;
            } else {
                console.log(`Forgot password error: ${errors}`);

                this.loggedIn = false;
                this.loggingIn = false;
                this.errorArr.push(errors);
            }
        }
    }
};
</script>

<style></style>
