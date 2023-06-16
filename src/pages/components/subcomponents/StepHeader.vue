<template>
    <h2 id="headline">{{ msg }}</h2>
</template>

<script>
export default {
    name: "StepHeader",
    props: {
        msg: String,
    },
};
</script>

<style>
#headline {
    color: #E7E9EA;
    display: block;
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
    margin-top: 0rem;
    width: 100%;
}
</style>
