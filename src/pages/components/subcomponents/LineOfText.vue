<template>
    <div>
        <span class="line-of-text" :style="style">{{ msg }}
            <slot />
        </span>
    </div>
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
                    ? { "font-size": "0.8rem", "color": "gray" }
                    : this.error ?
                        { color: "red" }
                        : this.seed ?
                            {
                                "align-items": "center",
                                "background-color": "#D0D4D9",
                                color: "black",
                                display: "flex",
                                "font-family": "monospace",
                                height: "5rem",
                                "padding-left": "1rem",
                                width: "100%",
                            }
                            : {}
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
    width: 100%;
}
</style>
