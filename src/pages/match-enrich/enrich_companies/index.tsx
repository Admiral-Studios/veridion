import React from 'react'
import Grid from '@mui/material/Grid'

import UploadCompanies from 'src/views/apps/upload_companies/UploadCompanies'
import { SubjectTypes } from 'src/types/acl/subjectTypes'

const EnrichCompanies = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UploadCompanies />
      </Grid>
    </Grid>
  )
}

EnrichCompanies.acl = {
  action: 'read',
  subject: SubjectTypes.EnrichCompaniesPage
}

export default EnrichCompanies
