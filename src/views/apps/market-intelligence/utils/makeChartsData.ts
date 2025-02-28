import { CompanySearchProductType } from 'src/types/apps/veridionTypes'

const reduceValues = (array: [string, number][]) =>
  array.reduce(
    (acc, cur, index) => {
      if (index < 20) {
        acc.keys.push(cur[0])
        acc.values.push(cur[1])
      } else {
        if (!acc.keys.includes('Other')) {
          acc.keys.push('Other')
          acc.values.push(0)
        }
        acc.values[acc.keys.indexOf('Other')] += cur[1]
      }

      return acc
    },
    { keys: [] as string[], values: [] as number[] }
  )

const countChartsInfo = (data: CompanySearchProductType[]) => {
  const businessTags: { [key: string]: number } = {}
  const employeesCount: { [key: string]: number } = {
    'N/A': 0,
    '0 - 10': 0,
    '11 - 100': 0,
    '101 - 500': 0,
    '501 - 1000': 0,
    '> 1000': 0
  }
  const revenuesValues: { [key: string]: number } = {
    'N/A': 0,
    '<= 100,000': 0,
    '100,001 - 500,000': 0,
    '500,001 - 1,000,000': 0,
    '1,000,001 - 5,000,000': 0,
    '5,000,001 - 15,000,000': 0,
    '15,000,001 - 50,000,000': 0,
    '50,000,001 - 100,000,000': 0,
    '100,000,001 - 500,000,000': 0,
    '500,000,001 - 1,000,000,000': 0,
    '> 1,000,000,000': 0
  }

  const companiesByCities: { [key: string]: number } = {}

  data.forEach(item => {
    const employeeCountValue = item.employee_count?.value
    const revenueValue = item.revenue?.value

    const mainCity = item.main_address.city

    item.business_tags_extracted?.forEach(tag => {
      businessTags[tag] = (businessTags[tag] || 0) + 1
    })

    if (employeeCountValue !== undefined) {
      if (employeeCountValue >= 0 && employeeCountValue <= 10) {
        employeesCount['0 - 10'] = (employeesCount['0 - 10'] || 0) + 1
      } else if (employeeCountValue >= 11 && employeeCountValue <= 100) {
        employeesCount['11 - 100'] = (employeesCount['11 - 100'] || 0) + 1
      } else if (employeeCountValue >= 101 && employeeCountValue <= 500) {
        employeesCount['101 - 500'] = (employeesCount['101 - 500'] || 0) + 1
      } else if (employeeCountValue >= 501 && employeeCountValue <= 1000) {
        employeesCount['501 - 1000'] = (employeesCount['501 - 1000'] || 0) + 1
      } else if (employeeCountValue >= 1000) {
        employeesCount['> 1000'] = (employeesCount['> 1000'] || 0) + 1
      }
    } else {
      employeesCount['N/A'] = (employeesCount['N/A'] || 0) + 1
    }

    if (revenueValue !== undefined) {
      if (revenueValue <= 100000) {
        revenuesValues['<= 100,000'] = revenuesValues['<= 100,000'] += 1
      } else if (revenueValue >= 100001 && revenueValue <= 500000) {
        revenuesValues['100,001 - 500,000'] = revenuesValues['100,001 - 500,000'] += 1
      } else if (revenueValue >= 500001 && revenueValue <= 1000000) {
        revenuesValues['500,001 - 1,000,000'] = revenuesValues['500,001 - 1,000,000'] += 1
      } else if (revenueValue >= 1000001 && revenueValue <= 5000000) {
        revenuesValues['1,000,001 - 5,000,000'] = revenuesValues['1,000,001 - 5,000,000'] += 1
      } else if (revenueValue >= 5000001 && revenueValue <= 15000000) {
        revenuesValues['5,000,001 - 15,000,000'] = revenuesValues['5,000,001 - 15,000,000'] += 1
      } else if (revenueValue >= 15000001 && revenueValue <= 50000000) {
        revenuesValues['15,000,001 - 50,000,000'] = revenuesValues['15,000,001 - 50,000,000'] += 1
      } else if (revenueValue >= 50000001 && revenueValue <= 100000000) {
        revenuesValues['50,000,001 - 100,000,000'] = revenuesValues['50,000,001 - 100,000,000'] += 1
      } else if (revenueValue >= 100000001 && revenueValue <= 500000000) {
        revenuesValues['100,000,001 - 500,000,000'] = revenuesValues['100,000,001 - 500,000,000'] += 1
      } else if (revenueValue >= 500000001 && revenueValue <= 1000000000) {
        revenuesValues['500,000,001 - 1,000,000,000'] = revenuesValues['500,000,001 - 1,000,000,000'] += 1
      } else if (revenueValue > 1000000000) {
        revenuesValues['> 1,000,000,000'] = revenuesValues['> 1,000,000,000'] += 1
      }
    } else {
      revenuesValues['N/A'] = revenuesValues['N/A'] + 1
    }

    if (mainCity) {
      companiesByCities[mainCity] = (companiesByCities[mainCity] || 0) + 1
    } else {
      companiesByCities['N/A'] = (companiesByCities['N/A'] || 0) + 1
    }
  })

  const businessTagsEntries = Object.entries(businessTags).sort((a, b) => b[1] - a[1])
  const employeesCountEntries = Object.entries(employeesCount)
  const revenuesValuesEntries = Object.entries(revenuesValues)
  const companiesByCitiesEntries = Object.entries(companiesByCities).sort((a, b) => b[1] - a[1])

  return {
    businessTags: reduceValues(businessTagsEntries),
    employeesCount: reduceValues(employeesCountEntries),
    revenuesValues: reduceValues(revenuesValuesEntries),
    companiesByCities: reduceValues(companiesByCitiesEntries)
  }
}

export const makeChartsData = (companies: CompanySearchProductType[]) => {
  return countChartsInfo(companies)
}
