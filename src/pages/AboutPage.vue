<template>
    <PageBanner msg="About Us">
        <img class="banner-icon" src="/src/assets/images/about.png">
    </PageBanner>
    <LineOfText msg="Stay up to date with our socials:" />
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
import AboutView from "./components/AboutView.vue";
import LineOfText from "./components/subcomponents/LineOfText.vue";
import PageBanner from "./components/subcomponents/PageBanner.vue";

export default {
    name: 'AboutPage',
    components: {
        AboutView,
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
  