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
        hasError: { type: Boolean, required: true },
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
            const { hasError, newWallet, submitting, submitted } = this;

            return (hasError || (!newWallet.length) || submitting || submitted);
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
            this.errorArr = [];
            this.submitting = true;

            const { apiKey: key, newWallet, password, username } = this;

            axios.post(`${baseUrl}/user-bcaddr-reset`, { key, password, username, wallet: newWallet })
                .then(async response => {
                    const { status } = response.data;
                    let setAzeroAddress = false;

                    this.status = status;
                    this.submitted = true;
                    this.submitting = false;

                    // set wallet address in state with user's new address
                    if (newWallet?.length) {
                        setAzeroAddress = await setChromeStorage({ azeroAddress: newWallet });
                    }

                    if (setAzeroAddress) {
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
};
</script>

<style></style>