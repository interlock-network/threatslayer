<template>
    <div :style="divStyle">
        <span class="line-of-text" :style="style">{{ msg }}</span>
        <slot />
    </div>
</template>

<script>
export default {
    name: "LineOfText",
    props: {
        bigmono: {
            type: Boolean,
            default: false,
        },
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
            type: String,
            default: undefined,
        },
        subinstruction: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        divStyle() {
            let result = { 'padding-right': '2rem' };

            if (!this.msg) {
                result = {
                    ...result,
                    'margin-top': '-.25rem'
                };
            } else if (!this.msg && this.error) {
                result = {
                    ...result,
                    'margin-top': '-2rem'
                };
            } else if (this.error) {
                result = {
                    ...result,
                    'margin-top': '-0.75rem',
                    'margin-bottom': '0rem'
                }
            } else if (this.mono) {
                result = {
                    ...result,
                    'display': 'block',
                    'font-family': 'monospace',
                    'font-size': '0.9rem',
                    'width': '375px'
                }
            }

            return result;
        },
        style() {
            let styleObj;
            const { bigmono, bold, error, footer, mono, subinstruction } = this;

            switch (true) {
                case bold:
                    styleObj = { 'font-weight': 'bold' };
                    break;
                case error:
                    styleObj = { 'color': 'red' };
                    break;
                case footer:
                    styleObj = {
                        'color': 'gray',
                        'display': 'inline',
                        'font-size': '0.75rem'
                    };
                    break;
                case bigmono:
                    styleObj = {
                        'display': 'block',
                        'font-family': 'monospace',
                        'font-size': '1.1rem'
                    };
                    break;
                case mono:
                    styleObj = {
                        'display': 'block',
                        'font-family': 'monospace',
                        'font-size': '0.9rem',
                        'width': '375px'
                    };
                    break;
                case subinstruction:
                    styleObj = { 'font-size': '1rem' };
                    break;
                default:
                    styleObj = { 'width': '100%' };
            }

            return styleObj;
        },
    },
};
</script>

<style>
.line-of-text {
    color: #FFFFFF;
    display: inline-flex;
    margin-bottom: 0.5rem;
    /* opacity: 85%; */
}
</style>
