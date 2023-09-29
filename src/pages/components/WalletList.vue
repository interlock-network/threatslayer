<template>
    <div v-if="azeroAddress?.length && !changeAddressSelected">
        <TextComponent :msg="$i18n('address_aleph')" bold /> <br />
        <TextComponent :msg="azeroAddress" mono /><br />
        <br />
    </div>
    <div v-if="pdotAddress?.length && !changeAddressSelected">
        <TextComponent :msg="$i18n('address_pdot')" bold /> <br />
        <TextComponent :msg="pdotAddress" mono /><br />
        <br />
    </div>
</template>

<script>
import TextComponent from "./TextComponent.vue";

export default {
    name: "WalletList",
    props: {
        azeroAddress: { type: String, default: '' },
        changeAddressSelected: { type: Boolean, required: true },
        pdotAddress: { type: String, default: '' }
    },
    components: {
        TextComponent
    }
};
</script>

<style></style>
