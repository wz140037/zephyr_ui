<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

import { decodeFileToAudioBuffer } from './core/audioContext'
import { renderSpatialAudio } from './core/spatialRenderer'
import { encodeWav } from './core/wavEncoder'
import { createSpatialPreviewPlayer } from './core/spatialPreviewPlayer'

import type {
  SpatialMode,
  SpatialStrength,
  SpatialOptions
} from './spatial/spatialTypes'

/* ================= 状态 ================= */

const file = ref<File | null>(null)
const audioName = ref('')

const mode = ref<SpatialMode>('left-to-right')
const strength = ref<SpatialStrength>('medium')
const period = ref(5)

const loading = ref(false)
const previewing = ref(false)

const fileInputRef = ref<HTMLInputElement | null>(null)

let previewPlayer: ReturnType<typeof createSpatialPreviewPlayer> | null = null

function getOptions(): SpatialOptions {
  return {
    mode: mode.value,
    strength: strength.value,
    period: Math.max(3, period.value)
  }
}

/* ================= 上传 ================= */

function triggerUpload() {
  fileInputRef.value?.click()
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.[0]) return

  stopPreview()
  file.value = input.files[0]
  audioName.value = input.files[0].name
}

/* ================= 试听 ================= */

async function handlePreview() {
  if (!file.value || previewing.value) return
  loading.value = true

  try {
    const buffer = await decodeFileToAudioBuffer(file.value)
    previewPlayer?.stop()

    previewPlayer = createSpatialPreviewPlayer(buffer, getOptions())
    previewPlayer.play()
    previewing.value = true
  } finally {
    loading.value = false
  }
}

function stopPreview() {
  previewPlayer?.stop()
  previewPlayer = null
  previewing.value = false
}

/* ================= 导出 ================= */

async function handleExport() {
  if (!file.value) return
  stopPreview()
  loading.value = true

  try {
    const buffer = await decodeFileToAudioBuffer(file.value)
    const rendered = await renderSpatialAudio(buffer, getOptions())
    const wav = encodeWav(rendered)

    const url = URL.createObjectURL(wav)
    const a = document.createElement('a')
    a.href = url
    a.download = `spatial-${audioName.value || 'audio'}.wav`
    a.click()
    URL.revokeObjectURL(url)
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(stopPreview)
</script>

<template>
  <div class="zephyr-card">
    <!-- Header -->
    <header class="header">
      <div class="title">Zephyr Spatial Audio</div>
      <div class="sub">生成固定空间轨迹的 3D 音频</div>
    </header>

    <!-- 上传 -->
    <div class="upload-box" @click="triggerUpload">
      <div class="upload-left">
        <span class="icon">🎧</span>
        <span class="text">
          {{ audioName || '选择一首音乐文件' }}
        </span>
      </div>

      <button
        class="upload-btn"
        type="button"
        @click.stop="triggerUpload"
      >
        选择文件
      </button>

      <input
        ref="fileInputRef"
        class="file-input"
        type="file"
        accept="audio/*"
        @change="handleFileChange"
      />
    </div>

    <!-- 参数 -->
    <div class="panel">
      <div class="row">
        <label>空间模式</label>
        <select v-model="mode">
          <option value="left-to-right">左 → 右</option>
          <option value="right-to-left">右 → 左</option>
          <option value="circle">环绕</option>
          <option value="front-back">前 ↔ 后</option>
        </select>
      </div>

      <div class="row">
        <label>空间强度</label>
        <select v-model="strength">
          <option value="weak">弱</option>
          <option value="medium">中</option>
          <option value="strong">强</option>
        </select>
      </div>

      <div class="row">
        <label>空间周期</label>
        <div class="inline">
          <input
            type="number"
            min="3"
            step="1"
            v-model.number="period"
          />
          <span class="unit">秒 / 次</span>
        </div>
      </div>
    </div>

    <!-- 操作 -->
    <div class="actions">
      <button
        class="btn ghost"
        :disabled="!file || loading || previewing"
        @click="handlePreview"
      >
        试听
      </button>

      <button
        class="btn ghost"
        :disabled="!previewing"
        @click="stopPreview"
      >
        停止
      </button>

      <button
        class="btn primary"
        :disabled="!file || loading"
        @click="handleExport"
      >
        生成空间音频
      </button>
    </div>

    <div v-if="loading" class="loading">处理中…</div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.zephyr-card {
  width: 100%;
  max-width: 420px;
  padding: 16px;
  background: #fafafa;
  border-radius: 10px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1f2937;
}

/* Header */
.header {
  margin-bottom: 12px;
}

.title {
  font-size: 15px;
  font-weight: 600;
}

.sub {
  font-size: 12px;
  color: #6b7280;
}

/* 上传 */
.upload-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  padding: 10px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
}

.upload-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.upload-left .text {
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload-btn {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 14px;
  background: #ec4141;
  color: #fff;
  border: none;
  cursor: pointer;
}

.file-input {
  display: none;
}

/* 参数 */
.panel {
  margin-top: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  display: grid;
  gap: 12px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.row label {
  font-size: 12px;
  color: #6b7280;
  flex-shrink: 0;
}

.row select,
.row input {
  width: 140px;
  padding: 6px 8px;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.inline {
  display: flex;
  align-items: center;
  gap: 6px;
}

.unit {
  font-size: 12px;
  color: #9ca3af;
}

/* 操作 */
.actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1.4fr;
  gap: 8px;
  margin-top: 14px;
}

.btn {
  padding: 10px 0;
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
}

.btn.primary {
  background: #ec4141;
  color: #fff;
  border: none;
}

.btn.ghost {
  background: #fff;
  border: 1px solid #e5e7eb;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 状态 */
.loading {
  margin-top: 10px;
  font-size: 12px;
  color: #ec4141;
}

/* ================== 响应式 ================== */

@media (max-width: 480px) {
  .row {
    flex-direction: column;
    align-items: stretch;
  }

  .row select,
  .row input {
    width: 100%;
  }

  .actions {
    grid-template-columns: 1fr;
  }

  .btn {
    font-size: 14px;
  }
}

@media (max-width: 360px) {
  .upload-btn {
    display: none;
  }
}
</style>