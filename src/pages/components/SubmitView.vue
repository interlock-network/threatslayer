<template>
    <StepView header="Complete Registration" text="Click Submit to start earning today!" :active="active">
        <slot />
    </StepView>
</template>

<script>
import StepView from "./subcomponents/StepView.vue";

export default {
    name: "ConnectWalletView",
    components: {
        StepView,
    },
    props: {
        active: Boolean
    },
};
</script>

<style></style>
