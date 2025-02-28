import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'
import { UserDataType } from 'src/context/types'
import { CsvCompanyUploadType, CompanyMatchEnrichTypeForSave } from 'src/types/apps/veridionTypes'
import sql, { ConnectionPool, NVarChar, Request, Int, Decimal, DateTime2, SmallInt, BigInt } from 'mssql'
import { dbConfig } from 'src/configs/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool: ConnectionPool = await sql.connect(dbConfig)
  const request: Request = pool.request()
  const { enrichedData, inputData } = req.body as {
    user: UserDataType
    inputData: CsvCompanyUploadType
    enrichedData: CompanyMatchEnrichTypeForSave
  }

  const {
    naics_2022,
    sics_sector,
    sics_subsector,
    sics_industry,
    main_address,
    match_details,
    registered_address,
    revenue,
    employee_count
  } = enrichedData

  const created_at = enrichedData.created_at
    ? new Date(enrichedData.created_at).toISOString().replace('T', ' ').replace('Z', '')
    : new Date().toISOString().replace('T', ' ').replace('Z', '')

  const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

  const sqlVarTypeHandler = (propertyName: keyof CsvCompanyUploadType | keyof CompanyMatchEnrichTypeForSave) => {
    if (propertyName === 'created_at') {
      return DateTime2
    }

    if (propertyName === 'year_founded') {
      return SmallInt
    }
    if (propertyName === 'num_locations') {
      return SmallInt
    }

    return NVarChar
  }

  Object.keys(inputData).map(property =>
    request.input(
      `input_${property}`,
      sqlVarTypeHandler(property as keyof CsvCompanyUploadType),
      `${inputData[property as keyof CsvCompanyUploadType]}`
    )
  )

  Object.keys(enrichedData).map(property => {
    if (property === 'naics_2022') {
      request.input('naics_2022_primary_label', NVarChar, `${naics_2022?.primary?.label || ''}`)
      request.input('naics_2022_primary_code', NVarChar, naics_2022?.primary?.code)

      return
    }

    if (property === 'sics_sector') {
      request.input('sics_sector_code', NVarChar, sics_sector?.code)
      request.input('sics_sector_label', NVarChar, sics_sector?.label)

      return
    }

    if (property === 'sics_subsector') {
      request.input('sics_subsector_code', NVarChar, sics_subsector?.code)
      request.input('sics_subsector_label', NVarChar, sics_subsector?.label)

      return
    }

    if (property === 'sics_industry') {
      request.input('sics_industry_code', NVarChar, sics_industry?.code)
      request.input('sics_industry_label', NVarChar, sics_industry?.label)

      return
    }

    if (property === 'created_at') {
      return request.input('created_at', DateTime2, created_at)
    }

    if (property === 'main_address') {
      request.input('main_country_code', NVarChar, main_address?.country_code || '')
      request.input('main_country', NVarChar, main_address?.country || '')
      request.input('main_region', NVarChar, main_address?.region || '')
      request.input('main_city', NVarChar, main_address?.city || '')
      request.input('main_street', NVarChar, main_address?.street || '')
      request.input('main_street_number', NVarChar, main_address?.street_number || '')
      request.input('main_postcode', NVarChar, main_address?.postcode || '')
      request.input('main_latitude', Decimal(9, 6), main_address?.latitude)
      request.input('main_longitude', Decimal(9, 6), main_address?.longitude)

      return
    }

    if (property === 'match_details') {
      return request.input('confidence_score', Decimal(4, 2), match_details.confidence_score)
    }

    if (property === 'registered_address') {
      request.input('registered_country_code', NVarChar, registered_address?.country_code || '')
      request.input('registered_country', NVarChar, registered_address?.country || '')
      request.input('registered_region', NVarChar, registered_address?.region || '')
      request.input('registered_city', NVarChar, registered_address?.city || '')
      request.input('registered_street', NVarChar, registered_address?.street || '')
      request.input('registered_street_number', NVarChar, registered_address?.street_number || '')
      request.input('registered_postcode', NVarChar, registered_address?.postcode || '')
      request.input('registered_latitude', Decimal(9, 6), registered_address?.latitude)
      request.input('registered_longitude', Decimal(9, 6), registered_address?.longitude)

      return
    }

    if (property === 'revenue') {
      request.input('revenue_value', BigInt, revenue?.value)

      return request.input('revenue_type', NVarChar, revenue?.type || '')
    }

    if (property === 'employee_count') {
      request.input('employee_count_value', BigInt, employee_count?.value)

      return request.input('employee_count_type', NVarChar, employee_count?.type || '')
    }

    return request.input(
      `${property}`,
      sqlVarTypeHandler(property as keyof CompanyMatchEnrichTypeForSave),
      `${enrichedData[property as keyof CompanyMatchEnrichTypeForSave] || ''}`
    )
  })

  request.input('updated', DateTime2, `${created_at}`)
  request.input('user_id', Int, payload.id)

  const sqlQuery = `
  INSERT INTO user_watchlist (
    user_id,
    input_legal_names,
    input_commercial_names,
    input_address_txt,
    input_phone_number,
    input_website,
    input_email,
    company_name,
    website_url,
    main_country_code,
    main_country,
    main_region,
    main_city,
    main_street,
    main_street_number,
    main_postcode,
    main_business_category,
    naics_2022_primary_label,
    short_description,
    long_description_extracted,
    long_description_generated,
    last_updated_at,
    veridion_id,
    primary_phone,
    primary_email,
    facebook_url,
    linkedin_url,
    created_at,
    updated,
    status,
    api_error,
    main_latitude,
    main_longitude,
    num_locations,
    company_type,
    year_founded,
    employee_count_value,
    revenue_value,
    main_industry,
    main_sector,
    website_domain,
    website_tld,
    website_language_code,
    twitter_url,
    instagram_url,
    ios_app_url,
    youtube_url,
    naics_2022_primary_code,
    sics_industry_code,
    sics_industry_label,
    sics_subsector_code,
    sics_subsector_label,
    sics_sector_code,
    sics_sector_label,
    input_file_name,
    is_product,
    confidence_score,
    registered_name,
    registered_country_code,
    registered_country,
    registered_region,
    registered_city,
    registered_street,
    registered_street_number,
    registered_postcode,
    registered_latitude,
    registered_longitude,
    revenue_type,
    employee_count_type,
    jurisdiction,
    legal_form,
    company_status,
    incorporation_date,
    lei,
    ein,
    vat_id,
    tin
  ) VALUES (
    @user_id,
    @input_legal_names,
    @input_commercial_names,
    @input_address_txt,
    @input_phone_number,
    @input_website,
    @input_email,
    @company_name,
    @website_url,
    @main_country_code,
    @main_country,
    @main_region,
    @main_city,
    @main_street,
    @main_street_number,
    @main_postcode,
    @main_business_category,
    @naics_2022_primary_label,
    @short_description,
    @long_description_extracted,
    @long_description_generated,
    @last_updated_at,
    @veridion_id,
    @primary_phone,
    @primary_email,
    @facebook_url,
    @linkedin_url,
    @created_at,
    @created_at,
    @status,
    @api_error,
    @main_latitude,
    @main_longitude,
    @num_locations,
    @company_type,
    @year_founded,
    @employee_count_value,
    @revenue_value,
    @main_industry,
    @main_sector,
    @website_domain,
    @website_tld,
    @website_language_code,
    @twitter_url,
    @instagram_url,
    @ios_app_url,
    @youtube_url,
    @naics_2022_primary_code,
    @sics_industry_code,
    @sics_industry_label,
    @sics_subsector_code,
    @sics_subsector_label,
    @sics_sector_code,
    @sics_sector_label,
    @input_file_name,
    @is_product,
    @confidence_score,
    @registered_name,
    @registered_country_code,
    @registered_country,
    @registered_region,
    @registered_city,
    @registered_street,
    @registered_street_number,
    @registered_postcode,
    @registered_latitude,
    @registered_longitude,
    @revenue_type,
    @employee_count_type,
    @jurisdiction,
    @legal_form,
    @company_status,
    @incorporation_date,
    @lei,
    @ein,
    @vat_id,
    @tin
  ); SELECT SCOPE_IDENTITY() AS id;
`

  const result = await request.query(sqlQuery)

  const watchlistRequest: Request = pool.request()

  let watchlistQuery = ''

  watchlistRequest.input('watchlistId', Int, result.recordset[0].id)
  watchlistRequest.input('userId', Int, payload.id)

  if (enrichedData.business_tags_extracted?.length) {
    const query = enrichedData.business_tags_extracted
      .map((tag, id) => {
        watchlistRequest.input(`business_tag${id}`, sql.NVarChar, tag)

        return `INSERT INTO watchlist_extracted_business_tags (watchlist_id, user_id, business_tag) VALUES (@watchlistId, @userId, @business_tag${id});`
      })
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData.business_tags_generated?.length) {
    const query = enrichedData.business_tags_generated
      .map((tag, id) => {
        watchlistRequest.input(`generated_business_tag${id}`, sql.NVarChar, tag)

        return `INSERT INTO watchlist_generated_business_tags (watchlist_id, user_id, business_tag) VALUES (@watchlistId, @userId, @generated_business_tag${id});`
      })
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData.company_commercial_names?.length) {
    const query = enrichedData.company_commercial_names
      .map((name, id) => {
        watchlistRequest.input(`companyCommercialName${id}`, sql.NVarChar, name)

        return `INSERT INTO watchlist_company_commercial_names (watchlist_id, user_id, company_commercial_name) VALUES (@watchlistId, @userId, @companyCommercialName${id});`
      })
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData.company_legal_names?.length) {
    const query = enrichedData.company_legal_names
      .map((name, id) => {
        watchlistRequest.input(`companyLegalName${id}`, sql.NVarChar, name)

        return `INSERT INTO watchlist_company_legal_names (watchlist_id, user_id, company_legal_name) VALUES (@watchlistId, @userId, @companyLegalName${id});`
      })
      .join(' ')
    watchlistQuery += query
  }

  if (enrichedData.emails?.length) {
    const query = enrichedData.emails
      .map(
        email =>
          `INSERT INTO watchlist_emails (watchlist_id, user_id, email) VALUES ('${result.recordset[0].id}', '${payload.id}', '${email}');`
      )
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData.ibc_insurance?.length) {
    const query = enrichedData.ibc_insurance
      .map(({ code, label }, id) => {
        watchlistRequest.input(`ibc_code${id}`, sql.NVarChar, code)
        watchlistRequest.input(`ibc_label${id}`, sql.NVarChar, label)

        return `INSERT INTO watchlist_ibc_insurance (watchlist_id, user_id, code, label) VALUES (@watchlistId, @userId, @ibc_code${id}, @ibc_label${id});`
      })
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData.isic_v4?.length) {
    const query = enrichedData.isic_v4
      .map(({ code, label }, id) => {
        watchlistRequest.input(`isic_code${id}`, sql.NVarChar, code)
        watchlistRequest.input(`isic_label${id}`, sql.NVarChar, label)

        return `INSERT INTO watchlist_isic_v4 (watchlist_id, user_id, code, label) VALUES (@watchlistId, @userId, @isic_code${id}, @isic_label${id});`
      })
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData.locations?.length) {
    const query = enrichedData.locations
      .map(({ country_code, country, region, city, postcode, street, street_number, latitude, longitude }, id) => {
        watchlistRequest.input(`loc_country${id}`, sql.NVarChar, country)
        watchlistRequest.input(`loc_region${id}`, sql.NVarChar, region)
        watchlistRequest.input(`loc_city${id}`, sql.NVarChar, city)
        watchlistRequest.input(`loc_street${id}`, sql.NVarChar, street)

        return `INSERT INTO watchlist_locations (watchlist_id, user_id, country_code, country, region, city, postcode, street, street_number, latitude, longitude) VALUES ('${result.recordset[0].id}', '${payload.id}', '${country_code}', @loc_country${id}, @loc_region${id}, @loc_city${id}, '${postcode}', @loc_street${id}, '${street_number}', ${latitude}, ${longitude});`
      })
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData.nace_rev2?.length) {
    const query = enrichedData.nace_rev2
      .map(({ code, label }, id) => {
        watchlistRequest.input(`nace_code${id}`, sql.NVarChar, code)
        watchlistRequest.input(`nace_label${id}`, sql.NVarChar, label)

        return `INSERT INTO watchlist_nace_rev2 (watchlist_id, user_id, code, label) VALUES (@watchlistId, @userId, @nace_code${id}, @nace_label${id});`
      })
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData.naics_2022?.secondary) {
    const query = enrichedData.naics_2022?.secondary
      .map(({ code, label }, id) => {
        watchlistRequest.input(`naics_code${id}`, sql.NVarChar, code)
        watchlistRequest.input(`naics_label${id}`, sql.NVarChar, label)

        return `INSERT INTO watchlist_naics_2022_secondary (watchlist_id, user_id, code, label) VALUES (@watchlistId, @userId, @naics_code${id}, @naics_label${id});`
      })
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData?.ncci_codes_28_1?.length) {
    const query = enrichedData.ncci_codes_28_1
      .map(
        code =>
          `INSERT INTO watchlist_ncci_codes_28_1 (watchlist_id, user_id, ncci_codes_28_1) VALUES ('${result.recordset[0].id}', '${payload.id}', '${code}');`
      )
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData?.phone_numbers?.length) {
    const query = enrichedData.phone_numbers
      .map(
        number =>
          `INSERT INTO watchlist_phone_numbers (watchlist_id, user_id, phone_number) VALUES ('${result.recordset[0].id}', '${payload.id}', '${number}');`
      )
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData.sic?.length) {
    const query = enrichedData.sic
      .map(({ code, label }, id) => {
        watchlistRequest.input(`sic_code${id}`, sql.NVarChar, code)
        watchlistRequest.input(`sic_label${id}`, sql.NVarChar, label)

        return `INSERT INTO watchlist_sic (watchlist_id, user_id, code, label) VALUES (@watchlistId, @userId, @sic_code${id}, @sic_label${id});`
      })
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData.technologies?.length) {
    const query = enrichedData.technologies
      .map((technology, id) => {
        watchlistRequest.input(`technology${id}`, sql.NVarChar, technology)

        return `INSERT INTO watchlist_technologies (watchlist_id, user_id, technology) VALUES (@watchlistId, @userId, @technology${id});`
      })
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData.match_details?.attributes) {
    const query = Object.entries(enrichedData.match_details.attributes)
      .map(([name, value], id) => {
        watchlistRequest.input(`attribute_name${id}`, sql.NVarChar, name)
        watchlistRequest.input(`attribute_confidence_score${id}`, sql.Decimal(4, 2), value.confidence_score || 0)
        watchlistRequest.input(`attribute_match_type${id}`, sql.NVarChar, value.match_type || '')
        watchlistRequest.input(`attribute_match_source${id}`, sql.NVarChar, value.match_source || '')

        if (name === 'location') {
          watchlistRequest.input(`attribute_match_element${id}`, sql.NVarChar, value.match_element || '')
          watchlistRequest.input(`attribute_value_country_code${id}`, sql.NVarChar, value.value?.country_code || '')
          watchlistRequest.input(`attribute_value_country${id}`, sql.NVarChar, value.value?.country || '')
          watchlistRequest.input(`attribute_value_region${id}`, sql.NVarChar, value.value?.region || '')
          watchlistRequest.input(`attribute_value_city${id}`, sql.NVarChar, value.value?.city || '')
          watchlistRequest.input(`attribute_value_postcode${id}`, sql.NVarChar, value.value?.postcode || '')
          watchlistRequest.input(`attribute_value_street${id}`, sql.NVarChar, value.value?.street || '')
          watchlistRequest.input(`attribute_value_street_number${id}`, sql.NVarChar, value.value?.street_number || '')
          watchlistRequest.input(`attribute_value_latitude${id}`, sql.Decimal(9, 6), value.value?.latitude)
          watchlistRequest.input(`attribute_value_longitude${id}`, sql.Decimal(9, 6), value.value?.longitude)

          return `INSERT INTO watchlist_match_details (
        watchlist_id,
        user_id,
        attribute_name,
        attribute_confidence_score,
        attribute_match_type,
        attribute_match_source,
        attribute_match_element,
        attribute_value_country_code,
        attribute_value_country,
        attribute_value_region,
        attribute_value_city,
        attribute_value_postcode,
        attribute_value_street,
        attribute_value_street_number,
        attribute_value_latitude,
        attribute_value_longitude) VALUES (
        @watchlistId,
        @userId,
        @attribute_name${id},
        @attribute_confidence_score${id},
        @attribute_match_type${id},
        @attribute_match_source${id},
        @attribute_match_element${id},
        @attribute_value_country_code${id},
        @attribute_value_country${id},
        @attribute_value_region${id},
        @attribute_value_city${id},
        @attribute_value_postcode${id},
        @attribute_value_street${id},
        @attribute_value_street_number${id},
        @attribute_value_latitude${id},
        @attribute_value_longitude${id})`
        } else {
          watchlistRequest.input(`attribute_value${id}`, sql.NVarChar, '')

          return `INSERT INTO watchlist_match_details (watchlist_id, user_id, attribute_name, attribute_confidence_score, attribute_match_type, attribute_match_source, attribute_value) VALUES (@watchlistId, @userId, @attribute_name${id}, @attribute_confidence_score${id}, @attribute_match_type${id}, @attribute_match_source${id}, @attribute_value${id})`
        }
      })
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData.match_details?.matched_on) {
    const query = enrichedData.match_details?.matched_on
      .map(match => {
        return `INSERT INTO watchlist_matched_on (watchlist_id, user_id, matched_on) VALUES (@watchlistId, @userId, '${match}')`
      })
      .join(' ')

    watchlistQuery += query
  }

  if (enrichedData.registry_ids) {
    const query = enrichedData.registry_ids
      .map(id => {
        return `INSERT INTO watchlist_registry_ids (watchlist_id, user_id, registry_ids) VALUES (@watchlistId, @userId, '${id}')`
      })
      .join(' ')

    watchlistQuery += query
  }

  await watchlistRequest.query(watchlistQuery)

  res.status(200).json({ id: result.recordset[0].id })
}
