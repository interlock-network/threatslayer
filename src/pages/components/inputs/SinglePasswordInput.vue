<template>
    <input id="login-password" class="input-field-text password-input" @input="validatePassword" :type="passwordInputType"
        v-model.trim="password" :placeholder="$i18n('password')" tabindex="2" :class="passwordInputClass" />
    <button @click="togglePasswordInputType" class="small-button" id="show-password-toggle-button" tabindex="4">
        {{ passwordInputType === 'password' ? $i18n('password_show') : $i18n('password_hide') }}
    </button>
    <ErrorMessage :msg="$i18n(errorMessage)" single v-if="errorMessage.length" />
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
            errorMessage: '',
            passwordInputType: 'password',
        };
    },
    computed: {
        passwordInputClass() {
            return this.errorMessage.length ? 'generic-error' : '';
        }
    },
    methods: {
        togglePasswordInputType() {
            const inputType = this.passwordInputType === 'password' ? 'text' : 'password';

            this.passwordInputType = inputType;
            this.$emit('inputType', inputType);
        },
        validatePassword: debounce(function () {
            const password = this.password;
            const errorMessage = validatePassword(password);
            const hasError = !!errorMessage.length;

            this.errorMessage = errorMessage;
            this.$emit('currentPassword', password)
            this.$emit('passwordHasError', hasError);
        }, 250)
    }
}
</script>
<style></style>
