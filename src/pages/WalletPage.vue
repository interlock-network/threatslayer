<template>
    <PageBanner msg="Create Wallet">
        <img class="banner-icon" src="/src/assets/images/wallet.png">
    </PageBanner>
    <TextComponent msg="Already have a wallet?" instruction /><button class="login-button"
        @click="selectPage('earn')">Register</button>
    <br />
    <br />
    <div style="padding-right: 2rem;">
        <TextComponent msg="In order to use ThreatSlayer, you will need to create an Aleph Zero-compatible wallet." />
        <br />
        <br />
        <TextComponent
            msg="Please click 'Create Wallet' to be redirected to a Chrome browser extension to create a SubWallet." />
    </div>
    <br />
    <br />
    <WalletButton tabindex="2" />
</template>
<script>
import PageBanner from "./components/PageBanner.vue";
import TextComponent from "./components/TextComponent.vue";
import WalletButton from "./components/buttons/WalletButton.vue";

export default {
    name: 'AboutPage',
    components: {
        PageBanner,
        TextComponent,
        WalletButton
    },
    props: {
        selectPage: Function,
    }
}
</script>

<style></style>
