<template>
    <PageBanner msg="Frequently Asked Questions">
        <img class="banner-icon" src="../assets/images/faq.png">
    </PageBanner>
    <br />
    <div style="padding-right: 2rem;">
        <TextComponent msg="How does ThreatSlayer protect me?" bold /><br />
        <div>
            <LineOfText>
                <span>ThreatSlayer uses <a href="https://www.interlock.network/" target="_blank">Interlock's</a>
                    threat-detecting AI to instantly block malicious sites and prevent them from stealing your data.</span>
            </LineOfText>
        </div>
        <br />
        <br />
        <TextComponent msg="How does ThreatSlayer reward me with $ILOCK?" bold /><br />
        <br />
        <TextComponent
            msg="ThreatSlayer users have a chance to get rewarded for every URL they visit. The more sites you browse, the more chances you have to get $ILOCK." />
        <br />
        <br />
        <br />
        <TextComponent msg="What data does ThreatSlayer Collect?" bold /><br />
        <br />
        <TextComponent
            msg="We scan your browser's URLs with our threat-detecting AI. We associate URLs with your account so we can reward you with $ILOCK. That's it!" />
        <br />
        <br />
        <br />
        <TextComponent msg="Is ThreatSlayer open source?" bold /><br />
        <div>
            <LineOfText>
                <span>Absolutely. You can look at our <a href="https://github.com/interlock-network/threatslayer"
                        target="_blank">source code on GitbHub</a> and see exactly what it does.</span>
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

<style>
.socials-icon {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>
