<template>
    <div v-if="walletAddress?.length && !changeAddressSelected">
        <TextComponent :msg="$i18n('wallet_address')" bold /> <br />
        <button id="clear-wallet-button"><img @click="deleteWalletSelected(true)" class="sidebar-icon"
                src="/src/assets/images/x-icon.png"></button>
        <TextComponent :msg="walletAddress" wallet /><br /><br />
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
        changeAddressSelected: { type: Boolean, required: true },
        deleteWalletSelected: { type: Function, required: true },
        walletAddress: { type: String, default: '' }
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
