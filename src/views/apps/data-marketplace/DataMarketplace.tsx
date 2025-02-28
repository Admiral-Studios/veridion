import { Box, Grid } from '@mui/material'
import React from 'react'
import DataSampleCard from './component/DataSampleCard'
import { defaultStateData } from './configs/defaultStateData'
import { PortalSettings } from 'src/types/apps/dataMarketplaceTypes'
import useSWR from 'swr'
import { useAuth } from 'src/hooks/useAuth'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const DataMarketplace = () => {
  const { data: portalSettings } = useSWR<PortalSettings[]>(`/api/db_transactions/fetch_portal_settings`, fetcher)

  const { trackOnClick } = useAuth()

  return (
    <Grid container>
      <Box
        sx={{
          width: '100%',
          mt: 8,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          justifyContent: 'center',
          gap: 4,
          '@media(max-width: 944px)': {
            gridTemplateColumns: 'repeat(2, 1fr)'
          },
          '@media(max-width: 688px)': {
            gridTemplateColumns: 'repeat(1, 1fr)'
          }
        }}
      >
        {defaultStateData.map(state => (
          <DataSampleCard
            key={state.title}
            defaultState={state}
            updatedAt={
              portalSettings ? portalSettings.find(({ setting }) => setting === state.db_field)?.value || '' : ''
            }
            trackOnClick={trackOnClick}
          />
        ))}
      </Box>
    </Grid>
  )
}

export default DataMarketplace
