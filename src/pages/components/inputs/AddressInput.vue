<template>
    <input @input="validateWalletAddress" v-model.trim="wallet" required :class="addressInputClass"
        :placeholder="$i18n('enter_wallet_address_optional')" :tabindex="tabindex" />
    <ErrorMessage v-if="errorMessage.length" :msg="$i18n(errorMessage)" single />
</template>

<script>
import { debounce } from 'debounce';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import { isAddress } from 'ethers';

import ErrorMessage from "../ErrorMessage.vue";

export default {
    name: 'AddressInput',
    components: {
        ErrorMessage
    },
    props: {
        missingSubmitFields: { type: Boolean, default: false },
        tabindex: { type: Number, default: 4 }
    },
    data() {
        return {
            errorMessage: '',
            wallet: ''
        }
    },
    computed: {
        addressInputClass() {
            const { errorMessage, missingSubmitFields, wallet } = this;

            console.log('missingSubmitFields, wallet', missingSubmitFields, wallet);
            let result = '';

            // error bc a required field is missing
            if (missingSubmitFields && !wallet?.length) {
                console.log('here');
                result = 'generic-error';
            } else if (errorMessage?.length) {
                result = 'generic-error';
            }

            console.log('result', result);
            return result;
        }
    },
    methods: {
        validateArbitrumAddress(wallet) {
            return isAddress(wallet);
        },
        validateAzero(wallet = '') {
            let result = true;
            const azeroRegex = /^5.*/;

            if (wallet?.length && !azeroRegex.test(wallet)) {
                result = false;
            }

            return result;
        },
        validateWalletAddress: debounce(function () {
            let result = 'error';
            const wallet = this.wallet;

            if (!wallet?.length) {
                result = '';
            } else {
                const isArbitrum = this.validateArbitrumAddress(wallet);
                const isAzero = this.validateAlephZeroAddress(wallet);

                // happy case
                if (isArbitrum || isAzero) {
                    result = '';
                } else if (!this.isAzero && !isArbitrum) {
                    result = 'warning_invalid_address';
                } else {
                    result = 'error_registering_wallet_address';
                }
            }

            const hasError = !!result.length;

            this.errorMessage = result;
            this.$emit('currentAddress', wallet);
            this.$emit('addressHasError', hasError);
        }, 250),
        validateAlephZeroAddress(wallet) {
            try {
                encodeAddress(
                    isHex(wallet)
                        ? hexToU8a(wallet)
                        : decodeAddress(wallet)
                ) && this.validateAzero(wallet);

                return true;
            } catch (_error) {
                return false;
            }
        }
    }
}
</script>

<style></style>
