import { Link } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

const digitalColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: '№',
    renderCell: params => params.api.getAllRowIds().indexOf(params.id) + 1
  },
  {
    field: 'company_id',
    headerName: 'company_id',
    width: 200
  },
  {
    field: 'company_name',
    headerName: 'company_name',
    width: 200
  },
  {
    field: 'company_legal_names',
    headerName: 'company_legal_names',
    width: 200
  },
  {
    field: 'company_commercial_names',
    headerName: 'company_commercial_names',
    width: 200
  },
  {
    field: 'main_country_code',
    headerName: 'main_country_code',
    width: 200
  },
  {
    field: 'main_country',
    headerName: 'main_country',
    width: 200
  },
  {
    field: 'main_region',
    headerName: 'main_region',
    width: 200
  },
  {
    field: 'main_city',
    headerName: 'main_city',
    width: 200
  },
  {
    field: 'main_postcode',
    headerName: 'main_postcode',
    width: 200
  },
  {
    field: 'main_street',
    headerName: 'main_street',
    width: 200
  },
  {
    field: 'main_street_number',
    headerName: 'main_street_number',
    width: 200
  },
  {
    field: 'main_latitude',
    headerName: 'main_latitude',
    width: 200
  },
  {
    field: 'main_longitude',
    headerName: 'main_longitude',
    width: 200
  },
  {
    field: 'number_of_locations',
    headerName: 'number_of_locations',
    width: 200
  },
  {
    field: 'all_locations',
    headerName: 'all_locations',
    width: 200
  },
  {
    field: 'company_type',
    headerName: 'company_type',
    width: 200
  },
  {
    field: 'year_founded',
    headerName: 'year_founded',
    width: 200
  },
  {
    field: 'employee_count',
    headerName: 'employee_count',
    width: 200
  },
  {
    field: 'estimated_revenue',
    headerName: 'estimated_revenue',
    width: 200
  },
  {
    field: 'generated_company_description',
    headerName: 'generated_company_description',
    width: 200
  },
  {
    field: 'extracted_short_description',
    headerName: 'extracted_short_description',
    width: 200
  },
  {
    field: 'extracted_long_description',
    headerName: 'extracted_long_description',
    width: 200
  },
  {
    field: 'business_tags',
    headerName: 'business_tags',
    width: 200
  },
  {
    field: 'naics_2022_primary_code',
    headerName: 'naics_2022_primary_code',
    width: 200
  },
  {
    field: 'naics_2022_primary_label',
    headerName: 'naics_2022_primary_label',
    width: 200
  },
  {
    field: 'naics_2022_secondary_codes',
    headerName: 'naics_2022_secondary_codes',
    width: 200
  },
  {
    field: 'naics_2022_secondary_labels',
    headerName: 'naics_2022_secondary_labels',
    width: 200
  },
  {
    field: 'main_business_category',
    headerName: 'main_business_category',
    width: 200
  },
  {
    field: 'main_industry',
    headerName: 'main_industry',
    width: 200
  },
  {
    field: 'main_sector',
    headerName: 'main_sector',
    width: 200
  },
  {
    field: 'sic_code',
    headerName: 'sic_code',
    width: 200
  },
  {
    field: 'sic_label',
    headerName: 'sic_label',
    width: 200
  },
  {
    field: 'isic_4_code',
    headerName: 'isic_4_code',
    width: 200
  },
  {
    field: 'isic_4_label',
    headerName: 'isic_4_label',
    width: 200
  },
  {
    field: 'nace_rev2_code',
    headerName: 'nace_rev2_code',
    width: 200
  },
  {
    field: 'nace_rev2_label',
    headerName: 'nace_rev2_label',
    width: 200
  },
  {
    field: 'ncci_28_1_code',
    headerName: 'ncci_28_1_code',
    width: 200
  },
  {
    field: 'primary_phone',
    headerName: 'primary_phone',
    width: 200
  },
  {
    field: 'phone_numbers',
    headerName: 'phone_numbers',
    width: 200
  },
  {
    field: 'primary_email',
    headerName: 'primary_email',
    width: 200
  },
  {
    field: 'emails',
    headerName: 'emails',
    width: 200,
    renderCell: params => (!!params.value ? <Link href={`mailto:${params.value}`}>{`${params.value}`}</Link> : '')
  },
  {
    field: 'website_url',
    headerName: 'website_url',
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
    field: 'website_domain',
    headerName: 'website_domain',
    width: 200
  },
  {
    field: 'website_tld',
    headerName: 'website_tld',
    width: 200
  },
  {
    field: 'website_language_code',
    headerName: 'website_language_code',
    width: 200
  },
  {
    field: 'facebook_url',
    headerName: 'facebook_url',
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
    headerName: 'twitter_url',
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
    headerName: 'instagram_url',
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
    headerName: 'linkedin_url',
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
    headerName: 'ios_app_url',
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
    headerName: 'android_app_url',
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
    headerName: 'youtube_url',
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
    field: 'tiktok_url',
    headerName: 'tiktok_url',
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
    headerName: 'technologies',
    width: 200
  },
  {
    field: 'sics_codified_industry',
    headerName: 'sics_codified_industry',
    width: 200
  },
  {
    field: 'sics_codified_sector',
    headerName: 'sics_codified_sector',
    width: 200
  },
  {
    field: 'ibc_insurance_labels',
    headerName: 'ibc_insurance_labels',
    width: 200
  },
  {
    field: 'ibc_insurance_codes',
    headerName: 'ibc_insurance_codes',
    width: 200
  },
  {
    field: 'created_at',
    headerName: 'created_at',
    width: 200
  },
  {
    field: 'last_updated_at',
    headerName: 'last_updated_at',
    width: 200
  }
]

