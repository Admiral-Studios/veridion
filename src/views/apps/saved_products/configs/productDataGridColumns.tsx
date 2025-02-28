import { GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'
import React from 'react'
import { Box, Button, Link } from '@mui/material'
import { addThousandsDelimiter } from 'src/utils/numbers/addThousandsDelimeter'
import { Address } from 'src/types/apps/veridionTypes'

const formatArrayOfObjects = (arr: any) => arr.map((item: any) => Object.values(item).join(', ')).join(' | ')

export const productsDataGridColumns = (setMainAddress?: (newMainAddress: Address) => void): GridColDef[] => [
  {
    field: 'id',
    headerName: '№',
    renderCell: params => params.api.getAllRowIds().indexOf(params.id) + 1
  },

  { field: 'project_name', headerName: 'Project Name', width: 200 },
  { field: 'product_headline', headerName: 'Product Headline', width: 200 },
  { field: 'product_content', headerName: 'Product Content', width: 200 },
  {
    field: 'product_url',
    headerName: 'Product Url',
    width: 200,
    renderCell: params =>
      !!params.value ? (
        <Link href={`${params.value}`} target='_blank'>
          {`${params.value}`}
        </Link>
      ) : (
        ''
      )
  },
  { field: 'veridion_id', headerName: 'Veridion ID', width: 250 },
  { field: 'company_name', headerName: 'Company Name', width: 200 },
  {
    field: 'company_commercial_names',
    headerName: 'Commercial Names',
    width: 250,

    valueGetter: params => (params.value ? params.value.join(' | ') : '')
  },
  {
    field: 'company_legal_names',
    headerName: 'Legal Names',
    width: 250,

    valueGetter: params => (params.value ? params.value.join(' | ') : '')
  },
  {
    field: 'main_address',
    headerName: 'Main Address',
    width: 200,
    disableExport: true,
    renderCell: params => {
      const value = params.row.main_address || {
        country_code: params.row.main_country_code,
        country: params.row.main_country,
        region: params.row.main_region,
        city: params.row.main_city,
        street: params.row.main_street,
        street_number: params.row.main_street_number,
        postcode: params.row.main_postcode,
        latitude: params.row.main_latitude,
        longitude: params.row.main_longitude
      }

      return <Button onClick={() => setMainAddress && setMainAddress(value)}>Open</Button>
    }
  },
  {
    field: 'main_country',
    headerName: 'Main Country',
    hideable: false,
    width: 200
  },
  {
    field: 'main_country_code',
    headerName: 'Main Country Code',
    hideable: false,
    width: 200
  },
  {
    field: 'main_region',
    headerName: 'Main Region',
    hideable: false,
    width: 200
  },
  {
    field: 'main_city',
    headerName: 'Main City',
    hideable: false,
    width: 200
  },
  {
    field: 'main_street',
    headerName: 'Main Street',
    hideable: false,
    width: 200
  },
  {
    field: 'main_street_number',
    headerName: 'Main Street Number',
    hideable: false,
    width: 200
  },
  {
    field: 'main_postcode',
    headerName: 'Main Postcode',
    hideable: false,
    width: 200
  },
  {
    field: 'main_latitude',
    headerName: 'Main Latitude',
    hideable: false,
    width: 200
  },
  {
    field: 'main_longitude',
    headerName: 'Main Longitude',
    hideable: false,
    width: 200
  },
  {
    field: 'locations',
    headerName: 'Locations',
    width: 250,

    valueGetter: params => (params.value ? formatArrayOfObjects(params.value) : '')
  },
  {
    field: 'num_locations',
    headerName: 'Num Locations',
    width: 150
  },

  {
    field: 'company_type',
    headerName: 'Company Type',
    width: 150
  },
  {
    field: 'year_founded',
    headerName: 'Year Founded',
    width: 150
  },
  {
    field: 'employee_count_type',
    headerName: 'Employee Count Type',
    width: 250,
    valueGetter: params => {
      return params.value || params.row.employee_count?.type
    }
  },
  {
    field: 'employee_count_value',
    headerName: 'Employee Count',
    width: 150,
    valueGetter: params => addThousandsDelimiter(params.value || '')
  },
  {
    field: 'revenue_type',
    headerName: 'Revenue Type',
    width: 250,
    valueGetter: params => {
      return params.value || params.row.employee_count?.type
    }
  },
  {
    field: 'revenue_value',
    headerName: 'Revenue',
    width: 150,
    valueGetter: params => addThousandsDelimiter(params.value || '')
  },
  { field: 'main_business_category', headerName: 'Business Category', width: 200 },
  {
    field: 'main_industry',
    headerName: 'Main Industry',
    width: 150
  },
  {
    field: 'main_sector',
    headerName: 'Main Sector',
    width: 150
  },
  {
    field: 'naics_2022.primary.code',
    headerName: 'NAICS Primary Code',
    width: 200,
    valueGetter: params =>
      params.row.naics_2022_primary_code ? params.row.naics_2022_primary_code : params.row?.naics_2022?.primary.code
  },
  {
    field: 'naics_2022.primary.label',
    headerName: 'NAICS Primary Label',
    width: 200,
    valueGetter: params =>
      params.row.naics_2022_primary_label ? params.row.naics_2022_primary_label : params.row?.naics_2022?.primary.label
  },
  {
    field: 'naics_2022',
    headerName: 'NAICS 2022 Secondary',
    width: 400,
    valueGetter: params =>
      params.row.naics_2022?.secondary
        ? formatArrayOfObjects(params.row.naics_2022?.secondary)
        : params.row.naics_2022_secondary
        ? formatArrayOfObjects(params.row.naics_2022_secondary)
        : ''
  },
  {
    field: 'nace_rev2',
    headerName: 'NACE REV2',
    width: 400,
    valueGetter: params => (params.value ? formatArrayOfObjects(params.value) : '')
  },
  {
    field: 'ncci_codes_28_1',
    headerName: 'NCCI Codes 28 1',
    width: 400,
    valueGetter: params => (params.value ? params.value.join(' | ') : '')
  },
  {
    field: 'sic',
    headerName: 'SIC',
    width: 400,
    valueGetter: params => (params.value ? formatArrayOfObjects(params.value) : '')
  },
  {
    field: 'isic_v4',
    headerName: 'ISIC V4',
    width: 400,
    valueGetter: params => (params.value ? formatArrayOfObjects(params.value) : '')
  },
  {
    field: 'ibc_insurance',
    headerName: 'Ibc Insurance',
    width: 400,
    valueGetter: params => (params.row.ibc_insurance ? formatArrayOfObjects(params.row.ibc_insurance) : '')
  },

  {
    field: 'website_url',
    headerName: 'Website',
    width: 200,
    renderCell: params =>
      !!params.value ? (
        <Link href={`${params.value}`} target='_blank'>
          {`${params.value}`}
        </Link>
      ) : (
        ''
      )
  },
  {
    field: 'company_supplier_types',
    headerName: 'Company Supplier Types',
    width: 250,

    valueGetter: params => (params.value ? params.value.join(' | ') : '')
  },
  {
    field: 'sics_industry.code',
    headerName: 'SICS Industry Code',
    width: 200,
    valueGetter: params =>
      params.row.sics_industry_code ? params.row.sics_industry_code : params.row?.sics_industry?.code
  },
  {
    field: 'sics_industry.label',
    headerName: 'SICS Industry Label',
    width: 200,
    valueGetter: params =>
      params.row.sics_industry_label ? params.row.sics_industry_label : params.row?.sics_industry?.label
  },
  {
    field: 'sics_sector.code',
    headerName: 'SICS Sector Code',
    width: 200,
    valueGetter: params => (params.row.sics_sector_code ? params.row.sics_sector_code : params.row?.sics_sector?.code)
  },
  {
    field: 'sics_sector.label',
    headerName: 'SICS Sector Label',
    width: 200,
    valueGetter: params =>
      params.row.sics_sector_label ? params.row.sics_sector_label : params.row?.sics_sector?.label
  },
  {
    field: 'sics_subsector.code',
    headerName: 'SICS Subsector Code',
    width: 200,
    valueGetter: params =>
      params.row.sics_subsector_code ? params.row.sics_subsector_code : params.row?.sics_subsector?.code
  },
  {
    field: 'sics_subsector.label',
    headerName: 'SICS Subsector Label',
    width: 200,
    valueGetter: params =>
      params.row.sics_subsector_label ? params.row.sics_subsector_label : params.row?.sics_subsector?.label
  },

  { field: 'short_description', headerName: 'Short Description', width: 400 },
  {
    field: 'long_description_extracted',
    headerName: 'Extracted Long Description',
    width: 600
  },
  {
    field: 'long_description_generated',
    headerName: 'Generated Long Description',
    width: 600
  },
  {
    field: 'business_tags_extracted',
    headerName: 'Extracted Business Tags',
    width: 250,
    valueGetter: params => params.value?.length && params.value.join(' | ')
  },
  {
    field: 'business_tags_generated',
    headerName: 'Generated Business Tags',
    width: 250,
    valueGetter: params => params.value?.length && params.value.join(' | ')
  },
  {
    field: 'primary_phone',
    headerName: 'Primary Phone',
    width: 200,
    renderCell: params => (!!params.value ? <Link href={`tel:${params.value}`}>{`${params.value}`}</Link> : '')
  },

  {
    field: 'phone_numbers',
    headerName: 'Phone Numbers',
    width: 400,
    valueGetter: params => (params.value?.length ? params.value.join(' | ') : ''),
    renderCell: params =>
      params.value
        ? params.value.split(' | ').map((number: string, key: number) => (
            <React.Fragment key={number}>
              <Link href={`tel:${number}`}>{`${number}`}</Link>

              {key !== params.value.length - 1 && (
                <Box component='span' sx={{ padding: '0px 4px' }}>
                  {' '}
                  |{' '}
                </Box>
              )}
            </React.Fragment>
          ))
        : ''
  },
  {
    field: 'primary_email',
    headerName: 'Primary Email',
    width: 300,
    renderCell: params => (!!params.value ? <Link href={`mailto:${params.value}`}>{`${params.value}`}</Link> : '')
  },
  {
    field: 'emails',
    headerName: 'Emails',
    width: 400,
    valueGetter: params => (params.value?.length ? params.value.join(' | ') : ''),
    renderCell: params =>
      params.value
        ? params.value
            .split(' | ')
            .map((email: string) => <Link key={email} href={`mailto:${email}`}>{`${email}`}</Link>)
        : ''
  },
  {
    field: 'website_url',
    headerName: 'Website Url',
    width: 300,
    renderCell: params =>
      !!params.value ? (
        <Link href={`${params.value}`} target='_blank'>
          {`${params.value}`}
        </Link>
      ) : (
        ''
      )
  },
  {
    field: 'website_domain',
    headerName: 'Website Domain',
    width: 150
  },
  {
    field: 'website_tld',
    headerName: 'Website Tld',
    width: 150
  },
  {
    field: 'website_language_code',
    headerName: 'Website Language Code',
    width: 150
  },
  {
    field: 'facebook_url',
    headerName: 'Facebook Url',
    width: 200,
    renderCell: params =>
      !!params.value ? (
        <Link href={`${params.value}`} target='_blank'>
          {`${params.value}`}
        </Link>
      ) : (
        ''
      )
  },
  {
    field: 'twitter_url',
    headerName: 'Twitter Url',
    width: 200,
    renderCell: params =>
      !!params.value ? (
        <Link href={`${params.value}`} target='_blank'>
          {`${params.value}`}
        </Link>
      ) : (
        ''
      )
  },
  {
    field: 'instagram_url',
    headerName: 'Instagram Url',
    width: 200,
    renderCell: params =>
      !!params.value ? (
        <Link href={`${params.value}`} target='_blank'>
          {`${params.value}`}
        </Link>
      ) : (
        ''
      )
  },
  {
    field: 'linkedin_url',
    headerName: 'Linkedin Url',
    width: 200,
    renderCell: params =>
      !!params.value ? (
        <Link href={`${params.value}`} target='_blank'>
          {`${params.value}`}
        </Link>
      ) : (
        ''
      )
  },
  {
    field: 'ios_app_url',
    headerName: 'Ios App Url',
    width: 200,
    renderCell: params =>
      !!params.value ? (
        <Link href={`${params.value}`} target='_blank'>
          {`${params.value}`}
        </Link>
      ) : (
        ''
      )
  },
  {
    field: 'android_app_url',
    headerName: 'Android App Url',
    width: 200,
    renderCell: params =>
      !!params.value ? (
        <Link href={`${params.value}`} target='_blank'>
          {`${params.value}`}
        </Link>
      ) : (
        ''
      )
  },
  {
    field: 'youtube_url',
    headerName: 'Youtube Url',
    width: 300,
    renderCell: params =>
      !!params.value ? (
        <Link href={`${params.value}`} target='_blank'>
          {`${params.value}`}
        </Link>
      ) : (
        ''
      )
  },
  {
    field: 'technologies',
    headerName: 'Technologies',
    width: 350,

    valueGetter: params => (params.value ? params.value.join(' | ') : '')
  },
  {
    field: 'created_at',
    headerName: 'Created At',
    width: 200,
    valueGetter: params => {
      if (!params.value) {
        return params.value
      }

      const createdAtDateValue = new Date(params.row.created_at)

      return format(createdAtDateValue, 'yyyy-MM-dd')
    }
  },

  {
    field: 'last_updated_at',
    headerName: 'Last Updated At',
    width: 200,
    valueGetter: params => {
      if (!params.value) {
        return params.value
      }

      const updatedAtDateValue = new Date(params.row.last_updated_at)

      return format(updatedAtDateValue, 'yyyy-MM-dd')
    }
  }
]

export const productDataGridColumnsNames = productsDataGridColumns().map(({ headerName }) => ({
  column_name: headerName || '',
  mapped_column_name: ''
}))
