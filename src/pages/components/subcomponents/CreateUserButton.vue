<template>
    <div id="submit-button-container">
        <button id='submit-button' @click="submitForm()" class="submit-button" :class="computedClass"
            :disabled="submitting || submitted">
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
        changePage: Function,
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
                className = 'submit-button-error';
            } else if (!this.active) {
                className = 'submit-button-disabled';
            } else {
                className = 'submit-button-active';
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
            const response = await axios.post('/api/submit', { address, email, password, termsOfService, unitedStates, username })
                .then(res => {
                    return res;
                }).catch(err => {
                    return err;
                });

            if (response?.status === 200) {
                this.submitted = true;
                this.submitting = false;
                this.submitButtonText = 'Success';

                let loggedInSynched = false;

                // TODO improve this try/catch block
                try {
                    loggedInSynched = await chrome.storage.local
                        .set({ loggedIn: true })
                        .then(() => {
                            console.log("User succesfully logged in.");

                            return true;
                        });
                } catch (err) {
                    console.log('Error updating extension logged in status:', err);
                }

                try {
                    chrome.storage.local
                        .set({ registered: true })
                        .then(() => {
                            console.log("User succesfully registered!");

                            return true;
                        });
                } catch (err) {
                    console.log('Error updating extension registered and logged in status:', err);
                }

                if (loggedInSynched) {
                    changePage('user');
                }
            } else {
                console.log('Error submitting registration:', response?.code);

                this.error = true;
                this.submitButtonText = 'Try again later';
            }
        }
    }
};
</script>

<style></style>
