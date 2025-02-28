import React, { useContext, useEffect, useMemo } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'

import dynamic from 'next/dynamic'
import { ContextProvider } from 'src/context/ReportContext'
import { Theme, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { SubjectTypes } from 'src/types/acl/subjectTypes'

const Dashboard = () => {
  const ability = useContext(AbilityContext)

  const { query, push } = useRouter()
  const isMobileScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const PowerBIIframe = useMemo(
    () => dynamic(() => import('../../../views/apps/powerbi/PowerBiIframe').then(iframe => iframe.default)),
    [isMobileScreen]
  )

  useEffect(() => {
    if (query.page) {
      const subject = `dashboard-${query.page}-page`
      if (!ability.can('read', subject)) {
        push('/acl')
      }
    }
  }, [query, ability, push])

  return (
    <ContextProvider>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent style={{ height: 'calc(100vh - 80px)' }}>
              <PowerBIIframe />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ContextProvider>
  )
}

Dashboard.acl = {
  action: 'read',
  subject: SubjectTypes.DashboardPage
}

export default Dashboard
