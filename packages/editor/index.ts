import type { App } from 'vue'
import ZephyrEditor from './ZephyrEditor.vue'

ZephyrEditor.install = (app: App) => {
  app.component('ZzButton', ZephyrEditor)
}

export default ZephyrEditor