import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ZephyrUI from '../packages'

const pinia = createPinia()
const app = createApp(App);
app.use(pinia);
app.use(ZephyrUI);
app.mount('#app');