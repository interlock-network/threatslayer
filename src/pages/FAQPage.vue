<template>
    <PageBanner msg="Frequently Asked Questions">
        <img class="banner-icon" src="/src/assets/images/faq.png">
    </PageBanner>
    <br />
    <LineOfText msg="What data does ThreatSlayer Collect?" bold />
    <LineOfText
        msg="ThreatSlayer collects no personal information. The only thing sent to our servers is a URL, so we can scan it with our threat-detecting AI. These URLs are anonymized and there is no way to connect any user with any URL." />
    <br />
    <br />
    <LineOfText msg="Does it work on mobile?" bold />
    <LineOfText
        msg="Not yet! Mobile browsers are designed to make it difficult for independent companies to add extensions to them." />
    <br />
    <br />
    <LineOfText msg="Which browsers does ThreatSlayer work on?" bold />
    <LineOfText msg="Chrome, Brave, Edge, and other Chrome-compatible browsers. FireFox coming soon!" />
    <br />
    <br />
    <LineOfText msg="Is ThreatSlayer open source?" bold />
    <LineOfText>
        <span>Absolutely. You can look at our <a href="https://github.com/interlock-network/threatslayer"
                target="_blank">source
                code on GitbHub</a> and see exactly what it does.</span>
    </LineOfText>
</template>
<script>
import LineOfText from "./components/subcomponents/LineOfText.vue";
import PageBanner from "./components/subcomponents/PageBanner.vue";

export default {
    name: 'FAQPage',
    components: {
        LineOfText,
        PageBanner
    },
    data() {
        return {

        };
    },
    mounted() {

    },
    computed: {

    },
    methods: {}
}
</script>
  
<style>
.socials-icon {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>
  