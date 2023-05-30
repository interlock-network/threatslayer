<template>
    <div class="help-tip">
        <span class="help-tip">{{ msg }}</span>
    </div>
</template>

<script>
export default {
    name: "InfoTip",
    props: {
        msg: String,
    },
};
</script>

<style>
.help-tip {
    cursor: default;
    font-size: 0.8rem;
    margin-left: 0rem;
    pointer-events: initial;
}

.help-tip:before {
    content: '?';
    font-weight: bold;
    color: #963cf5;
}

.help-tip:hover span {
    display: block;
    -webkit-animation: fadeIn 0.3s ease-in-out;
    animation: fadeIn 0.3s ease-in-out;

}

.help-tip span {
    /* The tooltip */
    display: none;
    text-align: left;
    background-color: #1E2021;
    padding: 10px;
    width: 400px;
    position: absolute;
    border-radius: 3px;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
    color: #E7E9EA;
    font-size: 0.75rem;
    line-height: 0.8rem;
}

.help-tip p:before {
    /* The pointer of the tooltip */
    position: absolute;
    content: '';
    width: 0;
    height: 0;
}

.help-tip p:after {
    /* Prevents the tooltip from being hidden */
    width: 100%;
    height: 40px;
    content: '';
    position: absolute;
    top: -40px;
    left: 0;
}

/* CSS animation */

@-webkit-keyframes fadeIn {
    0% {
        opacity: 0;
        transform: scale(0.6);
    }

    100% {
        opacity: 100%;
        transform: scale(1);
    }
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 100%;
    }
}
</style>
