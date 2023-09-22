<template>
    <button @click="submitDeleteUser" id="modal-delete-user-button" :disabled="disabled">
        {{ $i18n(deleteUserButtonText) }}
    </button>
    <ErrorMessage v-for="errorMessage in errorArr" :msg="errorMessage" style="margin-top: 1rem;" single />
</template>

<script>
import axios from "axios";
import { baseUrl, clearChromeStorage, extractFromError, formatErrorMessages, setChromeStorage } from '../../../utilities.js';

import ErrorMessage from "../ErrorMessage.vue";

export default {
    name: "DeleteUserButton",
    props: {
        active: Boolean,
        checkState: Function,
        fadeAccountPage: Function,
        password: String,
        setActive: Function,
        username: String
    },
    components: {
        ErrorMessage
    },
    data() {
        return {
            confirm: false,
            deleting: false,
            errorArr: []
        }
    },
    computed: {
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
            const { deleting, password } = this;

            return !password.length || deleting;
        }
    },
    methods: {
        async submitDeleteUser() {
            const { password, username } = this;
            this.errorArr = [];

            if (password.length) {
                this.deleting = true;

                axios.post(`${baseUrl}/user-delete`, { confirm: true, password, username })
                    .then(async _response => {
                        this.deleting = false;

                        const keyClearedFromState = await clearChromeStorage('apiKey');
                        const loggedOut = await setChromeStorage({ loggedIn: false });
                        const usernameClearedFromState = await clearChromeStorage('username');

                        const deletedSynched = keyClearedFromState && loggedOut && usernameClearedFromState;

                        if (deletedSynched) {
                            this.setActive(false);
                            this.deleting = false;

                            const unregistered = await setChromeStorage({ registered: false });

                            if (unregistered) {
                                this.checkState();
                            }
                        }
                    })
                    .catch(error => {
                        this.deleting = false;
                        const { errors, status } = extractFromError(error);

                        console.log(`Delete user error. Status: ${status}. Error: ${errors}`);

                        this.errorArr = formatErrorMessages(errors);
                        this.fadeAccountPage(false);
                    });
            }
        }
    }
};
</script>

<style>
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
