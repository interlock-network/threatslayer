<template>
    <input id="login-password" class="password-input" @input="validatePassword" :type="passwordInputType"
        v-model.trim="password" :placeholder="$i18n(placeholder)" :tabindex="tabindex" :class="passwordInputClass" />
    <button @click="togglePasswordInputType" id="show-password-toggle-button" :tabindex="showButtonIndex">
        {{ passwordInputType === 'password' ? $i18n('password_show') : $i18n('password_hide') }}
    </button>
    <ErrorMessage :msg="$i18n(errorMessage)" single v-if="errorMessage.length" />
</template>

<script>
import { debounce } from 'debounce';

import ErrorMessage from "../ErrorMessage.vue";

export default {
    name: 'SinglePasswordInput',
    components: {
        ErrorMessage
    },
    props: {
        placeholder: { type: String, default: 'password' },
        tabindex: { type: Number, default: 4 }
    },
    data() {
        return {
            password: '',
            errorMessage: '',
            passwordInputType: 'password'
        };
    },
    computed: {
        passwordInputClass() {
            return this.errorMessage.length ? 'generic-error' : '';
        },
        showButtonIndex() {
            return Number.parseInt(this.tabindex) + 1;
        }
    },
    methods: {
        findPasswordError(password = '') {
            let result = '';

            // number of characters
            const minLength = 12;
            const maxLength = 512;

            if (!password.length) {
                result = ''; // no change, empty string === valid
            } else if (password.length < minLength) {
                result = 'error_password_too_short';
            } else if (password.length > maxLength) {
                result = 'error_password_too_long';
            }

            return result;
        },
        togglePasswordInputType() {
            const inputType = this.passwordInputType === 'password' ? 'text' : 'password';

            this.passwordInputType = inputType;
            this.$emit('inputType', inputType);
        },
        validatePassword: debounce(function () {
            const password = this.password;
            const errorMessage = this.findPasswordError(password);
            const hasError = !!errorMessage.length;

            this.errorMessage = errorMessage;
            this.$emit('currentPassword', password)
            this.$emit('passwordHasError', hasError);
        }, 250)
    }
}
</script>

<style>
#show-password-toggle-button {
    background-color: #0F0818;
    border: none;
    color: #963cf5;
    float: right;
    margin-right: 4.25rem;
    margin-top: -2.25rem;
    pointer-events: initial;
    cursor: pointer;
}

.password-input {
    float: left;
}
</style>
