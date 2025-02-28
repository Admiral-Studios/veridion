import { countriesMapping, CountryType } from '../../product_search/configs/countriesMapping'

type GroupedCountries = {
  [key: string]: {
    childCountries: CountryType[]
    label: string
    children: {
      [key: string]: {
        childCountries: CountryType[]
        label: string
        children: CountryType[]
      }
    }
  }
}

export const groupByContinentAndRegion = (searchTerm: string) => {
  const filteredCountries = countriesMapping.filter(naic =>
    Object.values(naic).some(n => n.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const grouped = filteredCountries.reduce((acc, country) => {
    if (!acc[country.continent]) {
      acc[country.continent] = {
        childCountries: [],
        label: country.continent,
        children: {}
      }
    }

    if (!acc[country.continent].children[country.macro_region]) {
      acc[country.continent].children[country.macro_region] = {
        childCountries: [],
        label: country.macro_region,
        children: []
      }
    }

    acc[country.continent].childCountries.push(country)

    acc[country.continent].children[country.macro_region].childCountries.push(country)

    acc[country.continent].children[country.macro_region].children.push({
      ...country
    })

    return acc
  }, {} as GroupedCountries)

  const formatted = Object.values(grouped)
    .map(g => ({
      ...g,
      children: Object.values(g.children)
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(macroRegion => ({
          ...macroRegion,
          children: macroRegion.children.sort((a, b) => a.country_name.localeCompare(b.country_name))
        }))
    }))
    .filter(({ label }) => label)
    .sort((a, b) => a.label.localeCompare(b.label))

  return {
    locations: formatted,
    currentLocations: searchTerm
      ? filteredCountries.reduce((acc, cur) => {
          if (!acc.includes(cur.continent)) {
            acc.push(cur.continent)
          }

          if (!acc.includes(cur.macro_region)) {
            acc.push(cur.macro_region)
          }

          return acc
        }, [] as string[])
      : []
  }
}
