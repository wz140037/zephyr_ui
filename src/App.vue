<script setup lang="ts">
import { ref } from 'vue'
import { ZephyrForm } from '../packages/form'
import { formItems, formRules } from './config/mock'
import { ElButton } from 'element-plus'

const formRef = ref()

async function submit() {
  try {
    const values = await formRef.value.getValues({ required: true })
    console.log('校验通过：', values)
  } catch (err) {
    console.log('校验失败')
  }
}
</script>

<template>
  <div :style="{ width: '600px', height: '500px' }">
    <ZephyrForm ref="formRef" :formItems="formItems" :rules="formRules" />
  </div>
  <ElButton type="primary" @click="submit">
    提交
  </ElButton>
</template>