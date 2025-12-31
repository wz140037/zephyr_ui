// packages/audio/core/audioContext.ts
let ctx: AudioContext | null = null

export function getAudioContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
    ctx.listener.positionX.setValueAtTime(0, ctx.currentTime)
    ctx.listener.positionY.setValueAtTime(0, ctx.currentTime)
    ctx.listener.positionZ.setValueAtTime(0, ctx.currentTime)
  }
  return ctx
}