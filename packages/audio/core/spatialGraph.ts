// packages/audio/core/spatialGraph.ts
import type { SpatialParams } from '../types'

export interface SpatialGraph {
  source: AudioBufferSourceNode
  panner: PannerNode
  gain: GainNode
}

export function createSpatialGraph(
  ctx: AudioContext,
  buffer: AudioBuffer
): SpatialGraph {
  const source = ctx.createBufferSource()
  source.buffer = buffer

  const panner = ctx.createPanner()
  panner.panningModel = 'HRTF'
  panner.distanceModel = 'inverse'
  panner.refDistance = 1
  panner.rolloffFactor = 1

  const gain = ctx.createGain()

  source.connect(panner)
  panner.connect(gain)
  gain.connect(ctx.destination)

  return { source, panner, gain }
}

/**
 * ⚠️ 实时参数更新：必须用 automation
 */
export function updateSpatialParams(
  panner: PannerNode,
  params: SpatialParams
) {
  const t = panner.context.currentTime

  panner.positionX.setTargetAtTime(params.x, t, 0.01)
  panner.positionY.setTargetAtTime(params.y, t, 0.01)
  panner.positionZ.setTargetAtTime(params.z, t, 0.01)
}
