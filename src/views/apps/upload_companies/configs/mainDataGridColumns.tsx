import { GridColDef } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'
import React from 'react'
import { Box, Button, Link } from '@mui/material'
import {
  Address,
  CodeLabel,
  InputFieldsType,
  LocationAttribute,
  MatchDetails,
  MatchMethod
} from 'src/types/apps/veridionTypes'
import { addThousandsDelimiter } from 'src/utils/numbers/addThousandsDelimeter'

const formatArrayOfObjects = (arr: any) => arr.map((item: any) => Object.values(item).join(', ')).join(' | ')

export const mainDataGridColumns = (
  setMatchDetails?: (newMatchDetails: MatchDetails) => void,
  setInputField?: (newMatchDetails: InputFieldsType) => void,
  setMainAddress?: (newMainAddress: Address) => void,
  setRegisteredAddress?: (newRegistered: Address) => void,
  setLocations?: (newLocations: Address[]) => void,
  setNaicsSecondaryCodes?: (newCodes: CodeLabel[]) => void,
  setNaceRev2Codes?: (newCodes: CodeLabel[]) => void,
  setSicCodes?: (newCodes: CodeLabel[]) => void,
  setIsicCodes?: (newCodes: CodeLabel[]) => void,
  setNcciCodes?: (newCodes: string[]) => void
): GridColDef[] => [
  {
    field: 'id',
    headerName: '№',
    renderCell: params => params.api.getAllRowIds().indexOf(params.id) + 1
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: params => <Typography>{params.value}</Typography>
  },
  { field: 'company_name', headerName: 'Company Name', width: 200 },
  {
    field: 'input_fields',
    headerName: 'Input Fields',
    width: 150,
    disableExport: true,
    renderCell: params => {
      const value = {
        input_legal_names: params.row.input_legal_names,
        input_commercial_names: params.row.input_commercial_names,
        input_address_txt: params.row.input_address_txt,
        input_phone_number: params.row.input_phone_number,
        input_website: params.row.input_website,
        input_email: params.row.input_email,
        input_file_name: params.row.input_file_name,
        input_registry_id: params.row.input_registry_id
      }

      return <Button onClick={() => setInputField && setInputField(value)}>Open</Button>
    }
  },
  {
    field: 'input_address_txt',
    headerName: 'Input Address Txt',
    width: 400,
    hideable: false,
    valueGetter: params => `${params.row.input_address_txt || ''} ${params.row.address_txt || ''}`
  },
  {
    field: 'input_commercial_names',
    headerName: 'Input Commercial Name',
    hideable: false,
    width: 300
  },
  {
    field: 'input_email',
    headerName: 'Input Email',
    hideable: false,
    width: 300,
    valueGetter: params => params.row.input_email
  },
  {
    field: 'input_file_name',
    headerName: 'Input File Name',
    hideable: false,
    width: 300
  },
  {
    field: 'input_legal_names',
    headerName: 'Input Legal Names',
    width: 300,
    hideable: false
  },

  {
    field: 'input_phone_number',
    headerName: 'Input Phone Number',
    hideable: false,
    width: 300,
    valueGetter: params => params.row.input_phone_number
  },
  {
    field: 'input_registry_id',
    headerName: 'Input Registry Id',
    hideable: false,
    width: 300
  },
  {
    field: 'input_website',
    headerName: 'Input Website',
    hideable: false,
    width: 300,
    valueGetter: params => params.row.input_website
  },
  {
    field: 'confidence_score',
    headerName: 'Confidence Score',
    width: 200,
    valueGetter: params => (params.value ? params.value : params.row?.match_details?.confidence_score || '')
  },
  {
    field: 'match_details',
    headerName: 'Match Details',
    width: 150,
    disableExport: true,
    renderCell: params => {
      const value = params.value as MatchDetails | null

      if (value) {
        return <Button onClick={() => setMatchDetails && setMatchDetails(value)}>Open</Button>
      }

      return ''
    }
  },
  {
    field: 'match_details_matched_on',
    headerName: 'Match Details Matched On',
    width: 150,
    hideable: false,
    valueGetter: params =>
      params.row.match_details?.matched_on?.length ? params.row.match_details.matched_on.join(' | ') : ''
  },
  {
    field: 'match_details_company_name',
    headerName: 'Match Details For Company Name',
    width: 150,
    hideable: false,
    valueGetter: params => {
      const value: MatchMethod | null = params.row.match_details?.attributes?.company_name

      if (value) {
        return `Confidence score: ${value.confidence_score || ''} | Match Source: ${
          value.match_source || ''
        } | Match Type: ${value.match_type || ''} | Value: ${value.value || ''}`
      }
    }
  },
  {
    field: 'match_details_location',
    headerName: 'Match Details For Location',
    width: 150,
    hideable: false,
    valueGetter: params => {
      const value: LocationAttribute | null = params.row.match_details?.attributes?.company_name

      if (value) {
        return `Confidence score: ${value.confidence_score || ''} | Match Element: ${
          value.match_element
        } | Match Source: ${value.match_source || ''} | Match Type: ${value.match_type || ''} | Country: ${
          value.value.country || ''
        } | Country Code: ${value.value.country_code || ''} | Region: ${value.value.region || ''} | City: ${
          value.value.city || ''
        } | Street: ${value.value.street || ''} | Street Number: ${value.value.street_number || ''} | Postcode: ${
          value.value.postcode || ''
        } | Latitude: ${value.value.latitude || ''} | Longitude: ${value.value.longitude || ''}`
      }
    }
  },
  {
    field: 'match_details_phone_number',
    headerName: 'Match Details For Phone Number',
    width: 150,
    hideable: false,
    valueGetter: params => {
      const value: MatchMethod | null = params.row.match_details?.attributes?.phone_number

      if (value) {
        return `Confidence score: ${value.confidence_score || ''} | Match Source: ${
          value.match_source || ''
        } | Match Type: ${value.match_type || ''} | Value: ${value.value || ''}`
      }
    }
  },
  {
    field: 'match_details_registry_ids',
    headerName: 'Match Details For Registry Ids',
    width: 150,
    hideable: false,
    valueGetter: params => {
      const value: MatchMethod | null = params.row.match_details?.attributes?.registry_id

      if (value) {
        return `Confidence score: ${value.confidence_score || ''} | Match Source: ${
          value.match_source || ''
        } | Match Type: ${value.match_type || ''} | Value: ${value.value || ''}`
      }
    }
  },
  {
    field: 'match_details_website',
    headerName: 'Match Details For Website',
    width: 150,
    hideable: false,
    valueGetter: params => {
      const value: MatchMethod | null = params.row.match_details?.attributes?.website

      if (value) {
        return `Confidence score: ${value.confidence_score || ''} | Match Source: ${
          value.match_source || ''
        } | Match Type: ${value.match_type || ''} | Value: ${value.value || ''}`
      }
    }
  },
  { field: 'veridion_id', headerName: 'Veridion ID', width: 250 },
  {
    field: 'registered_name',
    headerName: 'Registered Name',
    width: 250
  },
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
    width: 150,
    disableExport: true,
    renderCell: params => {
      const value = params.row.main_address || {
        country: params.row.main_country,
        country_code: params.row.main_country_code,
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
    width: 200,
    hideable: false,
    valueGetter: params => params.row.main_address?.country || params.row.main_country
  },
  {
    field: 'main_country_code',
    headerName: 'Main Country Code',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.main_address?.country_code || params.row.main_country_code
  },
  {
    field: 'main_region',
    headerName: 'Main Region',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.main_address?.region || params.row.main_region
  },
  {
    field: 'main_city',
    headerName: 'Main City',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.main_address?.city || params.row.main_city
  },
  {
    field: 'main_street',
    headerName: 'Main Street',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.main_address?.street || params.row.main_street
  },
  {
    field: 'main_street_number',
    headerName: 'Main Street Number',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.main_address?.street_number || params.row.main_street_number
  },
  {
    field: 'main_postcode',
    headerName: 'Main Postcode',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.main_address?.postcode || params.row.main_postcode
  },
  {
    field: 'main_latitude',
    headerName: 'Main Latitude',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.main_address?.latitude || params.row.main_latitude
  },
  {
    field: 'main_longitude',
    headerName: 'Main Longitude',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.main_address?.longitude || params.row.main_longitude
  },
  {
    field: 'locations',
    headerName: 'Locations',
    width: 150,
    valueGetter: params => (params.value ? formatArrayOfObjects(params.value) : ''),
    renderCell: params => {
      const locations = (params.row?.locations || []) as Address[]

      if (locations.length) {
        return <Button onClick={() => setLocations && setLocations(locations)}>Open</Button>
      }

      return ''
    }
  },
  {
    field: 'num_locations',
    headerName: 'Num Locations',
    width: 150
  },
  {
    field: 'registered_address',
    headerName: 'Registered Address',
    width: 200,
    disableExport: true,
    renderCell: params => {
      const value = params.row.registered_address || {
        country_code: params.row.registered_country_code,
        country: params.row.registered_country,
        region: params.row.registered_country_code,
        city: params.row.registered_city,
        street: params.row.registered_street,
        street_number: params.row.registered_street_number,
        postcode: params.row.registered_postcode,
        latitude: params.row.registered_latitude,
        longitude: params.row.registered_longitude
      }

      return <Button onClick={() => setRegisteredAddress && setRegisteredAddress(value)}>Open</Button>
    }
  },
  {
    field: 'registered_country',
    headerName: 'Registered Country',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.registered_address?.country || params.row.registered_country
  },
  {
    field: 'registered_country_code',
    headerName: 'Registered Country Code',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.registered_address?.country_code || params.row.registered_country_code
  },
  {
    field: 'registered_region',
    headerName: 'Registered Region',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.registered_address?.region || params.row.registered_region
  },
  {
    field: 'registered_city',
    headerName: 'Registered City',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.registered_address?.city || params.row.registered_city
  },
  {
    field: 'registered_street',
    headerName: 'Registered Street',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.registered_address?.street || params.row.registered_street
  },
  {
    field: 'registered_street_number',
    headerName: 'Registered Street Number',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.registered_address?.street_number || params.row.registered_street_number
  },
  {
    field: 'registered_postcode',
    headerName: 'Registered Postcode',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.registered_address?.postcode || params.row.registered_postcode
  },
  {
    field: 'registered_latitude',
    headerName: 'Registered Latitude',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.registered_address?.latitude || params.row.registered_latitude
  },
  {
    field: 'registered_longitude',
    headerName: 'Registered Longitude',
    width: 200,
    hideable: false,
    valueGetter: params => params.row.registered_address?.longitude || params.row.registered_longitude
  },
  {
    field: 'jurisdiction',
    headerName: 'Jurisdiction',
    width: 150
  },
  {
    field: 'legal_form',
    headerName: 'Legal Form',
    width: 150
  },
  {
    field: 'company_type',
    headerName: 'Company Type',
    width: 150
  },
  {
    field: 'company_status',
    headerName: 'Company Status',
    width: 250
  },
  {
    field: 'year_founded',
    headerName: 'Year Founded',
    width: 150
  },
  {
    field: 'incorporation_date',
    headerName: 'Incorporation Date',
    width: 250
  },
  {
    field: 'lei',
    headerName: 'LEI',
    width: 150
  },
  {
    field: 'ein',
    headerName: 'EIN',
    width: 150
  },
  {
    field: 'vat_id',
    headerName: 'VAT ID',
    width: 150
  },
  {
    field: 'tin',
    headerName: 'TIN',
    width: 150
  },
  {
    field: 'registry_ids',
    headerName: 'Registry IDs',
    width: 250,
    valueGetter: params => (params.value ? params.value.join(' | ') : '')
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
    valueGetter: params => {
      return typeof params.value === 'object'
        ? addThousandsDelimiter(params.row.employee_count?.value || '')
        : params.row.employee_count_value
        ? addThousandsDelimiter(params.row.employee_count_value)
        : addThousandsDelimiter(params.row.employee_count?.value || '')
    }
  },
  {
    field: 'revenue_type',
    headerName: 'Revenue Type',
    width: 250,
    valueGetter: params => {
      return params.value || params.row.revenue?.type
    }
  },
  {
    field: 'revenue_value',
    headerName: 'Revenue',
    width: 150,
    valueGetter: params => {
      return typeof params.value === 'object'
        ? addThousandsDelimiter(params.row.revenue?.value || '')
        : params.row.revenue_value
        ? addThousandsDelimiter(params.row.revenue_value)
        : addThousandsDelimiter(params.row.revenue?.value || '')
    }
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
    width: 200,
    valueGetter: params =>
      params.row.naics_2022?.secondary
        ? formatArrayOfObjects(params.row.naics_2022?.secondary)
        : params.row.naics_2022_secondary
        ? formatArrayOfObjects(params.row.naics_2022_secondary)
        : '',

    renderCell: params => {
      const codes = (params.row.naics_2022?.secondary || params.row?.naics_2022_secondary || []) as CodeLabel[]

      if (codes.length) {
        return <Button onClick={() => setNaicsSecondaryCodes && setNaicsSecondaryCodes(codes)}>Open</Button>
      }

      return ''
    }
  },
  {
    field: 'nace_rev2',
    headerName: 'NACE REV2',
    width: 200,
    valueGetter: params => (params.value ? formatArrayOfObjects(params.value) : ''),
    renderCell: params => {
      const codes = (params.row.nace_rev2 || []) as CodeLabel[]

      if (codes.length) {
        return <Button onClick={() => setNaceRev2Codes && setNaceRev2Codes(codes)}>Open</Button>
      }

      return ''
    }
  },

  {
    field: 'ncci_codes_28_1',
    headerName: 'NCCI Codes 28 1',
    width: 200,
    valueGetter: params => (params.value ? params.value.join(' | ') : ''),
    renderCell: params => {
      const codes = (params.row.ncci_codes_28_1 || []) as string[]

      if (codes.length) {
        return <Button onClick={() => setNcciCodes && setNcciCodes(codes)}>Open</Button>
      }

      return ''
    }
  },
  {
    field: 'sic',
    headerName: 'SIC',
    width: 400,
    valueGetter: params => (params.value ? formatArrayOfObjects(params.value) : ''),
    renderCell: params => {
      const codes = (params.row.sic || []) as CodeLabel[]

      if (codes.length) {
        return <Button onClick={() => setSicCodes && setSicCodes(codes)}>Open</Button>
      }

      return ''
    }
  },
  {
    field: 'isic_v4',
    headerName: 'ISIC V4',
    width: 200,
    valueGetter: params => (params.value ? formatArrayOfObjects(params.value) : ''),
    renderCell: params => {
      const codes = (params.row.isic_v4 || []) as CodeLabel[]

      if (codes.length) {
        return <Button onClick={() => setIsicCodes && setIsicCodes(codes)}>Open</Button>
      }

      return ''
    }
  },
  {
    field: 'ibc_insurance',
    headerName: 'IBC Insurance',
    width: 400,
    valueGetter: params => (params.row.ibc_insurance ? formatArrayOfObjects(params.row.ibc_insurance) : '')
  },
  {
    field: 'sics_industry.code',
    headerName: 'SICS Industry Code',
    width: 150,
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
    width: 150,
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
  { field: 'long_description_extracted', headerName: 'Extracted Long Description', width: 600 },
  { field: 'long_description_generated', headerName: 'Generated Long Description', width: 600 },
  {
    field: 'business_tags_extracted',
    headerName: 'Extracted Business Tags',
    width: 350,

    valueGetter: params => (params.value ? params.value.join(' | ') : '')
  },
  {
    field: 'business_tags_generated',
    headerName: 'Generated Business Tags',
    width: 350,

    valueGetter: params => (params.value ? params.value.join(' | ') : '')
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

              {key !== params.value.split(' | ').length - 1 && (
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
    valueGetter: params => (params.value?.length ? params.value.join(' | ') : ''),
    width: 250,
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
  },
  {
    field: 'api_error',
    headerName: 'API Error',
    width: 200
  }
]

export const mainDataGridColumnsNames = mainDataGridColumns().map(({ headerName }) => ({
  column_name: headerName || '',
  mapped_column_name: ''
}))
