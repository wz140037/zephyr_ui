<template>
  <div class="policy-filter-bar">
    <a-form ref="formRef" :model="innerModel" :layout="layout"
      :class="{ 'is-single-item': normalizedItems.length === 1 }">
      <template v-for="item in normalizedItems" :key="item.prop">
        <a-form-item v-if="!item.hidden">
          <div class="policy-filter-node" :class="{
            'is-vertical': layout === 'vertical',
            'is-required': item.required
          }">
            <div class="filter-node-title" @click.stop="$emit('itemClick', item.raw)">
              {{ item.label }}
            </div>

            <div class="node-is_box">
              <div class="filter-node-content">
                <template v-for="node in item.nodes" :key="node.prop">
                  <div v-if="!node.hidden" class="filter-node-item" :class="{ 'children-node': item.hasChildren }"
                    :style="node.style">
                    <a-form-item :name="node.prop" :rules="node.rules">
                      <component :is="node.is" v-bind="node.attr" :ref="(el: any) => setInstance(node.prop, el)"
                        :[node.model.valueField]="innerModel[node.prop]"
                        @[node.model.eventField]="(val: any) => (innerModel[node.prop] = val)" />
                    </a-form-item>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </a-form-item>
      </template>

      <!-- 按钮 -->
      <a-form-item v-if="showButtons" class="filter-bar_btns">
        <a-button type="primary" @click="onSearch">搜索</a-button>
        <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import type { ZephyrFormItem } from './types'

/* ---------------- props ---------------- */
const props = defineProps({
  formItems: {
    type: Array as PropType<ZephyrFormItem[]>,
    required: true
  },
  modules: {
    type: Array as PropType<'button'[]>,
    default: () => ['button']
  },
  layout: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal'
  }
})

/* ---------------- emits ---------------- */

const emit = defineEmits<{
  (e: 'search', value: Record<string, any>): void
  (e: 'reset', value: Record<string, any>): void
  (e: 'itemClick', value: ZephyrFormItem): void
}>()

/* ---------------- refs ---------------- */

const formRef = ref()
const formInstances = ref<Record<string, any>>({})
const innerModel = reactive<Record<string, any>>({})

/* ---------------- 结构规范化 ---------------- */

const normalizedItems = computed(() => {
  return props.formItems.map(item => {
    const nodes = item.children?.length
      ? item.children
      : [item]

    const parsedNodes = nodes.map(node => {
      const attr =
        typeof node.attr === 'function'
          ? node.attr(innerModel)
          : node.attr ?? {}

      const rules = attr.rules ?? []
      const model = {
        valueField: attr.model?.valueField ?? 'value',
        eventField: attr.model?.eventField ?? 'update:value'
      }

      return {
        ...node,
        attr,
        rules,
        model,
        hidden: attr.hidden === true,
        style: attr.style
      } as Record<string, any>
    })

    return {
      raw: item,
      prop: item.prop,
      label: item.label,
      hasChildren: !!item.children?.length,
      hidden:
        (typeof item.attr === 'function'
          ? item.attr(innerModel)
          : item.attr)?.hidden === true,
      required: parsedNodes.some(n =>
        n.rules?.some((r: any) => r.required)
      ),
      nodes: parsedNodes
    }
  })
})

/* ---------------- 工具方法 ---------------- */

const showButtons = computed(() =>
  props.modules.includes('button')
)

const setInstance = (prop: string, el: any) => {
  el
    ? (formInstances.value[prop] = el)
    : delete formInstances.value[prop]
}

/* ---------------- model 初始化 ---------------- */

function initModel() {
  const newModel: Record<string, any> = {}

  normalizedItems.value.forEach(item => {
    item.nodes.forEach(node => {
      newModel[node.prop] = node.defaultValue
    })
  })

  Object.keys(innerModel).forEach(k => delete innerModel[k])
  Object.assign(innerModel, newModel)
}

watch(
  () => props.formItems,
  () => initModel(),
  { deep: true, immediate: true }
)

/* ---------------- 业务方法 ---------------- */

function onSearch() {
  emit('search', { ...innerModel })
}

function onReset() {
  initModel()
  emit('reset', { ...innerModel })
}

function setDefaultValues(values: Record<string, any>) {
  Object.assign(innerModel, values)
}

async function getValues({ required } = { required: false }) {
  if (required) {
    await formRef.value.validate()
  }
  return { ...innerModel }
}

/* ---------------- expose ---------------- */

defineExpose({
  setDefaultValues,
  getValues,
  formInstances
})
</script>

<style lang="scss" scoped>
.policy-filter-bar {
  padding: 10px 20px 16px;
  background-color: #fff;
  border-radius: 4px;

  .policy-filter-node+.policy-filter-node {
    margin-top: 10px;
  }

  .filter-bar_btns {
    margin-top: 20px;
  }

  .policy-filter-node {
    position: relative;
    display: flex;
    align-items: start;

    .filter-node-title {
      color: #293358;
      margin-right: 6px;
      font-feature-settings: "liga" off, "clig" off;
      font-family: Alibaba PuHuiTi;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }

    .node-is_box {
      display: flex;
      width: 100%;
    }

    &.is-vertical {
      flex-direction: column;
      align-items: flex-start;

      .filter-node-title {
        margin-bottom: 8px;
      }
    }

    &.is-required::before {
      // 模拟必填星号
      position: absolute;
      content: '*';
      color: #CD4949;
    }

    &.is-required .filter-node-title {
      padding-left: 6px;
    }

    &.is-required:has(.ant-form-item-explain-error) {
      .filter-node-title {
        color: #CD4949;
      }
    }
  }

  .ant-form-item {
    margin-bottom: 10px !important;
  }

  .filter-bar_component {
    width: 100%;
  }
}
</style>
<style lang="scss">
.filter-node-content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  column-gap: 12px;
  row-gap: 10px;

  .ant-form-item {
    width: 100%;
  }

  // 限制tag宽度
  .ant-form-item .ant-select-selection-item {
    width: 10em !important;
  }

  // 隐藏提示
  .ant-form-item-explain-error {
    display: none;
  }
}
</style>