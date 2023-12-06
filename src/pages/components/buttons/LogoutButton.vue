<template>
    <div class="sidebar-item" :disabled="disabled" @click="logout">
        <img class="sidebar-icon" src="/src/assets/images/logout.png">
        <span>{{ $i18n(logoutButtonText) }}
        </span><br />
    </div>
    <div>
        <div :disabled="!clickedOnce" id="sidebar-cancel" :class="computedClass" @click="cancelLogout">
            {{ $i18n('cancel') }}
        </div>
    </div>
</template>
<script>
import { clearChromeStorage, setChromeStorage } from '../../../utilities.js';

export default {
    name: "LogoutButton",
    props: {
        checkState: { type: Function, required: true },
        selectPage: { type: Function, required: true }
    },
    data() {
        return {
            clickedOnce: false,
            errorArr: [],
            loggedOut: false,
            status: 200
        }
    },
    computed: {
        computedClass() {
            return !this.clickedOnce ? 'hidden-sidebar-cancel' : 'visible-sidebar-cancel';
        },
        disabled() {
            return this.loggedOut;
        },
        logoutButtonText() {
            const { clickedOnce, loggedOut } = this;

            let result = '';

            if (clickedOnce && !(loggedOut)) {
                result = 'confirm_are_you_sure';
            } else if (loggedOut) {
                result = 'logged_out';
            } else {
                result = 'logout';
            }

            return result;
        }
    },
    methods: {
        cancelLogout() {
            this.clickedOnce = false;
        },
        async logout() {
            // user must confirm before they are logged out
            if (!this.clickedOnce) {
                this.clickedOnce = true;
            } else {
                this.loggedOut = true;

                const addressClearedFromState = await clearChromeStorage('walletAddress');
                const emailClearedFromState = await clearChromeStorage('email');
                const keyClearedFromState = await clearChromeStorage('apiKey');
                const usernameClearedFromState = await clearChromeStorage('username');

                // this happens last
                const loggedOut = await setChromeStorage({ loggedIn: false });

                const loggedOutSynched = addressClearedFromState && emailClearedFromState && keyClearedFromState
                    && loggedOut && usernameClearedFromState;

                if (!loggedOutSynched) {
                    this.errorArr.push('Error logging in. Please try again later.')
                }
                // navigate to user page after logging out, successfully or not
                this.selectPage('login');
                this.checkState();
            }
        }
    }
};
</script>

<style>
#sidebar-cancel {
    cursor: pointer;
    line-height: 2rem;
    padding-left: 1.65rem;
    pointer-events: initial;
    margin-bottom: 0.5rem;
}

.hidden-sidebar-cancel {
    color: #211037;
}

.visible-sidebar-cancel {
    color: red;
    border-radius: 6px;
    line-height: 2rem;
    width: 68%;
}

.visible-sidebar-cancel:hover {
    background-color: #4A0064;
}

.visible-sidebar-cancel:active {
    background-color: #261142;
}

.cancel-icon {
    height: 20px;
    padding-left: 0.75rem;
    position: relative;
    top: 5px;
    width: 20px;
}
</style>
