<template>
    <!-- initial delete user button -->
    <button v-if="!pageFaded" @click="openDeleteUserModal" id="delete-user-button" :class="computedClass">
        <img v-if="!active" class="sidebar-icon" src="/src/assets/images/delete-user.png">{{ $i18n('delete_account') }}
    </button>
    <div v-if="active" id="modal-overlay">
        <div id="delete-user-modal-container" :style="active ? 'bottom: 40%' : 'display: none'">
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
            <button @click="submitDeleteUser" id="modal-delete-user-button" :class="computedClass" :disabled="disabled">
                {{ $i18n(deleteUserButtonText) }}
            </button>
            <!-- error message -->
            <TextComponent v-for="errorMessage in errorArr" :msg="errorMessage" error />
            <!-- cancel button -->
            <button @click="cancelAction" id="cancel-delete-user-button" style="color: #963cf5 ">
                {{ $i18n('cancel') }}
            </button>
        </div>
    </div>
</template>

<script>
import TextComponent from "./TextComponent.vue";

import axios from "axios";
import { baseUrl, clearChromeStorage, extractFromError, formatErrorMessages, setChromeStorage } from '../../utilities.js';

export default {
    name: "DeleteUserModal",
    props: {
        checkState: Function,
        fadeAccountPage: Function,
        pageFaded: Boolean,
        selectPage: Function,
        username: String
    },
    components: {
        TextComponent
    },
    data() {
        return {
            active: false,
            confirm: false,
            errorArr: [],
            deleting: false,
            password: '',
            passwordInputType: 'password',
        }
    },
    computed: {
        computedClass() {
            return this.errorArr.length || this.active ? 'submit-button-error' : '';
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
            const { active, deleting, password } = this;

            return (active && !password.length) || deleting;
        }
    },
    methods: {
        cancelAction() {
            this.fadeAccountPage(false);
            this.active = false;
        },
        openDeleteUserModal() {
            this.fadeAccountPage(true);
            this.active = true;
        },
        async submitDeleteUser() {
            const { password, username } = this;
            this.errorArr = [];

            // user must confirm they are deleting their account
            if (!this.active) {
                this.fadeAccountPage(true);
                this.active = true;
            } else if (password.length) {
                this.deleting = true;

                axios.post(`${baseUrl}/user-delete`, { confirm: true, password, username })
                    .then(async _response => {
                        this.deleting = false;

                        const keyClearedFromState = await clearChromeStorage('apiKey');
                        const loggedOut = await setChromeStorage({ loggedIn: false });
                        const usernameClearedFromState = await clearChromeStorage('username');

                        const deletedSynched = keyClearedFromState && loggedOut && usernameClearedFromState;

                        if (deletedSynched) {
                            this.active = false;
                            this.deleting = false;
                            const unregistered = await setChromeStorage({ registered: false });

                            if (unregistered) {
                                this.checkState();
                            }
                        }
                    })
                    .catch(error => {
                        const { errors, status } = extractFromError(error);

                        console.log(`Delete user error. Status: ${status}. Error: ${errors}`);

                        this.deleting = false;
                        this.errorArr = formatErrorMessages(errors);
                        this.fadeAccountPage(false);
                    });
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
    color: #963cf5;
    cursor: pointer;
    font-size: 1.25rem;
    padding-top: 1rem;
    width: 400px;
}

#delete-user-modal-container {
    background-color: #0F0818;
    border-radius: 12px;
    color: #FFFFFF;
    padding: 50px;
    position: absolute;
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
    width: 400px;
    position: absolute;
    bottom: 22%;
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

#modal-delete-user-button {
    background-color: #0F0818;
    border: none;
    color: red;
    cursor: pointer;
    font-size: 1rem;
    margin-bottom: -1rem;
    padding-top: 1rem;
    width: 400px;
}
</style>
