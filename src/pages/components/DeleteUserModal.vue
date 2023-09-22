<template>
    <!-- initial delete user button -->
    <button v-if="!pageFaded" @click="openDeleteUserModal" id="delete-user-button">
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
            <DeleteUserButton v-if="active"
                v-bind="{ active, checkState, fadeAccountPage, password, setActive, username }" />
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
import TextComponent from "./TextComponent.vue";

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
        DeleteUserButton,
        ErrorMessage,
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
        deleteUserButtonText() {
            let result = '';

            if (this.deleting) {
                result = 'deleting_account';
                // TODO update text depending on error status
            } else if (this.errorArr.length) {
                result = 'try_again_later';
            } else {
                result = 'delete_account_permanent';
            }

            return result;
        }
    },
    methods: {
        cancelAction() {
            this.password = '';
            this.errorArr = [];
            this.fadeAccountPage(false);
            this.setActive(false);
        },
        openDeleteUserModal() {
            this.fadeAccountPage(true);
            this.setActive(true);
        },
        setActive(bool) {
            this.active = bool;
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
</style>
