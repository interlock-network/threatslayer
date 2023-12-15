<template>
    <div>
        <span id="coming-soon">{{ $i18n('coming_soon') }}</span>
    </div>
</template>

<script>
export default {
    name: "ComingSoon"
};
</script>

<style>
#coming-soon {
    color: #FEAB2A;
    display: inline-block;
    font-size: 2.25rem;
    font-weight: bold;
    margin-bottom: 1.75rem;
    margin-top: 1.25rem;
}
</style>
