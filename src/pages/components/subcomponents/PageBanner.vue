<template>
    <h3 class="page-banner">{{ msg }}</h3>
</template>

<script>
export default {
    name: "PageBanner",
    props: {
        msg: String,
    },
};
</script>

<style>
.page-banner {
    color: #E7E9EA;
    display: block;
    margin-bottom: 0.5rem;
}
</style>
