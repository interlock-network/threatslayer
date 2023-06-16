<template>
    <table>
        <tr style="width: 100%">
            <td style="width: 66%">
                <LineOfText msg="We recommend SubWallet if you don't already have an Aleph Zero-compatible wallet."
                    instruction />
            </td>
            <td style="width: 33%">
                <slot />
            </td>
        </tr>
    </table>
</template>

<script>
import LineOfText from "./subcomponents/LineOfText.vue";

export default {
    name: "CreateInstructions",
    components: {
        LineOfText,
    },
    props: {
        active: Boolean
    },
};
</script>

<style></style>
