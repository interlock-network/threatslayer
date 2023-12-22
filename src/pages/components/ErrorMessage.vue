<template>
    <span class="error" :class="computedClass" :style="computedStyle">{{ msg }}</span>
</template>

<script>
import TextComponent from "./TextComponent.vue";

export default {
    name: "ErrorMessage",
    props: {
        msg: { type: String, required: true },
        last: { type: Boolean, default: false },
        secondMsg: { type: String, default: undefined, required: false },
        single: { type: Boolean, default: false },
        stacked: { type: Boolean, default: false }
    },
    components: {
        TextComponent
    },
    computed: {
        computedClass() {
            return this.single ? 'single-error' : this.stacked ? 'stacked-error' : '';
        },
        computedStyle() {
            return this.last ? 'margin-bottom: 0;' : '';
        },
        errorMessage() {
            const { msg, secondMsg } = this;

            return secondMsg?.length ? `${msg} ${secondMsg}` : msg;
        }
    }
};
</script>

<style>
.error {
    color: red;
    display: block;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    word-wrap: break-word;
}

.single-error {
    margin-top: -0.3rem;
}

.stacked-error {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
