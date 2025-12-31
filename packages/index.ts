import type { App } from 'vue'
import ZzButton from './button'
import ZephyrEditor from './editor'
import ZephyrWrapper from './wrapper'
import ZephyrAudioConverter from './audio/index'

const components = [ZzButton, ZephyrEditor, ZephyrWrapper, ZephyrAudioConverter]

export { ZzButton, ZephyrEditor, ZephyrWrapper, ZephyrAudioConverter }

export default {
  install(app: App) {
    components.forEach(c => app.component((c as any).name || 'ZzButton', c))
  }
}