<template>
    <span class="simple-text" :style="style">{{ msg }}</span>
</template>

<script>
export default {
    name: "TextComponent",
    props: {
        bold: { type: Boolean, default: false },
        footer: { type: Boolean, default: false },
        instruction: { type: Boolean, default: false },
        mono: { type: Boolean, default: false },
        msg: { type: String, required: true },
        subinstruction: { type: Boolean, default: false },
        wallet: { type: Boolean, default: false }
    },
    computed: {
        style() {
            let result = {};
            const { bold, footer, mono, subinstruction, wallet } = this;

            switch (true) {
                case bold:
                    result = { "font-weight": "bold" };
                    break;
                case footer:
                    result = {
                        'color': "gray",
                        'display': "inline",
                        "font-size": "0.75rem"
                    };
                    break;
                case mono:
                    result = {
                        'font-family': 'monospace',
                        'font-size': '0.9rem'
                    };
                    break;
                case subinstruction:
                    result = { 'font-size': '1rem' };
                    break;
                case wallet:
                    result = {
                        'font-family': 'monospace',
                        'font-size': '0.75rem'
                    };
                    break;
                default:
                    result = { 'width': "100%" };
            }

            return result;
        }
    }
};
</script>

<style>
.simple-text {
    color: #FFFFFF;
    margin-bottom: 0.5rem;
    word-wrap: break-word;
}
</style>
