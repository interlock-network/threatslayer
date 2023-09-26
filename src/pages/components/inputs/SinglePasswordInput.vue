<template>
    <input id="login-password" class="input-field-text password-input" @input="validatePassword" :type="passwordInputType"
        v-model.trim="password" :placeholder="$i18n('password')" tabindex="2" :class="passwordInputClass" />
    <button @click="togglePasswordInputType" class="small-button" id="show-password-toggle-button" tabindex="4">
        {{ passwordInputType === 'password' ? $i18n('password_show') : $i18n('password_hide') }}
    </button>
    <ErrorMessage :msg="$i18n(passwordErrorMessage)" single v-if="passwordErrorMessage.length" />
</template>
<script>
import { debounce } from 'debounce';
import { validatePassword } from "../../../utilities";

import ErrorMessage from "../ErrorMessage.vue";

export default {
    name: 'SinglePasswordInput',
    components: {
        ErrorMessage
    },
    data() {
        return {
            password: '',
            passwordErrorMessage: '',
            passwordInputType: 'password',
        };
    },
    computed: {
        passwordInputClass() {
            return this.passwordErrorMessage.length ? 'generic-error' : '';
        }
    },
    methods: {
        togglePasswordInputType() {
            this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
        },
        validatePassword: debounce(function (event) {
            const password = event?.target?.value;
            const errorMessage = validatePassword(password);
            const hasError = !!errorMessage.length;

            this.passwordErrorMessage = errorMessage;
            this.$emit('currentPassword', password)
            this.$emit('passwordHasError', hasError);
        }, 250)
    }
}
</script>
<style></style>
