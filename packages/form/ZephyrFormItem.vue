<script setup lang="ts">
import { inject, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Schema from 'async-validator'
import type { FormContext, FormField } from './types'

interface Props {
  label?: string
  prop?: string,
  rules?: any[]
}

const props = defineProps<Props>()
const form = inject<FormContext>('ZephyrForm')

if (!form) {
  throw new Error('ZephyrFormItem must be used inside ZephyrForm')
}

const errorMessage = ref('')
const isError = ref(false)
async function validate(trigger?: string) {
  if (!props.rules?.length) return true
  if (!props.prop) return true
  // 根据 trigger 过滤规则
  const filteredRules = props.rules.filter(rule => {
    if (!rule.trigger) return true
    if (!trigger) return true

    if (Array.isArray(rule.trigger)) {
      return rule.trigger.includes(trigger)
    }

    return rule.trigger === trigger
  })

  if (!filteredRules.length) return true

  const validator = new Schema({
    [props.prop]: filteredRules
  })

  try {
    await validator.validate({
      [props.prop]: form?.model[props.prop]
    })

    isError.value = false
    errorMessage.value = ''
    return true
  } catch (err: any) {
    isError.value = true
    errorMessage.value = err.errors?.[0]?.message ?? '校验失败'
    return false
  }
}

const clearValidate = () => {
  errorMessage.value = ''
}

const resetField = () => {
  if (!props.prop) return
  form.model[props.prop] = undefined
  clearValidate()
}

const field: FormField = {
  prop: props.prop,
  validate,
  clearValidate,
  resetField,
  setError: msg => (errorMessage.value = msg)
}

onMounted(() => form.addField(field))
onBeforeUnmount(() => form.removeField(field))

watch(
  () => form.model[props.prop!],
  () => validate('change')
)

defineExpose({
  validate,
  clearValidate() {
    isError.value = false
    errorMessage.value = ''
  }
})

</script>

<template>
  <div v-bind="$attrs" class="zephyr-form-item">
    <slot />
    <div v-if="errorMessage" class="form-error">
      {{ errorMessage }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.form-error {
  color: #CD4949;
  font-size: 12px;
}
</style>