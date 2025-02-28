import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { ICompany } from 'src/d3/types/interfaces'
import { addThousandsDelimiter } from 'src/utils/numbers/addThousandsDelimeter'

const numberOfAllCompanies = 90000000

const CompaniesAnalytics: React.FC<{ companies: ICompany[]; productsCount: number; limit?: number }> = ({
  companies,
  productsCount
}) => {
  const slide = {
    details: {
      companies: {
        title: 'returned companies',
        value: companies.length
      },

      returnedProductsOfUniverse: {
        title: 'of universe',
        value: `${(((companies.length > 5000 ? 5000 : companies.length) / numberOfAllCompanies) * 100).toFixed(5)}%`
      }
    }
  }

  return (
    <Box
      sx={{
        p: 6,
        borderRadius: 2,
        backgroundColor: 'common.white',
        height: '100%'
      }}
    >
      <Typography variant='h5' sx={{ mb: 0.5 }} color='primary'>
        Search Stats
      </Typography>

      <Typography variant='body2' sx={{ mb: 4.5 }}>
        {/* {limit ? getTotalReturnedProducts(limit, productsCount) : 0} products in total */}
        {addThousandsDelimiter(productsCount)} available companies,{' '}
        {((productsCount / numberOfAllCompanies) * 100).toFixed(5)}% of universe
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={12}>
          <Grid
            container
            spacing={2}
            sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 4, mt: 2 }}
          >
            {Object.keys(slide.details).map((key: string, index: number) => {
              return (
                <Grid key={index} item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        width: 'auto',
                        p: 2,
                        height: 30,
                        fontWeight: 500,
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {slide.details[key as keyof typeof slide.details].value}
                    </CustomAvatar>
                    <Typography textAlign='center'>{slide.details[key as keyof typeof slide.details].title}</Typography>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CompaniesAnalytics
