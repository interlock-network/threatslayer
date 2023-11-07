<template>
    <PageBanner :msg="$i18n('slay_count')">
        <img class="banner-icon" src="/src/assets/images/slay_count.png">
    </PageBanner>
    <div id="slaycount-container">
        <div id="button-container">
            <button id="download-button" class="sharing-button" @click="download" :title="$i18n('slay_count_download')">
                <img class="button-img" src="/src/assets/images/download.png" alt="Download" />
            </button>
            <button id="copy-button" class="sharing-button" @click="copy" :title="$i18n('slay_count_copy')">
                <img class="button-img" src="/src/assets/images/copy_icon.png" alt="Copy" />
            </button>
        </div>
        <!-- Total URLs big donut -->
        <div id="local-urls-scanned-count" :style="totalURLsVisitedStyle">
            <div id="slaycount-circle">{{ totalURLsVisited }}</div>
        </div>
        <div id="urls-scanned-sub-text">{{ $i18n('urls_scanned') }}</div>
        <!-- Unique URLs small left number -->
        <div style="float: left" class="statistic">
            <span class="statistic-header" id="unique-urls-scanned-text">
                {{ $i18n('unique_urls_scanned') }}
            </span>
            <span id="local-unique-urls-scanned-count" class="statistic-value" :style="uniqueVisitedStyle">
                {{ formattedUniqueUrls }}
            </span>
        </div>
        <!-- Malicious URLs small right number -->
        <div style="float: right; margin-right: 2.5rem;" class="statistic">
            <span class="statistic-header" id="malicious-sites-detected-text">
                {{ $i18n('malicious_sites_detected') }}
            </span>
            <span id="local-malicious-urls-scanned-count" class="statistic-value" :style="maliciousVisitedStyle">
                {{ totalMaliciousURLsVisited }}
            </span>
        </div>
    </div>
    <!-- Exported SVG code -->
    <svg id="svg" width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="none"
        xmlns:xlink="http://www.w3.org/1999/xlink" style="background-color:black; display: none;">
        <defs>
            <filter id="filter0_d_622_766" x="0" y="0" width="365" height="365" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_622_766" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_622_766" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_622_766" x1="34.5" y1="100" x2="182.5" y2="356"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#01ADEF" />
                <stop offset="0.479167" stop-color="#9336E5" />
                <stop offset="1" stop-color="#FEAB2A" />
            </linearGradient>
        </defs>
        <defs>
            <linearGradient id="rainbow" x1="2" x2="0" y1="0" y2="10%" gradientUnits="userSpaceOnUse">
                <stop stop-color="#1f90f1" offset="30%" />
                <stop stop-color="#c417e0" offset="50%" />
                <stop stop-color="#e56a7a" offset="80%" />
                <stop stop-color="#fca531" offset="100%" />
            </linearGradient>
        </defs>
        <g filter="url(#filter0_d_622_766)" transform="translate(75, 90)">
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M360 178.5C360 276.531 280.531 356 182.5 356C84.4695 356 5 276.531 5 178.5C5 80.4695 84.4695 1 182.5 1C280.531 1 360 80.4695 360 178.5ZM182.5 323.231C262.433 323.231 327.231 258.433 327.231 178.5C327.231 98.5674 262.433 33.7692 182.5 33.7692C102.567 33.7692 37.7692 98.5674 37.7692 178.5C37.7692 258.433 102.567 323.231 182.5 323.231Z"
                fill="url(#paint0_linear_622_766)" />
            <path
                d="M182.5 356.5C280.807 356.5 360.5 276.807 360.5 178.5C360.5 80.1933 280.807 0.5 182.5 0.5C84.1933 0.5 4.5 80.1933 4.5 178.5C4.5 276.807 84.1933 356.5 182.5 356.5ZM326.731 178.5C326.731 258.156 262.156 322.731 182.5 322.731C102.844 322.731 38.2692 258.156 38.2692 178.5C38.2692 98.8436 102.844 34.2692 182.5 34.2692C262.156 34.2692 326.731 98.8436 326.731 178.5Z"
                stroke="black" />
        </g>
        <text id="threatslayer" x="50%" y="38" dominant-baseline="middle" text-anchor="middle" font-size="36px"
            font-family="THICCCBOI" font-weight="bold" fill="url(#rainbow)">
            {{ $i18n('threat_slayer') }}
        </text>
        <text id="credit" x="50%" y="66" dominant-baseline="middle" text-anchor="middle" font-size="14px"
            font-family="THICCCBOI" font-weight="bold" fill="white">
            {{ $i18n('powered_by_interlock') }}
        </text>
        <text id="slay-count" x="50%" y="53%" class="count" font-family="THICCCBOI" font-weight="bold"
            :font-size="totalVisitedFontSize" text-anchor="middle" dominant-baseline="middle" stroke="white" fill="white"
            stroke-width="2px">
            {{ totalURLsVisited }}
        </text>
        <image x="32%" y="64%" width="33" height="33" href="/src/assets/images/crossed_swords.png" />
        <text x="54%" y="68%" font-size="32px" font-family="THICCCBOI" text-anchor="middle" fill="white"
            dominant-baseline="middle">
            {{ $i18n('slay_count') }}
        </text>
    </svg>
