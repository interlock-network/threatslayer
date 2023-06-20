<template>
    <div id="bail-link-container">
        <EmptyButton :msg="msg" :action="openTab" />
    </div>
</template>

<script>

import EmptyButton from "./EmptyButton.vue";

export default {
    name: "BailLink",
    components: {
        EmptyButton,
    },
    props: {
        msg: String,
    },
    methods: {
        openTab() {
            window.open('https://interlock.network')
        },
    },
};
</script>

<style>
#bail-link-container {
    display: block;
    float: right;
}
</style>
