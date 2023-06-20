<template>
    <StepView header="Get username or change password" text="Enter your email to get your username or change your password."
        :active="active">
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
