<template>
    <div id="url-container">
        <LineOfText v-if="!allowlist?.length" msg="No allowlisted sites to show" bold />
        <div v-if="allowlist?.length">
            <LineOfText @click="sort" :msg="tableHeader" bold>{{ sortHeader }}</LineOfText>
            <TextComponent msg="You marked these safe. ThreatSlayer won't block them." subinstruction />
            <br />
            <table id="allowlist-table">
                <tr v-for="url in sortedAllowlist" style="margin-bottom: 1rem;">
                    <td class="icon-column">
                        <ClearAllowlistedURLButton v-bind="{ apiKey, callback: updateAllowlist, url }" />
                    </td>
                    <td class="url-column">
                        <TextComponent :msg="url" mono />
                    </td>
                </tr>
            </table>
            <!-- Note: Commented out until there's a better place for it -->
            <!-- <button @click="clearAllUrls" id="clear-allowlist">Clear all allowlisted URLs</button> -->
            <br />
        </div>
    </div>
</template>

<script>
import ClearAllowlistedURLButton from "./buttons/ClearAllowlistedURLButton.vue";
import LineOfText from "./LineOfText.vue";
import TextComponent from "./TextComponent.vue";

import { getChromeStorage, setChromeStorage } from '../../utilities.js';

export default {
    name: "AllowlistTable",
    components: {
        ClearAllowlistedURLButton,
        LineOfText,
        TextComponent
    },
    props: {
        apiKey: String
    },
    data() {
        return {
            allowlist: [],
            currentSortDir: 'chron', // defaults to chronological / API order
            sortedAllowlist: []
        }
    },
    mounted() {
        this.populateAllowlist();
    },
    computed: {
        sortedAllowlist() {
            if (!this.allowlist) return [];

            let result = [];

            if (this.currentSortDir === 'asc') {
                result = [...this.allowlist].sort((a, b) => a > b ? -1 : 1);
            } else if (this.currentSortDir === 'desc') {
                result = [...this.allowlist].sort((a, b) => a > b ? 1 : -1);
            } else {
                result = this.allowlist;
            }

            return result;
        },
        sortHeader() {
            let result;

            if (!this.allowlist?.length || this.allowlist?.length === 1) {
                result = '';
            } else {
                result = this.currentSortDir === 'asc' ? ' ▲' :
                    this.currentSortDir === 'desc' ? ' ▼' : ' (click here to sort)';
            }

            return result;
        },
        tableHeader() {
            return `${this.allowlist?.length} Allowlisted Sites`;
        }
    },
    methods: {
        async clearAllUrls() {
            setChromeStorage({ allowlist: null });

            this.allowlist = [];
        },
        async populateAllowlist() {
            const allowlist = await getChromeStorage('allowlist');

            this.allowlist = allowlist;
        },
        async updateAllowlist() {
            const allowlist = await getChromeStorage('allowlist');
            const updatedAllowlist = allowlist.filter(allowlistedUrl => allowlistedUrl !== url);

            setChromeStorage({ allowlist: updatedAllowlist });
            this.allowlist = allowlist;
        },
        sort() {
            this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' :
                this.currentSortDir === 'desc' ? 'chron' : 'asc';
        }
    }
}
</script>

<style>
#allowlist-table {
    display: block;
    height: 8rem;
    margin-left: -7px;
    overflow-y: auto;
}

#clear-allowlist {
    background-color: #0F0818;
    border: #9000CB solid 1px;
    border-radius: 12px;
    color: #FFFFFF;
    font-size: 1.25rem;
    padding: 0.5rem 0rem;
    width: 400px;
}

#clear-url-button {
    background: inherit;
    border: none;
    padding-bottom: 3px;
    padding-left: 5px;
}

#url-container {
    min-height: 25vh;
    overflow-y: scroll;
    margin-bottom: 4rem;
}

#url-container::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 4px;
}

#url-container::-webkit-scrollbar-track {
    background: inherit;
    border-radius: 2px;
}

#url-container::-webkit-scrollbar-thumb {
    background: #d0d4d9;
    border-radius: 2px;
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
}

.icon-column {
    display: inline-block;
    margin-left: -3px;
    vertical-align: top;
    width: 2rem;
}

.url-column {
    max-width: 389px;
    width: 389px;
    word-wrap: break-word;
}

.x-button {
    background-color: inherit;
    border: none;
    color: red;
}
</style>
