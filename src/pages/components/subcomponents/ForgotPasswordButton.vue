<template>
    <div class="login-page-submit-button-container">
        <button class='login-page-submit-button' @click="submitForgotPassword()" :class="computedClass">
            {{ forgotPasswordButtonText }}
        </button>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "ForgotPasswordButton",
    props: {
        email: String,
    },
    data() {
        return {
            error: false,
            loggedIn: false,
            loggingIn: false
        }
    },
    computed: {
        computedClass() {
            let className = '';

            if (this.error) {
                className = 'login-page-submit-button-error';
            } else {
                className = 'login-active';
            }

            return className;
        },
        forgotPasswordButtonText() {
            let result = '';

            if (this.loggedIn) {
                result = 'Success!';
            } else if (this.loggingIn) {
                result = 'Waiting...';
            } else if (this.error) {
                result = "Try again later";
            } else {
                result = 'Change password';
            }

            return result;
        }
    },
    methods: {
        async submitForgotPassword() {
            this.error = false;
            this.loggingIn = true;

            // TODO update with endpoint URL
            const response = await axios.post('/api/forgot_password', { email: this.email })
                .then(res => {
                    return res;
                }).catch(err => {
                    return err;
                });

            if (response?.status === 200) {
                this.loggedIn = true;
                this.loggingIn = false;
            } else {
                console.log('Forgot password error:', response.code)

                this.error = true;
                this.loggedIn = false;
                this.loggingIn = false;
            }
        }
    }
};
</script>

<style></style>
