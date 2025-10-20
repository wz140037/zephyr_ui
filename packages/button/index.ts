import type { App } from 'vue'
import ZzButton from './ZzButton.vue'

ZzButton.install = (app: App) => {
  app.component('ZzButton', ZzButton)
}

export default ZzButton
