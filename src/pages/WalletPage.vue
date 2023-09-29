<template>
    <PageBanner :msg="$i18n('create_wallet')">
        <img class="banner-icon" src="/src/assets/images/wallet.png">
    </PageBanner>
    <TextComponent :msg="$i18n('already_have_a_wallet')" subinstruction />
    <button class="login-button" @click="selectPage('earn')">{{ $i18n('register') }}</button>
    <br />
    <br />
    <div style="padding-right: 2rem;">
        <TextComponent :msg="$i18n('must_create_azero_wallet')" />
        <br />
        <br />
        <TextComponent :msg="$i18n('click_to_create_wallet')" />
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
        selectPage: { type: Function, required: true }
    }
}
</script>

<style></style>
