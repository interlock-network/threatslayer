<template>
    <TextComponent :msg="$i18n('already_have_one')" subinstruction /><button class="login-button"
        @click="selectPage('login')">{{ $i18n('login') }}</button><br />
</template>

<script>
import TextComponent from "./TextComponent.vue";

export default {
    name: "LoginLine",
    props: {
        selectPage: Function,
    },
    components: {
        TextComponent
    }
};
</script>

<style></style>
