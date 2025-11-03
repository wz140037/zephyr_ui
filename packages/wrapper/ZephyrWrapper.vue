<script lang="ts">
export default {
  name: "ZephyrWrapper",
};
</script>

<script setup lang="ts">
import { computed, isVNode, ref } from 'vue'

export interface ZephyrWrapperProps {
  is?: any         // 可以是字符串、组件、VNode、或函数返回VNode
  show?: boolean   // 是否包裹
  isProps?: any    // 外层组件的props
}

const props = defineProps<ZephyrWrapperProps>()

/**
 * 计算要渲染的外层组件类型
 */
const wrapperType = computed(() => {
  const target = props.is

  if (!target) return null

  // ① 是 VNode（如 h(ElTooltip) 或 JSX）
  if (isVNode(target)) return target.type

  // ② 是函数（比如 ()=> <ElTooltip />）
  if (typeof target === 'function') {
    const vnode = target()
    return isVNode(vnode) ? vnode.type : vnode
  }

  // ③ 是组件对象（如 ElTooltip）
  if (typeof target === 'object') return target

  // ④ 是字符串（如 'ElTooltip'）
  if (typeof target === 'string') return target

  return null
})

/**
 * 获取传入组件的 props
 */
const wrapperProps = computed(() => {
  const target = props.is
  const componentProps = props.isProps ?? {}
  if (!target) return componentProps
  if (isVNode(target)) return {
    ...target.props,
    ...componentProps
  }
  if (typeof target === 'function') {
    const vnode = target()
    return isVNode(vnode) ? {
      ...vnode.props,
      ...componentProps
    } : componentProps
  }
  return componentProps
})

// 是否使用默认插槽
const isUseDefault = ref(true)
const setDefault = () => {
  isUseDefault.value = false
}

</script>

<template>
  <component v-if="wrapperType && show" :is="wrapperType" v-bind="wrapperProps">
    {{ setDefault() }}
    <slot />
  </component>
  <slot v-if="isUseDefault" />
</template>

<style scoped lang="scss"></style>