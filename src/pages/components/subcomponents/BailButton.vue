<template>
    <button class="bail-button" @click="bailOut">
        Maybe later
    </button>
</template>

<script>
export default {
    name: "BailButton",
    methods: {
        bailOut() {
            window.open('https://interlock.network');
        }
    }
};
</script>

<style>
.bail-button {
    border: none;
    background: #060708;
    color: gray;
    pointer-events: initial;
    /* font-size: 1.25rem; */
    padding-top: 1rem;
    width: 50%;
}

.bail-button:focus {
    border: 3px solid #d0d4d9;
}
</style>
