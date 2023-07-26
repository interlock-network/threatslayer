<template>
    <div>
        <button @click="submitForm()" class="submit-button" :class="computedClass" :disabled="submitting || submitted">
            {{ submitButtonText }}
        </button>
        <!-- TODO add error message here -->
    </div>
</template>

<script>
import axios from "axios";
import { setChromeStorage } from '../../utilities.js';

export default {
    name: "CreateUserButton",
    props: {
        address: String,
        selectPage: Function,
        email: String,
        password: String,
        referrer: String,
        termsOfService: Boolean,
        unitedStates: Boolean,
        username: String,
    },
    data() {
        return {
            error: false,
            errorArr: [],
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
            } else {
                className = 'submit-button-active';
            }

            return className;
        },
    },
    methods: {
        async submitForm() {
            const { address, email, password, referrer, termsOfService, unitedStates, username } = this;

            this.submitting = true;
            this.submitButtonText = 'Waiting...';

            if (!address.length || email.length || password.length || termsOfService || unitedStates || username.length) {
                this.submitButtonText = 'Incomplete';
                this.error = true;

                return;
            }

            // TODO update with endpoint URL
            const response = await axios.post('/api/submit', { address, email, password, referrer, termsOfService, unitedStates, username })
                .then(res => {
                    return res;
                }).catch(err => {
                    console.log('Error logging in:', err);
                    // TODO update error object
                    return { errors: ['Error submitting to API.'] }
                });

            const errors = response.errors;

            // TODO test this
            if (!errors?.length) {
                this.submitted = true;
                this.submitting = false;
                this.submitButtonText = 'Success';

                // set API key with user's unique key
                setChromeStorage({ address }, 'Chrome state for address set after successful registration.', 'Error setting Chrome state for address after successful registration:');
                setChromeStorage({ email }, 'Chrome state for email set after successful registration.', 'Error setting Chrome state for email after successful registration:');
                setChromeStorage({ key: response.key }, 'Chrome state for unique API key set after successful registration.', 'Error setting Chrome state for API key after successful registration:');
                setChromeStorage({ username }, 'Chrome state for username set after successful registration.', 'Error setting Chrome state for username after successful registration:');

                const loggedInSynched = setChromeStorage({ loggedIn: true }, 'Chrome state set to logged in after successful registration.', 'Chrome state not set to logged in after successful registration.');
                // TODO improve this try/catch block
                if (loggedInSynched) {
                    try {
                        setChromeStorage({ registered: true }, 'Chrome state set to registered after successful registration.', 'Chrome state not succesfully set to registered after successful registration.');
                    } finally {
                        this.selectPage('user');
                    }
                } else {
                    // TODO update error message to be an object
                    this.errorArr.push('Error logging in. Please try again later.')
                }
            } else {
                console.log('Error submitting registration:', response.errors);

                this.error = true;
                this.errorArr = [errors, ...this.errorArr];
                this.submitButtonText = 'Try again later';
            }
        }
    }
};
</script>

<style></style>
