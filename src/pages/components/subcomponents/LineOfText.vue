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
        subinstruction: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        style() {
            let styleObj;
            const { error, footer, subinstruction } = this;

            switch (true) {
                case error:
                    styleObj = { color: "red" };
                    break;
                case footer:
                    styleObj = {
                        "color": "gray",
                        "display": "inline",
                        "font-size": "0.75rem"
                    };
                    break;
                case subinstruction:
                    styleObj = { 'font-size': '1rem' };
                    break;
                default:
                    styleObj = { width: "100%" };
            }

            return styleObj;
        },
    },
};
</script>

<style>
.line-of-text {
    color: #D0D4D9;
    display: inline-flex;
    margin-bottom: 0.5rem;
    /* opacity: 85%; */
}
</style>
