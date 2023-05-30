<template>
    <div id="button-container">
        <button id="download-button" class="sharing-button" title="Download Slay Count">
            <img class="button-img" src="/src/assets/images/download.png" alt="Download" />
        </button>
        <button id="copy-button" class="sharing-button" title="Copy Slay
              Count
              to
              clipboard">
            <img class="button-img" src="/src/assets/images/copy_to_clipboard.png" alt="Copy" />
        </button>
    </div>
    <!-- Total URLs big donut -->
    <div id="local-urls-scanned-count" :style="totalURLsVisitedStyle">{{ totalURLsVisited }}</div>
    <div id="urls-scanned-sub-text">URLs Scanned</div>

    <div style="float: left" class="content-box statistic">
        <p class="statistic-header" id="unique-urls-scanned-text">
            Unique URLs Scanned
        </p>
        <p id="local-unique-urls-scanned-count" class="statistic-value" :style="totalUniqueVisitedStyle">
            {{ formattedUniqueUrls }}
        </p>
    </div>

    <div style="float: right" class="content-box statistic">
        <p class="statistic-header" id="malicious-sites-detected-text">
            Malicious Sites Detected
        </p>
        <p id="local-malicious-urls-scanned-count" class="statistic-value" style="font-size: 56px">
            {{ totalMaliciousURLsVisited }}
        </p>
    </div>
</template>
<script>
import axios from "axios";
import { formatNumber, getFontSizeForTotal, getFontSizeForUnique } from "../utilities";

export default {
    name: 'SlayCount',
    components: {

    },
    data() {
        return {
            fontSizeForTotal: '123px',
            fontSizeForUnique: '56px',
            formattedUniqueUrls: '0',
            totalURLsVisited: '0',
            totalMaliciousURLsVisited: '0',
        };
    },
    mounted() {
        this.getExtensionState('totalMaliciousURLsVisited');
        this.getExtensionState('totalURLsVisited');
    },
    computed: {
        totalUniqueVisitedStyle() {
            return { "font-size": this.fontSizeForUnique }
        },
        totalURLsVisitedStyle() {
            return { "font-size": this.fontSizeForTotal }
        }
    },
    methods: {
        async getExtensionState(key) {
            await axios
                .get(`/${key}`, {}, {})
                .then((response) => {
                    const numberResponse = Number(response.data);

                    if (key === 'totalURLsVisited') {
                        this.fontSizeForTotal = getFontSizeForTotal(numberResponse);

                        const rawUniqueEstimate = Math.floor(numberResponse / 8);
                        this.fontSizeForUnique = getFontSizeForUnique(rawUniqueEstimate);
                        this.formattedUniqueUrls = formatNumber(Math.max(rawUniqueEstimate, 1));
                    }

                    this[key] = formatNumber(numberResponse);
                })
                .catch(async (err) => {
                    console.log("err", err);
                    // TODO throw error
                });
        },
    }
}
</script>
  
<style>
button {
    color: white;
    background-color: #9336e5;
    border: none;
    border-radius: 3px;
    margin: 5px;
    border: 3px solid white;
    font-size: 18px;
}

button:hover {
    cursor: pointer;
}

#button-container {
    float: right;
    margin-top: -40px;
    margin-right: -25px;
}

#local-urls-scanned-count {
    border-radius: 50%;
    width: 310px;
    height: 310px;
    border: 30px solid #9336e5;
    text-align: center;
    font-family: "THICCBOI-Bold";
    line-height: 310px;
    margin: auto;
}

#url-count {
    display: inline-block;
    vertical-align: middle;
}

#urls-scanned-sub-text {
    font-family: "THICCBOI";
    font-size: 36px;
    color: #717171;
    text-align: center;
    margin-top: 20px;
}

.sharing-button {
    background-color: transparent;
    border: none;
    padding: 0;
}

.button-img {
    width: 1.75rem;
    height: 1.75rem;
}

.statistic {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 30px;
    width: 242px;
    height: 131px;
}

.statistic-header {
    font-size: 16px;
    font-family: "THICCBOI-bold";
    color: #717171;
}

.statistic-value {
    font-family: "THICCBOI";
    color: #222222;
    margin-top: 0;
}

#slay-count {
    font: bold 120px sans-serif;
    dominant-baseline: middle;
    text-anchor: middle;
}

#threatslayer {
    font: bold 36px sans-serif;
}

#credit {
    font: bold 14px sans-serif;
}

#title {
    font: italic 64px sans-serif;
    font-weight: bold;
    text-anchor: middle;
    fill: red;
    stroke: black;
    paint-order: stroke;
    stroke-width: 14px;
    dominant-baseline: middle;
}
</style>
  