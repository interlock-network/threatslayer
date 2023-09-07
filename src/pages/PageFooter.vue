<template>
    <div id="footer-container">
        <div id="page-footer">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 30%;"></td>
                    <!-- this column wider to make more space between columns -->
                    <td style="width: 22%;">
                        <a href="https://www.interlock.network/" target="_blank">
                            <img id="logo-white" src="/assets/images/logo_white.svg"></a><br />
                        <div id="left-hand-block">
                            <LineOfText msg="Interlock © 2023 All Rights Reserved" footer />
                            <FooterIcons />
                        </div>
                    </td>
                    <td style="width: 18%; line-height: 1.25rem;">
                        <LineOfText msg="Company" footer bold />
                        <FooterLink msg="Privacy Policy"
                            url="https://github.com/interlock-network/knowledgebase-public/blob/main/what/privacy-policy.md" />
                        <br />
                        <FooterButton msg="Do Not Sell My Personal Information." :clickAction="openAlert" /><br />
                        <FooterLink msg="Terms of Service" />
                    </td>
                    <td>
                        <div style="width: 30%;"></div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import FooterButton from "./components/buttons/FooterButton.vue";
import FooterIcons from "./components/FooterIcons.vue";
import FooterLink from "./components/FooterLink.vue";
import LineOfText from "./components/LineOfText.vue";

export default {
    name: "PageFooter",
    components: {
        FooterButton,
        FooterIcons,
        FooterLink,
        LineOfText
    },
    methods: {
        openAlert() {
            alert('To delete all of your user data, login to your account and click on your username in the sidebar to open your account information. Then click "Delete Account" at the bottom of the page.')
        }
    }
};
</script>

<style>
#footer-container {
    background-color: #0F0818;
    bottom: 0;
    box-shadow: 0px 6px 46px 0px rgba(187, 0, 253, 0.30);
    /* left: 2rem; */
    height: 17%;
    position: absolute;
    width: 100%;
}

#left-hand-block {
    transform: translate(0, -14px);
}

#logo-white {
    opacity: 0.8;
    margin-left: -0.7rem;
    transform: translate(0, -14px) scale(0.75);
}

#page-footer {
    color: gray;
    /* display: flex; */
    font-size: 0.75rem;
    /* padding-left: 2rem; */
    padding-top: 0.6rem;
    position: absolute;
    top: 1rem;
    width: 100%;
}
</style>
