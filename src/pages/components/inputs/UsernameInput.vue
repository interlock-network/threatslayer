<template>
    <input id="username-input" @input="validateUsername" v-model.trim="username" required :tabindex="tabindex"
        :placeholder="$i18n('enter_a_username')" :class="usernameInputClass" />
    <ErrorMessage v-if="errorMessage.length" :msg="$i18n(errorMessage)" single />
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
    props: {
        tabindex: { type: Number, default: 2 }
    },
    data() {
        return {
            username: '',
            errorMessage: ''
        };
    },
    computed: {
        usernameInputClass() {
            return this.errorMessage?.length ? 'generic-error' : '';
        },
    },
    methods: {
        validateUsername: debounce(function () {
            const username = this.username;
            const errorMessage = validateUsername(username);
            const hasError = !!errorMessage.length;

            this.errorMessage = errorMessage;
            this.$emit('currentUsername', username)
            this.$emit('usernameHasError', hasError);

        }, 250)
    }
}
</script>
<style></style>
