import { FilterStoreStateType } from '../store/filterStore'

export const getNewPromptMessage = (prompt: string, filters: FilterStoreStateType) => {
  const { company_products, company_location, company_keywords, ...rest } = filters

  const { input_operands, exclude_operands, strictness, supplier_types } = company_products
    ? company_products
    : company_keywords
    ? company_keywords
    : { input_operands: [], exclude_operands: '', strictness: 0, supplier_types: [] }
  const { geographyIn, geographyNotIn, type } = company_location
    ? company_location
    : { geographyIn: [], geographyNotIn: [], type: { main: false, secondary: false } }

  const locationStrictness = type
    ? type?.main && !type?.secondary
      ? 1
      : !type?.main && type?.secondary
      ? 2
      : type?.main && type?.secondary
      ? 3
      : undefined
    : undefined

  let promptForAi = `Prompt for filter: ${prompt}. The operands that should be included are: ${(
    input_operands || []
  ).join(' | ')}.${
    exclude_operands?.length ? `The operands that should be excluded are: ${exclude_operands}.` : ''
  } The current search strictness level is: ${strictness}.${
    supplier_types.length ? `The current supplier types are: ${supplier_types.join(', ')}.` : ''
  }${
    geographyIn.length
      ? `The current locations to be included are: ${geographyIn
          .map((c: any) => c.country_name)
          .join(', ')}. Strictness level for included locations: ${locationStrictness}.`
      : ''
  }${
    geographyNotIn.length
      ? `The current locations to be excluded are: ${geographyNotIn
          .map((c: any) => c.country_name)
          .join(', ')}. Strictness level for excluded locations: ${locationStrictness}`
      : ''
  }`

  if (!!Object.keys(rest).length) {
    Object.entries(rest).forEach(([key, value]) => {
      if (value?.value) {
        promptForAi += `The ${key.replace('_', ' ')} must be ${
          value?.relation ? value?.relation.replace('_', ' ') : 'equals'
        } ${
          typeof value?.value === 'object'
            ? value?.relation === 'between'
              ? `min: ${value.value.min} and max: ${value.value.max}`
              : value.value.join(', ')
            : value.value
        }. `
      }
    })
  }

  return promptForAi.trim()
}
