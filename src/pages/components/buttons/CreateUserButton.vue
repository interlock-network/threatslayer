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
import { baseUrl, setChromeStorage } from '../../../utilities.js';

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
            const { address, email, password, referrer, termsOfService: terms_of_service, unitedStates: united_states, username } = this;
            const key = 'threatslayer-api-key';
            this.submitting = true;
            this.submitButtonText = 'Waiting...';

            if (!address.length || !email.length || !password.length || !terms_of_service || !united_states || !username.length) {
                this.submitButtonText = 'Incomplete';
                this.error = true;

                return;
            }

            // TODO update with endpoint URL
            const response = await axios.post(`${baseUrl}/user-create`, { address, email, key, password, referrer, terms_of_service, united_states, username })
                .then(res => {
                    console.log('res', res);
                    return res;
                }).catch(err => {
                    console.log('Error registering:', err);
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
                setChromeStorage({ address });
                setChromeStorage({ email });
                setChromeStorage({ key: response.data.key });
                setChromeStorage({ username });

                const loggedInSynched = await setChromeStorage({ loggedIn: true });
                // TODO improve this try/catch block
                if (loggedInSynched) {
                    try {
                        setChromeStorage({ registered: true });
                    } finally {
                        this.selectPage('faq');
                    }
                } else {
                    // TODO update error message to be an object
                    this.errorArr.push('Error registering. Please try again later.')
                }
            } else {
                console.log('Error submitting registration:', errors);

                this.error = true;
                this.errorArr = [errors, ...this.errorArr];
                this.submitButtonText = 'Try again later';
            }
        }
    }
};
</script>

<style></style>
