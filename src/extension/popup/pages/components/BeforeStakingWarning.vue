<template>
    <div class="warning-before-staking">
        <TextComponent :msg="msg" />
        <slot />
    </div>
</template>

<script>
import TextComponent from "./TextComponent.vue";

export default {
    name: "BeforeStakingWarning",
    props: {
        msg: String
    },
    components: {
        TextComponent
    },
};
</script>

<style>
.warning-before-staking {
    border: yellow solid 1px;
    border-radius: 0.5rem;
    font-size: 1rem;
    padding: 0.5rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
    width: 380px;
}
</style>
