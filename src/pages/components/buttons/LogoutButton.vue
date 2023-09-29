<template>
    <div class="sidebar-item" :disabled="loggingOut">
        <img class="sidebar-icon" src="/src/assets/images/logout.png">
        <span :disabled="disabled" @click="submitLogout">{{ $i18n(logoutButtonText) }}
        </span><br />
        <span :disabled="!clickedOnce" id="sidebar-cancel" :style="computedStyle" @click="cancelLogout">{{ $i18n('cancel')
        }}</span>
    </div>
</template>

<script>
import axios from "axios";
import { baseUrl, clearChromeStorage, extractFromError, submitButtonLabels, setChromeStorage } from '../../../utilities.js';

export default {
    name: "LogoutButton",
    props: {
        checkState: { type: Function, required: true },
        apiKey: { type: String, default: '' },
        selectPage: { type: Function, required: true },
        username: { type: String, default: '' }
    },
    data() {
        return {
            clickedOnce: false,
            errorArr: [],
            loggedOut: false,
            loggingOut: false,
            status: 200
        }
    },
    computed: {
        computedStyle() {
            return this.clickedOnce ? 'color: red;' : 'color: #211037;';
        },
        disabled() {
            const { loggedOut, loggingOut } = this;

            return loggedOut || loggingOut;
        },
        logoutButtonText() {
            const { clickedOnce, errorArr, loggedOut: submitted, loggingOut: submitting, status } = this;

            if (clickedOnce && !(submitted || submitting)) {
                return 'confirm_are_you_sure';
            } else {
                const initialMsg = 'logout';
                const submittedMsg = 'logged_out';
                const submittingMsg = 'logging_out';

                return submitButtonLabels(
                    { errorArr, initialMsg, submitting, submittingMsg, submitted, submittedMsg, submitting, status }
                );
            }
        }
    },
    methods: {
        cancelLogout() {
            this.clickedOnce = false;
        },
        submitLogout() {
            // user must confirm before they are logged out
            if (!this.clickedOnce) {
                this.clickedOnce = true;
            } else {
                const { apiKey, username } = this;

                this.errorArr = [];
                this.loggingOut = true;

                axios.post(`${baseUrl}/user-logout`, { key: apiKey, username })
                    .then(response => {
                        const { status } = response.data;

                        this.status = status;
                    })
                    .catch(error => {
                        const { errors, status } = extractFromError(error);

                        this.status = status;

                        console.log(`Logout error. Status: ${status}. Error: ${errors}`);
                    })
                    .finally(async () => {
                        // regardless of whether there are errors, users should be able to logout of the extension
                        // this prevents users from being unable to logout, e.g. because they logged in from a different
                        // installation on another browser and their API key changed
                        this.loggingOut = false;
                        this.loggedOut = true;

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
                        // navigate to user page after logging out, successfully or not
                        this.selectPage('login');
                        this.checkState();
                    });
            }
        }
    }
};
</script>

<style>
#sidebar-cancel {
    cursor: default;
    line-height: 2rem;
    margin-left: 1.65rem;
    pointer-events: initial;
}

.cancel-icon {
    height: 20px;
    padding-left: 0.75rem;
    position: relative;
    top: 5px;
    width: 20px;
}
</style>
