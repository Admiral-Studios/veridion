import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'
import sql, { ConnectionPool, Request, Int } from 'mssql'
import { dbConfig } from 'src/configs/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { entries } = req.query

  const pool: ConnectionPool = await sql.connect(dbConfig)
  const request: Request = pool.request()

  const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

  request.input('user_id', Int, payload.id)

  // const query = `SELECT * FROM user_watchlist WHERE user_id = @user_id`

  const query = `SELECT
      w.*,
      t.business_tags_extracted,
      btg.business_tags_generated,
      ccn.company_commercial_names,
      lg.company_legal_names,
      e.emails,
      i.ibc_insurance,
      iv4.isic_v4,
      l.locations,
      rev2.nace_rev2,
      naics.naics_2022_secondary,
      ncci.ncci_codes_28_1,
      phn.phone_numbers,
      sics.sic,
      tech.technologies,
      match.match_snippets,
      supp.company_supplier_types,
      mo.matched_on,
      ri.registry_ids,
      md.match_details
  FROM
      user_watchlist w
  LEFT JOIN
      (
          SELECT
              bt.watchlist_id,
              STRING_AGG(bt.business_tag, ', ') AS business_tags_extracted
          FROM
              watchlist_extracted_business_tags bt
          GROUP BY
              bt.watchlist_id
      ) t ON w.id = t.watchlist_id
       
LEFT JOIN
      (
          SELECT
              gbt.watchlist_id,
              STRING_AGG(gbt.business_tag, ', ') AS business_tags_generated
          FROM
              watchlist_generated_business_tags gbt
          GROUP BY
              gbt.watchlist_id
      ) btg ON w.id = btg.watchlist_id
  
  LEFT JOIN
  (
    SELECT
        cn.watchlist_id,
        STRING_AGG(cn.company_commercial_name, ', ') AS company_commercial_names
    FROM
        watchlist_company_commercial_names cn
    GROUP BY
        cn.watchlist_id
  ) ccn ON w.id = ccn.watchlist_id
  LEFT JOIN
  (
    SELECT
        ln.watchlist_id,
        STRING_AGG(ln.company_legal_name, ', ') AS company_legal_names
    FROM
        watchlist_company_legal_names ln
    GROUP BY
        ln.watchlist_id
  ) lg ON w.id = lg.watchlist_id
  LEFT JOIN
  (
    SELECT
        em.watchlist_id,
        STRING_AGG(em.email, ', ') AS emails
    FROM
        watchlist_emails em
    GROUP BY
        em.watchlist_id
  ) e ON w.id = e.watchlist_id
  LEFT JOIN
      (
          SELECT
              wi.watchlist_id,
            JSON_QUERY('[' + STRING_AGG(CONCAT('{"code": ', '"', wi.code, '", ', '"label": "', REPLACE(wi.label, '"', ''), '"}'), ',') + ']') as ibc_insurance
          FROM
              watchlist_ibc_insurance wi 
          GROUP BY
              wi.watchlist_id
      ) i ON w.id = i.watchlist_id

  LEFT JOIN
  (
      SELECT
          isic.watchlist_id,
        JSON_QUERY('[' + STRING_AGG(CONCAT('{"code": ', '"', isic.code, '", ', '"label": "', REPLACE(isic.label, '"', ''), '"}'), ',') + ']') as isic_v4
      FROM
          watchlist_isic_v4 isic 
      GROUP BY
          isic.watchlist_id 
  ) iv4 ON w.id = iv4.watchlist_id

  LEFT JOIN
  (
      SELECT
          loc.watchlist_id,
        JSON_QUERY('[' + STRING_AGG(CONCAT('{"country_code": ', '"', loc.country_code, '", ', '"country": "', loc.country, '", ', '"region": "', loc.region, '", ', '"city": "', loc.city, '", ', '"street": "', loc.street, '", ', '"street_number": "', loc.street_number, '", ', '"latitude": "', loc.latitude, '", ', '"longitude": "', loc.longitude, '"}'), ',') + ']') as locations
      FROM
          watchlist_locations loc 
      GROUP BY
          loc.watchlist_id
  ) l ON w.id = l.watchlist_id

  LEFT JOIN
  (
      SELECT
          nace.watchlist_id,
        JSON_QUERY('[' + STRING_AGG(CONCAT('{"code": ', '"', nace.code, '", ', '"label": "', REPLACE(nace.label, '"', ''), '"}'), ',') + ']') as nace_rev2
      FROM
          watchlist_nace_rev2 nace 
      GROUP BY
          nace.watchlist_id
  ) rev2 ON w.id = rev2.watchlist_id

  LEFT JOIN
  (
      SELECT
          naic.watchlist_id,
        JSON_QUERY('[' + STRING_AGG(CONCAT('{"code": ', '"', naic.code, '", ', '"label": "', REPLACE(naic.label, '"', ''), '"}'), ',') + ']') as naics_2022_secondary
      FROM
          watchlist_naics_2022_secondary naic 
      GROUP BY
          naic.watchlist_id
  ) naics ON w.id = naics.watchlist_id

  LEFT JOIN
  (
    SELECT
        nc.watchlist_id,
        STRING_AGG(nc.ncci_codes_28_1, ', ') AS ncci_codes_28_1
    FROM
        watchlist_ncci_codes_28_1 nc
    GROUP BY
        nc.watchlist_id
  ) ncci ON w.id = ncci.watchlist_id
  LEFT JOIN
  (
    SELECT
        phones.watchlist_id,
        STRING_AGG(phones.phone_number, ', ') AS phone_numbers
    FROM
        watchlist_phone_numbers phones
    GROUP BY
        phones.watchlist_id
  ) phn ON w.id = phn.watchlist_id
  LEFT JOIN
  (
      SELECT
          si.watchlist_id,
        JSON_QUERY('[' + STRING_AGG(CONCAT('{"code": ', '"', si.code, '", ', '"label": "', REPLACE(si.label, '"', ''), '"}'), ',') + ']') as sic
      FROM
          watchlist_sic si 
      GROUP BY
          si.watchlist_id
  ) sics ON w.id = sics.watchlist_id

  
LEFT JOIN
  (
    SELECT
        tec.watchlist_id,
        STRING_AGG( CAST(tec.technology AS nvarchar(MAX) ), ', ') AS technologies
    FROM
        watchlist_technologies tec
    GROUP BY
        tec.watchlist_id
  ) tech ON w.id = tech.watchlist_id

  LEFT JOIN
  (
    SELECT
        mat.watchlist_id,
        STRING_AGG( CAST(mat.match_snippets AS nvarchar(MAX) ), ', ') AS match_snippets
    FROM
        watchlist_match_snippets mat
    GROUP BY
        mat.watchlist_id
  ) match ON w.id = match.watchlist_id

  LEFT JOIN
  (
    SELECT
        supplier.watchlist_id,
        STRING_AGG( CAST(supplier.company_supplier_types AS nvarchar(MAX) ), ', ') AS company_supplier_types
    FROM
        watchlist_company_supplier_types supplier
    GROUP BY
        supplier.watchlist_id
  ) supp ON w.id = supp.watchlist_id

  LEFT JOIN
  (
    SELECT
        matched.watchlist_id,
        STRING_AGG(matched.matched_on, ', ') AS matched_on
    FROM
        watchlist_matched_on matched
    GROUP BY
        matched.watchlist_id
  ) mo ON w.id = mo.watchlist_id

   LEFT JOIN
  (
    SELECT
        registry.watchlist_id,
        STRING_AGG(registry.registry_ids, ', ') AS registry_ids
    FROM
        watchlist_registry_ids registry
    GROUP BY
        registry.watchlist_id
  ) ri ON w.id = ri.watchlist_id

  LEFT JOIN
  (
      SELECT
          details.watchlist_id,
        JSON_QUERY('[' + STRING_AGG(CONCAT('{"attribute_name": ', '"', details.attribute_name, '", ', 
        '"attribute_confidence_score": "', details.attribute_confidence_score, '", ',
        '"attribute_match_type": "', details.attribute_match_type, '", ', 
        '"attribute_match_source": "', details.attribute_match_source, '", ', 
        '"attribute_match_element": "', details.attribute_match_element, '", ', 
        '"attribute_value": "', details.attribute_value, '", ', 
        '"attribute_value_country_code": "', details.attribute_value_country_code, '", ', 
        '"attribute_value_country": "', details.attribute_value_country, '", ', 
        '"attribute_value_region": "', details.attribute_value_region, '", ', 
        '"attribute_value_city": "', details.attribute_value_city, '", ', 
        '"attribute_value_postcode": "', details.attribute_value_postcode, '", ', 
        '"attribute_value_street": "', details.attribute_value_street, '", ', 
        '"attribute_value_street_number": "', details.attribute_value_street_number, '", ', 
        '"attribute_value_latitude": "', details.attribute_value_latitude, '", ', 
        '"attribute_value_longitude": "', details.attribute_value_longitude, '"}'), ',') + ']') as match_details
      FROM
          watchlist_match_details details 
      GROUP BY
          details.watchlist_id
  ) md ON w.id = md.watchlist_id
  WHERE
      w.user_id = @user_id
      ${entries === 'products' ? "AND is_product = '1'" : 'AND is_product = 0 OR is_product IS NULL'}
  ORDER BY
      w.id DESC;`

  const data_from_db = await (await request.query(query)).recordset

  data_from_db.forEach(item => {
    if (item.business_tags_extracted) item.business_tags_extracted = item.business_tags_extracted.split(', ')

    if (item.business_tags_generated) item.business_tags_generated = item.business_tags_generated.split(', ')

    if (item.company_commercial_names) item.company_commercial_names = item.company_commercial_names.split(', ')

    if (item.company_legal_names) item.company_legal_names = item.company_legal_names.split(', ')

    if (item.emails) item.emails = item.emails.split(', ')

    if (item.ibc_insurance) item.ibc_insurance = JSON.parse(item.ibc_insurance)

    if (item.isic_v4) item.isic_v4 = JSON.parse(item.isic_v4)

    if (item.locations) item.locations = JSON.parse(item.locations)

    if (item.nace_rev2) item.nace_rev2 = JSON.parse(item.nace_rev2)

    if (item.naics_2022_secondary) item.naics_2022_secondary = JSON.parse(item.naics_2022_secondary)

    if (item.ncci_codes_28_1) item.ncci_codes_28_1 = item.ncci_codes_28_1.split(', ')

    if (item.phone_numbers) item.phone_numbers = item.phone_numbers.split(', ')

    if (item.sic) item.sic = JSON.parse(item.sic)

    if (item.technologies) item.technologies = item.technologies.split(', ')

    if (item.match_snippets) item.match_snippets = item.match_snippets.split(', ')

    if (item.company_supplier_types) item.company_supplier_types = item.company_supplier_types.split(', ')

    if (item.registry_ids) item.registry_ids = item.registry_ids.split(', ')

    if (item.match_details) {
      const parsed_match_details = JSON.parse(item.match_details)

      const match_details = {
        confidence_score: item.confidence_score,
        matched_on: item.matched_on ? item.matched_on.split(', ') : null,
        attributes: parsed_match_details?.length
          ? parsed_match_details.reduce((prev: any, curr: any) => {
              if (curr.attribute_name === 'location') {
                prev[curr.attribute_name] = {
                  confidence_score: +curr.attribute_confidence_score,
                  match_type: curr.attribute_match_type,
                  match_source: curr.attribute_match_source,
                  match_element: curr.attribute_match_element,
                  value: {
                    country_code: curr.attribute_value_country_code,
                    country: curr.attribute_value_country,
                    region: curr.attribute_value_region,
                    city: curr.attribute_value_city,
                    street: curr.attribute_value_street,
                    street_number: curr.attribute_value_street_number,
                    postcode: curr.attribute_value_postcode,
                    latitude: curr.attribute_value_latitude,
                    longitude: curr.attribute_value_longitude
                  }
                }
              } else {
                prev[curr.attribute_name] = {
                  confidence_score: +curr.attribute_confidence_score,
                  match_type: curr.attribute_match_type,
                  match_source: curr.attribute_match_source,
                  value: curr.attribute_value
                }
              }

              return prev
            }, {})
          : null
      }
      item.match_details = match_details
    }
  })

  res.status(200).json(data_from_db)
}
