<template>
    <input @input="validateWalletAddress" v-model.trim="wallet" required :class="inputClass"
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
            errorMessage: '',
            wallet: ''
        }
    },
    computed: {
        inputClass() {
            return this.errorMessage?.length ? 'generic-error' : '';
        }
    },
    methods: {
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
                const addressIsValid = this.validPolkadot(wallet);

                if (!this.validateAzero(wallet)) {
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
            this.$emit('currentAzeroAddress', wallet);
            this.$emit('azeroAddressHasError', hasError);
        }, 250),
        validPolkadot(wallet) {
            try {
                encodeAddress(
                    isHex(wallet)
                        ? hexToU8a(wallet)
                        : decodeAddress(wallet)
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
