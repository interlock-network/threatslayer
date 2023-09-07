<template>
    <div id="footer-icons-row">
        <a href="https://discord.com/invite/8M5QfHqzfA" target="_blank">
            <img class="footer-icon" src="/assets/images/discord.png">
        </a>
        <a href="https://interlockweb3.medium.com/" target="_blank">
            <img class="footer-icon" src="/assets/images/medium.png">
        </a>
        <a href="https://www.linkedin.com/company/interlocknetwork" target="_blank">
            <img class="footer-icon" src="/assets/images/linkedin.png">
        </a>
        <a href="https://twitter.com/intent/follow?screen_name=interlockweb3" target="_blank">
            <img class="footer-icon" src="/assets/images/twitter.png">
        </a>
        <a href="https://bit.ly/intlchat" target="_blank">
            <img class="footer-icon" src="/assets/images/telegram.png">
        </a>
    </div>
</template>

<script>
export default {
    name: "FooterIcons",
};
</script>

<style>
#footer-icons-row {
    margin-bottom: -1.5rem;
    margin-left: -1rem;
    margin-top: 0.5rem;
    transform: scale(0.9);
}

.footer-icon {
    margin-left: 0rem;
}
</style>
