<template>
    <StepView header="Connect Your Wallet" text="To receive $ILOCK token, connect your Aleph Zero-compatible wallet.">
        <slot />
    </StepView>
</template>

<script>
import StepView from "./subcomponents/StepView.vue";

export default {
    name: "CreateAccountView",
    components: {
        StepView,
    }
};
</script>

<style></style>
