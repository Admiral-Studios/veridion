import { CountryType } from '../../product_search/configs/countriesMapping'

export const prepareFilter = (
  naics: (number | string)[],
  naicsRelation: string,
  geographyIn: CountryType[],
  geographyNotIn: CountryType[],
  locationTypes: { main: boolean; secondary: boolean },
  input_operands: string[],
  exclude_operands: string,
  strictness: number | undefined,
  supplier_types: any
) => {
  const filter = {
    filters: {
      ['and']: [] as any[]
    }
  }

  const arrayToPush = filter.filters.and

  const locationStrictness = locationTypes
    ? locationTypes?.main && !locationTypes?.secondary
      ? 1
      : !locationTypes?.main && locationTypes?.secondary
      ? 2
      : locationTypes?.main && locationTypes?.secondary
      ? 3
      : undefined
    : undefined

  if (naics.length) {
    const objToAdd: any = {
      attribute: 'company_naics_code',
      relation: naicsRelation || 'equals',
      value: naics
    }

    arrayToPush.push(objToAdd)
  }

  if (geographyIn.length) {
    const objToAdd: any = {
      attribute: 'company_location',
      relation: 'in',
      value: geographyIn.map((g: CountryType) => ({ country: g.country_code.toUpperCase() }))
    }

    if (locationStrictness !== undefined) {
      objToAdd.strictness = locationStrictness
    }

    arrayToPush.push(objToAdd)
  }

  if (geographyNotIn.length) {
    const objToAdd: any = {
      attribute: 'company_location',
      relation: 'in',
      value: geographyNotIn.map((g: CountryType) => ({ country: g.country_code.toUpperCase() }))
    }

    if (locationStrictness !== undefined) {
      objToAdd.strictness = locationStrictness
    }

    arrayToPush.push(objToAdd)
  }

  if (input_operands?.length || exclude_operands) {
    const objectToAdd: any = {
      attribute: 'company_keywords',
      relation: 'match_expression',
      value: {}
    }

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
  }

  return filter
}
