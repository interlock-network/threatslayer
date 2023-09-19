<template>
    <div>
        <button @click="submitCreateUser" class="submit-button" :class="computedClass" :disabled="disabled">
            {{ $i18n(submitButtonText) }}
        </button>
        <TextComponent v-for="errorMessage in errorArr" :msg="$i18n(errorMessage)" error />
    </div>
</template>

<script>
import TextComponent from "../TextComponent.vue";

import axios from "axios";
import { baseUrl, setChromeStorage } from '../../../utilities.js';

export default {
    name: "CreateUserButton",
    props: {
        azeroWalletId: String,
        checkState: Function,
        email: String,
        password: String,
        pdotWalletId: String,
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
                result = 'success';
            } else if (this.loggingIn) {
                result = 'waiting';
            } else if (this.errorArr.length) {
                result = "try_again_later";
            } else {
                result = 'submit';
            }

            return result;
        },
        disabled() {
            const { email, password, submitting, submitted, termsOfService: terms_of_service, unitedStates: united_states, username } = this;

            return (!email?.length || !password?.length || submitting || submitted || !terms_of_service || !united_states || !username?.length);
        }
    },
    methods: {
        async submitCreateUser() {
            this.errorArr = [];

            const { azeroWalletId: azero_wallet_id = '', email, password, pdotWalletId: pdot_wallet_id = '',
                referrer, termsOfService: terms_of_service, unitedStates: united_states, username } = this;
            const key = 'threatslayer-api-key';
            this.submitting = true;

            // needed bc this endpoint returns a 201 (create) rather than 200
            const instance = axios.create({
                validateStatus: (status) => status === 200 || status === 201
            });

            instance.post(`${baseUrl}/user-create`,
                { azero_wallet_id, email, key, password, pdot_wallet_id, referrer, terms_of_service, united_states, username })
                .then(async response => {
                    this.submitted = true;
                    this.submitting = false;

                    // set user's values in Chrome extension state unique key
                    const loggedInSynched = await setChromeStorage({ loggedIn: true });
                    const registeredSynched = await setChromeStorage({ registered: true });
                    const setAzeroAddress = await setChromeStorage({ azeroAddress: azero_wallet_id });
                    const setPdotAddress = await setChromeStorage({ pdotAddress: pdot_wallet_id });
                    const setApiKey = await setChromeStorage({ apiKey: response.data.key });
                    const setEmail = await setChromeStorage({ email });
                    const setUsername = await setChromeStorage({ username });

                    if (loggedInSynched & registeredSynched && setAzeroAddress && setApiKey && setEmail && setPdotAddress && setUsername) {
                        this.selectPage('faq');
                        this.checkState();
                    } else {
                        this.errorArr.push('error_registering_generic');
                    }
                })
                .catch(error => {
                    this.submitted = false;
                    this.submitting = false;

                    const { errors = [], response: { status, statusText = '' } = {} } = error;

                    console.log(`Create user error. Code: ${status}, status text: ${statusText}`);

                    if (errors.length) {
                        this.errorArr = [...errors];
                    } else {
                        this.errorArr.push(`Error: ${statusText}`);
                    }

                    console.log(`Error creating user, status: ${status}, error ${errors}`);

                    this.errorArr = [...errors, ...this.errorArr];
                });
        }
    }
};
</script>

<style></style>
