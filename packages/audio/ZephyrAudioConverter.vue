<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSpatialAudio } from './composables/useSpatialAudio'
import { defaultSpatialParams, type SpatialParams } from './types'
import { audioBufferToWav } from './core/wavEncoder'

const spatial = ref<SpatialParams>({ ...defaultSpatialParams })
const file = ref<File | null>(null)
const audio = useSpatialAudio()

async function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  file.value = f
  await audio.load(f)
}

watch(
  spatial,
  (v) => audio.update(v),
  { deep: true }
)

async function exportWav() {
  if (!file.value) return

  const ctx = new AudioContext()
  const buffer = await ctx.decodeAudioData(await file.value.arrayBuffer())
  const wav = audioBufferToWav(buffer)

  const url = URL.createObjectURL(wav)
  const a = document.createElement('a')
  a.href = url
  a.download = 'spatial-audio.wav'
  a.click()
}
</script>

<template>
  <div class="zephyr-audio-converter">
    <input type="file" accept="audio/*" @change="onFileChange" />

    <div class="controls">
      <label>X</label>
      <input type="range" min="-1" max="1" step="0.01" v-model="spatial.x" />

      <label>Y</label>
      <input type="range" min="-1" max="1" step="0.01" v-model="spatial.y" />

      <label>Z</label>
      <input type="range" min="-1" max="1" step="0.01" v-model="spatial.z" />
    </div>

    <button @click="audio.play()">播放</button>
    <button @click="audio.stop()">停止</button>
    <button @click="exportWav()">导出 WAV</button>
  </div>
</template>