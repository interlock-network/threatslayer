<template>
    <button id="clear-url-button"><img @click="clearUrl" class="sidebar-icon" src="/src/assets/images/x-icon.png"></button>
</template>

<script>
import { getChromeStorage, setChromeStorage } from '../../../utilities.js';

export default {
    name: "ClearAllowlistedURLButton",
    props: {
        apiKey: { type: String, default: '' },
        callback: { type: Function, required: true },
        url: { type: String, default: '' }
    },
    methods: {
        async clearUrl() {
            const urlToStake = await getChromeStorage('urlToStake');

            if (urlToStake === this.url) {
                setChromeStorage({ urlToStake: null });
            }

            this.callback(this.url);
        }
    }
};
</script>

<style>
#clear-url-button {
    background: inherit;
    border: none;
    padding-bottom: 3px;
    padding-left: 5px;
}
</style>
