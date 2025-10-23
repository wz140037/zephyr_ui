<script setup lang="ts">
import * as monaco from 'monaco-editor-core'
import { ref } from 'vue';

// ZephyrEditor====Demo
const code = ref('import { ref } from "vue";\n\nconst count = ref(0);\n\nfunction increment() {\n  count.value++;\n}')

const options: monaco.editor.IStandaloneEditorConstructionOptions = {
  language: 'javascript',
  theme: 'github-dark',
  automaticLayout: true,
  scrollBeyondLastLine: false,
  minimap: { // 关闭小地图
    enabled: false,
  },
  fontSize: 14,
  wordWrap: 'off', // 自动换行
}

</script>

<template>
  <div class="container">
    <ZephyrEditor v-model="code" :options="options"></ZephyrEditor>
  </div>
</template>

<style scoped>
.container {
  width: 50vw;
  height: 50vh;
  /* 居中 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>