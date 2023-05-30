<template>
    <StepView header="Connect Your Wallet" :active="active"
        text="To receive $ILOCK token, connect your Aleph Zero-compatible account. Then choose a username and password.">
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
        active: Boolean,
    },
    watch: {
        // TODO fix this
        active: function (newVal, oldVal) {
            if (!oldVal && newVal) {
                document.getElementById('connectAccount').focus();
            } else if (oldVal && !newVal) {
                document.getElementById('connectAccount').blur();
                document.getElementById('username-input').blur();
                document.getElementById('password-input').blur();
            }
        },
    },
};
</script>

<style></style>
