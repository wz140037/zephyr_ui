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

const emits = defineEmits(['update:modelValue', 'load'])
// 高亮器
let highlighter: Highlighter | null = null
const monacoEditorRef = ref<HTMLDivElement | null>(null)
let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null

// 注册提示词
const registerCompletionItemProvider = (languageSelector: monaco.languages.LanguageSelector, provider: monaco.languages.CompletionItemProvider) => {
  if (!monacoEditor) return
  monaco.languages.registerCompletionItemProvider(languageSelector, provider)
}

// 切换主题
const changeTheme = (theme: BundledTheme) => {
  if (!highlighter) return
  return highlighter.registerTheme(theme).then(() => {
    monaco.editor.setTheme(theme)
  }).catch(err => {
    console.error(err)
  })
}

// 注册语言
const registerLanguage = (language: BundledLanguage) => {
  if (!highlighter) return
  return highlighter.registerLanguage(language).then(()=>{
    monaco.languages.register(language as any)
  })
}

onMounted(async () => {
  if (!monacoEditorRef.value) return
  highlighter = new Highlighter()
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
      monaco.editor.setTheme(props.options?.theme as BundledTheme)
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
    emits('load', { state: 'success', editor: monacoEditor, highlighter, highlighterInstance })
  } catch (error) {
    console.log('editor is init failed', error);
    emits('load', { state: 'error', error })
  }
})

onUnmounted(() => {
  if (monacoEditor) monacoEditor.dispose()
})

defineExpose({
  // 注册提示词
  registerCompletionItemProvider,
  // 注册/切换主题
  changeTheme,
  // 注册语言
  registerLanguage,
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