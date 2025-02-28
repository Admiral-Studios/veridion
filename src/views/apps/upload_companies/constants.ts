export const expectedHeaders = [
  'legal_names',
  'commercial_names',
  'address_txt',
  'phone_number',
  'website',
  'registry_id'
]

export const companyRecordsToEnrich = {
  company_name: '',
  website_url: '',
  company_commercial_names: [],
  main_address: {
    country_code: '',
    country: '',
    region: '',
    city: '',
    street: '',
    street_number: '',
    postcode: '',
    latitude: null,
    longitude: null
  },
  main_business_category: '',
  naics_2022: null,
  short_description: '',
  long_description_extracted: '',
  last_updated_at: '',
  veridion_id: '',
  primary_phone: '',
  primary_email: '',
  facebook_url: '',
  linkedin_url: '',
  created_at: '',
  status: 'Error',
  num_locations: null,
  company_type: '',
  year_founded: null,
  employee_count: null,
  revenue: null,
  main_industry: '',
  main_sector: '',
  website_domain: '',
  website_tld: '',
  website_language_code: '',
  twitter_url: '',
  instagram_url: '',
  ios_app_url: '',
  youtube_url: '',
  sics_sector: null,
  sics_industry: null,
  sics_subsector: null,
  match_details: {
    confidence_score: null,
    matched_on: [],
    attributes: {
      company_name: {
        confidence_score: null,
        match_type: '',
        match_source: '',
        value: ''
      },
      location: {
        confidence_score: null,
        match_type: '',
        match_source: '',
        match_element: '',
        value: {
          country_code: '',
          country: '',
          region: '',
          city: '',
          street: '',
          street_number: '',
          postcode: '',
          latitude: null,
          longitude: null
        }
      },
      website: {
        confidence_score: null,
        match_type: '',
        match_source: '',
        value: ''
      },
      phone: {
        confidence_score: null,
        match_type: '',
        match_source: '',
        value: ''
      },
      registry_id: {
        confidence_score: null,
        match_type: '',
        match_source: '',
        value: ''
      }
    }
  },
  registered_address: {
    country_code: '',
    country: '',
    region: '',
    city: '',
    street: '',
    street_number: '',
    postcode: '',
    latitude: null,
    longitude: null
  },
  jurisdiction: '',
  legal_form: '',
  company_status: '',
  incorporation_date: '',
  lei: null,
  ein: null,
  vat_id: null,
  tin: null,
  registry_ids: [],
  long_description_generated: '',
  business_tags_extracted: [],
  business_tags_generated: []
}

export const companyInputRecords = {
  legal_names: '',
  commercial_names: '',
  address_txt: '',
  phone_number: '',
  website: '',
  email: '',
  register_id: '  '
}
