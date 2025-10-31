import { createApp } from 'vue'
import App from './App.vue'
import ZephyrUI from '../packages'
// import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);
app.use(ZephyrUI);
// app.use(ElementPlus);
app.mount('#app');