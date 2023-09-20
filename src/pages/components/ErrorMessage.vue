<template>
    <TextComponent :msg="msg" :class="computedClass" :style="computedStyle" />
</template>

<script>
import TextComponent from "./TextComponent.vue";

export default {
    name: "ErrorMessage",
    props: {
        msg: {
            required: true,
            type: String,
        },
        last: {
            type: Boolean,
            default: false,
        },
        singleError: {
            type: Boolean,
            default: false,
        },
        stackedError: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        TextComponent
    },
    computed: {
        computedClass() {
            return this.singleError ? 'single-error' : this.stackedError ? 'stacked-error' : '';
        },
        computedStyle() {
            return this.last ? 'margin-bottom: 0;' : '';
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
    margin-bottom: 1rem;
}

.stacked-error {
    color: red;
    display: block;
    font-size: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
