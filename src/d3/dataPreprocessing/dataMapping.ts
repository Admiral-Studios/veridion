import { countriesMapping, naicsMapping } from '../data/referenceData'
import { ICompany } from '../types/interfaces'

export function addCountryAndNaicsData(data: ICompany[]): void {
  data.forEach((company: ICompany) => {
    if (!company?.main_address?.country_code) return
    if (!company?.naics_2022?.primary?.code) return
    const countryCode: any = company.main_address?.country_code.toLowerCase()
    const ninceID: string = company.naics_2022.primary.code

    company.continent = countriesMapping[countryCode].continent
    company.country_name = countriesMapping[countryCode].country_name
    company.macro_region = countriesMapping[countryCode].macro_region
    company.city = company.main_address.city

    company.naics2_label = naicsMapping[ninceID]?.naics2_label || ''
    company.naics3_label = naicsMapping[ninceID]?.naics3_label || ''
    company.naics4_label = naicsMapping[ninceID]?.naics4_label || ''
    company.naics5_label = naicsMapping[ninceID]?.naics5_label || ''
    company.naics6_label = naicsMapping[ninceID]?.naics6_label || ''
  })
}