const legalColumns: GridColDef[] = [
  {
    field: 'registred_name',
    headerName: 'registred_name',
    width: 200
  },
  {
    field: 'registered_country_code',
    headerName: 'registered_country_code',
    width: 200
  },
  {
    field: 'registered_country',
    headerName: 'registered_country',
    width: 200
  },
  {
    field: 'registered_region',
    headerName: 'registered_region',
    width: 200
  },
  {
    field: 'registered_city',
    headerName: 'registered_city',
    width: 200
  },
  {
    field: 'registered_postcode',
    headerName: 'registered_postcode',
    width: 200
  },
  {
    field: 'registered_street',
    headerName: 'registered_street',
    width: 200
  },
  {
    field: 'registered_street_number',
    headerName: 'registered_street_number',
    width: 200
  },
  {
    field: 'registered_latitude',
    headerName: 'registered_latitude',
    width: 200
  },
  {
    field: 'registered_longitude',
    headerName: 'registered_longitude',
    width: 200
  },
  {
    field: 'registered_primary_phone',
    headerName: 'registered_primary_phone',
    width: 200
  },
  {
    field: 'jurisdiction',
    headerName: 'jurisdiction',
    width: 200
  },
  {
    field: 'legal_form',
    headerName: 'legal_form',
    width: 200
  },
  {
    field: 'company_status',
    headerName: 'company_status',
    width: 200
  },
  {
    field: 'year_incorporated',
    headerName: 'year_incorporated',
    width: 200
  },
  {
    field: 'date_incorporated',
    headerName: 'date_incorporated',
    width: 200
  },
  {
    field: 'lei_id',
    headerName: 'lei_id',
    width: 200
  },
  {
    field: 'ein_id',
    headerName: 'ein_id',
    width: 200
  },
  {
    field: 'vat_id',
    headerName: 'vat_id',
    width: 200
  },
  {
    field: 'registry_id',
    headerName: 'registry_id',
    width: 200
  }
]

const productsServicesColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: '№',
    renderCell: params => params.api.getAllRowIds().indexOf(params.id) + 1
  },
  {
    field: 'company_id',
    headerName: 'Company id',
    width: 200
  },
  {
    field: 'root_domain',
    headerName: 'root domain',
    width: 200
  },
  {
    field: 'page_breadcrumbs',
    headerName: 'page breadcrumbs',
    width: 400
  },
  {
    field: 'h1',
    headerName: 'h1',
    width: 400
  },
  {
    field: 'meta_title',
    headerName: 'meta title',
    width: 400
  },
  {
    field: 'url',
    headerName: 'url',
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
    field: 'name',
    headerName: 'name',
    width: 400
  },
  {
    field: 'product_description',
    headerName: 'product description',
    width: 400
  },
  {
    field: 'unspsc_class_name',
    headerName: 'unspsc class name',
    width: 400
  },
  {
    field: 'unspsc_class',
    headerName: 'unspsc class',
    width: 400
  },
  {
    field: 'unspsc_family_name',
    headerName: 'unspsc family name',
    width: 400
  },
  {
    field: 'unspsc_family',
    headerName: 'unspsc family',
    width: 400
  },
  {
    field: 'unspsc_segment_name',
    headerName: 'unspsc segment name',
    width: 400
  },
  {
    field: 'unspsc_segment',
    headerName: 'unspsc segment',
    width: 400
  }
]

const esgColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: '№',
    renderCell: params => params.api.getAllRowIds().indexOf(params.id) + 1
  },
  {
    field: 'veridion_id',
    headerName: 'veridion id',
    width: 200
  },
  {
    field: 'esg_content_type',
    headerName: 'esg content type',
    width: 400
  },
  {
    field: 'esg_content_headline',
    headerName: 'esg content headline',
    width: 400
  },
  {
    field: 'esg_content_relevant_text',
    headerName: 'esg content relevant text',
    width: 400
  },
  {
    field: 'esg_content_source_url',
    headerName: 'esg content source url',
    width: 400
  },
  {
    field: 'esg_content_pillar',
    headerName: 'esg content pillar',
    width: 400
  },
  {
    field: 'esg_content_risk_criteria',
    headerName: 'esg content risk criteria',
    width: 400
  },
  {
    field: 'esg_content_sentiment_value',
    headerName: 'esg content sentiment value',
    width: 400
  },
  {
    field: 'esg_content_sentiment_confidence',
    headerName: 'esg content sentiment confidence',
    width: 400
  },
  {
    field: 'esg_content_publish_date',
    headerName: 'esg content publish date',
    width: 400
  }
]

export const previewColumns = {
  companyData: digitalColumns,
  legalData: legalColumns,
  productsServicesData: productsServicesColumns,
  esgData: esgColumns
}
