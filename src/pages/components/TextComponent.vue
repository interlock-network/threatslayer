<template>
    <span class="simple-text" :style="style">{{ msg }}</span>
</template>

<script>
export default {
    name: "TextComponent",
    props: {
        bold: {
            type: Boolean,
            default: false,
        },
        error: {
            type: Boolean,
            default: false,
        },
        footer: {
            type: Boolean,
            default: false,
        },
        instruction: {
            type: Boolean,
            default: false,
        },
        mono: {
            type: Boolean,
            default: false,
        },
        msg: {
            required: true,
            type: String,
        },
        subinstruction: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        style() {
            let result = {};
            const { bold, error, footer, mono, subinstruction } = this;

            switch (true) {
                case bold:
                    result = { "font-weight": "bold" };
                    break;
                case error:
                    result = {
                        color: "red",
                        display: 'block',
                        'margin-top': '-0.5rem'
                    };
                    break;
                case footer:
                    result = {
                        color: "gray",
                        display: "inline",
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
                default:
                    result = { width: "100%" };
            }

            return result;
        },
    },
};
</script>

<style>
.simple-text {
    color: #D0D4D9;
    margin-bottom: 0.5rem;
    word-wrap: break-word;
}
</style>
