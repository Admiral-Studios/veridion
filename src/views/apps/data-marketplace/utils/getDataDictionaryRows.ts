import descriptions from 'src/views/apps/data-marketplace/configs/data_dictionary_descriptions.json'

const isNumeric = (str: number | string) => {
  return !isNaN(str as number) && !isNaN(parseFloat(str as string))
}

const getType = (value: any) => {
  const splittedValue = value.split(' | ')

  if (splittedValue.length > 1) {
    return isNumeric(splittedValue[0]) ? 'number []' : 'string []'
  } else {
    return isNumeric(value) ? 'number' : 'string'
  }
}

export const getDataDictionaryRows = (data: any) => {
  const result: any = []

  Object.entries(data).forEach(([key, value]) => {
    if (key) {
      result.push({
        attribute: key,
        type: getType(value),
        description: descriptions.find((d: any) => d.attribute === key)?.description || ''
      })
    }
  })

  return result
}
