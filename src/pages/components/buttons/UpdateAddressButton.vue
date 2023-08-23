<template>
    <div>
        <button @click="submitUpdateAddress" class="secondary-hollow-button" :class="computedClass" :disabled="disabled"
            style="margin-right: 10%;">
            {{ submitButtonText }}
        </button>
        <br />
        <TextComponent v-for="errorMessage in errorArr" :msg="errorMessage" error />
    </div>
</template>

<script>
import TextComponent from "../TextComponent.vue";

import axios from "axios";
import { baseUrl, setChromeStorage } from '../../../utilities.js';

export default {
    name: "UpdateAddressButton",
    props: {
        checkState: Function,
        clickedOnce: Boolean,
        newAddress: String,
        password: String,
        toggleClickedOnce: Function,
        username: String,
    },
    components: {
        TextComponent
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
            const { newAddress, submitting, submitted } = this;

            return (!newAddress.length || submitting || submitted);
        },
        submitButtonText() {
            let result = '';

            if (this.loggedIn) {
                result = 'Success!';
            } else if (this.loggingIn) {
                result = 'Waiting...';
            } else if (this.errorArr.length) {
                result = 'Try again later';
            } else if (this.clickedOnce) {
                result = 'Submit New Address';
            } else {
                result = 'Update Address';
            }

            return result;
        }
    },
    methods: {
        async submitUpdateAddress() {
            if (!this.clickedOnce) {
                this.toggleClickedOnce();
            } else {
                this.errorArr = [];

                const { newAddress, password, username } = this;
                this.submitting = true;

                const response = await axios.post(`${baseUrl}/address-update`, { address: newAddress, password, username })
                    .then(res => res)
                    .catch(err => err);

                console.log('response', response);
                const { errors = [], response: { status = 200, statusText = '' } = {} } = response;

                if (status >= 400) {
                    console.log(`Create user error. Code: ${status}, status text: ${statusText}`);

                    this.submitted = false;
                    this.submitting = false;

                    if (errors.length) {
                        this.errorArr = [...errors];
                    } else {
                        this.errorArr.push(`Error: ${statusText}`);
                    }
                } else if (!errors?.length) {
                    this.submitted = true;
                    this.submitting = false;

                    // set API key with user's unique key
                    const setAddress = await setChromeStorage({ address: newAddress });

                    if (setAddress) {
                        this.checkState();
                    } else {
                        this.errorArr.push('Error updating wallet address. Please try again later.');
                    }
                } else {
                    console.log('Error submitting wallet address:', errors);

                    this.errorArr = [...errors, ...this.errorArr];
                }
            }
        }
    }
};
</script>

<style></style>
