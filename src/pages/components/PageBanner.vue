<template>
    <h3 class="page-banner">
        <slot />{{ msg }}
    </h3>
</template>

<script>
export default {
    name: "PageBanner",
    props: {
        msg: { type: String, default: '' }
    }
};
</script>

<style>
.page-banner {
    color: #E7E9EA;
    display: block;
    margin-bottom: 0.5rem;
}
</style>
