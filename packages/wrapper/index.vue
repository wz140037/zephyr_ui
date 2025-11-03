<!-- index.vue -->
<!--
 * new page
 * @author: wzzz
 * @since: 2025-11-03
-->
<script lang="ts">
export default {
  name: "ZephyrWrapper",
};
</script>
<script setup lang="ts">
import WrapperVue from './helper'
import { computed, nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  is: { type: [String, Object, Function], default: null },
  show: { type: Boolean, default: true },
  isProps: { type: Object, default: () => ({}) },
})

const wrapperRef = ref()
const hiddenComponent = ref(false)
const isUseDefault = computed(() => {
  console.log('cccc', Object.keys(wrapperRef.value ?? {}));
  return Object.keys(wrapperRef.value ?? {}).length === 0
})

onMounted(()=>{
  nextTick(()=>{
    hiddenComponent.value = true
  })
})

</script>

<template>
  <component v-if="show && !hiddenComponent" ref="wrapperRef" :is="is"></component>
  <WrapperVue v-if="hiddenComponent" v-bind="$attrs" />
  <slot v-if="isUseDefault"></slot>
</template>

<style scoped lang="scss"></style>