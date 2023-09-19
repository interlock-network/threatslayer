<template>
    <div class="login-page-submit-button-container">
        <button class='submit-button' @click="submitLogin" :class="computedClass" :disabled="disabled"
            style="margin-bottom: 1rem; margin-top: 1rem;">
            {{ $i18n(loginButtonText) }}
        </button>
        <br />
        <br />
        <TextComponent v-for="errorMessage in errorArr" :msg="errorMessage" style="margin-bottom: -1rem;" error />
    </div>
</template>

<script>
import TextComponent from "../TextComponent.vue";

import axios from "axios";
import { baseUrl, isEmail, setChromeStorage } from '../../../utilities.js';

export default {
    name: "LoginButton",
    props: {
        checkState: Function,
        password: String,
        selectPage: Function,
        usernameOrEmail: String,
    },
    components: {
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
                        this.checkState();
                        const loggedInSynched = await setChromeStorage({ loggedIn: true });

                        if (loggedInSynched) {
                            this.loggedIn = true;
                            this.loggingIn = false;

                            await setChromeStorage({ registered: true });
                            // navigate to user page after logging in
                            this.selectPage('slayCount');
                            this.checkState();
                        } else {
                            this.errorArr.push('error_login_generic')
                        }
                    }
                })
                .catch(error => {
                    const { error_message: errors = [], status } = error.response.data;
                    console.log(`Login error. Status: ${status}, ${errors}`);

                    this.loggedIn = false;
                    this.loggingIn = false;
                    this.errorArr = [...errors];
                });
        }
    }
};
</script>

<style></style>
