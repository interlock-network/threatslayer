<template>
    <LineOfText msg="Paste the address for your Aleph Zero-compatible wallet." instruction />
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
