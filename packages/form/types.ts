import type { Component } from 'vue'

type AttrFunction = (formData: any) => Record<string, any>

export interface ZephyrFormItem {
  prop: string // 属性名
  label?: string // 标签名
  is?: Component // 自定义组件
  attr?: Record<string, any> | AttrFunction // 属性
  children?: ZephyrFormItem[] // 子节点
  [key: string]: any
}