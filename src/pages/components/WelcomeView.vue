<template>
    <StepView header="Sign up for ThreatSlayer"
        text="ThreatSlayer will protect you from phishing attacks and reward you for browsing." :active="active">
        <slot />
    </StepView>
</template>

<script>
import StepView from "./subcomponents/StepView.vue";

export default {
    name: "WelcomeView",
    components: {
        StepView,
    },
    props: {
        active: Boolean,
    },
};
</script>

<style></style>
