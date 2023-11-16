<template>
    <TextComponent :msg="$i18n('dont_have_an_account')" subinstruction />
    <button class="login-button" @click="unregister" :tabindex="tabindex">
        {{ $i18n('register') }}
    </button>
</template>

<script>
import { setChromeStorage } from '../../utilities.js';

import TextComponent from "./TextComponent.vue";

export default {
    name: "RegisterLine",
    props: {
        checkState: { type: Function, required: true },
        selectPage: { type: Function, required: true },
        tabindex: { type: Number, default: 10 }
    },
    components: {
        TextComponent
    },
    methods: {
        async unregister() {
            const unregistered = await setChromeStorage({ 'registered': false });

            if (unregistered) {
                // this forces a check to make the "Start Earning" tab appear in the sidebar
                await this.checkState();
            };

            this.selectPage('earn');
        }
    }
};
</script>

<style></style>
