<template>
    <PageBanner :msg="$i18n('frequently_asked_questions')">
        <img class="banner-icon" src="/src/assets/images/faq.png">
    </PageBanner>
    <br />
    <div style="padding-right: 2rem;">
        <TextComponent :msg="$i18n('how_does_threat_slayer_protect_me')" bold /><br />
        <div>
            <LineOfText>
                <span>ThreatSlayer uses <a href="https://www.interlock.network/" target="_blank">Interlock's</a>
                    threat-detecting AI to instantly block malicious sites and prevent them from stealing your data.</span>
            </LineOfText>
        </div>
        <br />
        <br />
        <TextComponent :msg="$i18n('how_does_threat_slayer_reward_me')" bold /><br />
        <br />
        <TextComponent :msg="$i18n('how_does_threat_slayer_reward_me_answer')" />
        <br />
        <br />
        <br />
        <TextComponent :msg="$i18n('what_does_threat_slayer_collect')" bold /><br />
        <br />
        <TextComponent :msg="$i18n('what_does_threat_slayer_collect_answer')" />
        <br />
        <br />
        <br />
        <TextComponent :msg="$i18n('is_threat_slayer_open_source')" bold /><br />
        <div>
            <LineOfText>
                <span>Absolutely. You can look at our <a href="https://github.com/interlock-network/threatslayer"
                        target="_blank">source code on GitHub</a> and see exactly what it does.</span>
            </LineOfText>
        </div>
    </div>
    <br />
    <br />
</template>

<script>
import LineOfText from "./components/LineOfText.vue";
import PageBanner from "./components/PageBanner.vue";
import TextComponent from "./components/TextComponent.vue";

export default {
    name: 'FAQPage',
    components: {
        LineOfText,
        PageBanner,
        TextComponent
    }
}
</script>

<style></style>
