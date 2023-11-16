<template>
    <input id="username-input" @input="validateUsername" v-model.trim="username" required :tabindex="tabindex"
        :placeholder="$i18n(placeholderText)" :class="usernameInputClass" />
    <ErrorMessage v-if="errorMessage.length" :msg="$i18n(errorMessage)" :secondMsg="illegalChars" single />
</template>

<script>
import { debounce } from 'debounce';

import ErrorMessage from "../ErrorMessage.vue";

export default {
    name: 'UsernameInput',
    components: {
        ErrorMessage
    },
    props: {
        focus: { type: Boolean, default: false },
        placeholderI18n: { type: String, default: undefined },
        tabindex: { type: Number, default: 2 }
    },
    data() {
        return {
            username: '',
            errorMessage: '',
            illegalChars: ''
        };
    },
    mounted() {
        if (this.focus) {
            document.getElementById('username-input').focus();
        }
    },
    computed: {
        placeholderText() {
            const { placeholderI18n } = this;
            const defaultPlaceholder = 'enter_a_username';

            return placeholderI18n ? placeholderI18n : defaultPlaceholder;
        },
        usernameInputClass() {
            return this.errorMessage?.length ? 'generic-error' : '';
        }
    },
    methods: {
        findNonAlphanumericChars(str) {
            let result = [];

            if (str?.length) {
                const regex = /[^A-Za-z0-9]/g;
                const matchesArr = str.match(regex);

                if (matchesArr?.length) {
                    const illegalChars = matchesArr.map(char =>
                        char === ' ' ? 'space' :
                            char === ',' ? 'comma' : char
                    );

                    // to remove duplicate chars and stringify
                    result = [...new Set(illegalChars)].join(', ');
                }
            }

            return result;
        },
        findUsernameErrors(username = '') {
            let result = '';

            // number of characters
            const maxLength = 16;
            const minLength = 5;

            const allowedCharsRegex = /^[a-zA-Z0-9_]+$/;
            const containsIllegalChars = !allowedCharsRegex.test(username);

            if (!username.length) {
                result = ''; // no change, empty string === valid
            } else if (username.length < minLength) {
                result = 'warning_username_too_short';
            } else if (username.length > maxLength) {
                result = 'warning_username_too_long';
            } else if (containsIllegalChars) {
                result = 'warning_username_contains_illegal_characters';
            }

            return result;
        },
        validateUsername: debounce(function () {
            const username = this.username;
            const errorMessage = this.findUsernameErrors(username);
            const illegalChars = this.findNonAlphanumericChars(username);
            const hasError = !!errorMessage.length;

            this.errorMessage = errorMessage;
            this.illegalChars = illegalChars;
            this.$emit('currentUsername', username);
            this.$emit('usernameHasError', hasError);
        }, 250)
    }
}
</script>

<style></style>
