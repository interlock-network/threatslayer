<template>
    <div class="login-page-submit-button-container">
        <button class='login-page-submit-button' @click="submitLogin()" :class="computedClass"
            :disabled="loggingIn || loggedIn || !active">
            {{ loginButtonText }}
        </button>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "SubmitButton",
    props: {
        active: Boolean,
        password: String,
        usernameOrEmail: String,
    },
    data() {
        return {
            error: false,
            loggedIn: false,
            loggingIn: false
        }
    },
    computed: {
        computedClass() {
            let className = '';

            if (this.error) {
                className = 'login-page-submit-button-error';
            } else if (!this.active) {
                className = 'disabled';
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

            this.error = false;
            this.loggingIn = true;

            // TODO update with endpoint URL
            const response = await axios.post('/api/login', { password, usernameOrEmail })
                .then(res => {
                    return res;
                }).catch(err => {
                    return err;
                });

            if (response?.status === 200) {
                this.loggedIn = true;
                this.loggingIn = false;

                chrome.storage.local
                    .set({ registered: true })
                    .then(() => {
                        console.log("Confirmed registered status!");
                    });

                const loggedIn = await chrome.storage.local
                    .set({ loggedIn: true })
                    .then(() => {
                        console.log("User succesfully logged in");
                        return true;
                    });

                if (loggedIn) {
                    this.loggedIn = true;
                    this.loggingIn = false;
                } else {
                    // TODO add better error handling
                }
            } else {
                console.log('Login error:', response.code)
                // if API doesn't return a 200
                // TODO catch errors properly
                this.error = true;
                this.loggedIn = false;
                this.loggingIn = false;
            }
        }
    }
};
</script>

<style></style>
