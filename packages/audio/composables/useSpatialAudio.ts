// packages/audio/composables/useSpatialAudio.ts
import { ref } from 'vue'
import { getAudioContext } from '../core/audioContext'
import {
  createSpatialGraph,
  updateSpatialParams,
  type SpatialGraph,
} from '../core/spatialGraph'
import type { SpatialParams } from '../types'

export function useSpatialAudio() {
  const ctx = getAudioContext()

  const buffer = ref<AudioBuffer | null>(null)
  const graph = ref<SpatialGraph | null>(null)

  async function load(file: File) {
    const arrayBuffer = await file.arrayBuffer()
    buffer.value = await ctx.decodeAudioData(arrayBuffer)
  }

  async function play() {
    if (!buffer.value) return

    if (ctx.state !== 'running') {
      await ctx.resume()
    }

    graph.value = createSpatialGraph(ctx, buffer.value)
    graph.value.source.start()
  }

  function update(params: SpatialParams) {
    if (!graph.value) return
    updateSpatialParams(graph.value.panner, params)
  }

  function stop() {
    graph.value?.source.stop()
    graph.value = null
  }

  return {
    load,
    play,
    update,
    stop,
  }
}