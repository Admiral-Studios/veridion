import React from 'react'
import { SubjectTypes } from 'src/types/acl/subjectTypes'
import FullSearch from 'src/views/apps/full_search/FullSearch'

const FullSearchPage = () => {
  return <FullSearch />
}

FullSearchPage.acl = {
  action: 'read',
  subject: SubjectTypes.FullSearchPage
}

export default FullSearchPage
