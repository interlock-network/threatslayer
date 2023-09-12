<template>
    <div>
        <button @click="submitUpdateAddress" class="secondary-hollow-button" :class="computedClass" :disabled="disabled"
            style="margin-right: 10%; margin-top: 2rem;">
            {{ $i18n(submitButtonText) }}
        </button>
        <br />
        <TextComponent v-for="errorMessage in errorArr" :msg="$i18n(errorMessage)" error />
    </div>
</template>

<script>
import TextComponent from "../TextComponent.vue";

import axios from "axios";
import { baseUrl, setChromeStorage } from '../../../utilities.js';

export default {
    name: "UpdateAddressButton",
    props: {
        apiKey: String,
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
            console.log('here in submitUpdateAddress');
            this.errorArr = [];

            const { apiKey: key, newAddress, password, username } = this;
            this.submitting = true;

            const response = await axios.post(`${baseUrl}/user-bcaddr-reset`, { key, password, username, wallet_id: newAddress })
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

                // set wallet address in state with user's new address
                const setAddress = await setChromeStorage({ address: newAddress });

                if (setAddress) {
                    this.checkState();
                } else {
                    this.errorArr.push('error_updating_wallet_address_generic');
                }
            } else {
                console.log('Error submitting wallet address:', errors);

                this.errorArr = [...errors, ...this.errorArr];
            }
        }
    }
};
</script>

<style>
#update-address-button {
    background-color: #0F0818;
    border: none;
    color: #9000CB;
    font-size: 1rem;
    height: 2rem;
    padding: 0.5rem 0.75rem;
    width: 400px;
}
</style>