<template>
    <div id="delete-user-button-container" :style="clickedOnce ? 'bottom: 40%' : 'bottom: 10rem;'">
        <!-- initial delete user button -->
        <button v-if="!clickedOnce" @click="submitDeleteUser" id="delete-user-button" :class="computedClass"
            :disabled="disabled">
            <img class="sidebar-icon" src="/src/assets/images/delete-user.png">{{ $i18n('delete_account') }}
        </button>
        <div v-if="clickedOnce" style="font-size: 1rem;">
            <TextComponent :msg="$i18n('confirm_are_you_sure')" id="delete-user-confirm-text" /><br />
            <TextComponent :msg="$i18n('warning_account_will_be_deleted')" /><br />
            <TextComponent :msg="$i18n('warning_ilock_will_be_lost')" /><br />
            <!-- password input field -->
            <div style="position: relative;">
                <input v-model.trim="password" id="delete-user-password-input" :type="passwordInputType"
                    :placeholder="$i18n('enter_password_to_delete_account')" tabindex="6" />
                <button @click="togglePasswordInputType" class="small-button" id="delete-user-toggle-button" tabindex="8">
                    {{ passwordInputType === 'password' ? $i18n('password_show') : $i18n('password_hide') }}
                </button>
            </div>
            <!-- delete user button -->
            <br />
            <br />
            <button @click="submitDeleteUser" id="delete-user-button" :class="computedClass" :disabled="disabled">
                {{ $i18n(deleteUserButtonText) }}
            </button>
            <!-- error message -->
            <TextComponent v-for="errorMessage in errorArr" :msg="errorMessage" error />
            <!-- cancel button -->
            <button @click="fadeAccountPage(false); this.clickedOnce = false;" id="cancel-delete-user-button"
                style="color: #963cf5;">{{ $i18n('cancel') }}</button>
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
            password: '',
            passwordInputType: 'password',
        }
    },
    computed: {
        computedClass() {
            return this.errorArr.length || this.clickedOnce ? 'submit-button-error' : '';
        },
        deleteUserButtonText() {
            let result = '';

            if (this.deleting) {
                result = 'deleting_account';
            } else if (this.errorArr.length) {
                result = 'try_again_later';
            } else {
                result = 'delete_account_permanent';
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

                    const keyClearedFromState = await clearChromeStorage('apiKey');
                    const loggedOut = await setChromeStorage({ loggedIn: false });
                    const usernameClearedFromState = await clearChromeStorage('username');

                    const deletedSynched = keyClearedFromState && loggedOut && usernameClearedFromState;

                    // TODO improve this try/catch block
                    if (!deletedSynched) {
                        this.errorArr.push('error_deleting_account_generic')
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
        },
        togglePasswordInputType() {
            this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
        }
    }
};
</script>

<style>
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

#delete-user-button-container {
    background-color: #0F0818;
    border-radius: 12px;
    color: #FFFFFF;
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
    position: absolute;
}

#delete-user-toggle-button {
    background-color: #0F0818;
    border: none;
    color: #963cf5;
    margin-top: 1.45rem;
    position: absolute;
    right: 4%;
}
</style>