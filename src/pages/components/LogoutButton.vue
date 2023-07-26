<template>
    <div class="sidebar-item" @click="submitLogout()" :class="computedClass" :disabled="loggingOut">
        <img class="sidebar-icon" src="/src/assets/images/logout.png">{{ logoutButtonText }}
    </div>
    <!-- TODO add error message here -->
</template>

<script>
import axios from "axios";
import { clearChromeStorage, setChromeStorage } from '../../utilities.js';

export default {
    name: "LogoutButton",
    props: {
        checkState: Function,
        key: String,
        selectPage: Function,
        username: String
    },
    data() {
        return {
            confirmed: false,
            error: false,
            errorArr: [],
            loggingOut: false
        }
    },
    computed: {
        computedClass() {
            return this.error ? 'submit-button-error' : '';
        },
        logoutButtonText() {
            let result = '';

            if (this.loggingOut) {
                result = 'Logging Out';
            } else if (this.error) {
                result = "Try again later";
            } else if (this.confirmed) {
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
            if (!this.confirmed) {
                this.confirmed = true;
            } else {
                const { key, username } = this;

                this.error = false;
                this.loggingOut = true;

                // TODO update with endpoint URL
                const response = await axios.post('/api/logout', { key, username })
                    .then(res => res)
                    .catch(err => err);

                // TODO test this
                if (!response.errors?.length) {
                    this.loggingOut = false;

                    const keyClearedFromState = await clearChromeStorage('key', 'Chrome state for unique API key cleared after successful logout.', 'Error clearing Chrome state user API key after successful logout:');
                    const loggedOut = await setChromeStorage({ loggedIn: false }, 'Chrome state set to logged out after successful logout.', 'Chrome state not set to logged out after successful logout.');
                    const usernameClearedFromState = await clearChromeStorage('username', 'Chrome state for username cleared after successful logout.', 'Error clearing Chrome state username after successful logout:');

                    const loggedOutSynched = keyClearedFromState && loggedOut && usernameClearedFromState;

                    // TODO improve this try/catch block
                    if (!loggedOutSynched) {
                        // TODO update error message to be an object
                        this.errorArr.push('Error logging in. Please try again later.')
                    }

                    if (loggedOutSynched) {
                        this.confirmed = false;
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

                    this.error = true;
                    this.errorArr = response.errors;
                    this.loggingOut = false;
                }
            }
        }
    }
};
</script>

<style></style>
