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

#delete-address-button {
    background-color: #0F0818;
    border: none;
    color: #9000CB;
    font-size: 1rem;
    height: 2rem;
    margin-bottom: 2rem;
    padding: 0.5rem 0.75rem;
    pointer-events: initial;
    width: 400px;
}

#delete-address-button:hover {
    background-color: #4A0064;
}
</style>
