import dynamic from 'next/dynamic'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ContextProvider, ReportContext } from 'src/context/ReportContext'
import FilterBasic from '../../api/powerbi/filter_basic'
import { useAuth } from 'src/hooks/useAuth'
import { SubjectTypes } from 'src/types/acl/subjectTypes'
import { Card, CardContent, Grid } from '@mui/material'

const CompanyAnalyticsPage = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoaded(true)
    }
  }, [])

  return (
    <ContextProvider>
      {isLoaded && (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardContent style={{ height: 'calc(100vh - 80px)' }}>
                <AnalyticsPowerbi />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </ContextProvider>
  )
}

const AnalyticsPowerbi = () => {
  const { report } = useContext(ReportContext) || {}
  const auth = useAuth()

  const PowerBIIframe = useMemo(
    () => dynamic(() => import('../../../views/apps/powerbi/PowerBiIframe').then(iframe => iframe.default)),
    []
  )

  useEffect(() => {
    if (report) {
      report.on('loaded', () => {
        if (report && auth && auth.user) {
          FilterBasic(['user_watchlist'], ['user_id'], ['In'], [auth.user.id], report)
        }
      })
    }
  }, [report, auth])

  return (
    <div>
      <PowerBIIframe type='analytics' />
    </div>
  )
}

CompanyAnalyticsPage.acl = {
  action: 'read',
  subject: SubjectTypes.CompanyAnalyticsPage
}

export default CompanyAnalyticsPage
