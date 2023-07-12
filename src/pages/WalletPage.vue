<template>
    <PageBanner msg="Create a Wallet">
        <img class="banner-icon" src="/src/assets/images/wallet.png">
    </PageBanner>
    <LineOfText msg="In order to use ThreatSlayer, you will need to create an Aleph Zero compatible wallet." />
    <LineOfText msg="Please click the link to be redirected to a Chrome Web Page extension to create a SubWallet." />
    <br />
    <br />
    <WalletButton tabindex="2" />
</template>
<script>
import LineOfText from "./components/subcomponents/LineOfText.vue";
import PageBanner from "./components/subcomponents/PageBanner.vue";
import WalletButton from "./components/subcomponents/WalletButton.vue";

export default {
    name: 'AboutPage',
    components: {
        LineOfText,
        PageBanner,
        WalletButton
    },
    data() {
        return {};
    },
    methods: {}
}
</script>
  
<style></style>
  