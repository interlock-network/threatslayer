<template>
    <!-- modal contents -->
    <div v-if="pageFaded" id="installation-modal-overlay">
        <div id="installation-modal-container" :style="pageFaded ? 'bottom: 30%' : 'display: none'">
            <TextComponent :msg="$i18n('do_this_to_be_protected')" /><br /><br />
            <img src="../../assets/images/how_to_pin.gif" style="height:100%; width:100%;"
                alt="Animation showing how to pin the ThreatSlayer icon" />
            <br /><br /><br />
            <!-- close button -->
            <button @click="fadeEarnPage(false)" class="submit-button">
                {{ $i18n('got_it') }}
            </button>
        </div>
    </div>
</template>

<script>
import TextComponent from "./TextComponent.vue";

export default {
    name: "InstallationModal",
    props: {
        fadeEarnPage: { type: Function, required: true },
        pageFaded: { type: Boolean, default: false }
    },
    components: {
        TextComponent
    },
    async mounted() {
        chrome.storage.local.set({ justInstalled: false });
    }
};
</script>

<style>
#installation-modal-container {
    background-color: #0F0818;
    border-radius: 12px;
    color: #FFFFFF;
    padding: 50px;
    position: absolute;
    width: 400px;
}

#installation-modal-overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 10%;
    display: flex;
    justify-content: center;
    background-color: #000000da;
}
</style>
