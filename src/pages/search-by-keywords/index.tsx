import React from 'react'
import { SubjectTypes } from 'src/types/acl/subjectTypes'
import KeywordsSearch from 'src/views/apps/keywords_search/KeywordsSearch'

const KeywordsSearchPage = () => {
  return <KeywordsSearch />
}

KeywordsSearchPage.acl = {
  action: 'read',
  subject: SubjectTypes.KeywordsSearchPagePage
}

export default KeywordsSearchPage
