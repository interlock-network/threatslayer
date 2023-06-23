<template>
    <div id="get-info-button-container">
        <button id='get-info-button' @click="submitForm()" class="submit-button" :class="computedClass"
            :disabled="submitting || submitted">
            {{ getLoginInfoText }}
        </button>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "GetLoginInfoButton",
    props: {
        active: Boolean,
        email: String,
    },
    data() {
        return {
            error: false,
            getLoginInfoText: 'Get Login Info',
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
                className = 'get-info-active';
            }

            return className;
        },
    },
    methods: {
        async submitForm() {
            this.submitting = true;
            this.getLoginInfoText = 'Waiting...';

            // TODO update with endpoint URL
            const response = await axios.post('/api/get-info',
                { email: this.email });

            if (response.status === 200) {
                this.submitted = true;
                this.submitting = false;
                this.getLoginInfoText = 'Info Sent!';
            } else {
                this.error = true;
                this.getLoginInfoText = 'Try again later';
                console.log('Error sending username / password');
            }
        }
    }
};
</script>

<style>
#get-info-button-container {
    margin-top: 3rem;
    margin-bottom: 3rem;
    width: 450px;
}

#get-info-button {
    background: #060708;
    cursor: pointer;
    float: left;
    font-size: 1.25rem;
    width: 50%;
    padding: 0.5rem 0.75rem;
}

.get-info-active {
    border: 3px solid #3b8de8;
    color: #963cf5;
    opacity: 1;
    outline: none;
    pointer-events: initial;
}
</style>
