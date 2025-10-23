import type { App } from 'vue'
import ZzButton from './button'
import ZephyrEditor from './editor'

const components = [ZzButton, ZephyrEditor]

export { ZzButton, ZephyrEditor }

export default {
  install(app: App) {
    components.forEach(c => app.component((c as any).name || 'ZzButton', c))
  }
}