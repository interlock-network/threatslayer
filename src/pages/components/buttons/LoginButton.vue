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
import { baseUrl, extractFromError, formatErrorMessages, isEmail, setChromeStorage } from '../../../utilities.js';

export default {
    name: "LoginButton",
    props: {
        checkState: Function,
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
            loggingIn: false
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
            const { loggedIn, loggingIn, password, usernameOrEmail } = this;

            return !password || !usernameOrEmail || loggedIn || loggingIn;
        },
        loginButtonText() {
            let result = '';

            if (this.loggedIn) {
                result = 'success';
            } else if (this.loggingIn) {
                result = 'waiting';
            } else if (this.errorArr.length) {
                result = "try_again_later";
            } else {
                result = 'login';
            }

            return result;
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
                    const { azeroAddress = '', email = '', key = '', pdotAddress = '', username = '' } = response?.data;

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
                    this.errorArr = formatErrorMessages(errors);
                });
        }
    }
};
</script>

<style></style>
