import { SpatialStrengthPreset } from '../spatial/spatialPresets'
import { getPositionByTime } from '../spatial/spatialTrajectory'
import type { SpatialOptions } from '../spatial/spatialTypes'

export function createSpatialPreviewPlayer(
  audioBuffer: AudioBuffer,
  options: SpatialOptions
) {
  const ctx = new AudioContext()

  const source = ctx.createBufferSource()
  source.buffer = audioBuffer
  source.loop = true

  const panner = ctx.createPanner()
  panner.panningModel = 'HRTF'
  panner.distanceModel = 'inverse'

  source.connect(panner).connect(ctx.destination)

  const { radius, elevation } = SpatialStrengthPreset[options.strength]
  const startTime = ctx.currentTime

  let rafId = 0

  function tick() {
    const t = ctx.currentTime - startTime
    const pos = getPositionByTime(
      options.mode,
      t,
      options.period,
      radius,
      elevation
    )

    panner.positionX.value = pos.x
    panner.positionY.value = pos.y
    panner.positionZ.value = pos.z

    rafId = requestAnimationFrame(tick)
  }

  return {
    play() {
      ctx.resume()
      source.start()
      tick()
    },
    stop() {
      cancelAnimationFrame(rafId)
      source.stop()
      ctx.close()
    }
  }
}