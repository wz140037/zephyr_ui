import { createApp } from 'vue'
import App from './App.vue'
import ZephyrUI from '../packages'
import 'element-plus/dist/index.css'

const app = createApp(App);
app.use(ZephyrUI);
app.mount('#app');