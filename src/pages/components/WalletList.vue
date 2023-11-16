<template>
    <div v-if="azeroAddress?.length && !changeAddressSelected">
        <TextComponent :msg="$i18n('wallet_address')" bold /> <br />
        <button id="clear-wallet-button"><img @click="deleteWalletSelected(true)" class="sidebar-icon"
                src="/src/assets/images/x-icon.png"></button>
        <TextComponent :msg="azeroAddress" wallet /><br /><br />
    </div>
</template>

<script>
import TextComponent from "./TextComponent.vue";

export default {
    name: "WalletList",
    components: {
        TextComponent
    },
    props: {
        azeroAddress: { type: String, default: '' },
        changeAddressSelected: { type: Boolean, required: true },
        deleteWalletSelected: { type: Function, required: true }
    }
};
</script>

<style>
#clear-wallet-button {
    background: inherit;
    border: none;
    padding-bottom: 3px;
    padding-left: 5px;
}
</style>
