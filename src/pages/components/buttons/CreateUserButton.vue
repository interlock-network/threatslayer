<template>
    <div>
        <button @click="submitCreateUser" class="submit-button" :class="computedClass" :disabled="disabled">
            {{ submitButtonText }}
        </button>
        <TextComponent v-for="errorMessage in errorArr" :msg="errorMessage" error />
    </div>
</template>

<script>
import TextComponent from "../TextComponent.vue";

import axios from "axios";
import { baseUrl, setChromeStorage } from '../../../utilities.js';

export default {
    name: "CreateUserButton",
    props: {
        address: String,
        checkState: Function,
        email: String,
        password: String,
        referrer: String,
        selectPage: Function,
        termsOfService: Boolean,
        unitedStates: Boolean,
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
        submitButtonText() {
            let result = '';

            if (this.loggedIn) {
                result = 'Success!';
            } else if (this.loggingIn) {
                result = 'Waiting...';
            } else if (this.errorArr.length) {
                result = "Try again later";
            } else {
                result = 'Submit';
            }

            return result;
        },
        disabled() {
            const { address, email, password, submitting, submitted, termsOfService: terms_of_service, unitedStates: united_states, username } = this;

            return (!address?.length || !email?.length || !password?.length || submitting || submitted || !terms_of_service || !united_states || !username?.length);
        }
    },
    methods: {
        async submitCreateUser() {
            this.errorArr = [];

            const { address, email, password, referrer, termsOfService: terms_of_service, unitedStates: united_states, username } = this;
            const key = 'threatslayer-api-key';
            this.submitting = true;

            const response = await axios.post(`${baseUrl}/user-create`, { address, email, key, password, referrer, terms_of_service, united_states, username })
                .then(res => res)
                .catch(err => err);

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
                const loggedInSynched = await setChromeStorage({ loggedIn: true });
                const registeredSynched = await setChromeStorage({ registered: true });
                const setAddress = await setChromeStorage({ address });
                const setApiKey = await setChromeStorage({ apiKey: response.data.key });
                const setEmail = await setChromeStorage({ email });
                const setUsername = await setChromeStorage({ username });

                if (loggedInSynched & registeredSynched && setAddress && setApiKey && setEmail && setUsername) {
                    this.selectPage('faq');
                    this.checkState();
                } else {
                    this.errorArr.push('Error registering. Please try again later.');
                }
            } else {
                console.log('Error submitting registration:', errors);

                this.errorArr = [...errors, ...this.errorArr];
            }
        }
    }
};
</script>

<style></style>
