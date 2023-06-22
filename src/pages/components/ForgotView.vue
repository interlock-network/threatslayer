<template>
    <StepView header="Forgot password" text="Enter your email to receive a link to change your password." :active="active">
        <slot />
    </StepView>
</template>

<script>
import StepView from "./subcomponents/StepView.vue";

export default {
    name: "ForgotView",
    components: {
        StepView,
    },
    props: {
        active: Boolean,
    },
};
</script>

<style></style>
