<template>
    <div class="login-page-submit-button-container">
        <button class='submit-button' @click="submitLogin" :class="computedClass" :disabled="disabled"
            style="margin-bottom: 1rem; margin-top: 1rem;">
            {{ $i18n(loginButtonText) }}
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
import { baseUrl, extractFromError, formatErrorMessages, genericSubmitButtonLabels, isEmail, setChromeStorage } from '../../../utilities.js';

export default {
    name: "LoginButton",
    props: {
        checkState: Function,
        disabled: Boolean,
        password: String,
        selectPage: Function,
        usernameOrEmail: String,
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
            const { disabled, loggedIn, loggingIn, password, usernameOrEmail } = this;

            return disabled || !password || !usernameOrEmail || loggedIn || loggingIn;
        },
        loginButtonText() {
            const { errorArr, loggedIn: submitted, loggingIn: submitting, status } = this;

            return genericSubmitButtonLabels({ errorArr, initial: 'login', submitted, submitting, status });
        }
    },
    methods: {
        async submitLogin() {
            this.loggingIn = true;
            this.errorArr = [];
            const { password, usernameOrEmail } = this;
            const requestBody = { password };

            if (!usernameOrEmail?.length) {
                return;
            }

            if (isEmail(usernameOrEmail)) {
                requestBody.email = usernameOrEmail;
                requestBody.username = '';
            } else {
                requestBody.email = '';
                requestBody.username = usernameOrEmail;
            }

            axios.post(`${baseUrl}/user-login`, requestBody)
                .then(async response => {
                    const { status, data: { azeroAddress = '', email = '', key = '', pdotAddress = '', username = '' } } = response;

                    this.status = status;
                    this.loggedIn = true;
                    this.loggingIn = false;

                    // set API key with user's unique key and other values
                    const azeroWalletSet = await setChromeStorage({ azeroAddress });
                    const emailSet = await setChromeStorage({ email });
                    const keySet = await setChromeStorage({ apiKey: key });
                    const pdotWalletSet = await setChromeStorage({ pdotAddress });
                    const setUsername = await setChromeStorage({ username });

                    if (azeroWalletSet && emailSet && keySet && pdotWalletSet && setUsername) {
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

                    this.loggedIn = false;
                    this.loggingIn = false;
                    this.status = status;
                    this.errorArr = formatErrorMessages(errors);
                });
        }
    }
};
</script>

<style></style>
