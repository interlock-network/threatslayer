<template>
    <TextComponent :msg="$i18n('dont_have_one')" subinstruction />
    <button class="login-button" @click="selectPage('wallet')" :tabindex="tabindex">
        {{ $i18n('create_one') }}
    </button>
</template>

<script>
import TextComponent from "./TextComponent.vue";

export default {
    name: "CreateWalletLine",
    props: {
        selectPage: { type: Function, required: true },
        tabindex: { type: Number, default: 24 }
    },
    components: {
        TextComponent
    }
};
</script>

<style></style>
