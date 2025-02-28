export enum StringValueFilterTypes {
  CompanyName = 'company_name',
  CompanyWebsite = 'company_website',
  CompanyPostcode = 'company_postcode',
  CompanyCategory = 'company_category',
  CompanyIndustry = 'company_industry',
  CompanyNaicsCode = 'company_naics_code'
}

export enum ComplexValueFilterTypes {
  CompanyProducts = 'company_products',
  CompanyLocation = 'company_location',
  CompanyKeywords = 'company_keywords'
}

export enum RangeFilterValueTypes {
  CompanyEmployeeCount = 'company_employee_count',
  CompanyEstimatedRevenue = 'company_estimated_revenue',
  CompanyYearFounded = 'company_year_founded'
}

export type AllFiltersType =
  | 'company_name'
  | 'company_website'
  | 'company_postcode'
  | 'company_category'
  | 'company_industry'
  | 'company_naics_code'
  | 'company_products'
  | 'company_location'
  | 'company_employee_count'
  | 'company_estimated_revenue'
  | 'company_year_founded'
  | 'company_keywords'
