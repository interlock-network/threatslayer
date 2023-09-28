<template>
    <input type="email" @input="validateEmail" v-model.trim="email" required :tabindex="tabindex" :class="inputClass"
        :placeholder="$i18n(placeholder)" />
    <ErrorMessage v-if="errorMessage.length" :msg="$i18n(errorMessage)" single />
</template>
<script>
import { debounce } from 'debounce';
import { validateEmail } from "../../../utilities";

import ErrorMessage from "../ErrorMessage.vue";

export default {
    name: 'EmailInput',
    components: {
        ErrorMessage
    },
    props: {
        placeholder: { type: String, default: 'enter_your_email' },
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
        validateEmail: debounce(function () {
            const email = this.email;
            const errorMessage = validateEmail(email);
            const hasError = !!errorMessage.length;

            this.errorMessage = errorMessage;
            this.$emit('currentEmail', email)
            this.$emit('emailHasError', hasError);
        }, 250)
    }
}
</script>
<style></style>
