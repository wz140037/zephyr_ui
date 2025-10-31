import type { App } from 'vue'
import ZephyrWrapper from './ZephyrWrapper.vue'

ZephyrWrapper.install = (app: App) => {
  app.component('ZzButton', ZephyrWrapper)
}

export default ZephyrWrapper