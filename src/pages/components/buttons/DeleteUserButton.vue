<template>
    <button @click="submitDeleteUser" id="modal-delete-user-button" :disabled="disabled">
        {{ $i18n(deleteUserButtonText) }}
    </button>
    <ErrorMessage v-for="errorMessage in errorArr" :msg="errorMessage" style="margin-top: 1rem;" single />
</template>

<script>
import axios from "axios";
import { baseUrl, clearChromeStorage, extractFromError, formatErrorMessages, genericSubmitButtonLabels, setChromeStorage } from '../../../utilities.js';

import ErrorMessage from "../ErrorMessage.vue";

export default {
    name: "DeleteUserButton",
    props: {
        active: { type: Boolean, required: true },
        checkState: { type: Function, required: true },
        fadeAccountPage: { type: Function, required: true },
        password: { type: String, default: '' },
        setActive: { type: Function, required: true },
        username: { type: String, default: '' }
    },
    components: {
        ErrorMessage
    },
    data() {
        return {
            confirm: false,
            deleted: false,
            deleting: false,
            errorArr: [],
            status: 200
        }
    },
    computed: {
        deleteUserButtonText() {
            const { errorArr, deleted: submitted, deleting: submitting, status } = this;

            return genericSubmitButtonLabels(
                { errorArr, initial: 'delete_account_permanent', inProgress: 'deleting_account', submitted, submitting, status }
            );
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
                    .then(async response => {
                        const { status } = response.data;

                        this.deleted = true;
                        this.deleting = false;
                        this.status = status;

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
                        const { errors, status } = extractFromError(error);

                        console.log(`Delete user error. Status: ${status}. Error: ${errors}`);

                        this.deleting = false;
                        this.errorArr = formatErrorMessages(errors);
                        this.status = status;
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
    padding-top: 5.5rem;
    width: 400px;
}
</style>
