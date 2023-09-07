<template>
    <button id="clear-url-button"><img @click="clearUrl" class="sidebar-icon" src="/assets/images/x-icon.png"></button>
</template>

<script>
import axios from "axios";
import { baseUrl, getChromeStorage, setChromeStorage } from '/utilities.js';

export default {
    name: "ClearAllowlistedURLButton",
    props: {
        apiKey: String,
        callback: Function,
        url: String
    },
    methods: {
        async clearUrl() {
            const { apiKey, url } = this;
            console.log('apiKey', apiKey);
            console.log('url', url);
            // TODO add allowlist code here
            // TODO update URL
            const response = await axios.post(`${baseUrl}/site-forget`, { key: apiKey, url })
                .then(res => res)
                .catch(err => err);

            console.log('response', response);

            // if cleared URL is the same url as the one to stake, clear it
            const urlToStake = await getChromeStorage('urlToStake');

            if (urlToStake === url) {
                setChromeStorage({ urlToStake: null });
            }

            const allowlist = await getChromeStorage('allowlist');

            if (!allowlist) {
                return;
            }

            const updatedAllowlist = allowlist.filter(allowlistedUrl => allowlistedUrl !== url);
            setChromeStorage({ allowlist: updatedAllowlist });

            this.callback();
        },
    }
};
</script>

<style>
.link-button {
    background: #060708;
    border: 1px solid #9336e5;
    color: #FFFFFF;
    font-size: 0.1rem;
    height: 100%;
    margin: 0px;
    padding: 0.5rem 0.5rem;
    pointer-events: initial;
    width: 100%;
}
</style>
