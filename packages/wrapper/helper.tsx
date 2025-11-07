import { defineComponent, h, isVNode } from 'vue'
import type { VNode } from 'vue'

export default defineComponent({
  name: 'wrapperHelper',
  props: {
    is: { type: [String, Object, Function], default: null },
    show: { type: Boolean, default: true },
    isProps: { type: Object, default: () => ({}) },
  },
  setup(props, { slots }) {
    return () => {
      const { is, show, isProps } = props
      if (!show) return null

      // 没传组件，直接渲染默认插槽
      if (!is) return slots.default?.()

      let type: any = null
      let mergedProps: any = { ...isProps }
      let children: any = {}

      // 1️⃣ 支持 is 为 VNode
      if (isVNode(is)) {
        type = is.type
        mergedProps = { ...is.props, ...isProps }
        children = is.children || {}
      }

      // 2️⃣ 支持 is 为函数
      else if (typeof is === 'function') {
        const vnode = is()
        if (isVNode(vnode)) {
          type = vnode.type
          mergedProps = { ...vnode.props, ...isProps }
          children = vnode.children || {}
        } else type = vnode
      }

      // 3️⃣ 支持 is 为组件或标签名
      else if (typeof is === 'object' || typeof is === 'string') {
        type = is
      }

      // 统一插槽（如果 is 是 h() 构造的）
      const slotChildren: Record<string, () => VNode[]> = {}

      if (slots.default) slotChildren.default = () => slots.default!()
      for (const key in slots) {
        if (key !== 'default') slotChildren[key] = () => slots[key]!()
      }

      // 注意这里可以兼容 h() 的第三个参数 children
      if (typeof children === 'object') {
        Object.assign(slotChildren, children)
      }

      // 最终渲染
      return h(type, mergedProps, slotChildren)
    }
  },
})
