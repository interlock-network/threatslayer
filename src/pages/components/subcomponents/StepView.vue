<template>
    <div id="stepview-container" :class="computedClass">
        <StepHeader :msg="header" />
        <LineOfText :msg="text" />
        <!-- CTAs etc are passed to the slot below -->
        <slot />
    </div>
</template>

<script>
import LineOfText from "./LineOfText.vue";
import StepHeader from "./StepHeader.vue";

export default {
    name: "StepView",
    props: {
        active: Boolean,
        header: String,
        text: String,
    },
    components: {
        LineOfText,
        StepHeader,
    },
    computed: {
        computedClass() {
            return this.active ? 'step-active' : 'step-inactive';
        }
    }
};
</script>

<style>
#stepview-container {
    display: block;
    margin-top: 2rem;
    width: 450px;
}

.step-active {
    opacity: 1;
    /* border: 1px solid #d0d4d9; */
    /* border-radius: 0.5rem; */
    /* padding: 1rem; */
}

.step-inactive {
    opacity: 0.3;
}
</style>
