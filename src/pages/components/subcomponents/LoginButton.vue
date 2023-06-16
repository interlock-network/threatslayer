<template>
    <div id="login-button-container">
        <button id='login-button' @click="submitLogin()" :class="computedClass"
            :disabled="loggingIn || loggedIn || !active">
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
    computed: {
        computedClass() {
            let className = '';

            if (this.error) {
                className = 'login-button-error';
            } else if (!this.active) {
                className = 'disabled';
            } else {
                className = 'login-active';
            }

            return className;
        }
    },
    methods: {
        async submitLogin() {
            const { password, username } = this;

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
#login-button-container {
    color: #d0d4d9;
    margin-top: 3rem;
    margin-bottom: 3rem;
    width: 450px;
}

#login-button {
    background: #060708;
    cursor: pointer;
    float: left;
    font-size: 1.5rem;
    pointer-events: initial;
    width: 50%;
    padding: 0.5rem 0.75rem;
}

.disabled {
    border: 1px solid #d0d4d9;
    opacity: 0.3;
    pointer-events: none;
}

.login-active {
    border: 3px solid #3b8de8;
    color: #963cf5;
    opacity: 1;
    outline: none;
    pointer-events: initial;
}

.login-button-error {
    color: red;
}
</style>
