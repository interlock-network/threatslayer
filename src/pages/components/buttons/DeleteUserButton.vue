<template>
    <div id="delete-user-button-container" :style="clickedOnce ? 'bottom: 40%' : 'bottom: 8rem;'">
        <!-- initial delete user button -->
        <button v-if="!clickedOnce" @click="submitDeleteUser" id="delete-user-button" :class="computedClass"
            :disabled="disabled">
            <img class="sidebar-icon" src="/src/assets/images/delete-user.png">Delete Account
        </button>
        <div v-if="clickedOnce" style="font-size: 1rem;">
            <TextComponent msg="Are you sure?" id="delete-user-confirm-text" /><br />
            <TextComponent msg="Your account will be deleted forever." /><br />
            <TextComponent msg="This action cannot be undone." />
            <!-- password input field -->
            <input v-model.trim="password" id="delete-user-password-input"
                placeholder="Enter password to permanently delete account" />
            <!-- error message -->
            <TextComponent v-for="errorMessage in errorArr" :msg="errorMessage" error />
            <!-- delete user button -->
            <button @click="submitDeleteUser" id="delete-user-button" :class="computedClass" :disabled="disabled">
                {{ deleteUserButtonText }}
            </button>
            <!-- cancel button -->
            <button @click="fadeAccountPage(false); this.clickedOnce = false;" id="cancel-delete-user-button"
                style="color: #963cf5;">Cancel</button>
        </div>
    </div>
</template>

<script>
import TextComponent from "../TextComponent.vue";

import axios from "axios";
import { baseUrl, clearChromeStorage, setChromeStorage } from '../../../utilities.js';

export default {
    name: "DeleteUserButton",
    props: {
        checkState: Function,
        fadeAccountPage: Function,
        selectPage: Function,
        username: String
    },
    components: {
        TextComponent
    },
    data() {
        return {
            clickedOnce: false,
            confirm: false,
            errorArr: [],
            deleting: false,
            password: ''
        }
    },
    computed: {
        computedClass() {
            return this.errorArr.length || this.clickedOnce ? 'submit-button-error' : '';
        },
        deleteUserButtonText() {
            let result = '';

            if (this.deleting) {
                result = 'Deleting Account';
            } else if (this.errorArr.length) {
                result = "Try again later";
            } else {
                result = 'Delete Account (Permanent)';
            }

            return result;
        },
        disabled() {
            const { clickedOnce, deleting, password } = this;

            return (clickedOnce && !password.length) || deleting;
        }
    },
    methods: {
        async submitDeleteUser() {
            const { password, username } = this;
            this.errorArr = [];

            // user must confirm they are deleting their account
            if (!this.clickedOnce) {
                this.fadeAccountPage(true);
                this.clickedOnce = true;
            } else if (password.length) {
                this.deleting = true;

                const response = await axios.post(`${baseUrl}/user-delete`, { confirm: true, password, username })
                    .then(res => res)
                    .catch(err => err);

                const { errors = [], response: { status = 200, statusText = '' } = {} } = response;

                if (status >= 400) {
                    console.log(`Delete user error. Code: ${status}, status text: ${statusText}`);

                    this.deleting = false;
                    this.errorArr.push(`Error: ${statusText}`);
                } else if (!errors.length) {
                    this.deleting = false;

                    const keyClearedFromState = await clearChromeStorage('key');
                    const loggedOut = await setChromeStorage({ loggedIn: false });
                    const usernameClearedFromState = await clearChromeStorage('username');

                    const deletedSynched = keyClearedFromState && loggedOut && usernameClearedFromState;

                    // TODO improve this try/catch block
                    if (!deletedSynched) {
                        this.errorArr.push('Error logging in. Please try again later.')
                    }

                    if (deletedSynched) {
                        this.clickedOnce = false;
                        this.deleting = false;

                        // navigate to user page after logging out
                        this.selectPage('earn');
                        this.checkState();
                        await setChromeStorage({ registered: false });
                    } else {
                        // TODO add error handling?
                    }
                } else {
                    // TODO show errors
                    console.log('Delete User error:', response.errors)

                    this.errorArr = [response.errors];
                    this.deleting = false;

                    fadeAccountPage(false);
                }
            }
        }
    }
};
</script>

<style>
#delete-user-button-container {
    background-color: #0F0818;
    border-radius: 12px;
    color: #d0d4d9;
    position: absolute;
    padding: 0.75rem 1rem;
    width: 400px;
}

#delete-user-confirm-text {
    color: red;
    display: block;
    font-size: 1.25rem;
    text-align: center;
}

#delete-user-button {
    background-color: #0F0818;
    border: none;
    color: red;
    cursor: pointer;
    font-size: 1rem;
    padding-bottom: 1rem;
    padding-top: 1rem;
    width: 400px;
}

#delete-user-password-input {
    margin-top: 1rem;
}

#cancel-delete-user-button {
    font-size: 1.25rem;
    background-color: #0F0818;
    border: none;
    color: red;
    cursor: pointer;
    font-size: 1.25rem;
    padding-top: 1rem;
    width: 400px;
}
</style>
