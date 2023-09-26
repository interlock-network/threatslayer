<template>
    <TextComponent :msg="$i18n('dont_have_one')" subinstruction /><button class="login-button"
        @click="selectPage('wallet')">{{ $i18n('create_one') }}</button>
</template>

<script>
import TextComponent from "./TextComponent.vue";

export default {
    name: "CreateWalletLine",
    props: {
        selectPage: { type: Function, required: true },
    },
    components: {
        TextComponent
    }
};
</script>

<style></style>
