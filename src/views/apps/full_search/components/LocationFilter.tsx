import { Box, Checkbox, FormControlLabel, Grid, IconButton, Menu, Radio } from '@mui/material'
import React, { useState } from 'react'
import FilterItemLabel from './FilterItemLabel'
import FilterItemValueBox from './FilterItemValueBox'
import CountrySelector from '../../product_search/components/CountrySelector'
import { CountryType } from '../../product_search/configs/countriesMapping'
import { useFilterStore } from '../store/filterStore'
import Icon from 'src/@core/components/icon'

const LocationFilter = () => {
  const { onSetData, data } = useFilterStore()

  const filter = data['company_location']

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [radioValue, setRadioValue] = useState('any_of')

  const openMenu = Boolean(anchorEl)

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          px: 1,
          py: 0.3,
          borderRadius: 1.25,
          backgroundColor: '#F8F8F8',
          maxWidth: '400px',
          overflowX: 'auto',
          scrollbarWIdth: 'none',
          '-ms-overflow-style': 'none',

          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
        onClick={e => setAnchorEl(e.currentTarget)}
        id='location-filter'
      >
        <FilterItemLabel icon='mdi:location' label='Location' />

        {!!filter.geographyIn?.length && (
          <FilterItemValueBox
            sxValue={{
              whiteSpace: 'nowrap'
            }}
            values={[
              {
                label: 'Is any of',
                value: (filter.geographyIn as CountryType[]).map(({ country_name }) => country_name)
              }
            ]}
          />
        )}

        {!!filter.geographyNotIn?.length && (
          <FilterItemValueBox
            sxValue={{
              whiteSpace: 'nowrap'
            }}
            values={[
              {
                label: 'Is none of',
                value: (filter.geographyNotIn as CountryType[]).map(({ country_name }) => country_name)
              }
            ]}
          />
        )}
      </Box>

      <Menu
        id='location-filter-menu'
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'location-filter'
        }}
        sx={{
          '.MuiMenu-paper': {
            mt: 2
          }
        }}
      >
        <Box
          sx={{
            px: 2,
            position: 'relative'
          }}
        >
          <IconButton sx={{ position: 'absolute', top: 0, right: 0, p: 1 }} onClick={() => setAnchorEl(null)}>
            <Icon icon='material-symbols:close' />
          </IconButton>

          <Grid item container xs={12}>
            <Box sx={{ width: '100%', padding: '15px 10px', border: '1px solid #F8F8F8', borderRadius: 2 }}>
              <FormControlLabel
                label='Is any of'
                sx={{
                  '.MuiRadio-root': {
                    p: 0
                  },
                  '.MuiTypography-root': {
                    marginLeft: 1,
                    lineHeight: 1
                  },
                  marginLeft: 0,
                  marginRight: 0
                }}
                control={<Radio checked={radioValue === 'any_of'} onChange={() => setRadioValue('any_of')} />}
              />

              <FormControlLabel
                label='Is none of'
                sx={{
                  '.MuiRadio-root': {
                    p: 0
                  },
                  '.MuiTypography-root': {
                    marginLeft: 1,
                    lineHeight: 1
                  },
                  marginLeft: 4,
                  marginRight: 0
                }}
                control={<Radio checked={radioValue === 'none_of'} onChange={() => setRadioValue('none_of')} />}
              />

              <Box
                sx={{
                  mt: 4,
                  maxWidth: '444px'
                }}
              >
                {radioValue === 'any_of' ? (
                  <CountrySelector
                    countries={filter.geographyIn}
                    countryChange={c => {
                      onSetData('company_location', 'geographyIn', c)
                    }}
                    label='In'
                    id='geography-in'
                  />
                ) : (
                  <CountrySelector
                    countries={filter.geographyNotIn}
                    countryChange={c => {
                      onSetData('company_location', 'geographyNotIn', c)
                    }}
                    label='Not in'
                    id='geography-not-in'
                  />
                )}
              </Box>
            </Box>

            <Box sx={{ width: '100%', padding: '15px 10px', border: '1px solid #F8F8F8', borderRadius: 2, mt: 4 }}>
              <FormControlLabel
                label='Main Locations'
                sx={{
                  '.MuiCheckbox-root': {
                    p: 0
                  },
                  '.MuiTypography-root': {
                    marginLeft: 1,
                    lineHeight: 1
                  },
                  marginLeft: 0,
                  marginRight: 0
                }}
                control={
                  <Checkbox
                    checked={filter.type.main}
                    onChange={e => {
                      onSetData('company_location', 'type', { ...filter.type, main: e.target.checked })
                    }}
                  />
                }
              />

              <FormControlLabel
                label='Secondary Locations'
                sx={{
                  '.MuiCheckbox-root': {
                    p: 0
                  },
                  '.MuiTypography-root': {
                    marginLeft: 1,
                    lineHeight: 1
                  },
                  marginLeft: 4,
                  marginRight: 0
                }}
                control={
                  <Checkbox
                    checked={filter.type.secondary}
                    onChange={e =>
                      onSetData('company_location', 'type', { ...filter.type, secondary: e.target.checked })
                    }
                  />
                }
              />
            </Box>
          </Grid>
        </Box>
      </Menu>
    </>
  )
}

export default LocationFilter
