<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { ZephyrForm } from '../packages/form'
import { mockData } from './config/mock';

const zephyrFormRef = useTemplateRef<InstanceType<typeof ZephyrForm>>('zephyrForm')

onMounted(() => {
  zephyrFormRef.value?.setDefaultValues({
    // 是否感兴趣
    isInterested: true,
  })
})

</script>

<template>
  <div class="demo-container">
    <ZephyrForm :virtual="true" ref="zephyrForm" :form-items="mockData" />
  </div>
</template>
<style scoped>
.demo-container {
  width: 400px;
  height: 600px;
  background-color: #f5f5f5;
  margin: 10px auto;
  padding: 10px;
}
</style>