<template>
    <h1 id="page-banner">About Us</h1>
    <AboutView />
    <LineOfText msg="Stay up to date with our socials:" />
    <!-- <a href="https://bit.ly/ilocktwitter" target="_blank">
        <img class="social-icon" src=".../assets/images/social_twitter.png">
    </a>
    <a href="https://bit.ly/intldiscord" target="_blank">
        <img class="social-icon" src=".../assets/images/social_discord.png">
    </a>
    <a href="https://bit.ly/intlchat" target="_blank">
        <img class="social-icon" src=".../assets/images/social_telegram.png">
    </a> -->
</template>
<script>
import AboutView from "./components/AboutView.vue";
import LineOfText from "./components/subcomponents/LineOfText.vue";

export default {
    name: 'AboutPage',
    components: {
        AboutView,
        LineOfText
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
  
<style></style>
  