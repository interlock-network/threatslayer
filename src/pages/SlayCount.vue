<template>
    <PageBanner msg="Slay Count">
        <img class="banner-icon" src="/src/assets/images/slay_count.png">
    </PageBanner>
    <div id="slaycount-container">
        <div id="button-container">
            <button id="download-button" class="sharing-button" @click="download" title="Download Slay Count">
                <img class="button-img" src="/src/assets/images/download.png" alt="Download" />
            </button>
            <button id="copy-button" class="sharing-button" @click="copy" title="Copy Slay Count to clipboard">
                <img class="button-img" src="/src/assets/images/copy_to_clipboard.png" alt="Copy" />
            </button>
        </div>
        <!-- Total URLs big donut -->
        <div id="local-urls-scanned-count" :style="totalURLsVisitedStyle">
            <div id="slaycount-circle">
                {{ totalURLsVisited }}
            </div>
        </div>
        <div id="urls-scanned-sub-text">URLs Scanned</div>
        <!-- Unique URLs small left number -->
        <div style="float: left" class="content-box statistic">
            <p class="statistic-header" id="unique-urls-scanned-text">
                Unique URLs Scanned
            </p>
            <p id="local-unique-urls-scanned-count" class="statistic-value" :style="uniqueVisitedStyle">
                {{ formattedUniqueUrls }}
            </p>
        </div>
        <!-- Malicious URLs small right number -->
        <div style="float: right; margin-right: 2.5rem;" class="content-box statistic">
            <p class="statistic-header" id="malicious-sites-detected-text">
                Malicious Sites Detected
            </p>
            <p id="local-malicious-urls-scanned-count" class="statistic-value" :style="maliciousVisitedStyle">
                {{ totalMaliciousURLsVisited }}
            </p>
        </div>
    </div>
    <svg id="svg" width="512" height="512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        style="display: none">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color: #fdf4fb; stop-opacity: 1" />
                <stop offset="100%" style="stop-color: #f1fafe; stop-opacity: 1" />
            </linearGradient>
            <linearGradient id="rainbow" x1="0" x2="0" y1="0" y2="10%" gradientUnits="userSpaceOnUse">
                <stop stop-color="#1f90f1" offset="30%" />
                <stop stop-color="#c417e0" offset="50%" />
                <stop stop-color="#e56a7a" offset="80%" />
                <stop stop-color="#fca531" offset="100%" />
            </linearGradient>
        </defs>
        <rect width="512" height="512" fill="url(#grad1)" />
        <circle cx="256" cy="280" r="164" stroke="#9336E5" stroke-width="36" fill="none" />
        <text id="slay-count" x="50%" y="55%" class="count" font-family="THICCCBOI" font-weight="bold" font-size="120px"
            text-anchor="middle" dominant-baseline="middle">
            {{ totalURLsVisited }}
        </text>
        <text id="credit" x="38" y="64" font-size="14px" font-family="THICCCBOI" font-weight="bold">Powered by
            Interlock
        </text>
        <text id="threatslayer" x="32" y="42" font-size="36px" font-family="THICCCBOI" font-weight="bold"
            fill="url(#rainbow)">
            ThreatSlayer
        </text>
        <text x="48%" y="72%" font-style="italic" font-size="64px" font-family="THICCCBOI" font-weight="bold"
            text-anchor="middle" stroke="black" fill="red" stroke-width="8px" dominant-baseline="middle">
            SLAY COUNT
        </text>
    </svg>
</template>
<script>
import PageBanner from "./components/subcomponents/PageBanner.vue";

import { formatNumber, getFontSizeForTotal, getFontSizeForUnique } from "../utilities";

const output = { name: "SlayCount.png", width: 512, height: 512 };

export default {
    name: 'SlayCount',
    components: {
        PageBanner
    },
    data() {
        return {
            fontSizeForTotal: '123px',
            fontSizeForUnique: '56px',
            fontSizeForMalicious: '56px',
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
        maliciousVisitedStyle() {
            return { "font-size": this.fontSizeForUnique }
        },
        uniqueVisitedStyle() {
            return { "font-size": this.fontSizeForUnique }
        },
        totalURLsVisitedStyle() {
            return { "font-size": this.fontSizeForTotal }
        }
    },
    methods: {
        copy() {
            const svgElem = document.querySelector("svg");

            const uriData = `data:image/svg+xml;base64,${btoa(
                new XMLSerializer().serializeToString(svgElem)
            )}`;

            const img = new Image();
            img.src = uriData;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                [canvas.width, canvas.height] = [output.width, output.height];
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, output.width, output.height);

                canvas.toBlob(
                    (blob) => {
                        navigator.clipboard
                            .write([
                                new ClipboardItem({
                                    [blob.type]: blob,
                                }),
                            ])
                            .then(() => {
                                alert("SlayCount copied to clipboard!");
                            });
                    },
                    "image/png",
                    1
                );
            };
        },
        download() {
            const svgElem = document.querySelector("svg");

            const uriData = `data:image/svg+xml;base64,${btoa(
                new XMLSerializer().serializeToString(svgElem)
            )}`;

            const img = new Image();
            img.src = uriData;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                [canvas.width, canvas.height] = [output.width, output.height];
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, output.width, output.height);

                const a = document.createElement("a");
                const quality = 1.0;

                a.href = canvas.toDataURL("image/png", quality);
                a.download = output.name;
                a.dataset.downloadurl = ["png", a.download, a.href].join(":");

                a.append(canvas);
                a.click();
                a.remove();
            };
        },
        async getExtensionState(key) {
            try {
                chrome.storage.local
                    .get(key, response => {
                        const numberResponse = Number(response[key]);

                        if (key === 'totalURLsVisited') {
                            this.fontSizeForTotal = getFontSizeForTotal(numberResponse);

                            const rawUniqueEstimate = Math.floor(numberResponse / 8);
                            this.fontSizeForUnique = getFontSizeForUnique(rawUniqueEstimate);
                            this.formattedUniqueUrls = formatNumber(Math.max(rawUniqueEstimate, 1));
                        }

                        this[key] = formatNumber(numberResponse);
                    });
            } catch (err) {
                console.log('Error getting extension state:', err);
            }
        }
    }
}
</script>
  
<style>
#button-container {
    float: right;
    margin-top: -3.75rem;
    transform: scale(0.75);
}

#slaycount-container {
    margin-top: 2rem;
    margin-bottom: 8rem;
}

#local-urls-scanned-count {
    color: white;
    width: 370px;
    height: 310px;
    text-align: center;
    font-family: "THICCCBOI";
    font-weight: bold;
    line-height: 360px;
    margin: auto;
}

#slaycount-circle {
    background: url("/src/assets/images/slaycount_circle.svg");
}

#url-count {
    display: inline-block;
    vertical-align: middle;
}

#urls-scanned-sub-text {
    font-family: "THICCCBOI";
    font-weight: 600;
    font-size: 36px;
    color: white;
    text-align: center;
    margin-top: 4rem;
}

.sharing-button {
    background-color: #0f0818;
    border: none;
    border-radius: 3px;
    font-size: 18px;
    margin: 5px;
    padding: 0;
    pointer-events: initial;
}

.sharing-button:hover {
    cursor: pointer;
}

.button-img {
    width: 1.75rem;
    height: 1.75rem;
}

.statistic {
    text-align: center;
    margin-top: 30px;
}

.statistic-header {
    font-size: 16px;
    font-family: "THICCCBOI";
    font-weight: bold;
    color: white;
}

.statistic-value {
    font-family: "THICCCBOI";
    color: white;
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
  