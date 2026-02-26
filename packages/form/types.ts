import type { RuleItem } from 'async-validator'
import { Component } from 'vue'

export type FormRules = Record<string, RuleItem[]>

export interface FormContext {
  model: Record<string, any>
  rules: FormRules
  labelWidth?: string
  inline?: boolean
  addField: (field: FormField) => void
  removeField: (field: FormField) => void
}
export interface FormField {
  prop?: string
  rules?: any[]
  validate: (trigger?: string) => Promise<boolean>
  clearValidate: () => void
  resetField: () => void
  setError: (msg: string) => void
}

type AttrFunction = (formData: any) => Record<string, any>

export interface ZephyrFormSchema {
  prop: string // 属性名
  label?: string // 标签名
  is?: Component // 自定义组件
  attr?: Record<string, any> | AttrFunction // 属性
  children?: ZephyrFormSchema[] // 子节点
  [key: string]: any
}