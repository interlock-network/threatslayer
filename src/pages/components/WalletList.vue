<template>
    <div v-if="azeroAddress?.length && !changeAddressSelected">
        <TextComponent :msg="$i18n('wallet_address')" bold /> <br />
        <TextComponent :msg="azeroAddress" wallet /><br />
        <br />
    </div>
</template>

<script>
import TextComponent from "./TextComponent.vue";

export default {
    name: "WalletList",
    props: {
        azeroAddress: { type: String, default: '' },
        changeAddressSelected: { type: Boolean, required: true }
    },
    components: {
        TextComponent
    }
};
</script>

<style></style>
