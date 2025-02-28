export type CompanyType = {
  veridion_id: string
  company_name: string
  company_commercial_names: string[] | null
  company_legal_names: string[] | null
  main_address: Address
  locations: Location[]
  num_locations: number | null
  company_type: string | null
  year_founded: number | null
  main_business_category: string | null
  main_industry: string | null
  main_sector: string | null
  naics_2022: {
    primary: CodeLabel | null
    secondary: CodeLabel[] | null
  } | null
  nace_rev2: CodeLabel[]
  ncci_codes_28_1: string[] | null
  sic: CodeLabel[] | null
  isic_v4: CodeLabel[] | null
  ibc_insurance: CodeLabel[] | null
  sics_industry: CodeLabel | null
  sics_subsector: CodeLabel | null
  sics_sector: CodeLabel | null
  short_description: string | null
  long_description_extracted: string
  long_description_generated: string
  business_tags_extracted?: string[] | null
  business_tags_generated?: string[] | null
  employee_count: AdditionalInfoType
  revenue: AdditionalInfoType
  primary_phone: string | null
  phone_numbers: string[] | null
  primary_email: string | null
  emails: string[] | null
  website_url: string | null
  website_domain: string | null
  website_tld: string | null
  website_language_code: string | null
  facebook_url: string | null
  twitter_url: string | null
  instagram_url: string | null
  linkedin_url: string | null
  ios_app_url: string | null
  android_app_url: string | null
  youtube_url: string | null
  technologies: string[] | null
  created_at: string | null
  last_updated_at: string | null
}

export type CompanyMatchEnrichType = CompanyType & {
  match_details: MatchDetails
  registered_name: string
  registered_address: Address
  jurisdiction: string
  legal_form: string
  company_status: string
  incorporation_date: string
  lei: string
  ein?: null | string
  vat_id?: null | string
  tin: string
  registry_ids?: string[] | null
}

export type CompanyMatchEnrichTypeForSave = CompanyMatchEnrichType & {
  input_file_name: string
  api_error: string
  status: 'Enriched' | 'Error' | 'Not Enriched' | 'Duplicate'
}

export type CompanySearchProductType = CompanyType & {
  search_details: {
    product_match: {
      context: {
        headline: string
        content: string
        url: string
        snippets: string[]
      }
      supplier_types: string[]
    }
    keyword_match: {
      context: {
        snippets: string[]
      }
    }
  }
}

export type CompanySearchProductTypeForSave = CompanySearchProductType & {
  input_file_name: string
  is_product: boolean
  api_error: string
  status: 'Enriched' | 'Error' | 'Not Enriched' | 'Duplicate'
}

export type CompanyMatchEnrichTypeWithStatus = CompanyMatchEnrichType & {
  status: 'Enriched' | 'Error' | 'Not Enriched' | 'Duplicate'
  api_error: string
}

type DbFields = {
  id: number
  naics_2022_primary_code: string
  naics_2022_primary_label: string
  naics_2022_secondary: CodeLabel[]
  sics_sector_code: string
  sics_sector_label: string
  sics_subsector_code: string
  sics_subsector_label: string
  sics_industry_code: string
  sics_industry_label: string
  veridion_id: string
  revenue_value: number | null
  employee_count_value: number | null
  long_description_extracted: string | null
  registered_city: null | string
  registered_country: null | string
  registered_country_code: null | string
  registered_latitude: null | string
  registered_longitude: null | string
  registered_name: null | string
  registered_postcode: null | string
  registered_region: null | string
  registered_street: null | string
  registered_street_number: null | string
  confidence_score: null | string
  jurisdiction: string | null
  legal_form: string | null
  company_status: string | null
  incorporation_date: string | null
  lei: string | null
  ein: string | null
  vat_id: string | null
  tin: string | null
  value: string | null
  employee_count_type: string | null
  revenue_type: string | null
  main_country_code: string | null
  main_country: string | null
  main_region: string | null
  main_city: string | null
  main_street: string | null
  main_street_number: string | null
  main_postcode: string | null
  main_latitude: Float32Array | null
  main_longitude: Float32Array | null
}

export type CompanyMatchEnrichFromDb = CompanyMatchEnrichTypeForSave & DbFields

export type CompanySearchProductFromDb = CompanySearchProductTypeForSave &
  DbFields & {
    product_content: string
    product_headline: string
    product_url: string
    short_description: string
    company_supplier_types: string[]
    match_snippets: string[]
  }

export interface MatchMethod {
  confidence_score: number
  match_type: string
  match_source: string
  value: string
}
export interface Address {
  country_code: string
  country: string
  region: string
  city: string
  street: string
  street_number: string
  postcode: string
  latitude: number
  longitude: number
}
export interface LocationAttribute {
  confidence_score: number
  match_type: string
  match_source: string
  match_element: string
  value: Address
}

interface AdditionalInfoType {
  value: number
  type: string
}

interface Attributes {
  company_name: MatchMethod
  location: LocationAttribute
  website: MatchMethod
  phone: MatchMethod
  registry_id: MatchMethod
}

export interface MatchDetails {
  confidence_score: number
  matched_on?: string[] | null
  attributes: Attributes
}

export type CodeLabel = {
  code: string
  label: string
}

export type Location = {
  country_code: string | null
  country: string | null
  region: string | null
  city: string | null
  postcode: string | null
  street: string | null
  street_number: null | string
  latitude: number | null
  longitude: number | null
}

export type CsvCompanyUploadType = {
  legal_names: string | null
  commercial_names: string | null
  address_txt: string | null
  phone_number: string | null
  website: string | null
  email: string | null
  registry_id: string | null
}

export type SingleCompanyEnrichType = {
  legal_names: string[] | null
  commercial_names: string[] | null
  address_txt: string | null
  phone_number: string | null
  website: string | null
  email: string | null
  registry_id: string | null
}

export type ShortlistTypeFromDb = {
  id: number
  companies: number[]
  user_id: number
  name: string
}

export type ShortlistType = {
  id: number
  companies: CompanyMatchEnrichFromDb[]
  user_id: number
  name: string
}

export type ThreadType = {
  id: number
  user_id: number
  subject: string
  json_query: string
  type: 'filter' | 'message'
  messages: string[]
}

export type ThreadFromDb = {
  id: number
  user_id: number
  subject: string
  json_query: string
  messages: string[]
}

export type PaginationType = {
  next: string
  prev: string
}

export type ProductsProjectType = {
  id: number
  watchlist_id: number
  user_id: number
  name: string
  created_at: string
  updated_at: string
}

export type InputFieldsType = {
  input_legal_names: string | null
  input_commercial_names: string | null
  input_address_txt: string | null
  input_phone_number: string | null
  input_website: string | null
  input_email: string | null
  input_file_name: string | null
  input_registry_id: string | null
}

export type ExportSettingType = {
  id: number
  user_id: number
  datagrid: string
  user_defined_column: string
}
