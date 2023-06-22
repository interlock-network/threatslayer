<template>
    <StepView header="Enter or retrieve info" text="Login to your account, or change your password." :active="active">
        <slot />
    </StepView>
</template>

<script>
import StepView from "./subcomponents/StepView.vue";

export default {
    name: "LoginView",
    components: {
        StepView,
    },
    props: {
        active: Boolean,
    },
};
</script>

<style></style>
