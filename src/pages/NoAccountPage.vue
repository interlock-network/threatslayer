<template>
    <PageBanner>
        <img class="banner-icon" src="/src/assets/images/account.png">{{ $i18n('account_info') }}
    </PageBanner>
    <WarningTextBox v-if="!loggedIn" :msg="$i18n('warning_must_login_to_earn_etc')">
        <br />
        <br />
        <RegisterLine :checkState="checkState" :selectPage="selectPage" /><br />
        <LoginLine :selectPage="selectPage" />
    </WarningTextBox>
    <br />
    <div>
        <TextComponent :msg="$i18n('ilock_earned')" bold /> <br />
        <TextComponent msg="0" mono /> <br />
        <br />
        <br />
        <!-- Tabe of allowlisted URLs -->
        <AllowlistTable apiKey="" />
    </div>
</template>
<script>
import AllowlistTable from './components/AllowlistTable.vue';
import LineOfText from './components/LineOfText.vue';
import LoginLine from './components/LoginLine.vue';
import PageBanner from './components/PageBanner.vue';
import RegisterLine from './components/RegisterLine.vue';
import TextComponent from './components/TextComponent.vue';
import WarningTextBox from './components/WarningTextBox.vue';

export default {
    name: 'NoAccountPage',
    components: {
        AllowlistTable,
        LineOfText,
        LoginLine,
        PageBanner,
        RegisterLine,
        TextComponent,
        WarningTextBox
    },
    props: {
        checkState: Function,
        selectPage: Function,
    }
}
</script>

<style>
#cancel-change-address {
    background-color: #0F0818;
    border: none;
    color: red;
    float: right;
    font-size: 1rem;
    padding-right: 50px;
}

#update-address-button {
    background-color: #0F0818;
    border: none;
    color: #9000CB;
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
    width: 400px;
}

#url-container {
    min-height: 25vh;
    overflow-y: scroll;
    margin-bottom: 4rem;
}

#url-container::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 4px;
}

#url-container::-webkit-scrollbar-track {
    background: inherit;
    border-radius: 2px;
}

#url-container::-webkit-scrollbar-thumb {
    background: #d0d4d9;
    border-radius: 2px;
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
}
</style>
