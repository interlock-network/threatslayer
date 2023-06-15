<template>
    <StepView header="Options" text="Select from the following:" active>
        <slot />
    </StepView>
</template>

<script>
import StepView from "./subcomponents/StepView.vue";

export default {
    name: "OptionsView",
    components: {
        StepView,
    }
};
</script>

<style></style>
