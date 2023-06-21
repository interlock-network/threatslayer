<template>
    <button class="empty-button" @click="action">
        {{ msg }}
        <slot />
    </button>
</template>

<script>
export default {
    name: "EmptyButton",
    props: {
        action: Function,
        msg: String,
    }
};
</script>

<style>
.empty-button {
    border: none;
    background: #060708;
    color: gray;
    pointer-events: initial;
    padding-top: 1rem;
    padding-bottom: 0.8rem;
    /* width: 50%; */
}

.empty-button:focus {
    border: 3px solid #d0d4d9;
}
</style>
