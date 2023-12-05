<template>
    <input @input="validateWalletAddress" v-model.trim="wallet" required :class="inputClass"
        :placeholder="$i18n('enter_wallet_address_optional')" :tabindex="tabindex" />
    <ErrorMessage v-if="errorMessage.length" :msg="$i18n(errorMessage)" single />
</template>

<script>
import { debounce } from 'debounce';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import { isAddress } from 'web3-validator';

import ErrorMessage from "../ErrorMessage.vue";

export default {
    name: 'AddressInput',
    components: {
        ErrorMessage
    },
    props: {
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
        validateArbitrum(wallet) {
            return isAddress(wallet);
        },
        validateWalletAddress: debounce(function () {
            let result = 'error';
            const wallet = this.wallet;

            if (!wallet?.length) {
                result = '';
            } else {
                const isArbitrum = this.validateArbitrum(wallet);
                const isAzero = this.validPolkadot(wallet);

                if (!this.validateAzero(wallet) && !isArbitrum) {
                    result = 'warning_invalid_address';
                }
                // happy case
                else if (isArbitrum || isAzero) {
                    result = '';
                } else {
                    result = 'error_registering_wallet_address';
                }
            }

            const hasError = !!result.length;

            this.errorMessage = result;
            this.$emit('currentAddress', wallet);
            this.$emit('addressHasError', hasError);
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
