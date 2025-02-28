import React from 'react'
import CompanySearch from 'src/views/apps/company_search/CompanySearch'
import CompanyDetails from 'src/views/apps/company_search/CompanyDetails'
import { CompanyType } from 'src/types/apps/veridionTypes'

const ParentComponent: React.FC = () => {
  const [returnedCompanies, setReturnedCompanies] = React.useState<CompanyType[]>([])

  const handleDataReceived = (data: CompanyType[]) => {
    setReturnedCompanies(data)
  }

  return (
    <div>
      <CompanySearch onDataReceived={handleDataReceived} />
      <CompanyDetails returnedCompanies={returnedCompanies} />
    </div>
  )
}

export default ParentComponent
