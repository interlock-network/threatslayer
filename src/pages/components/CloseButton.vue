<template>
    <a href="https://interlock.network">
        <div id="mdiv">
            <div class="mdiv">
                <div class="md"></div>
            </div>
        </div>
    </a>
</template>

<script>
export default {
    name: "CloseButton",
    methods: {
        closeTab() {

        },
    }
};
</script>

<style>
#mdiv {
    color: #D0D4D9;
    float: left;
    width: 1rem;
    height: 1rem;
    margin-left: -1.75rem;
    margin-top: 0.33rem;
    opacity: 0.3;
    padding-right: 0.5rem;
    pointer-events: initial;
}

.mdiv {
    height: 1rem;
    width: 2px;
    margin-left: 12px;
    background-color: white;
    transform: rotate(45deg);
    Z-index: 1;
}

.md {
    height: 1rem;
    width: 2px;
    background-color: white;
    transform: rotate(90deg);
    Z-index: 2;
}
</style>
