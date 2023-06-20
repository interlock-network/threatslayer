<template>
    <div id="submit-button-container">
        <button id='submit-button' @click="submitForm()" :class="computedClass" :disabled="submitting || submitted">
            {{ submitButtonText }}
        </button>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "CreateUserButton",
    props: {
        active: Boolean,
        address: String,
        email: String,
        password: String,
        termsOfService: Boolean,
        unitedStates: Boolean,
        username: String,
    },
    data() {
        return {
            error: false,
            submitButtonText: 'Submit',
            submitting: false,
            submitted: false
        }
    },
    computed: {
        computedClass() {
            let className = '';

            if (this.error) {
                className = 'error';
            } else if (!this.active) {
                className = 'disabled';
            } else {
                className = 'submit-active';
            }

            return className;
        },
    },
    methods: {
        async submitForm() {
            const { address, email, password, termsOfService, unitedStates, username } = this;

            this.submitting = true;
            this.submitButtonText = 'Waiting...';

            // TODO update with endpoint URL
            const response = await axios.post('/api/submit',
                { address, email, password, termsOfService, unitedStates, username });

            if (response.status === 200) {
                this.submitted = true;
                this.submitting = false;
                this.submitButtonText = 'Success';

                try {
                    chrome.storage.local
                        .set({ registered: true })
                        .then(() => {
                            console.log("User succesfully registered!");
                        });
                    try {
                        chrome.storage.local
                            .set({ loggedIn: true })
                            .then(() => {
                                console.log("User succesfully logged in.");
                            });
                    } catch (err) {
                        console.log('Error updating extension logged in status:', err);
                    }
                } catch (err) {
                    console.log('Error updating extension registered and logged in status:', err);
                }
            } else {
                this.error = true;
                this.submitButtonText = 'Try again later';
                console.log('Error submitting registration');
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

#submit-button-container {
    margin-top: 3rem;
    margin-bottom: 3rem;
    width: 450px;
}

#submit-button {
    background: #060708;
    cursor: pointer;
    float: left;
    font-size: 1.25rem;
    width: 50%;
    padding: 0.5rem 0.75rem;
}

.submit-active {
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
