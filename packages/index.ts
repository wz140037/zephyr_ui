import type { App } from 'vue'
import ZzButton from './button'
import ZephyrEditor from './editor'
import ZephyrWrapper from './wrapper'

const components = [ZzButton, ZephyrEditor, ZephyrWrapper]

export { ZzButton, ZephyrEditor, ZephyrWrapper }

export default {
  install(app: App) {
    components.forEach(c => app.component((c as any).name || 'ZzButton', c))
  }
}