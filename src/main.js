import { createApp } from 'vue';
import App from './App.vue';
import i18n from 'vue-plugin-webextension-i18n';

if (process.env.NODE_ENV === 'development') {
    const { worker } = require('./mocks/browser');
    worker.start();
}

createApp(App).use(i18n).mount('#app');
