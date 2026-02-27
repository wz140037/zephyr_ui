import { markRaw } from 'vue'
import {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElRadioGroup,
  ElSwitch,
  ElDatePicker
} from 'element-plus'
import { ZephyrFormSchema } from '../../packages/form/types'

const cities = ['beijing', 'shanghai', 'hangzhou', 'guangzhou']
const genders = ['male', 'female']

function createField(index: number): ZephyrFormSchema {
  const type = index % 6

  switch (type) {
    case 0:
      return {
        prop: `input_${index}`,
        label: `输入框 ${index}`,
        is: markRaw(ElInput),
        attr: {
          placeholder: `请输入内容 ${index}`,
          clearable: true,
          rules:
            index % 5 === 0
              ? [{ required: true, message: '必填项', trigger: 'blur' }]
              : []
        }
      }

    case 1:
      return {
        prop: `number_${index}`,
        label: `数字 ${index}`,
        is: markRaw(ElInputNumber),
        attr: {
          min: 0,
          max: 999
        }
      }

    case 2:
      return {
        prop: `select_${index}`,
        label: `选择 ${index}`,
        is: markRaw(ElSelect),
        attr: {
          clearable: true,
          options: cities.map(c => ({
            value: c,
            label: c
          }))
        }
      }

    case 3:
      return {
        prop: `radio_${index}`,
        label: `单选 ${index}`,
        is: markRaw(ElRadioGroup),
        attr: {
          options: genders.map(g => ({
            value: g,
            label: g
          }))
        }
      }

    case 4:
      return {
        prop: `switch_${index}`,
        label: `开关 ${index}`,
        is: markRaw(ElSwitch)
      }

    case 5:
      return {
        prop: `date_${index}`,
        label: `日期 ${index}`,
        is: markRaw(ElDatePicker),
        attr: {
          type: 'date'
        }
      }

    default:
      return { prop: '', label: '' }
  }
}

/* ---------------- 大规模生成 ---------------- */

const baseFields = Array.from({ length: 300 }).map((_, i) =>
  createField(i)
)

/* ---------------- 条件联动组 ---------------- */

const dynamicGroup: ZephyrFormSchema = {
  prop: 'isVip',
  label: '是否 VIP',
  is: markRaw(ElSwitch),
  attr: {
    activeValue: true,
    inactiveValue: false
  }
}

const vipChildrenGroup: ZephyrFormSchema = {
  prop: '',
  label: 'VIP 专属信息',
  attr: (formData: any) => ({
    hidden: formData.isVip !== true
  }),
  children: [
    {
      prop: 'vipCode',
      is: markRaw(ElInput),
      attr: {
        placeholder: '请输入 VIP 编码',
        rules: [{ required: true, message: '请输入编码', trigger: 'blur' }]
      }
    },
    {
      prop: 'vipLevel',
      is: markRaw(ElSelect),
      attr: {
        options: [
          { label: 'A', value: 'A' },
          { label: 'B', value: 'B' },
          { label: 'C', value: 'C' }
        ]
      }
    }
  ]
}

/* ---------------- 二级联动 ---------------- */

const interestSwitch: ZephyrFormSchema = {
  prop: 'isInterested',
  label: '是否感兴趣',
  is: markRaw(ElSwitch),
  attr: {
    activeValue: true,
    inactiveValue: false
  }
}

const contactGroup: ZephyrFormSchema = {
  prop: '',
  label: '联系方式',
  attr: (formData: any) => ({
    hidden: formData.isInterested !== true
  }),
  children: [
    {
      prop: 'phone1',
      is: markRaw(ElInput),
      attr: { placeholder: '联系方式1' }
    },
    {
      prop: 'phone2',
      is: markRaw(ElInput),
      attr: { placeholder: '联系方式2' }
    }
  ]
}

/* ---------------- 最终测试数据 ---------------- */

export const mockData: ZephyrFormSchema[] = [
  ...baseFields,
  dynamicGroup,
  vipChildrenGroup,
  interestSwitch,
  contactGroup
]

export const formRules = {
  name: [
    { required: true, message: '姓名为必填项（form级）', trigger: 'change' }
  ],
  age: [
    { type: 'number', required: true, message: '年龄必须填写（form级）', trigger: 'change' }
  ],
  email: [
    { type: 'email', message: '邮箱格式不正确（form级）', trigger: 'change' }
  ]
}

export const formItems = [
  {
    prop: 'name',
    label: '姓名',
    is: markRaw(ElInput),
    attr: {
      placeholder: '请输入姓名',
      // attr 级规则
      rules: [
        { min: 2, message: '姓名至少2个字（attr级）', trigger: 'change' }
      ]
    }
  },
  {
    prop: 'age',
    label: '年龄',
    is: markRaw(ElInputNumber),
    attr: {
      placeholder: '请输入年龄'
    },
    // schema 级规则
    rules: [
      { type: 'number', min: 18, message: '必须年满18岁（schema级）', trigger: 'change' }
    ]
  },
  {
    prop: 'email',
    label: '邮箱',
    is: markRaw(ElInput),
    attr: {
      placeholder: '请输入邮箱'
    }
  }
]