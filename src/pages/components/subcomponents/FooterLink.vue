<template>
    <a :href="url" target="_blank" id='footer-link'>{{ msg }}</a> <span id="divider" v-if="divider">|
    </span>
</template>

<script>
export default {
    name: "FooterLink",
    props: {
        msg: String,
        divider: {
            type: Boolean,
            default: false,
        },
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
    cursor: pointer;
    pointer-events: initial;
}
</style>
