<template>
    <div class="login-page-submit-button-container">
        <button class="secondary-hollow-button" @click="submitForgotPassword" :class="computedClass"
            :disabled="forgotPasswordDisabled" tabindex="10">
            {{ $i18n(forgotPasswordButtonText) }}
        </button>
        <br />
        <br />
        <ErrorMessage v-for="error in errorArr" :msg="$i18n(error)" single />
    </div>
</template>

<script>
import ErrorMessage from '../ErrorMessage.vue';

import axios from 'axios';
import { baseUrl, extractFromError, formatErrorMessages, submitButtonLabels } from '../../../utilities.js';

export default {
    name: "ForgotPasswordButton",
    props: {
        email: { type: String, default: '' },
        fadeLoginPage: { type: Function, required: true },
        forgotPasswordDisabled: { type: Boolean, required: true },
        resetButtonText: { type: Boolean, required: true }
    },
    components: {
        ErrorMessage
    },
    data() {
        return {
            errorArr: [],
            status: 200,
            submitted: false,
            submitting: false
        }
    },
    computed: {
        computedClass() {
            let result = '';

            if (this.errorArr.length) {
                result = 'submit-button-error';
            } else {
                result = 'login-active';
            }

            return result;
        },
        forgotPasswordButtonText() {
            const { errorArr, resetButtonText, submitted, submitting, status } = this;

            return submitButtonLabels({ errorArr, initialMsg: 'change_password', reset: resetButtonText, submitted, submitting, status });
        }
    },
    methods: {
        async submitForgotPassword() {
            this.errorArr = [];
            this.submitting = true;

            axios.post(`${baseUrl}/user-password-reset`, { email: this.email })
                .then((response) => {
                    const { status } = response.data;

                    this.status = status;
                    this.submitted = true;
                    this.submitting = false;

                    this.fadeLoginPage(true);
                })
                .catch((error) => {
                    const { errors, status } = extractFromError(error);

                    console.log(`Forgot password error. Status: ${status}. Error: ${errors}`);

                    this.errorArr = formatErrorMessages(errors);
                    this.status = status;
                    this.submitted = false;
                    this.submitting = false;
                })
                // TODO delete this 
                .finally(() => {
                    this.fadeLoginPage(true)
                })
        }
    }
}
</script>

<style></style>
