<template>
    <div id="bail-link-container">
        <a href="https://interlock.network" target="_blank" id='bail-link'>{{ msg }}</a>
    </div>
</template>

<script>
export default {
    name: "BailLink",
    props: {
        msg: String,
    },
};
</script>

<style>
#bail-link-container {
    display: block;
    float: right;
}

#bail-link {
    color: gray;
    float: right;
    font-size: 0.8rem;
    cursor: pointer;
    min-width: 65px;
    pointer-events: initial;
}
</style>
