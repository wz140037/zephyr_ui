import ZzButton from './button'
import ZephyrEditor from './editor'
import ZephyrWrapper from './wrapper'
import ZephyrAudioConverter from './audio'
import { ZephyrForm, ZephyrFormItem } from './form'
import type { App } from 'vue'

const components = [ZzButton, ZephyrEditor, ZephyrWrapper, ZephyrAudioConverter
  , ZephyrForm, ZephyrFormItem
]

export { ZzButton, ZephyrEditor, ZephyrWrapper, ZephyrAudioConverter, ZephyrForm }

export default {
  install(app: App) {
    components.forEach(c => app.component((c as any).name || 'ZzButton', c))
  }
}