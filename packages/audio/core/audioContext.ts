export function decodeFileToAudioBuffer(file: File): Promise<AudioBuffer> {
  return new Promise(async (resolve) => {
    const arrayBuffer = await file.arrayBuffer()
    const ctx = new AudioContext()
    const buffer = await ctx.decodeAudioData(arrayBuffer)
    ctx.close()
    resolve(buffer)
  })
}