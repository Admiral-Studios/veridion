import { create } from 'zustand'
import { AllFiltersType } from '../types/enums'
import { IndustryType } from '../types/types'
import axios from 'axios'

type LogicParamType = {
  operator: 'and' | 'or'
  params: AllFiltersType[]
  id: number
}

type State = {
  data: {
    [key in AllFiltersType]?: any
  }
  params: (AllFiltersType | LogicParamType)[]
  operator: 'and' | 'or'
  industries: string[]
  categories: string[]
}

type Action = {
  onSetData: (filter: AllFiltersType, field: string, value: any) => void
  onSetNewParam: (param: AllFiltersType) => void
  onRemoveParam: (param: AllFiltersType, logicBoxId?: number) => void
  onSetChildParam: (index: number, param: AllFiltersType) => void
  resetAll: () => void
  onSetNewLogicOperatorParam: (operator?: 'and' | 'or') => void
  onChangeLogicOperator: (index: number, value: 'and' | 'or') => void
  onRemoveLogicBoxWithChildParams: (index: number) => void
  onChangeOperator: (o: 'and' | 'or') => void
  fetchIndustries: () => Promise<void>
}

const initialState = {
  company_products: {
    input_operands: [],
    exclude_operands: '',
    strictness: 2,
    supplier_types: {
      distributor: false,
      manufacturer: false,
      service_provider: false
    }
  },
  company_keywords: {
    input_operands: [],
    exclude_operands: '',
    strictness: 2,
    supplier_types: {
      distributor: false,
      manufacturer: false,
      service_provider: false
    }
  },
  company_location: {
    geographyIn: [],
    geographyNotIn: [],
    type: { main: true, secondary: false }
  }
}

export const useFilterStore = create<State & Action>(set => ({
  data: {},
  operator: 'and' as 'and' | 'or',
  params: [] as AllFiltersType[],
  industries: [],
  categories: [],
  onSetData: (filter, field, value) => {
    set(state => {
      return {
        data: {
          ...state.data,
          [filter]: field ? { ...state.data[filter], [field]: value } : { ...state.data[filter], ...value }
        }
      }
    })
  },

  onSetNewParam: param => {
    set(state => ({
      data: { ...state.data, [param]: initialState[param as keyof typeof initialState] || {} },
      params: [...state.params, param],
      operator:
        (param === 'company_keywords' || param === 'company_products') && state.operator === 'or'
          ? 'and'
          : state.operator
    }))
  },

  onChangeOperator: newOperator => {
    set(() => ({
      operator: newOperator
    }))
  },

  onSetNewLogicOperatorParam: (operator = 'and') => {
    set(state => ({ params: [...state.params, { operator: operator, params: [], id: Date.now() }] }))
  },

  onRemoveParam: (param, logicBoxId) => {
    set(state => {
      const copy = { ...state.data }

      delete copy[param]

      return {
        data: { ...copy },
        params: logicBoxId
          ? state.params.map(p => {
              if ((p as LogicParamType).id === logicBoxId) {
                return {
                  ...(p as LogicParamType),
                  params: (p as LogicParamType).params.filter(paramForRemove => paramForRemove !== param)
                }
              }

              return p
            })
          : state.params.filter(p => p !== param)
      }
    })
  },

  onSetChildParam: (index, param) => {
    set(state => {
      return {
        data: { ...state.data, [param]: {} },
        params: state.params.map(oldParam => {
          if ((oldParam as LogicParamType).id === index) {
            return { ...(oldParam as LogicParamType), params: [...(oldParam as LogicParamType).params, param] }
          }

          return oldParam
        })
      }
    })
  },

  onChangeLogicOperator: (index, operator) => {
    set(state => {
      return {
        params: state.params.map(oldParam => {
          if ((oldParam as LogicParamType).id === index) {
            return { ...(oldParam as LogicParamType), operator }
          }

          return oldParam
        })
      }
    })
  },

  onRemoveLogicBoxWithChildParams: index => {
    set(state => {
      const idForDelete = state.params.findIndex(p => (p as LogicParamType)?.id === index)

      if (idForDelete !== -1) {
        const copy = { ...state.data }

        const paramForDelete = state.params[idForDelete] as LogicParamType

        paramForDelete.params.forEach(param => {
          delete copy[param as AllFiltersType]
        })

        return { data: { ...copy }, params: state.params.filter(p => (p as LogicParamType)?.id !== index) }
      }

      return { ...state }
    })
  },

  resetAll: () => {
    set(() => ({ data: {}, params: [] }))
  },

  fetchIndustries: async () => {
    const response = await axios<IndustryType[]>('/api/veridion/industries')

    const categories: string[] = []

    response.data.forEach(option => {
      option.children.forEach(child => !categories.includes(child.name) && categories.push(child.name))
    })

    set({
      industries: response.data.map(option => option.name).sort((a, b) => a.localeCompare(b)),
      categories: categories.sort((a, b) => a.localeCompare(b))
    })
  }
}))

export type FilterStoreStateType = {
  [key in AllFiltersType]?: any
}
