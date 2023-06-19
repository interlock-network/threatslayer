<template>
    <LineOfText msg="After you create a wallet, click 'Connect Wallet' and enter your wallet address." instruction />
</template>

<script>
import LineOfText from "./subcomponents/LineOfText.vue";

export default {
    name: "CreateInstructions",
    components: {
        LineOfText,
    },
};
</script>

<style></style>
