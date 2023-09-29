<template>
    <!-- initial delete user button -->
    <button v-if="!pageFaded" @click="openDeleteUserModal" id="delete-user-button">
        <img v-if="!active" class="sidebar-icon" src="/src/assets/images/delete-user.png">{{ $i18n('delete_account') }}
    </button>
    <!-- delete user modal contents -->
    <div v-if="active" id="modal-overlay" @keydown.esc="cancelAction">
        <div id="delete-user-modal-container" :style="active ? 'bottom: 40%' : 'display: none'">
            <TextComponent :msg="$i18n('confirm_are_you_sure')" id="delete-user-confirm-text" /><br />
            <TextComponent :msg="$i18n('warning_account_will_be_deleted')" /><br />
            <TextComponent :msg="$i18n('warning_ilock_will_be_lost')" /><br />
            <div id="delete-user-password-input">
                <SinglePasswordInput placeholder="enter_password_to_delete_account" @currentPassword="getPassword"
                    @passwordHasError="getPasswordHasError" />
            </div>
            <DeleteUserButton v-if="active"
                v-bind="{ active, checkState, disableDeleteButton, fadeAccountPage, password, setActive, username }" />
            <ErrorMessage v-for="errorMessage in errorArr" :msg="errorMessage" single style="margin-top: 1rem;" />
            <!-- cancel button -->
            <button @click="cancelAction" id="cancel-delete-user-button" style="color: #963cf5 ">
                {{ $i18n('cancel') }}
            </button>
        </div>
    </div>
</template>

<script>
import DeleteUserButton from "./buttons/DeleteUserButton.vue";
import ErrorMessage from "./ErrorMessage.vue";
import SinglePasswordInput from "./inputs/SinglePasswordInput.vue";
import TextComponent from "./TextComponent.vue";

export default {
    name: "DeleteUserModal",
    props: {
        checkState: { type: Function, required: true },
        fadeAccountPage: { type: Function, required: true },
        pageFaded: { type: Boolean, default: false },
        selectPage: { type: Function, required: true },
        username: { type: String, default: '' }
    },
    components: {
        DeleteUserButton,
        ErrorMessage,
        SinglePasswordInput,
        TextComponent
    },
    data() {
        return {
            active: false,
            confirm: false,
            errorArr: [],
            deleted: false,
            deleting: false,
            password: '',
            passwordHasError: false,
            status: 200
        }
    },
    computed: {
        disableDeleteButton() {
            return !this.password.length || this.passwordHasError;
        }
    },
    methods: {
        cancelAction() {
            this.password = '';
            this.errorArr = [];
            this.fadeAccountPage(false);
            this.setActive(false);
        },
        getPassword(password) {
            this.password = password;
        },
        getPasswordHasError(errorBool) {
            this.passwordHasError = errorBool;
        },
        openDeleteUserModal() {
            this.fadeAccountPage(true);
            this.setActive(true);
        },
        setActive(bool) {
            this.active = bool;
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
    padding-top: 0.9rem;
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
    margin-top: 2rem;
    position: relative;
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
