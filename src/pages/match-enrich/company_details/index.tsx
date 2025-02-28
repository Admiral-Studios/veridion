import React from 'react'
import Grid from '@mui/material/Grid'

import { CompanyMatchEnrichFromDb } from 'src/types/apps/veridionTypes'

import EnrichedCompanyDetails from 'src/views/apps/match_enrich/EnrichedCompanyDetails'
import EnrichedCompanyPick from 'src/views/apps/match_enrich/EnrichedCompanyPick'
import { SubjectTypes } from 'src/types/acl/subjectTypes'
import useSWR from 'swr'
import { Box, Typography } from '@mui/material'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const CompanyDetails = () => {
  const [pickedCompanies, setPickedCompanies] = React.useState<CompanyMatchEnrichFromDb[] | undefined>(undefined)
  const [enrichedCompanies, setEnrichedCompanies] = React.useState<CompanyMatchEnrichFromDb[] | undefined>(undefined)
  const [companies, setCompanies] = React.useState<CompanyMatchEnrichFromDb[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const { data } = useSWR<CompanyMatchEnrichFromDb[]>('/api/db_transactions/fetch_watchlist_entries_from_db', fetcher)

  const handleDataReceivedFromCompanyPick = (data: CompanyMatchEnrichFromDb[] | undefined) => {
    setPickedCompanies(data)
    setEnrichedCompanies(undefined)
  }

  React.useEffect(() => {
    if (isLoading && data) {
      setCompanies(data.filter(item => item.status === 'Enriched'))
      setIsLoading(false)
    }
  }, [isLoading, data, enrichedCompanies])

  return (
    <Grid item height='100%'>
      <Grid item container xs={12} justifyContent='center' p={6}>
        <Box position='relative' borderRadius={2} p={8} sx={{ width: '100%' }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundSize: 'cover',
              backgroundColor: 'transparent',
              backgroundImage: 'url(/images/pages/header-bg.png)',
              borderRadius: 2,
              opacity: 0.7,
              zIndex: -1
            }}
          ></Box>

          <Box>
            <Typography variant='h3' mb={4} textAlign='center'>
              See the profile of any company you enriched
            </Typography>
          </Box>

          <Box>
            <EnrichedCompanyPick
              onDataReceived={handleDataReceivedFromCompanyPick}
              enrichedCompanies={enrichedCompanies}
              companies={companies}
              isLoading={isLoading}
            />
          </Box>
        </Box>
        <Grid item xs={12} flex='1 1 100%'>
          {pickedCompanies?.map(pickedCompany => (
            <EnrichedCompanyDetails key={pickedCompany.id} company={pickedCompany} />
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

CompanyDetails.acl = {
  action: 'read',
  subject: SubjectTypes.CompanyDetailsPage
}

export default CompanyDetails
