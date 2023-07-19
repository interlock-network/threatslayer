<template>
    <PageBanner msg="">
        <img class="banner-icon" src="/src/assets/images/account.png">Account info for {{ username }}
    </PageBanner>
    <br />
    <LineOfText msg="Email" bold />
    <LineOfText msg="">{{ email }}</LineOfText>
    <br />
    <br />
    <br />
    <LineOfText msg="Wallet Address" bold />
    <LineOfText msg="">{{ address }}</LineOfText>
</template>
<script>
import LineOfText from "./components/subcomponents/LineOfText.vue";
import PageBanner from "./components/subcomponents/PageBanner.vue";

import { getChromeStorage } from '../utilities.js';

export default {
    name: 'AccountPage',
    components: {
        LineOfText,
        PageBanner
    },
    data() {
        return {
            email: '',
            username: '',
            address: '',
        };
    },
    mounted() {
        this.getUserInfo();
    },
    methods: {
        async getUserInfo() {
            const email = await getChromeStorage('email');
            const username = await getChromeStorage('username');
            const address = await getChromeStorage('address');

            this.email = email;
            this.username = username;
            this.address = address;
        }
    }
}
</script>
  
<style>
.socials-icon {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>
  