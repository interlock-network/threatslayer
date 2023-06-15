<template>
    <div class="interrupted-line">
        Copy and paste the 12 or 22 word mnemonic seed phrase
        <span class="help-tip"><span class="help-tip">
                This mnemonic seed phrase is used to generate a cryptographic signature to prove that you own the account.
                The seed itself is never sent to Interlock.
            </span></span>
        for your Aleph Zero blockchain address. If you do not have one, click "Create New Account".
    </div>
    <slot />
</template>

<script>
import LineOfText from "./subcomponents/LineOfText.vue";

export default {
    name: "ConnectInstructions",
    components: {
        LineOfText,
    },
    props: {
        active: Boolean
    },
};
</script>

<style>
.interrupted-line {
    color: #D0D4D9;
    display: block;
    opacity: 85%;
    margin-bottom: 0.5rem;
    width: 100%;
}
</style>
