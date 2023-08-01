<template>
    <div class="login-page-submit-button-container">
        <button class='submit-button' @click="submitLogin()" :class="computedClass" :disabled="loggingIn || loggedIn">
            {{ loginButtonText }}
        </button>
        <!-- TODO add error message here -->
    </div>
</template>

<script>
import axios from "axios";
import { baseUrl, isEmail, setChromeStorage } from '../../../utilities.js';

export default {
    name: "LoginButton",
    props: {
        selectPage: Function,
        password: String,
        usernameOrEmail: String,
    },
    data() {
        return {
            error: false,
            errorArr: [],
            loggedIn: false,
            loggingIn: false
        }
    },
    computed: {
        computedClass() {
            let className = '';

            if (this.error) {
                className = 'submit-button-error';
            } else {
                className = 'login-active';
            }

            return className;
        },
        loginButtonText() {
            let result = '';

            if (this.loggedIn) {
                result = 'Success!';
            } else if (this.loggingIn) {
                result = 'Waiting...';
            } else if (this.error) {
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

            if (isEmail(usernameOrEmail)) {
                requestBody.email = usernameOrEmail;
                requestBody.username = '';
            } else {
                requestBody.email = '';
                requestBody.username = usernameOrEmail;
            }

            this.error = false;
            this.loggingIn = true;

            // TODO update with endpoint URL
            const response = await axios.post(`${baseUrl}/user-login`, requestBody)
                .then(res => res)
                .catch(err => err);

            const { data: { address = '', email = '', key = '' } = {}, errors = [] } = response;

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
                // TODO show errors
                console.log('Login error:', errors)

                this.error = true;
                this.errorArr = errors;
                this.loggedIn = false;
                this.loggingIn = false;
            }
        }
    }
};
</script>

<style></style>
