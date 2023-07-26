<template>
    <PageBanner msg="Create Wallet">
        <img class="banner-icon" src="/src/assets/images/wallet.png">
    </PageBanner>
    <LineOfText instruction>
        <span>Already have a wallet?<button class="login-button" @click="selectPage('earn')">Register</button></span>
    </LineOfText>
    <br />
    <br />
    <LineOfText msg="In order to use ThreatSlayer, you will need to create an Aleph Zero-compatible wallet." />
    <br />
    <LineOfText msg="Please click 'Create Wallet' to be redirected to a Chrome browser extension to create a SubWallet." />
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
    props: {
        selectPage: Function,
    }
}
</script>

<style></style>
