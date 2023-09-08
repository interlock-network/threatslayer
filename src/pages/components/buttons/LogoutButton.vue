<template>
    <div class="sidebar-item" @click="submitLogout" :class="computedClass" :disabled="loggingOut">
        <img class="sidebar-icon" src="/src/assets/images/logout.png">{{ logoutButtonText }}
    </div>
    <TextComponent v-for="errorMessage in errorArr" :msg="errorMessage" error />
</template>

<script>
import TextComponent from "../TextComponent.vue";

import axios from "axios";
import { baseUrl, clearChromeStorage, setChromeStorage } from '../../../utilities.js';

export default {
    name: "LogoutButton",
    props: {
        checkState: Function,
        apiKey: String,
        selectPage: Function,
        username: String
    },
    components: {
        TextComponent
    },
    data() {
        return {
            clickedOnce: false,
            errorArr: [],
            loggingOut: false
        }
    },
    computed: {
        computedClass() {
            return this.errorArr.length || this.clickedOnce ? 'submit-button-error' : '';
        },
        logoutButtonText() {
            let result = '';

            if (this.loggingOut) {
                result = 'Logging Out';
            } else if (this.errorArr.length) {
                result = "Try again later";
            } else if (this.clickedOnce) {
                result = "Are you sure?";
            } else {
                result = 'Logout';
            }

            return result;
        }
    },
    methods: {
        async submitLogout() {
            // user must confirm before they are logged out
            if (!this.clickedOnce) {
                this.clickedOnce = true;
            } else {
                const { apiKey, username } = this;

                this.errorArr = [];
                this.loggingOut = true;

                const response = await axios.post(`${baseUrl}/user-logout`, { key: apiKey, username })
                    .then(res => res)
                    .catch(err => err);

                const { errors = [], response: { status = 200, statusText = '' } = {} } = response;

                if (status >= 400) {
                    console.log(`Logout user error. Code: ${status}, status text: ${statusText}`);

                    this.loggingOut = false;
                    this.errorArr.push(`Error: ${statusText}`);
                } else if (!errors.length) {
                    this.loggingOut = false;

                    const addressClearedFromState = await clearChromeStorage('address');
                    const emailClearedFromState = await clearChromeStorage('email');
                    const keyClearedFromState = await clearChromeStorage('apiKey');
                    const loggedOut = await setChromeStorage({ loggedIn: false });
                    const usernameClearedFromState = await clearChromeStorage('username');

                    const loggedOutSynched = addressClearedFromState && emailClearedFromState && keyClearedFromState && loggedOut && usernameClearedFromState;

                    if (!loggedOutSynched) {
                        this.errorArr.push('Error logging in. Please try again later.')
                    }

                    if (loggedOutSynched) {
                        this.clickedOnce = false;
                        this.loggingOut = false;

                        // navigate to user page after logging out
                        this.selectPage('login');
                        this.checkState();
                    } else {
                        // TODO add error handling?
                    }
                } else {
                    console.log('Logout error:', response.errors)

                    this.errorArr = [response.errors];
                    this.loggingOut = false;
                }
            }
        }
    }
};
</script>

<style></style>