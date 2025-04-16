import { CompanySearchProductType, Location } from 'src/types/apps/veridionTypes'
import { CountryType } from '../../product_search/configs/countriesMapping'

const isCompanyWithInternationalPresences = (locations: CountryType[], mainLocation: Location) =>
  !!locations.find(
    location =>
      location.country_name === mainLocation.country ||
      location.country_code.toLocaleLowerCase() === mainLocation.country_code?.toLocaleLowerCase()
  )

export const makeCardsData = (
  companies: CompanySearchProductType[],
  selectedLocations: CountryType[],
  count: number | null
) => {
  const companiesLength = companies.length

  let companiesWithInternationalPresence = 0
  let companiesBranches = 0

  companies.forEach(company => {
    const mainCountry = company.main_address.country

    if (isCompanyWithInternationalPresences(selectedLocations, company.main_address)) {
      if (company.locations.some(location => location.country !== mainCountry)) {
        companiesWithInternationalPresence += 1
      }
    }

    companiesBranches += company.locations?.length || 0
  })

  return {
    companiesLength,
    companiesWithInternationalPresence,
    companiesBranches,
    companiesCountReturnedByApi: count || 0
  }
}
