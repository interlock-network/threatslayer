<template>
    <button :id="id" class="wallet-button" @click="clickAction()">
        {{ msg }}
    </button>
</template>

<script>
export default {
    name: "WalletButton",
    props: {
        active: Boolean,
        action: Function,
        id: String,
        msg: String
    },
    data() {
        return {
            error: false,
        }
    },
    methods: {
        clickAction() {
            this.action();
        },
    },
    watch: {
        active: function (newVal, oldVal) {
            if (!oldVal && newVal) {
                document.getElementById(this.id).focus();
            } else if (oldVal && !newVal) {
                document.getElementById(this.id).blur();
            }
        },
    },
};
</script>

<style>
.wallet-button {
    border: 1px solid #d0d4d9;
    background: #060708;
    color: #d0d4d9;
    pointer-events: initial;
    font-size: 1.25rem;
    padding: 0.5rem 0.75rem;
    width: 50%;
}

.wallet-button:focus {
    border: 3px solid #3b8de8;
    color: #963cf5;
    outline: none;
}

.error {
    color: red;
}

.enabled {
    pointer-events: initial;
}

.disabled {
    pointer-events: none;
}
</style>
