<template>
    <PageBanner msg="Extension Options">
        <img class="banner-icon" src="/src/assets/images/settings.png">
    </PageBanner>
    <br />
    <TextComponent msg="Select from the following:" bold />
    <div class="options-container">
        <input type="checkbox" id="beta-ai-checkbox" @click="betaClassifier($event)" tabindex="2" />
        <label for="beta-ai-checkboxbox">
            Enable beta AI Threat Detection (developers only)
        </label>
    </div>
    <div class="options-container">
        <input type="checkbox" id="dev-mode-checkbox" @click="devMode($event)" tabindex="4" />
        <label for="dev-mode-checkbox">
            Dev mode (Interlock engineers only)
        </label>
    </div>
</template>
<script>
import PageBanner from "./components/PageBanner.vue";
import TextComponent from "./components/TextComponent.vue";

import { getChromeStorage, setChromeStorage } from '../utilities.js';

export default {
    name: 'OptionsPage',
    components: {
        TextComponent,
        PageBanner
    },
    async mounted() {
        const betaAICheckbox = document.getElementById('beta-ai-checkbox');
        const devModeCheckbox = document.getElementById('dev-mode-checkbox');

        betaAICheckbox.focus();

        // Load the user's preference for beta AI Threat Detection from storage
        const betaAISelected = await getChromeStorage("betaAISelected");
        betaAICheckbox.checked = betaAISelected;

        // same for devmode
        const devMode = await getChromeStorage("devMode");
        devModeCheckbox.checked = devMode;
    },
    methods: {
        betaClassifier(event) {
            const betaAISelected = event.target.checked;

            // Store the user's preference for beta AI Threat Detection in storage
            setChromeStorage({ betaAISelected });
        },
        devMode(event) {
            const devMode = event.target.checked;

            // Store the user's preference for beta AI Threat Detection in storage
            setChromeStorage({ devMode })
        }
    }
}
</script>

<style>
.options-container {
    margin-top: 1rem;
}
</style>
