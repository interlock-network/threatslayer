<template>
    <!-- TODO update translation here -->
    <div v-if="azeroAddress?.length && changeAddressSelected">
        <TextComponent msg="Aleph Zero-compatible Wallet Address" bold /> <br />
        <TextComponent :msg="azeroAddress" mono /><br />
    </div>
    <br />
    <!-- TODO update translation here -->
    <div v-if="pdotAddress?.length && changeAddressSelected">
        <TextComponent msg="Moonbeam-compatible Wallet Address" bold /> <br />
        <TextComponent v-if="pdotAddress?.length && changeAddressSelected" :msg="pdotAddress" mono /><br />
    </div>
</template>

<script>
import TextComponent from "./TextComponent.vue";

export default {
    name: "WalletList",
    props: {
        azeroAddress: String,
        changeAddressSelected: Boolean,
        pdotAddress: String,
    },
    components: {
        TextComponent,
    }
};
</script>

<style></style>
