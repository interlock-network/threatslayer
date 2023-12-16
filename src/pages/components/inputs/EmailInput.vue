<template>
    <input type="email" @input="validateEmail" v-model.trim="email" required :tabindex="tabindex" :class="inputClass"
        :placeholder="$i18n(placeholder)" />
    <ErrorMessage v-if="errorMessage.length" :msg="$i18n(errorMessage)" single />
</template>
<script>
import { debounce } from 'debounce';

import ErrorMessage from "../ErrorMessage.vue";

export default {
    name: 'EmailInput',
    components: {
        ErrorMessage
    },
    props: {
        placeholder: { type: String, default: 'enter_email' },
        tabindex: { type: Number, default: 4 }
    },
    data() {
        return {
            email: '',
            errorMessage: ''
        };
    },
    computed: {
        inputClass() {
            return this.errorMessage?.length ? 'generic-error' : '';
        },
    },
    methods: {
        findEmailError(email = '') {
            let result = '';

            if (!email.length) {
                result = '';
            } else if (!this.isEmail(email)) {
                result = 'error_invalid_email_generic';
            } else {
                result = '';
            }

            return result;
        },
        isEmail(usernameOrPassword) {
            let result = true;
            // from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

            if (!emailRegex.test(usernameOrPassword)) {
                result = false;
            }

            return result;
        },
        validateEmail: debounce(function () {
            const email = this.email;
            const errorMessage = this.findEmailError(email);
            const hasError = !!errorMessage.length;

            this.errorMessage = errorMessage;
            this.$emit('currentEmail', email);
            this.$emit('emailHasError', hasError);
        }, 250)
    }
}
</script>
<style></style>
