<template>
    <div id="bail-link-container">
        <a href="https://interlock.network" id="bail-link">{{ msg }}</a>
    </div>
</template>

<script>

export default {
    name: "BailLink",
    components: {},
    props: {
        msg: String,
    },
    methods: {
        openTab() {
            window.open('https://interlock.network')
        },
    },
};
</script>

<style>
#bail-link-container {
    display: block;
    float: right;
}

#bail-link {
    border: none;
    background: #060708;
    color: gray;
    font-size: 0.75rem;
    pointer-events: initial;
    padding-top: 1rem;
    padding-bottom: 0.8rem;
}

#bail-link:focus {
    border: 3px solid #d0d4d9;
}
</style>
