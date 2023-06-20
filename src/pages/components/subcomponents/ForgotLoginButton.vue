<template>
    <button class="bail-button" @click="action">{{ msg }}</button>
</template>

<script>
export default {
    name: "ForgotLoginButton",
    props: {
        action: Boolean,
        msg: String,
    },
};
</script>

<style>
.bail-button {
    border: none;
    background: #060708;
    color: gray;
    pointer-events: initial;
    padding-top: 1rem;
    width: 50%;
}

.bail-button:focus {
    border: 3px solid #d0d4d9;
}
</style>
