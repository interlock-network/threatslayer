<template>
    <button :id="id" class='submit-button' @click="openTab()">
        {{ $i18n('create_wallet') }}
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