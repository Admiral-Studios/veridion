import React from 'react'
import { SubjectTypes } from 'src/types/acl/subjectTypes'
import DataMarketplace from 'src/views/apps/data-marketplace/DataMarketplace'

const DataMarketplacePage = () => {
  return <DataMarketplace />
}

DataMarketplacePage.acl = {
  action: 'read',
  subject: SubjectTypes.DataMarketplacePage
}

export default DataMarketplacePage
