<template>
    <StepView header="Web3 Security for Everyone"
        text="Over $7 billion worth of crypto was stolen in 2021 alone. ThreatSlayer protects your crypto assets by blocking phishing sites from taking your passwords or seed phrases. In the future, ThreatSlayer will be powered by $ILOCK, our token coming in 2023."
        active>
        <slot />
    </StepView>
</template>

<script>
import StepView from "./subcomponents/StepView.vue";

export default {
    name: "AboutView",
    components: {
        StepView,
    }
};
</script>

<style></style>
