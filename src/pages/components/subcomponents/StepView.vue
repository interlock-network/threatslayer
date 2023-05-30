<template>
    <div id="stepview-container" :class="computedClass">
        <StepHeader :msg="header"></StepHeader>
        <StepText :msg="text"></StepText>
        <!-- CTAs etc are passed to the slot below -->
        <slot />
    </div>
</template>

<script>
import StepHeader from "./StepHeader.vue";
import StepText from "./StepText.vue";

export default {
    name: "StepView",
    props: {
        active: Boolean,
        header: String,
        text: String,
    },
    components: {
        StepHeader,
        StepText,
    },
    computed: {
        computedClass() {
            return this.active ? 'active' : 'inactive';
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

.active {
    opacity: 1;
    /* border: 1px solid #d0d4d9; */
    /* border-radius: 0.5rem; */
    /* padding: 1rem; */
}

.inactive {
    opacity: 0.3;
}
</style>
