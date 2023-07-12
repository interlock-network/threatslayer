<template>
    <button :id="id" class='submit-button' @click="openTab()">
        Create a wallet
    </button>
</template>

<script>
export default {
    name: "WalletButton",
    methods: {
        openTab() {
            window.open('https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn')
        },
    },
};
</script>
<style></style>