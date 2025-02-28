export const allFilters = {
  company_name: {
    relations: ['equals', 'matches', 'in']
  },
  company_website: { relations: ['equals', 'in'] },
  company_location: { relations: ['equals', 'not_equals', 'in', 'not_in'] },
  company_postcode: { relations: ['equals', 'not_equals', 'in', 'not_in'] },
  company_category: { relations: ['equals', 'not_equals', 'in', 'not_in'] },
  company_industry: { relations: ['equals', 'not_equals', 'in', 'not_in'] },
  company_naics_code: { relations: ['equals', 'not_equals', 'in', 'not_in'] },
  company_employee_count: {
    relations: [
      'equals',
      'matches',
      'in',
      'between',
      'greater_than',
      'greater_than_or_equal',
      'less_than',
      'less_than_or_equal'
    ]
  },
  company_estimated_revenue: {
    relations: [
      'equals',
      'matches',
      'in',
      'between',
      'greater_than',
      'greater_than_or_equal',
      'less_than',
      'less_than_or_equal'
    ]
  },
  company_year_founded: {
    relations: [
      'equals',
      'matches',
      'in',
      'between',
      'greater_than',
      'greater_than_or_equal',
      'less_than',
      'less_than_or_equal'
    ]
  },
  company_keywords: { relations: ['match_expression'] },
  company_products: { relations: ['match_expression'] }
}

export type InputTypes = 'string' | 'string_arr' | 'number' | 'json'

export const inputTypeDependingOnRelation = {
  equals: 'string',
  not_equals: 'string',
  matches: 'string',
  in: 'string_arr',
  not_in: 'string_arr',
  between: 'number',
  greater_than: 'number',
  greater_than_or_equal: 'number',
  less_than: 'number',
  less_than_or_equal: 'number',
  match_expression: 'json'
}
