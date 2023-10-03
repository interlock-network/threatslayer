<template>
    <PageBanner :msg="$i18n('about_threat_slayer')">
        <img class="banner-icon" src="/src/assets/images/about.png">
    </PageBanner>
    <br />
    <TextComponent :msg="$i18n('why_choose_threat_slayer')" bold />
    <br />
    <br />
    <div class="generic-text-container">
        <TextComponent :msg="$i18n('about_us_paragraph_1')" />
        <br />
        <br />
        <TextComponent :msg="$i18n('about_us_paragraph_2')" />
        <br />
        <br />
        <TextComponent :msg="$i18n('about_us_paragraph_3')" />
        <br />
        <br />
        <TextComponent :msg="$i18n('about_us_paragraph_4')" />
    </div>
</template>

<script>
import PageBanner from "./components/PageBanner.vue";
import TextComponent from "./components/TextComponent.vue";

export default {
    name: 'AboutPage',
    components: {
        TextComponent,
        PageBanner
    }
}
</script>

<style></style>
