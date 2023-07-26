<template>
    <PageBanner msg="Frequently Asked Questions">
        <img class="banner-icon" src="/src/assets/images/faq.png">
    </PageBanner>
    <br />
    <LineOfText msg="What data does ThreatSlayer Collect?" bold />
    <LineOfText
        msg="URLs are sent to our classifier so we can scan them with our threat-detecting AI. If you are registered, we associate URLs to your account to reward you for the URLs you get scanned." />
    <br />
    <LineOfText msg="Is ThreatSlayer open source?" bold />
    <div>
        <LineOfText>
            <span>Absolutely. You can look at our <a href="https://github.com/interlock-network/threatslayer"
                    target="_blank">source
                    code on GitbHub</a> and see exactly what it does.</span>
        </LineOfText>
    </div>
</template>
<script>
import LineOfText from "./components/LineOfText.vue";
import PageBanner from "./components/PageBanner.vue";

export default {
    name: 'FAQPage',
    components: {
        LineOfText,
        PageBanner
    }
}
</script>

<style>
.socials-icon {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>
