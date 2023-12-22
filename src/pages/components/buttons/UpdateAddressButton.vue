<template>
    <div>
        <button @click="submitUpdateAddress" class="secondary-hollow-button" :class="computedClass" :disabled="disabled"
            style="margin-right: 10%;">
            {{ $i18n(submitButtonText) }}
        </button>
        <br />
        <ErrorMessage v-for="error in errorArr" :msg="$i18n(error)" stacked />
    </div>
</template>

<script>
import ErrorMessage from "../ErrorMessage.vue";

import axios from "axios";
import { baseUrl, extractFromError, formatErrorMessages, submitButtonLabels, setChromeStorage } from '../../../utilities.js';

export default {
    name: "UpdateAddressButton",
    props: {
        apiKey: { type: String, required: true },
        checkState: { type: Function, required: true },
        hasErrors: { type: Boolean, default: false },
        newWallet: { type: String, default: '' },
        password: { type: String, default: '' },
        username: { type: String, default: '' }
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
            let className = '';

            if (this.errorArr.length) {
                className = 'submit-button-error';
            } else {
                className = 'submit-button-active';
            }

            return className;
        },
        disabled() {
            return this.submitting || this.submitted;
        },
        submitButtonText() {
            const { errorArr, submitted, submitting, status } = this;

            return submitButtonLabels(
                { errorArr, initialMsg: 'update_wallet_address', submitted, submitting, status }
            );
        }
    },
    methods: {
        async submitUpdateAddress() {
            const { apiKey: key, hasErrors, newWallet, password } = this;

            this.errorArr = [];

            this.$emit('missingSubmitFields', false);

            const fieldMissing = !newWallet?.length || !password?.length;

            if (hasErrors) {
                this.errorArr.push('warning_has_errors');
            } else if (fieldMissing) {
                this.errorArr.push('warning_required_fields_missing');
                this.$emit('missingSubmitFields', true);
            } else {
                this.submitting = true;

                axios.post(`${baseUrl}/user-bcaddr-reset`, { key, password, username, wallet: newWallet })
                    .then(async response => {
                        const { status } = response.data;
                        let setAddress = false;

                        this.status = status;
                        this.submitted = true;
                        this.submitting = false;

                        // set wallet address in state with user's new address
                        if (newWallet?.length) {
                            setAddress = await setChromeStorage({ walletAddress: newWallet });
                        }

                        if (setAddress) {
                            this.checkState();
                        } else {
                            this.errorArr.push('error_updating_wallet_address_generic');
                        }
                    })
                    .catch(error => {
                        const { errors, status } = extractFromError(error);

                        console.log(`Create user error. Status: ${status}. Error: ${errors}`);

                        this.errorArr = formatErrorMessages(errors);
                        this.status = status;
                        this.submitted = false;
                        this.submitting = false;
                    });
            }
        }
    }
};
</script>

<style></style>