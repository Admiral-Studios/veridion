import { countriesMapping, CountryType } from '../../product_search/configs/countriesMapping'
import { useFilterStore } from '../store/filterStore'
import { AllFiltersType } from '../types/enums'

export const setFilterFromJson = (filters: any, operator: string) => {
  const { onSetNewParam } = useFilterStore.getState()

  const setParamValue = (f: any, parentLogicOperator?: string) => {
    if (f?.attribute && !parentLogicOperator) {
      onSetNewParam(f.attribute)
    }

    if (f.attribute === 'company_products' || f.attribute === 'company_keywords') {
      const filter = {
        input_operands: f?.value?.match?.operands
          ? typeof f?.value?.match?.operands[0] === 'object'
            ? f?.value?.match?.operands.map((value: any) => value.operands.join(', '))
            : [f?.value?.match?.operands.join(', ')]
          : [],
        exclude_operands: f?.value?.match?.operands ? f?.value?.exclude?.operands[0] : '',
        strictness: f.strictness,
        supplier_types: f.supplier_types?.length
          ? {
              distributor: f.supplier_types.includes('distributor'),
              manufacturer: f.supplier_types.includes('manufacturer'),
              service_provider: f.supplier_types.includes('service_provider')
            }
          : {
              distributor: false,
              manufacturer: false,
              service_provider: false
            }
      }

      useFilterStore.setState({ data: { ...useFilterStore.getState().data, [f.attribute]: filter } })
    } else if (f.attribute === 'company_location') {
      const getCountryValues = (values: any) => {
        const result: CountryType[] = []

        values.forEach((c: any) => {
          const foundCountry = countriesMapping.find(
            ({ country_code }) => country_code.toLowerCase() === c.country.toLowerCase()
          )

          if (foundCountry) {
            result.push(foundCountry)
          }
        })

        return result
      }

      const filter = {
        geographyIn: [] as CountryType[],
        geographyNotIn: [] as CountryType[],
        type:
          f.strictness === 1
            ? { main: true, secondary: false }
            : f.strictness === 2
            ? {
                main: false,
                secondary: true
              }
            : f.strictness === 1
            ? { main: true, secondary: true }
            : { main: false, secondary: false }
      }
      if (f.relation === 'in') {
        filter.geographyIn = getCountryValues(f.value)
      }

      if (f.relation === 'not_in') {
        filter.geographyNotIn = getCountryValues(f.value)
      }

      useFilterStore.setState({ data: { ...useFilterStore.getState().data, company_location: filter } })
    } else {
      const filter = {
        relation: f.relation,
        value: f.relation === 'between' ? { min: f.value[0], max: f.value[1] } : f.value
      }

      useFilterStore.setState({
        data: { ...useFilterStore.getState().data, [f.attribute]: filter }
      })
    }
  }

  filters[operator].forEach((f: any) => {
    if (f?.and || f?.or) {
      const logicOperator = f?.and ? 'and' : 'or'

      const childFilters = {
        operator: logicOperator as 'and' | 'or',
        params: [] as AllFiltersType[],
        id: Date.now()
      }

      if (f[logicOperator]?.length) {
        f[logicOperator].forEach((childFilter: any) => {
          setParamValue(childFilter, logicOperator)

          childFilters.params.push(childFilter.attribute)
        })
      }

      useFilterStore.setState(state => ({
        params: [...state.params, childFilters]
      }))
    } else {
      setParamValue(f)
    }
  })
}
