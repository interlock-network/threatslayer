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
        <TextComponent class="left-label" :msg="$i18n('ilock_earned')" bold />
        <TextComponent msg="0" bigmono /> <br />
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
        checkState: { type: Function, required: true },
        selectPage: { type: Function, required: true },
    }
}
</script>

<style>
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
