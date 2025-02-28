import { CountryType } from '../../product_search/configs/countriesMapping'
import { AllFiltersType } from '../types/enums'

export const prepareFilter = (
  params: (
    | AllFiltersType
    | {
        operator: 'and' | 'or'
        params: AllFiltersType[]
        id: number
      }
  )[],
  data: {
    [key in AllFiltersType]?: any
  },
  operator: 'and' | 'or'
) => {
  const filter = {
    filters: {
      [operator]: [] as any[]
    }
  }

  let arrayToPush = filter.filters[operator]

  const getParamValue = (param: AllFiltersType) => {
    if (param === 'company_products' || param === 'company_keywords') {
      const objectToAdd: any = {
        attribute: param,
        relation: 'match_expression',
        value: {}
      }

      const { input_operands, exclude_operands, strictness, supplier_types } = data[param]

      if (input_operands?.length) {
        objectToAdd.value.match = {
          operator: input_operands.length === 1 ? 'or' : 'and',
          operands:
            input_operands.length === 1
              ? input_operands[0].split(',').map((o: string) => o.trim())
              : input_operands.map((o: string) => ({ operator: 'or', operands: o.split(',').map(o => o.trim()) }))
        }
      }

      if (exclude_operands?.length) {
        objectToAdd.value.exclude = {
          operator: 'and',
          operands: [{ operator: 'or', operands: exclude_operands.split(',').map((o: string) => o.trim()) }]
        }
      }

      if (strictness !== undefined) {
        objectToAdd.strictness = strictness
      }

      const formattedSupplierTypes = Object.keys(supplier_types).filter(k => supplier_types[k])

      if (formattedSupplierTypes?.length) {
        objectToAdd.supplier_types = formattedSupplierTypes
      }

      arrayToPush.push(objectToAdd)

      return
    }

    if (param === 'company_location') {
      const { geographyIn, geographyNotIn, type } = data[param]

      const strictness = type
        ? type?.main && !type?.secondary
          ? 1
          : !type?.main && type?.secondary
          ? 2
          : type?.main && type?.secondary
          ? 3
          : undefined
        : undefined

      if (geographyIn?.length) {
        const objToAdd: any = {
          attribute: 'company_location',
          relation: 'in',
          value: geographyIn.map((g: CountryType) => ({ country: g.country_code.toUpperCase() }))
        }

        if (strictness !== undefined) {
          objToAdd.strictness = strictness
        }

        arrayToPush.push(objToAdd)
      }

      if (geographyNotIn?.length) {
        const objToAdd: any = {
          attribute: 'company_location',
          relation: 'not_in',
          value: geographyNotIn.map((g: CountryType) => ({ country: g.country_code.toUpperCase() }))
        }

        if (strictness !== undefined) {
          objToAdd.strictness = strictness
        }
        arrayToPush.push(objToAdd)
      }

      return
    }

    if (
      param === 'company_employee_count' ||
      param === 'company_estimated_revenue' ||
      param === 'company_year_founded'
    ) {
      const { value, relation } = data[param]

      const objToAdd: any = {
        attribute: param,
        relation: relation || 'equals',
        value: relation === 'between' ? [value?.min || 0, value?.max || 0] : value
      }

      arrayToPush.push(objToAdd)

      return
    }

    const { value, relation } = data[param as AllFiltersType]

    const objToAdd: any = {
      attribute: param,
      relation: relation || 'equals',
      value: value
    }

    arrayToPush.push(objToAdd)
  }

  params.forEach(param => {
    if (typeof param === 'object') {
      const objToPush = {
        [param.operator]: []
      }

      filter.filters[operator].push(objToPush)

      arrayToPush = objToPush[param.operator]

      param.params.forEach(childParam => {
        getParamValue(childParam)
      })
    } else {
      arrayToPush = filter.filters[operator]

      getParamValue(param)
    }
  })

  return filter
}
