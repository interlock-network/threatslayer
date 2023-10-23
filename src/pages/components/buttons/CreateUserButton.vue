<template>
    <div>
        <button @click="submitCreateUser" class="submit-button" :class="computedClass" :disabled="disabled">
            {{ $i18n(submitButtonText) }}
        </button>
        <ErrorMessage v-for="errorMessage in errorArr" :msg="errorMessage" style="padding-top: 3rem;" single />
    </div>
</template>

<script>
import ErrorMessage from "../ErrorMessage.vue";
import TextComponent from "../TextComponent.vue";

import axios from "axios";
import { baseUrl, extractFromError, formatErrorMessages, getChromeStorage, submitButtonLabels, setChromeStorage } from '../../../utilities.js';

export default {
    name: "CreateUserButton",
    props: {
        address: { type: String, default: '' },
        checkState: { type: Function, required: true },
        createUserDisabled: { type: Boolean, default: false },
        email: { type: String, default: '' },
        password: { type: String, default: '' },
        referrer: { type: String, default: '' },
        selectPage: { type: Function, required: true },
        termsOfService: { type: Boolean, default: false },
        unitedStates: { type: Boolean, default: false },
        username: { type: String, default: '' }
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
                className = 'submit-button-active';
            }

            return className;
        },
        submitButtonText() {
            const { errorArr, loggedIn: submitted, loggingIn: submitting, status } = this;

            return submitButtonLabels({ errorArr, initialMsg: 'register', submitted, submitting, status });
        },
        disabled() {
            const { createUserDisabled, submitting, submitted } = this;

            return createUserDisabled || submitting || submitted;
        }
    },
    methods: {
        async submitCreateUser() {
            this.errorArr = [];

            const allowlist = await getChromeStorage('allowlist') || [];
            const { address, email, password, referrer, termsOfService: terms_of_service, unitedStates: confirmed_not_united_states, username } = this;
            const key = 'threatslayer-api-key';
            this.submitting = true;

            // needed bc this endpoint returns a 201 (create) rather than 200
            const instance = axios.create({
                validateStatus: (status) => status === 200 || status === 201
            });

            instance.post(`${baseUrl}/user-create`,
                { address, allowlist, email, key, password, referrer, terms_of_service, confirmed_not_united_states, username })
                .then(async response => {
                    const { status, data: { key } } = response;

                    this.status = status;
                    this.submitted = true;
                    this.submitting = false;

                    // set user's values in Chrome extension state unique key
                    const loggedInSynched = await setChromeStorage({ loggedIn: true });
                    const registeredSynched = await setChromeStorage({ registered: true });
                    const setApiKey = await setChromeStorage({ apiKey: key });
                    const setAzeroAddress = await setChromeStorage({ azeroAddress: address });
                    const setEmail = await setChromeStorage({ email });
                    const setUsername = await setChromeStorage({ username });

                    if (loggedInSynched & registeredSynched && setApiKey && setAzeroAddress && setEmail && setUsername) {
                        this.checkState();
                    }
                })
                .catch(error => {
                    const { errors, status } = extractFromError(error);

                    console.log(`Create user error. Status: ${status}. Error: ${errors}`);

                    this.submitted = false;
                    this.submitting = false;
                    this.status = status;
                    this.errorArr = formatErrorMessages(errors);
                })
        }
    }
};
</script>

<style></style>
