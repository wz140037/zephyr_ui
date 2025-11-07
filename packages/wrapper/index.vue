<script lang="ts">
export default {
  name: "ZephyrWrapper",
};
</script>
<script setup lang="ts">
import WrapperVue from './helper'

import { useElementSize } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps({
  is: { type: [String, Object, Function], default: null },
  show: { type: Boolean, default: true },
  isProps: { type: Object, default: () => ({}) },
})

const wrapperRef = ref()
const { height } = useElementSize(wrapperRef)

</script>

<template>
  <div class="zephyr-ui_wrapper">
    <div class="zephyr-wrapper_container" ref="wrapperRef">
      <WrapperVue v-bind="props">
        <template #[slotK] v-for="(slotK, _) in Object.keys($slots)" :key="slotK">
          <slot :name="slotK"></slot>
        </template>
      </WrapperVue>
    </div>
    <slot v-if="!height"></slot>
  </div>
</template>

<style scoped lang="scss"></style>