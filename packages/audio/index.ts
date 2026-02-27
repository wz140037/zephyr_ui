import ZephyrAudioConverter from './ZephyrAudioConverter.vue'

export * from './types'

ZephyrAudioConverter.install = (app: any) => {
  app.component('ZephyrAudioConverter', ZephyrAudioConverter)
}

export default ZephyrAudioConverter