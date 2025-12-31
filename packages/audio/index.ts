import ZephyrAudioConverter from './ZephyrAudioConverter.vue'

export * from './types'
export * from './composables/useSpatialAudio'

ZephyrAudioConverter.install = (app: any) => {
  app.component('ZephyrAudioConverter', ZephyrAudioConverter)
}

export default ZephyrAudioConverter