<template>
    <div>
        <button @click="submitUpdateAddress" class="secondary-hollow-button" :class="computedClass" :disabled="disabled"
            style="margin-right: 10%;">
            {{ $i18n(submitButtonText) }}
        </button>
        <br />
        <ErrorMessage v-for="errorMessage in errorArr" :msg="errorMessage" stacked />
    </div>
</template>

<script>
import ErrorMessage from "../ErrorMessage.vue";

import axios from "axios";
import { baseUrl, extractFromError, formatErrorMessages, setChromeStorage } from '../../../utilities.js';

export default {
    name: "UpdateAddressButton",
    props: {
        apiKey: String,
        checkState: Function,
        clickedOnce: Boolean,
        hasError: Boolean,
        newAzeroAddress: {
            type: String,
            default: ''
        },
        newPdotAddress: {
            type: String,
            default: ''
        },
        password: String,
        username: String,
    },
    components: {
        ErrorMessage
    },
    data() {
        return {
            errorArr: [],
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
            const { hasError, newAzeroAddress, newPdotAddress, submitting, submitted } = this;

            return (hasError || (!newAzeroAddress.length && !newPdotAddress.length) || submitting || submitted);
        },
        submitButtonText() {
            let result = '';

            if (this.errorArr.length) {
                result = 'try_again_later';
            } else if (this.clickedOnce) {
                result = 'submit_new_wallet_address';
            } else {
                result = 'update_wallet_address';
            }

            return result;
        }
    },
    methods: {
        async submitUpdateAddress() {
            this.errorArr = [];
            this.submitting = true;

            const { apiKey: key, newAzeroAddress, newPdotAddress, password, username } = this;

            axios.post(`${baseUrl}/user-bcaddr-reset`,
                { azero_wallet_id: newAzeroAddress, key, password, pdot_wallet_id: newPdotAddress, username })
                .then(async _response => {
                    this.submitted = true;
                    this.submitting = false;

                    let setAzeroAddress = false;
                    let setPdotAddress = false;

                    // set wallet address in state with user's new address
                    if (newAzeroAddress?.length) {
                        setAzeroAddress = await setChromeStorage({ azeroAddress: newAzeroAddress });
                    }
                    if (newPdotAddress?.length) {
                        setPdotAddress = await setChromeStorage({ pdotAddress: newPdotAddress });
                    }

                    if (setAzeroAddress || setPdotAddress) {
                        this.checkState();
                    } else {
                        this.errorArr.push('error_updating_wallet_address_generic');
                    }
                })
                .catch(error => {
                    const { errors, status } = extractFromError(error);

                    console.log(`Create user error. Status: ${status}. Error: ${errors}`);

                    this.submitted = false;
                    this.submitting = false;

                    if (errors.length) {
                        this.errorArr = formatErrorMessages(errors);
                    }
                });
        }
    }
};
</script>

<style></style>