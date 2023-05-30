<template>
    <p class="line-of-text" :style="style">{{ msg }}</p>
</template>

<script>
export default {
    name: "StepText",
    props: {
        msg: String,
    },
};
</script>

<style>
.line-of-text {
    color: #D0D4D9;
    opacity: 85%;
    margin-bottom: 0.5rem;
    margin-right: 2rem;
    margin-top: 0.25rem;
}
</style>
