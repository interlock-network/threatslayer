<template>
    <div class="login-page-submit-button-container">
        <button class='submit-button' @click="submitLogin" :class="computedClass" :disabled="disabled"
            style="margin-bottom: 1rem; margin-top: 1rem;">
            {{ loginButtonText }}
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
        selectPage: Function,
        password: String,
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
                result = 'Success!';
            } else if (this.loggingIn) {
                result = 'Waiting...';
            } else if (this.errorArr.length) {
                result = "Try again later";
            } else {
                result = 'Login';
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
            console.log('response', response);
            const { data: { address = '', email = '', key = '' } = {}, errors = [], response: { status = 200, statusText = '' } = {} } = response;

            if (status >= 400) {
                console.log(`Forgot password error. Code: ${status}, status text: ${statusText}`);

                this.loggedIn = false;
                this.loggingIn = false;
                this.errorArr.push(`Error: ${statusText}`);

                return;
            }
            // TODO test this
            if (!errors.length) {
                this.loggedIn = true;
                this.loggingIn = false;

                // set API key with user's unique key
                // TODO uncomment this once it's implemented
                // setChromeStorage({ address }, 'Chrome state for wallet address set after successful login.', 'Error setting Chrome state wallet address after successful login:');
                setChromeStorage({ email }, 'Chrome state for user email set after successful login.', 'Error setting Chrome state user email after successful login:');
                setChromeStorage({ key }, 'Chrome state for unique API key set after successful login.', 'Error setting Chrome state user API key after successful login:');

                const loggedInSynched = setChromeStorage({ loggedIn: true }, 'Chrome state set to logged in.', 'Error setting Chrome state to logged in.');
                // TODO improve this try/catch block
                if (loggedInSynched) {
                    setChromeStorage({ registered: true }, 'Chrome state set to registered.', 'Chrome state not succesfully set to registered.');
                } else {
                    // TODO update error message to be an object
                    this.errorArr.push('Error logging in. Please try again later.')
                }

                if (loggedInSynched) {
                    this.loggedIn = true;
                    this.loggingIn = false;

                    // navigate to user page after logging in
                    this.selectPage('slayCount');
                } else {
                    // TODO add error handling?
                }
            } else {
                console.log('Login error:', errors)

                this.errorArr = errors;
                this.loggedIn = false;
                this.loggingIn = false;
            }
        }
    }
};
</script>

<style></style>
