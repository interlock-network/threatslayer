<template>
    <div class="login-page-submit-button-container">
        <button class='submit-button' @click="submitLogin" :class="computedClass" :disabled="disabled"
            style="margin-bottom: 1rem;" tabindex="6">
            {{ $i18n(loginButtonText) }}
        </button>
        <br />
        <br />
        <ErrorMessage v-for="error in errorArr" :msg="error" single />
    </div>
</template>

<script>
import ErrorMessage from "../ErrorMessage.vue";
import TextComponent from "../TextComponent.vue";

import axios from "axios";
import { baseUrl, extractFromError, formatErrorMessages, submitButtonLabels, setChromeStorage } from '../../../utilities.js';

export default {
    name: "LoginButton",
    props: {
        checkState: { type: Function, required: true },
        loginDisabled: { type: Boolean, required: true },
        password: { type: String, default: '' },
        selectPage: { type: Function, required: true },
        username: { type: String, default: '' }
    },
    components: {
        ErrorMessage,
        TextComponent
    },
    data() {
        return {
            errorArr: [],
            loggedIn: false,
            loggingIn: false,
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
        disabled() {
            return this.loginDisabled || this.loggedIn || this.loggingIn;
        },
        loginButtonText() {
            const { errorArr, loggedIn: submitted, loggingIn: submitting, status } = this;

            return submitButtonLabels({ errorArr, initialMsg: 'login', submitted, submitting, status });
        }
    },
    methods: {
        extractLoginValues(response) {
            const { status, data: { allowlist = [], email, key, username, wallet } = {} } = response;
            const result = { allowlist, email, key, status, username, wallet };

            return result;
        },
        async submitLogin() {
            this.loggingIn = true;
            this.errorArr = [];
            const { email = '', password, username } = this;
            const requestBody = { email, password, username };

            axios.post(`${baseUrl}/user-login`, requestBody)
                .then(async response => {
                    const { allowlist, email, key, status, wallet } = this.extractLoginValues(response);

                    this.status = status;
                    this.loggedIn = true;
                    this.loggingIn = false;

                    // set API key with user's unique key and other values
                    const allowlistSet = await setChromeStorage({ allowlist });
                    const azeroWalletSet = await setChromeStorage({ azeroAddress: wallet });
                    const emailSet = await setChromeStorage({ email });
                    const keySet = await setChromeStorage({ apiKey: key });
                    const setUsername = await setChromeStorage({ username });

                    if (allowlistSet && azeroWalletSet && emailSet && keySet && setUsername) {
                        const registeredSynched = await setChromeStorage({ registered: true });
                        const loggedInSynched = await setChromeStorage({ loggedIn: true });

                        if (registeredSynched && loggedInSynched) {
                            this.loggedIn = true;
                            this.loggingIn = false;

                            this.checkState();
                        }
                    }
                })
                .catch(error => {
                    const { errors, status } = extractFromError(error);

                    console.log(`Login error. Status: ${status}. Error: ${errors}`);

                    this.errorArr = formatErrorMessages(errors);
                    this.loggedIn = false;
                    this.loggingIn = false;
                    this.status = status;
                });
        }
    }
};
</script>

<style></style>
