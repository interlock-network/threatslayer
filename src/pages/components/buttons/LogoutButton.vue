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
        key: String,
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
                const { key, username } = this;

                this.errorArr = [];
                this.loggingOut = true;

                // TODO update with endpoint URL
                const response = await axios.post(`${baseUrl}/user-logout`, { key, username })
                    .then(res => res)
                    .catch(err => err);

                // TODO test this
                if (!response.errors?.length) {
                    this.loggingOut = false;

                    const keyClearedFromState = await clearChromeStorage('key');
                    const loggedOut = await setChromeStorage({ loggedIn: false });
                    const usernameClearedFromState = await clearChromeStorage('username');

                    const loggedOutSynched = keyClearedFromState && loggedOut && usernameClearedFromState;

                    // TODO improve this try/catch block
                    if (!loggedOutSynched) {
                        // TODO update error message to be an object
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
                    // TODO show errors
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
