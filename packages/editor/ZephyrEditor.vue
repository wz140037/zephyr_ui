<!--
 * new page
 * @author: wzzz
 * @since: 2025-10-20
 * ZephyrEditor.vue
-->
<script lang="ts">
export default {
  name: "ZephyrEditor",
};
</script>

<script setup lang="ts">
import * as monaco from 'monaco-editor-core'

import { onMounted, onUnmounted, PropType, ref } from 'vue';
import { BundledLanguage, BundledTheme } from 'shiki'
import { shikiToMonaco } from '@shikijs/monaco'
import { Highlighter } from './Highlighter';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Object as PropType<monaco.editor.IStandaloneEditorConstructionOptions>,
    default: null
  },
})

const emits = defineEmits(['update:modelValue'])
// 高亮器
let highlighter: Highlighter | null = null
const monacoEditorRef = ref<HTMLDivElement | null>(null)
let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null

// 获取当前value
const getText = () => {
  return monacoEditor?.getValue() || ''
}

// 注册提示词
const registerCompletionItemProvider = (languageSelector: monaco.languages.LanguageSelector, provider: monaco.languages.CompletionItemProvider) => {
  if (!monacoEditor) return
  monaco.languages.registerCompletionItemProvider(languageSelector, provider)
}

onMounted(async () => {
  if (!monacoEditorRef.value) return
  if (!highlighter) highlighter = new Highlighter()
  try {
    await highlighter.init()
    const highlighterInstance = highlighter.getHighlighter()
    if (!highlighterInstance) return
    if (props.options?.language) {
      await highlighter.registerLanguage(props.options?.language as BundledLanguage)
      // 如果语言不存在，则注册你需要的语言的id
      monaco.languages.register({ id: props.options?.language })
    }
    if (props.options?.theme) {
      await highlighter.registerTheme(props.options?.theme as BundledTheme)
    }

    // 注册 Shiki 主题，并为 Monaco 提供语法高亮
    shikiToMonaco(highlighterInstance, monaco)
    // 创建编辑器
    monacoEditor = monaco.editor.create(monacoEditorRef.value, {
      value: props.modelValue,
      ...(props.options || {})
    })

    monacoEditor.onDidChangeModelContent(() => {
      emits('update:modelValue', monacoEditor?.getValue())
    })
  } catch (error) {
    console.log('editor is init failed', error);
  }
})

onUnmounted(() => {
  if (monacoEditor) monacoEditor.dispose()
})

defineExpose({
  // 获取编辑器内容
  getText,
  // 获取当前实例
  getEditor: () => monacoEditor,
  // 注册提示词
  registerCompletionItemProvider,
  // 获取高亮器
  getHighlighter: () => highlighter
})

</script>

<template>
  <div class="zephyr-editor_container" ref="monacoEditorRef" />
</template>

<style lang="scss" scoped>
.zephyr-editor_container {
  width: 100%;
  height: 100%;
}
</style>