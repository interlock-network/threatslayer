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
        forgotPasswordDisabled: { type: Boolean, required: true },
    },
    components: {
        ErrorMessage,
        TextComponent
    },
    data() {
        return {
            errorArr: [],
            submitted: false,
            submitting: false,
            status: 200
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
            const { errorArr, submitted, submitting, status } = this;

            return submitButtonLabels({ errorArr, initialMsg: 'change_password', submitted, submitting, status });
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
                })
                .catch((error) => {
                    const { errors, status } = extractFromError(error);

                    console.log(`Forgot password error. Status: ${status}. Error: ${errors}`);

                    this.errorArr = formatErrorMessages(errors);
                    this.status = status;
                    this.submitted = false;
                    this.submitting = false;
                });
        }
    }
};
</script>

<style></style>
