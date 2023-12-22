<template>
    <div id="modal-delete-user-button-container">
        <button @click="submitDeleteUser" id="modal-delete-user-button" :disabled="disabled">
            {{ $i18n(deleteUserButtonText) }}
        </button>
    </div>
    <ErrorMessage v-for="error in errorArr" :msg="$i18n(error)" style="margin-top: 1rem;" single />
</template>

<script>
import axios from "axios";
import { baseUrl, clearChromeStorage, extractFromError, formatErrorMessages, submitButtonLabels, setChromeStorage } from '../../../utilities.js';

import ErrorMessage from "../ErrorMessage.vue";

export default {
    name: "DeleteUserButton",
    props: {
        active: { type: Boolean, required: true },
        checkState: { type: Function, required: true },
        disableDeleteButton: { type: Boolean, required: true },
        fadeAccountPage: { type: Function, required: true },
        hasErrors: { type: Boolean, default: false },
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

            const initialMsg = 'delete_account_permanent';
            const submittingMsg = 'deleting_account';

            return submitButtonLabels(
                { errorArr, initialMsg, submittingMsg, submitted, submitting, status }
            );
        },
        disabled() {
            return this.deleting || this.deleted;
        }
    },
    methods: {
        async submitDeleteUser() {
            const { hasErrors, password, username } = this;
            this.errorArr = [];

            this.$emit('missingSubmitFields', false);

            const fieldMissing = !password?.length || !username?.length;

            if (hasErrors) {
                this.errorArr.push('warning_has_errors');
            } else if (fieldMissing) {
                this.errorArr.push('warning_required_fields_missing');
                this.$emit('missingSubmitFields', true);
            } else {
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
    }
};
</script>

<style>
#modal-delete-user-button-container {
    padding-bottom: 1rem;
    padding-top: 4.5rem;
}

#modal-delete-user-button {
    background-color: #0F0818;
    border: none;
    border-radius: 6px;
    color: red;
    cursor: pointer;
    font-size: 1rem;
    line-height: 2rem;
    width: 400px;
}

#modal-delete-user-button:hover {
    background-color: #4A0064;
}

#modal-delete-user-button:active {
    background-color: #261142;
}
</style>
