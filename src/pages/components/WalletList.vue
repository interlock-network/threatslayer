<template>
    <!-- TODO update translation here -->
    <div v-if="azeroAddress?.length && !changeAddressSelected">
        <TextComponent msg="Aleph Zero-compatible Wallet Address" bold /> <br />
        <TextComponent :msg="azeroAddress" mono /><br />
        <br />
    </div>
    <!-- TODO update translation here -->
    <div v-if="pdotAddress?.length && !changeAddressSelected">
        <TextComponent msg="Moonbeam Wallet Address" bold /> <br />
        <TextComponent :msg="pdotAddress" mono /><br />
        <br />
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
