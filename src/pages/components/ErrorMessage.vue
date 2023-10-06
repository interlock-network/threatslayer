<template>
    <TextComponent :msg="errorMessage" :class="computedClass" :style="computedStyle" />
</template>

<script>
import TextComponent from "./TextComponent.vue";

export default {
    name: "ErrorMessage",
    props: {
        msg: { type: String, required: true },
        last: { type: Boolean, default: false },
        secondMsg: { type: String, required: false },
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
            const { msg = '' } = this;
            const firstWord = msg.toLowerCase().slice(0, 5);

            return firstWord === 'error' ? msg : `Error: ${msg}`;
        },
        errorMessage() {
            return this.secondMsg ? this.msg + this.secondMsg : this.msg;
        }
    }
};
</script>

<style>
.single-error {
    color: red;
    display: block;
    font-size: 1rem;
    margin-top: -0.3rem;
}

.stacked-error {
    color: red;
    display: block;
    font-size: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
