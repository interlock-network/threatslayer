<template>
    <div id="checkbox-container">
        <input :id="id" type="checkbox">
        <label :for="id">{{ msg }} </label>
    </div>
</template>

<script>
export default {
    name: "CheckBox",
    props: {
        id: String,
        msg: String,
    },
};
</script>

<style>
#checkbox-container {
    display: inline-block;
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
