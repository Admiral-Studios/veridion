export type CompanyDataType = {
  company_id: string
  company_name: string
  company_legal_names: string
  company_commercial_names: string
  main_country_code: string
  main_country: string
  main_region: string
  main_city: string
  main_postcode: string
  main_street: string
  main_street_number: string
  main_latitude: string
  main_longitude: string
  number_of_locations: string
  all_locations: string
  company_type: string
  year_founded: string
  employee_count: string
  estimated_revenue: string
  generated_company_description: string
  extracted_short_description: string
  extracted_long_description: string
  business_tags: string
  naics_2022_primary_code: string
  naics_2022_primary_label: string
  naics_2022_secondary_codes: string
  naics_2022_secondary_labels: string
  main_business_category: string
  main_industry: string
  main_sector: string
  sic_code: string
  sic_label: string
  isic_4_code: string
  isic_4_label: string
  nace_rev2_code: string
  nace_rev2_label: string
  ncci_28_1_code: string
  primary_phone: string
  phone_numbers: string
  primary_email: string
  emails: string
  website_url: string
  website_domain: string
  website_tld: string
  website_language_code: string
  facebook_url: string
  twitter_url: string
  instagram_url: string
  linkedin_url: string
  ios_app_url: string
  android_app_url: string
  youtube_url: string
  tiktok_url: string
  technologies: string
  sics_codified_industry: string
  sics_codified_sector: string
  ibc_insurance_labels: string
  ibc_insurance_codes: string
  created_at: string
  last_updated_at: string
  registred_name: string
  registered_country_code: string
  registered_country: string
  registered_region: string
  registered_city: string
  registered_postcode: string
  registered_street: string
  registered_street_number: string
  registered_latitude: string
  registered_longitude: string
  registered_primary_phone: string
  jurisdiction: string
  legal_form: string
  company_status: string
  year_incorporated: string
  date_incorporated: string
  lei_id: string
  ein_id: string
  vat_id: string
  registry_id: string
}

export type ProductServiceType = {
  company_id: string
  root_domain: string
  page_breadcrumbs: string
  h1: string
  meta_title: string
  url: string
  name: string
  product_description: string
  unspsc_class_name: string
  unspsc_class: string
  unspsc_family_name: string
  unspsc_family: string
  unspsc_segment_name: string
  unspsc_segment: string
}

export type EsgType = {
  veridion_id: string
  esg_content_type: string
  esg_content_headline: string
  esg_content_relevant_text: string
  esg_content_source_url: string
  esg_content_pillar: string
  esg_content_risk_criteria: string
  esg_content_sentiment_value: string
  esg_content_sentiment_confidence: string
  esg_content_publish_date: string
}

export type PreviewStateType = {
  companyData: CompanyDataType[]
  productsServicesData: ProductServiceType[]
  esgData: EsgType[]
}

export type DefaultStateType = {
  title: string
  shortDescription: string
  detailedDescription: string
  tags: string[]
  useCases: string[]
  lastUpdate: string
  geography: string
  deliveryType: string
  contact: string
  price: string
  previewField: 'companyData' | 'productsServicesData' | 'esgData' | 'legalData'
  csv: string
  icon: string
  db_field: string
  click_track_event: string
}

export type PortalSettings = {
  created_at: string
  id: number
  setting: string
  updated_at: string
  value: string
}
