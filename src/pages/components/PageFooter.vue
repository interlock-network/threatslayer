<template>
    <div id="page-footer">
        <FooterLink msg="Privacy Policy" divider />
        <FooterLink msg="Do Not Sell My Personal Information." divider />
        <FooterLink msg="Terms of Service" divider />
        <LineOfText msg="Interlock (c) 2023 All Rights Reserved" footer />
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
#page-footer {
    color: gray;
    display: flex;
    font-size: 0.75rem;
    /* justify-content: center; */
    width: 100%;
}
</style>
