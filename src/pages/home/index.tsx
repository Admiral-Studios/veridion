import React from 'react'
import { SubjectTypes } from 'src/types/acl/subjectTypes'
import HomeLanding from 'src/views/pages/landing/HomeLanding'

const HomePage = () => {
  return <HomeLanding />
}

HomePage.acl = {
  action: 'read',
  subject: SubjectTypes.HomePage
}

export default HomePage
