<template>
    <div id="warning-banner">
        <table id="warning-banner-table-parent">
            <tr>
                <td>
                    <button id="dismiss-button"><img @click="dismissWarningBanner" class="sidebar-icon"
                            src="/src/assets/images/x-icon.png"></button>
                    <span style="color:#FEAB2A">{{ $i18n('warning_possible_malicious_url_detected') }}</span>
                </td>
                <td>
                    <table id="malicious-url-warning-table">
                        <tr v-for="maliciousUrlObject in maliciousUrlObjects" style="margin-bottom: 1rem;">
                            <td id="malicious-url-column">
                                <TextComponent :msg="maliciousUrlObject.url" mono />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import TextComponent from "./components/TextComponent.vue";

export default {
    name: "MaliciousWarningBanner",
    components: {
        TextComponent
    },
    props: {
        checkState: { type: Function, required: true },
        maliciousUrlObjects: { type: Array, required: true }
    },
    methods: {
        async dismissWarningBanner() {
            chrome.storage.local
                .set({ maliciousUrlObjects: [] })
                .then(() => {
                    console.log('Cleared queue of malicious URL objects.');
                });

            this.checkState();
        }
    }
};
</script>

<style>
#dismiss-button {
    background: inherit;
    border: none;
    cursor: default;
    pointer-events: initial;
}

.malicious-url {
    color: white;
}

#malicious-url-warning-table {
    text-align: left;
}

#malicious-url-column {
    text-align: left;
    transform: scale(0.75);
    word-wrap: break-word;
}

#warning-banner {
    background-color: inherit;
    border-bottom: 0.35rem solid red;
    padding-bottom: 0.25rem;
    width: 100%;
}

#warning-banner-table-parent {
    margin-left: auto;
    margin-right: auto;
}
</style>
