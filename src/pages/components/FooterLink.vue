<template>
    <span style="margin-top: 0.5rem">
        <a :href="url" target="_blank" id='footer-link'>{{ msg }}</a> <span id="divider" v-if="divider">|</span>
    </span>
</template>

<script>
export default {
    name: "FooterLink",
    props: {
        divider: {
            type: Boolean,
            default: false,
        },
        msg: { type: String, default: '' },
        url: {
            type: String,
            default: 'https://interlock.network',
        },
    },
};
</script>

<style>
#divider {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
}

#footer-link {
    /* cursor: pointer; */
    pointer-events: initial;
    text-decoration: none;
}
</style>
