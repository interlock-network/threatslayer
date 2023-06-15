<template>
    <span class="line-of-text" :style="style">{{ msg }}
        <slot />
    </span>
</template>

<script>
export default {
    name: "LineOfText",
    props: {
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
        msg: String,
        seed: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        style() {
            return this.error ?
                { color: "red" }
                : this.footer
                    ? {
                        "color": "gray",
                        "display": "inline",
                        "font-size": "0.8rem"
                    }
                    : this.error ?
                        { color: "red" }
                        : this.seed ?
                            {
                                "align-items": "center",
                                color: "black",
                                "font-family": "monospace",
                                "padding-top": "1rem",
                                width: "100%"
                            }
                            : { width: "100%" }
        },
    },
};
</script>

<style>
.line-of-text {
    color: #D0D4D9;
    display: inline-flex;
    opacity: 85%;
    margin-bottom: 0.5rem;
}
</style>
