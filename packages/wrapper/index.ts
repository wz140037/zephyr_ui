import type { App } from 'vue'
import ZephyrWrapper from './index.vue'

ZephyrWrapper.install = (app: App) => {
  app.component('ZephyrWrapper', ZephyrWrapper)
}

export default ZephyrWrapper