<template>
    <PageBanner msg="About ThreatSlayer">
        <img class="banner-icon" src="/src/assets/images/about.png">
    </PageBanner>
    <br />
    <TextComponent msg="Why Choose ThreatSlayer?" bold />
    <br />
    <br />
    <div style="padding-right: 2rem;">
        <TextComponent
            msg="In a world where cyber threats are becoming increasingly sophisticated and common, it's crucial to have a solution that not only reacts swiftly but also proactively prevents threats." />
        <br />
        <br />
        <TextComponent
            msg="ThreatSlayer is not just another cybersecurity product, it's a comprehensive security companion that operates in real-time to detect and neutralize threats before they can do any harm." />
        <br />
        <br />
        <TextComponent
            msg=" Easy to install and armed with the ability to protect you from threats in both web2 and web3 space, ThreatSlayer is the future of browser security. It runs in the background, protecting you from malicious assets or dangerous pages without interrupting your workflow." />
        <br />
        <br />
        <TextComponent
            msg="Combine this with rewards for users that share anonymized security data, and you have a win-win solution for staying secure online while contributing to the wider internet safety ecosystem." />
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

<style>
.socials-icon {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>
