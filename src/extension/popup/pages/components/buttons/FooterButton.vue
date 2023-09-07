<template>
    <span style="margin-top: 0.5rem">
        <button class="invisible-button" @click="clickAction">{{ msg }}</button> <span id="divider" v-if="divider">|</span>
    </span>
</template>

<script>
export default {
    name: "FooterButton",
    props: {
        divider: {
            type: Boolean,
            default: false,
        },
        msg: String,
        clickAction: Function
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

.invisible-button {
    background-color: #0F0818;
    border: none;
    color: gray;
    font-size: 0.75rem;
    padding: 0;
}
</style>
