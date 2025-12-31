import { SpatialStrengthPreset } from '../spatial/spatialPresets'
import { getPositionByTime } from '../spatial/spatialTrajectory'
import type { SpatialOptions } from '../spatial/spatialTypes'

export async function renderSpatialAudio(
  audioBuffer: AudioBuffer,
  options: SpatialOptions
): Promise<AudioBuffer> {
  const { mode, strength, period } = options

  const ctx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  )

  const source = ctx.createBufferSource()
  source.buffer = audioBuffer

  const panner = ctx.createPanner()
  panner.panningModel = 'HRTF'
  panner.distanceModel = 'inverse'

  source.connect(panner).connect(ctx.destination)

  const { radius, elevation } = SpatialStrengthPreset[strength]

  const duration = audioBuffer.duration
  const step = 0.05 // 50ms

  for (let t = 0; t <= duration; t += step) {
    const pos = getPositionByTime(
      mode,
      t,
      period,
      radius,
      elevation
    )

    panner.positionX.setValueAtTime(pos.x, t)
    panner.positionY.setValueAtTime(pos.y, t)
    panner.positionZ.setValueAtTime(pos.z, t)
  }

  source.start(0)
  return await ctx.startRendering()
}
