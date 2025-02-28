import { format } from 'date-fns'
import { addThousandsDelimiter } from '../numbers/addThousandsDelimeter'
import { stringify } from 'csv-stringify/sync'

const formatArrayOfObjects = (arr: any) => arr.map((item: any) => Object.values(item).join(', ')).join(' | ')

export const companyCsvColumns = (company: any) => [
  {
    headerName: 'ID',
    value: company.veridion_id
  },
  { headerName: 'Company Name', value: company.company_name },
  {
    headerName: 'Website',
    value: company.website_url
  },
  {
    headerName: 'Commercial Names',
    value: company.company_commercial_names?.length ? company.company_commercial_names.join(' | ') : ''
  },
  {
    headerName: 'Main Country',
    value: company.main_address?.country || ''
  },
  {
    headerName: 'Main Country Code',
    value: company.main_address?.country_code || ''
  },

  {
    headerName: 'Main Region',
    value: company.main_address?.region || ''
  },
  {
    headerName: 'Main City',
    value: company.main_address?.city || ''
  },
  {
    headerName: 'Main Street',
    value: company.main_address?.street || ''
  },
  {
    headerName: 'Main Street Number',
    value: company.main_address?.street_number || ''
  },
  {
    headerName: 'Main Postcode',
    value: company.main_address?.postcode || ''
  },
  {
    headerName: 'Main Latitude',
    value: company.main_address?.latitude || ''
  },
  {
    headerName: 'Main Longitude',
    value: company.main_address?.longitude || ''
  },
  {
    headerName: 'Registered Name',
    value: company.registered_name || ''
  },
  {
    headerName: 'Registered Country',
    value: company.registered_address?.country || ''
  },
  {
    headerName: 'Registered Country Code',
    value: company.registered_address?.country_code || ''
  },
  {
    headerName: 'Registered Region',
    value: company.registered_address?.region || ''
  },
  {
    headerName: 'Registered City',
    value: company.registered_address?.city || ''
  },
  {
    headerName: 'Registered Street',
    value: company.registered_address?.street || ''
  },
  {
    headerName: 'Registered Street Number',
    value: company.registered_address?.street_number || ''
  },
  {
    headerName: 'Registered Postcode',
    value: company.registered_address?.postcode || ''
  },
  {
    headerName: 'Registered Latitude',
    value: company.registered_address?.latitude || ''
  },
  {
    headerName: 'Registered Longitude',
    value: company.registered_address?.longitude || ''
  },

  {
    headerName: 'Jurisdiction',
    value: company.jurisdiction || ''
  },
  {
    headerName: 'Legal Form',
    value: company.legal_form || ''
  },
  {
    headerName: 'Company Status',
    value: company.company_status || ''
  },
  {
    headerName: 'Incorporation Date',
    value: company.incorporation_date || ''
  },
  {
    headerName: 'LEI',
    value: company.lei || ''
  },
  {
    headerName: 'EIN',
    value: company.ein || ''
  },
  {
    headerName: 'VAT ID',
    value: company.vat_id || ''
  },
  {
    headerName: 'TIN',
    value: company.tin || ''
  },
  {
    headerName: 'Employee Count Type',
    value: company.employee_count?.type || ''
  },
  {
    headerName: 'Employee Count',
    value: company.employee_count?.value ? addThousandsDelimiter(company.employee_count?.value) : ''
  },
  {
    headerName: 'Revenue Type',
    value: company.revenue?.type || ''
  },
  {
    headerName: 'Revenue',
    value: company.revenue?.value ? addThousandsDelimiter(company.revenue?.value) : ''
  },
  {
    headerName: 'Num Locations',
    value: company.num_locations || ''
  },
  {
    headerName: 'Company Type',
    value: company.company_type || ''
  },
  {
    headerName: 'Year Founded',
    value: company.year_founded || ''
  },
  {
    headerName: 'Business Category',
    value: company.main_business_category || ''
  },
  {
    headerName: 'Main Industry',
    value: company.main_industry || ''
  },
  {
    headerName: 'Main Sector',
    value: company.main_sector || ''
  },
  {
    headerName: 'Extracted Business Tags',
    value: company.business_tags_extracted ? company.business_tags_extracted.join(' | ') : ''
  },
  {
    headerName: 'Generated Business Tags',
    value: company.business_tags_generated ? company.business_tags_generated.join(' | ') : ''
  },
  {
    headerName: 'Commercial Names',
    value: company.company_commercial_names ? company.company_commercial_names.join(' | ') : ''
  },
  {
    headerName: 'Legal Names',
    value: company.company_legal_names ? company.company_legal_names.join(' | ') : ''
  },

  {
    headerName: 'Locations',
    value: company.locations ? formatArrayOfObjects(company.locations) : ''
  },

  {
    headerName: 'NAICS Primary Code',
    value: company.naics_2022?.primary?.code || ''
  },
  {
    headerName: 'NAICS Primary Label',
    value: company.naics_2022?.primary?.label || ''
  },
  {
    headerName: 'SICS Industry Code',
    value: company.sics_industry?.code || ''
  },
  {
    headerName: 'SICS Industry Label',
    value: company.sics_industry?.label || ''
  },
  {
    headerName: 'SICS Sector Code',
    value: company.sics_sector?.code || ''
  },
  {
    headerName: 'SICS Sector Label',
    value: company.sics_sector?.label || ''
  },
  {
    headerName: 'SICS Subsector Code',
    value: company.sics_subsector?.code || ''
  },
  {
    headerName: 'SICS Subsector Label',
    value: company.sics_subsector?.label || ''
  },

  {
    headerName: 'IBC Insurance',
    value: company.ibc_insurance ? formatArrayOfObjects(company.ibc_insurance) : ''
  },

  {
    headerName: 'ISIC V4',
    value: company.isic_v4 ? formatArrayOfObjects(company.isic_v4) : ''
  },

  {
    headerName: 'NACE REV2',
    value: company.nace_rev2 ? formatArrayOfObjects(company.nace_rev2) : ''
  },

  {
    headerName: 'NAICS 2022 Secondary',
    value: company.naics_2022?.secondary ? formatArrayOfObjects(company.naics_2022.secondary) : ''
  },

  {
    headerName: 'NCCI Codes 28 1',
    value: company.ncci_codes_28_1 ? company.ncci_codes_28_1.join(' | ') : ''
  },

  {
    headerName: 'SIC',
    value: company.sic ? formatArrayOfObjects(company.sic) : ''
  },
  {
    headerName: 'Short Description',
    value: company.short_description || ''
  },
  {
    headerName: 'Long Description',
    value: company.long_description_extracted || ''
  },
  {
    headerName: 'Technologies',
    value: company.technologies ? company.technologies.join(' | ') : ''
  },

  {
    headerName: 'Last Updated At',
    value: company.last_updated_at ? format(new Date(company.last_updated_at), 'yyyy-MM-dd') : ''
  },
  {
    headerName: 'Primary Phone',
    value: company.primary_phone || ''
  },

  {
    headerName: 'Phone Numbers',
    value: company.phone_numbers?.length ? company.phone_numbers.join(', ') : ''
  },

  {
    headerName: 'Primary Email',
    value: company.primary_email || ''
  },
  {
    headerName: 'Website Url',
    value: company.website_url || ''
  },
  {
    headerName: 'Website Domain',
    value: company.website_domain || ''
  },
  {
    headerName: 'Website Tld',
    value: company.website_tld || ''
  },
  {
    headerName: 'Website Language Code',
    value: company.website_language_code || ''
  },
  {
    headerName: 'Facebook Url',
    value: company.facebook_url || ''
  },
  {
    headerName: 'Twitter Url',
    value: company.twitter_url || ''
  },
  {
    headerName: 'Instagram Url',
    value: company.instagram_url || ''
  },
  {
    headerName: 'Linkedin Url',
    value: company.linkedin_url || ''
  },
  {
    headerName: 'Ios App Url',
    value: company.ios_app_url || ''
  },
  {
    headerName: 'Android App Url',
    value: company.android_app_url || ''
  },
  {
    headerName: 'Youtube Url',
    value: company.youtube_url || ''
  }
]

export const objectToCSV = (data: any) => {
  const headers = companyCsvColumns(data[0]).map(({ headerName }) => headerName)
  const rows = data
    .map((company: any) =>
      companyCsvColumns(company)
        .map(({ value }) => {
          let fieldValue = value

          if (typeof fieldValue === 'string' && (fieldValue.includes(',') || fieldValue.includes('"'))) {
            fieldValue = `"${value.replace(/"/g, '""')}"`
          }

          return fieldValue
        })
        .join(',')
    )
    .join('\n')

  return `${headers}\n${rows}`
}

export const exportDatagridData = (data: { headerName: string; value: string }[][]) => {
  const headers = data[0].map(({ headerName }) => headerName)
  const rows = data.map(company => company.map(({ value }) => value))

  return stringify(rows, {
    header: true,
    columns: headers
  })
}

export const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
}
