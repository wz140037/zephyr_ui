import type { App } from 'vue'
import ZzButton from './button'

const components = [ZzButton]

export { ZzButton }

export default {
  install(app: App) {
    components.forEach(c => app.component((c as any).name || 'ZzButton', c))
  }
}