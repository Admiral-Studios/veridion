import React, { useMemo } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import dynamic from 'next/dynamic'
import { ContextProvider } from 'src/context/ReportContext'

import { SubjectTypes } from 'src/types/acl/subjectTypes'

const LoginsReport = () => {
  const PowerBIIframe = useMemo(
    () => dynamic(() => import('../../views/apps/powerbi/PowerBiIframe').then(iframe => iframe.default)),
    []
  )

  return (
    <ContextProvider>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent style={{ height: 'calc(100vh - 80px)' }}>
              <PowerBIIframe type='logins' />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ContextProvider>
  )
}

LoginsReport.acl = {
  action: 'read',
  subject: SubjectTypes.LoginsReport
}

export default LoginsReport
