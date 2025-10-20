<template>
  <button class="zz-button" :class="`zz-button--${type}`">
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

defineProps({
  type: {
    type: String as PropType<'primary' | 'success' | 'warning' | 'danger'>,
    default: 'primary'
  }
})
</script>

<script lang="ts">
export default {
  name: "ZzButton",
};
</script>

<style scoped lang="scss">
.zz-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;

  &--primary {
    background: #409eff;
    color: white;
  }

  &--success {
    background: #67c23a;
    color: white;
  }

  &--warning {
    background: #e6a23c;
    color: white;
  }

  &--danger {
    background: #f56c6c;
    color: white;
  }
}
</style>