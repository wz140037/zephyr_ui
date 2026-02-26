<template>
  <form class="zephyr-form" v-bind="virtual ? containerProps : {}">
    <div v-bind="virtual ? wrapperProps : {}">
      <template v-for="item in virtual ? virtualList : visibleItems" :key="virtual ? item.data.key : item.key">
        <div class="form-node_container" :class="{
          'is-required': virtual ? item.data.required : item.required,
          'is-vertical': layout === 'vertical'
        }">
          <div v-if="virtual ? item.data.label : item.label" class="form-node_label">
            {{ virtual ? item.data.label : item.label }}
          </div>

          <div class="form-node_content">
            <template v-for="node in virtual ? item.data.nodes : item.nodes" :key="node.key">
              <ZephyrFormItem v-if="!node.hidden" :prop="node.prop" :rules="node.rules" :style="node.style">
                <component :is="node.is" v-bind="node.attr" :ref="(el: any) => (formInstances[node.prop] = el)"
                  v-model="innerModel[node.prop]" />
              </ZephyrFormItem>
            </template>
          </div>
        </div>
      </template>
    </div>
  </form>
</template>

<script setup lang="ts">
import ZephyrFormItem from './ZephyrFormItem.vue'
import {
  provide,
  reactive,
  ref,
  computed,
  watch,
  toRaw
} from 'vue'
import { useVirtualList } from '@vueuse/core'
import type { PropType } from 'vue'
import type { ZephyrFormSchema } from './types'

/* ---------------- props ---------------- */
const props = defineProps({
  formItems: {
    type: Array as PropType<ZephyrFormSchema[]>,
    required: true
  },
  layout: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'vertical'
  },
  virtual: {
    type: Boolean,
    default: false
  },
})

/* ---------------- refs ---------------- */
const formInstances = ref<Record<string, any>>({})
const innerModel = reactive<Record<string, any>>({})

/* ---------------- provide ---------------- */

const fields: any[] = []

function addField(field: any) {
  fields.push(field)
}

function removeField(field: any) {
  const index = fields.indexOf(field)
  if (index !== -1) fields.splice(index, 1)
}

async function validate() {
  const results = await Promise.all(fields.map(f => f.validate()))
  return results.every(Boolean)
}

provide('ZephyrForm', {
  model: innerModel,
  addField,
  removeField
})

/* ---------------- 规范化 ---------------- */

const normalizedItems = computed(() => {
  const model = innerModel

  return props.formItems.map((item, index) => {
    const nodes = item.children?.length ? item.children : [item]

    const parsedNodes = nodes.map((node, nodeIndex) => {
      const rawAttr =
        typeof node.attr === 'function'
          ? node.attr(model)
          : node.attr ?? {}

      const attr = { ...rawAttr }
      const rules = attr.rules ?? []

      return {
        ...node,
        key: node.prop || `node_${index}_${nodeIndex}`,
        attr,
        rules,
        hidden: attr.hidden === true,
        style: attr.style ?? { width: '100%' }
      }
    })

    const rawItemAttr =
      typeof item.attr === 'function'
        ? item.attr(model)
        : item.attr ?? {}

    return {
      ...item,
      key: item.prop || `item_${index}`,
      hidden: rawItemAttr?.hidden === true,
      required: parsedNodes.some(n =>
        n.rules?.some((r: any) => r.required)
      ),
      nodes: parsedNodes
    }
  })
})

/* ---------------- 过滤 hidden ---------------- */
const visibleItems = computed(() =>
  normalizedItems.value.filter(i => !i.hidden)
)

/* ---------------- 虚拟滚动层 ---------------- */

/**
 * 内部固定逻辑高度（不对外暴露）
 * 只是用于滚动计算
 */
const INTERNAL_ITEM_HEIGHT = 72
const {
  list: virtualList,
  containerProps,
  wrapperProps
}: any = useVirtualList(visibleItems, {
  itemHeight: INTERNAL_ITEM_HEIGHT,
  overscan: 2
})

/* ---------------- 初始化 model ---------------- */

function initModel() {
  const newModel: Record<string, any> = {}

  props.formItems.forEach(item => {
    const nodes = item.children?.length ? item.children : [item]
    nodes.forEach(node => {
      if (node.prop && !(node.prop in newModel)) {
        newModel[node.prop] = node.defaultValue ?? undefined
      }
    })
  })

  Object.keys(innerModel).forEach(k => delete innerModel[k])
  Object.assign(innerModel, newModel)
}

watch(
  () => props.formItems,
  () => initModel(),
  { immediate: true }
)

/* ---------------- 对外方法 ---------------- */

function setDefaultValues(values: Record<string, any>) {
  Object.assign(innerModel, values)
}

async function getValues({ required } = { required: false }) {
  if (required) {
    const valid = await validate()
    if (!valid) return Promise.reject('表单校验失败')
  }
  return { ...toRaw(innerModel) }
}

defineExpose({
  setDefaultValues,
  getValues,
  formInstances
})
</script>

<style lang="scss" scoped>
.zephyr-form {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 10px 20px 16px;
  background-color: #fff;
  border-radius: 4px;
  overflow: auto;

  .form-node_container+.form-node_container {
    margin-top: 10px;
  }

  .form-node_container {
    position: relative;
    display: flex;
    align-items: start;

    .form-node_label {
      color: #293358;
      margin-right: 6px;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }

    &.is-vertical {
      flex-direction: column;
      align-items: flex-start;

      .form-node_label {
        margin-bottom: 6px;
      }

      .form-node_content {
        width: 100%;
      }
    }

    &.is-required::before {
      position: absolute;
      content: '*';
      color: #CD4949;
    }

    &.is-required .form-node_label {
      padding-left: 10px;
    }

    &.is-required:has(.form-error) {
      .form-node_label {
        color: #CD4949;
      }
    }
  }

  .form-node_content {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    column-gap: 12px;
    row-gap: 10px;
  }
}
</style>