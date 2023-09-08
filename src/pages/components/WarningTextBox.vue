<template>
    <div class="warning-container">
        <TextComponent :msg="msg" />
        <slot />
    </div>
</template>

<script>
import TextComponent from "./TextComponent.vue";

export default {
    name: "WarningTextBox",
    props: {
        msg: String
    },
    components: {
        TextComponent
    },
};
</script>

<style></style>
