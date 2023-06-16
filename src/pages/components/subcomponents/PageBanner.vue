<template>
    <h1 class="page-banner">{{ msg }}</h1>
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
    font-size: 2rem;
    width: 100%;
}
</style>
