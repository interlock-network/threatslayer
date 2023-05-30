<template>
    <div id="submit-button-container">
        <!-- TODO fix this -->
        <button id='submit-button' @click="submitForm()" @input="validateName" :class="error ? 'error' : computedClass"
            :disabled="submitting || submitted">
            {{ submitButtonText }}
        </button>
    </div>
</template>

<script>
import axios from "axios";
import { Buffer } from "buffer";
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';
import { createMessage, encrypt, readMessage } from 'openpgp';

export default {
    name: "SubmitButton",
    props: {
        active: Boolean,
        mnemonic: String,
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
    watch: {
        active: function (newVal, oldVal) {
            if (!oldVal && newVal) {
                document.getElementById('submit-button').focus();
            } else if (oldVal && !newVal) {
                document.getElementById('submit-button').blur();
            }
        },
    },
    computed: {
        computedClass() {
            return this.active && this.mnemonic && this.password && this.termsOfService && this.unitedStates && this.username ? 'submit-active' : 'disabled';
        },
    },
    methods: {
        // TODO encrypt the mnemonic to store in the browser
        async encrypt() {
            const mnemonicBuffer = Buffer.from(this.mnemonic);
            const message = await createMessage({ binary: mnemonicBuffer });
            const encrypted = await encrypt({
                message,
                passwords: [this.password],
                format: 'binary'
            });

            const encryptedArray = Buffer.from(encrypted);
            const encryptedMessage = await readMessage({ binaryMessage: encryptedArray });

            return encryptedMessage;
        },
        async submitForm() {
            const { password, mnemonic, termsOfService, unitedStates, username, } = this;
            this.submitting = true;
            this.submitButtonText = 'Waiting...';

            const keyring = new Keyring();
            const pair = keyring.addFromUri(mnemonic, { name: username }, 'ed25519');

            const address = pair.address;
            const message = stringToU8a(username);
            const signature = pair.sign(message);

            // TODO update with endpoint URL
            const response = await axios.post('/api/submit',
                { address, password, signature, termsOfService, unitedStates, username });

            if (response.status === 200) {
                // TODO store encrypted mnemonic
                this.submitted = true;
                this.submitting = false;
                this.submitButtonText = 'Success';
            } else {
                // TODO catch errors properly
                this.submitting = false;
                this.error = true;
                this.submitButtonText = 'Error';
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
    outline: none;
    pointer-events: initial;
}

.error {
    color: red;
}

.disabled {
    border: 1px solid #d0d4d9;
    color: #d0d4d9;
    pointer-events: none;
}
</style>
