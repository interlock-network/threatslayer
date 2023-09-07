<template>
    <button :id="id" class="link-button" @click="openTab()">
        <div>
            Subwallet <img class="link-button-icon" src="/assets/images/external_link.png">
        </div>
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

<style>
.link-button {
    background: #060708;
    border: 1px solid #9336e5;
    color: #FFFFFF;
    font-size: 0.1rem;
    height: 100%;
    margin: 0px;
    padding: 0.5rem 0.5rem;
    pointer-events: initial;
    width: 100%;
}
</style>
