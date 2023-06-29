<template>
    <div id="page-footer">
        <table style="width: 100%;">
            <tr>
                <td style="min-width: 10%;"></td>
                <td style="width: 40%;">
                    <img id="logo-white" src="/src/assets/images/logo_white.svg"><br />
                    <div id="left-hand-block">
                        <LineOfText msg="Interlock © 2023 All Rights Reserved" footer />
                    </div>
                </td>
                <td style="width: 40%; line-height: 1.25rem;">
                    <LineOfText msg="Company" footer bold />
                    <FooterLink msg="Privacy Policy" /><br />
                    <FooterLink msg="Do Not Sell My Personal Information." /><br />
                    <FooterLink msg="Terms of Service" />
                </td>
                <td>
                    <div style="width: 10%;"></div>
                </td>
            </tr>
        </table>

    </div>
</template>

<script>
import FooterLink from "./subcomponents/FooterLink.vue";
import LineOfText from "./subcomponents/LineOfText.vue";

export default {
    name: "PageFooter",
    components: {
        FooterLink,
        LineOfText
    }
};
</script>

<style>
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
    display: flex;
    font-size: 0.75rem;
    padding-left: 2rem;
    position: absolute;
    top: 1rem;
    width: 100%;
}
</style>
