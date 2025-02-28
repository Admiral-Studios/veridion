import React from 'react'
import { SubjectTypes } from 'src/types/acl/subjectTypes'
import CompanySearchByName from 'src/views/apps/company_search_by_name/CompanySearchByName'

const CompanySearchPage = () => {
  return <CompanySearchByName></CompanySearchByName>
}

CompanySearchPage.acl = {
  action: 'read',
  subject: SubjectTypes.CompanySearchPage
}

export default CompanySearchPage
