<template>
    <div id="login-button-container">
        <!-- TODO fix this -->
        <button id='login-button' @click="submitLogin()" @input="validateName" :class="error ? 'error' : computedClass"
            :disabled="loggingIn || loggedIn">
            {{ loginButtonText }}
        </button>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "SubmitButton",
    props: {
        active: Boolean,
        password: String,
        username: String,
    },
    data() {
        return {
            error: false,
            loginButtonText: 'Login',
            loggingIn: false,
            loggedIn: false
        }
    },
    watch: {
        active: function (newVal, oldVal) {
            if (!oldVal && newVal) {
                document.getElementById('login-button').focus();
            } else if (oldVal && !newVal) {
                document.getElementById('login-button').blur();
            }
        },
    },
    computed: {
        computedClass() {
            return this.active && this.mnemonic && this.password && this.termsOfService && this.unitedStates && this.username ? 'login-active' : 'disabled';
        },
    },
    methods: {
        async submitLogin() {
            const { password, mnemonic, termsOfService, unitedStates, username, } = this;
            this.loggingIn = true;
            this.loginButtonText = 'Waiting...';

            // TODO update with endpoint URL
            const response = await axios.post('/api/login', { password, username });

            if (response.status === 200) {
                // TODO store encrypted mnemonic
                this.loggedIn = true;
                this.loggingIn = false;
                this.loginButtonText = 'Success';

                // TODO add error handling
                chrome.storage.local
                    .set({ registered: true })
                    .then(() => {
                        console.log("Confirmed registered status!");
                    });

                // TODO add error handling
                chrome.storage.local
                    .set({ loggedIn: true })
                    .then(() => {
                        console.log("User succesfully logged in");
                    });
            } else {
                // TODO catch errors properly
            }
        }
    }
};
</script>

<style>
#go-back-button {
    border: none;
    color: gray;
    margin-top: 0.8rem;
    width: 50%;
}

#login-button-container {
    margin-top: 3rem;
    margin-bottom: 3rem;
    width: 450px;
}

#login-button {
    background: #060708;
    cursor: pointer;
    float: left;
    font-size: 1.25rem;
    width: 50%;
    padding: 0.5rem 0.75rem;
}

.login-active {
    border: 3px solid #3b8de8;
    color: #963cf5;
    opacity: 1;
    outline: none;
    pointer-events: initial;
}

.error {
    color: red;
}

.disabled {
    border: 1px solid #d0d4d9;
    color: #d0d4d9;
    opacity: 0.3;
    pointer-events: none;
}
</style>
