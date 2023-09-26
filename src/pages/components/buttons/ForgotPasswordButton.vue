<template>
    <div class="login-page-submit-button-container">
        <button class='secondary-hollow-button' @click="submitForgotPassword" :class="computedClass"
            :disabled="forgotPasswordDisabled" tabindex="99">
            {{ $i18n(forgotPasswordButtonText) }}
        </button>
        <br />
        <br />
        <ErrorMessage v-for="errorMessage in errorArr" :msg="errorMessage" single />
    </div>
</template>

<script>
import ErrorMessage from "../ErrorMessage.vue";
import TextComponent from "../TextComponent.vue";

import axios from "axios";
import { baseUrl, extractFromError, formatErrorMessages, genericSubmitButtonLabels } from '../../../utilities.js';

export default {
    name: "ForgotPasswordButton",
    props: {
        forgotPasswordDisabled: { type: Boolean, required: true },
        email: { type: String, default: '' }
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
            let className = '';

            if (this.errorArr.length) {
                className = 'submit-button-error';
            } else {
                className = 'login-active';
            }

            return className;
        },
        forgotPasswordButtonText() {
            const { errorArr, submitted, submitting, status } = this;

            // TODO test this
            return genericSubmitButtonLabels(
                { errorArr, initial: 'change_password', submitted, submitting, status }
            );
        }
    },
    methods: {
        async submitForgotPassword() {
            this.errorArr = [];
            this.submitting = true;

            axios.post(`${baseUrl}/user-password-forgot`, { email: this.email })
                .then(response => {
                    const { status } = response.data;

                    this.status = status;
                    this.submitted = true;
                    this.submitting = false;
                })
                .catch(error => {
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
