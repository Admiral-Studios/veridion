import { Box, Typography } from '@mui/material'
import React, { useContext } from 'react'
import ItemCard from './components/ItemCard'
import { itemsCardsData } from './configs/data'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useAuth } from 'src/hooks/useAuth'
import FallbackSpinner from 'src/@core/components/spinner'

const HomeLanding = () => {
  const ability = useContext(AbilityContext)
  const { user } = useAuth()

  if (!user) return <FallbackSpinner />

  return (
    <Box>
      <Typography variant='h3' textAlign='center'>
        Welcome to Explore Veridion
      </Typography>

      <Typography
        textAlign='center'
        mt={6}
        sx={{
          fontSize: '19px'
        }}
      >
        Explore our entire{' '}
        <Typography
          component='span'
          sx={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'primary.main'
          }}
        >
          data universe
        </Typography>{' '}
        through dashboards, match & enrich, search and even Excel
      </Typography>

      <Box
        sx={{
          width: '100%',
          mt: 8,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
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
        {itemsCardsData(user).map(({ subject, ...data }) =>
          ability?.can('read', subject) ? <ItemCard key={data.title} {...data} /> : null
        )}
      </Box>
    </Box>
  )
}

export default HomeLanding
