<template>
    <PageBanner msg="About ThreatSlayer">
        <img class="banner-icon" src="/src/assets/images/about.png">
    </PageBanner>
    <br />
    <LineOfText msg="Why Choose ThreatSlayer?" bold />
    <LineOfText
        msg="In a world where cyber threats are becoming increasingly sophisticated and common, it's crucial to have a solution that not only reacts swiftly but also proactively prevents threats." />
    <LineOfText
        msg="ThreatSlayer is not just another cybersecurity product, it's a comprehensive security companion that operates in real-time to detect and neutralize threats before they can do any harm." />
    <LineOfText
        msg=" Easy to install and armed with the ability to protect you from threats in both web2 and web3 space, ThreatSlayer is the future of browser security. It runs in the background, protecting you from malicious assets or dangerous pages without interrupting your workflow." />
    <LineOfText
        msg="Combine this with rewards for users that share anonymized security data, and you have a win-win solution for staying secure online while contributing to the wider internet safety ecosystem." />
    <div style="pointer-events: initial;">
        <a href="https://bit.ly/ilocktwitter" target="_blank" class="socials-icon" style="padding-left: -1rem;">
            <img class="social-icon" src="/src/assets/images/social_twitter.png">
        </a>
        <a href="https://bit.ly/intldiscord" target="_blank" class="socials-icon">
            <img class="social-icon" src="/src/assets/images/social_discord.png">
        </a>
        <a href="https://bit.ly/intlchat" target="_blank" class="socials-icon">
            <img class="social-icon" src="/src/assets/images/social_telegram.png">
        </a>
    </div>
</template>
<script>
import LineOfText from "./components/subcomponents/LineOfText.vue";
import PageBanner from "./components/subcomponents/PageBanner.vue";

export default {
    name: 'AboutPage',
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
  