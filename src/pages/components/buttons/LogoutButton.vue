<template>
    <div class="sidebar-item" @click="submitLogout" :class="computedClass" :disabled="loggingOut">
        <img class="sidebar-icon" src="/src/assets/images/logout.png">{{ logoutButtonText }}
    </div>
</template>

<script>
import axios from "axios";
import { baseUrl, clearChromeStorage, extractFromError, setChromeStorage } from '../../../utilities.js';

export default {
    name: "LogoutButton",
    props: {
        checkState: Function,
        apiKey: String,
        selectPage: Function,
        username: String
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

                axios.post(`${baseUrl}/user-logout`, { key: apiKey, username })
                    .then(async _response => {
                        // regardless of whether there are errors, users should be able to logout of the extension
                        // this prevents users from being unable to logout, e.g. because they logged in from a different
                        // installation on another browser and their API key changed
                        this.loggingOut = false;

                        const azeroAddressClearedFromState = await clearChromeStorage('azeroAddress');
                        const emailClearedFromState = await clearChromeStorage('email');
                        const keyClearedFromState = await clearChromeStorage('apiKey');
                        const pdotAddressClearedFromState = await clearChromeStorage('pdotAddress');
                        const usernameClearedFromState = await clearChromeStorage('username');
                        // this happens last
                        const loggedOut = await setChromeStorage({ loggedIn: false });

                        const loggedOutSynched = azeroAddressClearedFromState && emailClearedFromState && keyClearedFromState
                            && loggedOut && pdotAddressClearedFromState && usernameClearedFromState;

                        if (!loggedOutSynched) {
                            this.errorArr.push('Error logging in. Please try again later.')
                        }
                    })
                    .catch(error => {
                        const { errors, status } = extractFromError(error);

                        console.log(`Logout error. Status: ${status}. Error: ${errors}`);
                    })
                    .finally(() => {
                        // navigate to user page after logging out, successfully or not
                        this.selectPage('login');
                        this.checkState();
                    });
            }
        }
    }
};
</script>

<style></style>