</template>

<script>
import axios from "axios";
import { baseUrl } from '../utilities.js';
import { extractFromError, setChromeStorage } from "../utilities";

import PageBanner from "./components/PageBanner.vue";

const output = { name: "SlayCount.png", width: 512, height: 512 };

export default {
    name: 'SlayCount',
    components: {
        PageBanner
    },
    props: {
        apiKey: { type: String, default: '' },
        username: { type: String, default: '' }
    },
    data() {
        return {
            fontSizeForTotal: '123px',
            fontSizeForSmallerNums: '50px',
            fontSizeForMalicious: '50px',
            rawTotalUrlsVisited: 0,
            totalMaliciousURLsVisited: '0',
        }
    },
    mounted() {
        this.getSlayCountStats()
    },
    computed: {
        fontSizeForTotal() {
            return this.getFontSizeForTotal(this.rawTotalUrlsVisited);
        },
        formattedUniqueUrls() {
            const rawUniqueEstimate = Math.floor(this.rawTotalUrlsVisited / 8);
            this.fontSizeForSmallerNums = this.getFontSizeForSmallerNums(rawUniqueEstimate);

            return this.formatNumber(Math.max(rawUniqueEstimate, 1));
        },
        maliciousVisitedStyle() {
            return { "font-size": this.fontSizeForSmallerNums };
        },
        totalVisitedFontSize() {
            let size = 120; // default size for up to 9999

            if (this.totalURLsVisited >= 10 ** 5) {
                size = 80;
            } else if (this.totalURLsVisited >= 10 ** 4) {
                size = 100;
            }

            return `${size}px`;
        },
        uniqueVisitedStyle() {
            return { "font-size": this.fontSizeForSmallerNums };
        },
        totalURLsVisited() {
            return this.formatNumber(Math.max(this.rawTotalUrlsVisited, this.totalMaliciousURLsVisited, 1));
        },
        totalURLsVisitedStyle() {
            return { "font-size": this.totalVisitedFontSize };
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
        formatNumber(num) {
            return new Intl.NumberFormat().format(num);
        },
        getFontSizeForSmallerNums(num) {
            let result = '';
            const defaultSize = '50px';
            const sixDigits = '40px';

            if (num >= 10 ** 6) {
                result = sixDigits;
            } else {
                result = defaultSize;
            }

            return result;
        },
        getFontSizeForTotal(num) {
            let result = '';
            const oneToThreeDigits = '123px';
            const fourDigits = '110px';
            const fiveDigits = '90px';
            const sixDigits = '75px';
            const sevenDigits = '60px';

            if (num >= 10 ** 6) {
                result = sevenDigits;
            } else if (num >= 10 ** 5) {
                result = sixDigits;
            } else if (num >= 10 ** 4) {
                result = fiveDigits;
            } else if (num >= 10 ** 3) {
                result = fourDigits;
            } else {
                result = oneToThreeDigits;
            }

            return result;
        },
        async getSlayCountStats() {
            // this value is only stored locally
            this.useExtensionState('totalMaliciousURLsVisited');

            if (this.apiKey?.length && this.username?.length) {
                this.getStatsFromApi();
            } else {
                this.useExtensionState('totalURLsVisited');
            }
        },
        async useExtensionState(key) {
            try {
                chrome.storage.local
                    .get(key, response => {
                        // sets number to 0 if its undefined
                        const numberResponse = Number(response[key]) || 0;

                        if (key === 'totalURLsVisited') {
                            this.rawTotalUrlsVisited = numberResponse;
                        } else {
                            this[key] = this.formatNumber(numberResponse);
                        }
                    });
            } catch (err) {
                console.log(`Error getting extension state: ${err}`);
            }
        },
        async getStatsFromApi() {
            const { apiKey, username } = this;

            axios.post(`${baseUrl}/user-get`, { key: apiKey, username })
                .then(response => {
                    const { lookups = 0, lookups_total = 0 } = response?.data;
                    const totalURLsVisited = lookups + lookups_total;

                    this.rawTotalUrlsVisited = totalURLsVisited;
                    setChromeStorage({ totalURLsVisited });
                })
                .catch(error => {
                    const { errors, status } = extractFromError(error);

                    console.log(`Error getting user stats from API. Status: ${status}. Error: ${errors}`);
                });
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
    margin-top: 15px;
}

.statistic-header {
    color: white;
    display: block;
    font-size: 16px;
    font-family: "THICCCBOI";
    font-weight: bold;
    margin-bottom: 0.5rem;
    margin-top: 1.25rem;
}

.statistic-value {
    display: block;
    font-family: "THICCCBOI";
    color: white;
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
    color: white;
    font: bold 14px sans-serif;
}
</style>
