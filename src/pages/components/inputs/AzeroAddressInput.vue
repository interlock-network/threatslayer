<template>
    <input @input="validateWalletAddress" v-model.trim="walletAddress" required :class="inputClass"
        :placeholder="$i18n(placeholder)" :tabindex="tabindex" />
    <ErrorMessage v-if="errorMessage.length" :msg="$i18n(errorMessage)" single />
</template>

<script>
import { debounce } from 'debounce';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

import ErrorMessage from "../ErrorMessage.vue";

export default {
    name: 'AzeroAddressInput',
    components: {
        ErrorMessage
    },
    props: {
        placeholder: { type: String, default: 'enter_azero_wallet_address_optional' },
        tabindex: { type: Number, default: 4 }
    },
    data() {
        return {
            walletAddress: '',
            errorMessage: ''
        }
    },
    computed: {
        inputClass() {
            return this.errorMessage?.length ? 'generic-error' : '';
        }
    },
    methods: {
        validateAzero(address = '') {
            let result = true;
            const azeroRegex = /^5.*/;

            if (address.length && !azeroRegex.test(address)) {
                result = false;
            }

            return result;
        },
        validateWalletAddress: debounce(function () {
            let result = 'error';
            const walletAddress = this.walletAddress;

            if (!walletAddress || !walletAddress.length) {
                result = '';
            } else {
                const addressIsValid = this.validPolkadot(walletAddress);

                if (!this.validateAzero(walletAddress)) {
                    result = 'warning_address_not_azero';
                }
                // happy case
                else if (addressIsValid) {
                    result = '';
                } else {
                    result = 'error_registering_wallet_address';
                }
            }

            const hasError = !!result.length;

            this.errorMessage = result;
            this.$emit('currentAzeroAddress', walletAddress);
            this.$emit('azeroAddressHasError', hasError);
        }, 250),
        validPolkadot(address) {
            try {
                encodeAddress(
                    isHex(address)
                        ? hexToU8a(address)
                        : decodeAddress(address)
                );

                return true;
            } catch (_error) {
                return false;
            }
        }
    }
}
</script>

<style></style>
