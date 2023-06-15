<template>
    <h1 id="page-banner">Extension Options</h1>
    <OptionsView>
        <div class="options-container">
            <input type="checkbox" id="beta-ai-checkbox" @click="betaClassifier($event)" tabindex="1" />
            <label for="beta-ai-checkboxbox">
                Enable beta AI Threat Detection (developers only)
            </label>
        </div>
    </OptionsView>
</template>
<script>
import OptionsView from "./components/OptionsView.vue";

export default {
    name: 'OptionsPage',
    components: {
        OptionsView
    },
    data() {
        return {};
    },
    mounted() {
        const betaAICheckbox = document.getElementById('beta-ai-checkbox');

        betaAICheckbox.focus();

        // Load the user's preference for beta AI Threat Detection from storage
        chrome.storage.sync.get("betaAISelected", function (data) {
            betaAICheckbox.checked = data.betaAISelected;
        });
    },
    computed: {},
    methods: {
        betaClassifier(event) {
            const betaAISelected = event.target.checked;

            // Store the user's preference for beta AI Threat Detection in storage
            chrome.storage.sync.set({ betaAISelected: betaAISelected }, function () {
                console.log('Setting betaAISelected set to', betaAISelected);
            });
        }
    }
}
</script>
  
<style>
.options-container {
    margin-top: 1rem;
}
</style>
  