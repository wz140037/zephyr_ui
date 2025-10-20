import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ZephyrUI from '../packages'

const app = createApp(App);
app.use(ZephyrUI);
app.mount('#app');