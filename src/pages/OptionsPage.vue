<template>
    <PageBanner :msg="$i18n('extension_options')">
        <img class="banner-icon" src="/src/assets/images/settings.png">
    </PageBanner>
    <br />
    <TextComponent :msg="$i18n('select_from_the_following')" bold />
    <div class="options-container">
        <input type="checkbox" id="beta-ai-checkbox" @click="betaClassifier($event)" tabindex="2" />
        <label for="beta-ai-checkboxbox">{{ $i18n('enable_beta_option') }}</label>
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

        betaAICheckbox.focus();

        // Load the user's preference for beta AI Threat Detection from storage
        const betaAISelected = await getChromeStorage("betaAISelected");
        betaAICheckbox.checked = betaAISelected;
    },
    methods: {
        betaClassifier(event) {
            const betaAISelected = event.target.checked;

            // Store the user's preference for beta AI Threat Detection in storage
            setChromeStorage({ betaAISelected });
        }
    }
}
</script>

<style>
.options-container {
    margin-top: 1rem;
}
</style>
