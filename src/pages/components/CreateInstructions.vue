<template>
    <div class="line-of-text">
        Please save this mnemonic seed phrase
        <span class="help-tip"><span class="help-tip">
                This mnemonic seed phrase is used to generate a cryptographic signature to prove that you own the account.
                The seed itself is never sent to Interlock.
            </span></span>
        somewhere secure. It cannot be retrieved. If you lose it, you will lose all access to the tokens in this account!
    </div>
    <slot />
</template>

<script>
import LineOfText from "./subcomponents/LineOfText.vue";

export default {
    name: "CreateInstructions",
    components: {
        LineOfText,
    },
    props: {
        active: Boolean
    },
};
</script>

<style>
.line-of-text {
    color: #D0D4D9;
    display: block;
    opacity: 85%;
    margin-bottom: 0.5rem;
    width: 100%;
}
</style>
