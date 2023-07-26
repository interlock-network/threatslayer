<template>
    <button class="forgot-login-button" @click="action">{{ msg }}</button>
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
.forgot-login-button {
    border: none;
    background: #060708;
    color: gray;
    pointer-events: initial;
    padding-top: 1rem;
    width: 50%;
}

.forgot-login-button:focus {
    border: 3px solid #d0d4d9;
}
</style>
