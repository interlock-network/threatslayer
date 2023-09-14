<template>
    <div class="login-page-submit-button-container">
        <button class='submit-button' @click="submitLogin" :class="computedClass" :disabled="disabled"
            style="margin-bottom: 1rem; margin-top: 1rem;">
            {{ $i18n(loginButtonText) }}
        </button>
        <br />
        <br />
        <TextComponent v-for="errorMessage in errorArr" :msg="$i18n(errorMessage)" style="margin-bottom: -1rem;" error />
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
            const { password, usernameOrEmail } = this;
            const requestBody = { password };
            this.errorArr = [];
            this.loggingIn = true;

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

            const response = await axios.post(`${baseUrl}/user-login`, requestBody)
                .then(res => res)
                .catch(err => err);

            const { data: { address = '', email = '', key = '', username = '' } = {}, errors = [], response: { status = 200, statusText = '' } = {} } = response;

            if (status >= 400) {
                console.log(`Login error. Code: ${status}, status text: ${statusText}`);

                this.loggedIn = false;
                this.loggingIn = false;
                this.errorArr.push(`Error: ${statusText}`);

                return;
            }

            if (!errors.length) {
                this.loggedIn = true;
                this.loggingIn = false;

                // set API key with user's unique key and other values
                // TODO uncomment this once it's implemented
                // setChromeStorage({ address }, 'Chrome state for wallet address set after successful login.', 'Error setting Chrome state wallet address after successful login:');
                const emailSet = await setChromeStorage({ email });
                const keySet = await setChromeStorage({ apiKey: key });
                const setUsername = await setChromeStorage({ username });

                if (emailSet && keySet && setUsername) {
                    this.checkState()
                    const loggedInSynched = setChromeStorage({ loggedIn: true });

                    if (loggedInSynched) {
                        this.loggedIn = true;
                        this.loggingIn = false;

                        await setChromeStorage({ registered: true });
                        // navigate to user page after logging in
                        this.selectPage('slayCount');
                        this.checkState()
                    } else {
                        this.errorArr.push('error_login_generic')
                    }
                } else {
                    console.log('Login error:', errors)

                    this.errorArr = errors;
                    this.loggedIn = false;
                    this.loggingIn = false;
                }
            }
        }
    }
};
</script>

<style></style>
