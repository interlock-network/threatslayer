<template>
    <PageBanner :msg="$i18n('create_wallet')">
        <img class="banner-icon" src="/src/assets/images/wallet.png">
    </PageBanner>
    <div class="generic-text-container">
        <ComingSoon />
        <TextComponent :msg="$i18n('must_create_wallet')" /><br />
        <br />
        <TextComponent :msg="$i18n('click_to_create_wallet')" />
    </div>
    <br />
    <br />
    <WalletButton tabindex="2" />
</template>

<script>
import ComingSoon from "./components/ComingSoon.vue";
import PageBanner from "./components/PageBanner.vue";
import TextComponent from "./components/TextComponent.vue";
import WalletButton from "./components/buttons/WalletButton.vue";

export default {
    name: 'AboutPage',
    components: {
        ComingSoon,
        PageBanner,
        TextComponent,
        WalletButton
    },
    props: {
        selectPage: { type: Function, required: true }
    }
}
</script>

<style></style>
