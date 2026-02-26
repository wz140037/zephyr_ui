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
const validate = async (trigger?: string) => {
  if (!props.prop) return true

  let rules = props.rules
  if (!rules?.length) return true

  if (trigger) {
    rules = rules.filter((r: any) => {
      if (!r.trigger) return true
      return Array.isArray(r.trigger)
        ? r.trigger.includes(trigger)
        : r.trigger === trigger
    })
  }

  if (!rules.length) return true

  const validator = new Schema({
    [props.prop]: rules
  })

  try {
    await validator.validate({
      [props.prop]: form.model[props.prop]
    })
    errorMessage.value = ''
    return true
  } catch (err: any) {
    errorMessage.value = err.errors?.[0]?.message || ''
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

</script>

<template>
  <div v-bind="$attrs" class="zephyr-form-item">
    <slot />
    <div v-if="errorMessage" class="form-error">
      {{ errorMessage }}
    </div>
  </div>
</template>