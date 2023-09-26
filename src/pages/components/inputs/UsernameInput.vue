<template>
    <input id="username-input" @input="validateUsername" v-model.trim="username" required tabindex="2"
        :placeholder="$i18n('enter_a_username')" :class="usernameInputClass" />
    <ErrorMessage v-if="usernameErrorMessage.length" :msg="$i18n(usernameErrorMessage)" single />
</template>
<script>
import { debounce } from 'debounce';
import { validateUsername } from "../../../utilities";

import ErrorMessage from "../ErrorMessage.vue";

export default {
    name: 'UsernameInput',
    components: {
        ErrorMessage
    },
    data() {
        return {
            username: '',
            usernameErrorMessage: ''
        };
    },
    computed: {
        usernameInputClass() {
            return this.usernameErrorMessage?.length ? 'generic-error' : '';
        },
    },
    methods: {
        validateUsername: debounce(function (event) {
            const username = event?.target?.value;
            const errorMessage = validateUsername(username);
            const hasError = !!errorMessage.length;

            this.usernameErrorMessage = errorMessage;
            this.passwordErrorMessage = errorMessage;
            this.$emit('currentUsername', username)
            this.$emit('usernameHasError', hasError);

        }, 250)
    }
}
</script>
<style></style>
