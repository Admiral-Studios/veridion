import { Autocomplete, Box, Button, Checkbox } from '@mui/material'
import React from 'react'
import { CountryType, countriesMapping } from '../configs/countriesMapping'
import CustomTextField from 'src/@core/components/mui/text-field'

interface IProps {
  countries: CountryType[]
  countryChange: (c: CountryType[]) => void
  label: string
  id: string
}

const CountrySelector: React.FC<IProps> = ({ countries, countryChange, label, id }) => {
  return (
    <Autocomplete
      id={id}
      size='small'
      value={countries}
      multiple
      disableCloseOnSelect
      options={countriesMapping.sort((a, b) => a.continent.localeCompare(b.continent))}
      getOptionLabel={option => option.country_name}
      groupBy={option => option.continent}
      onChange={(e, newValue) => {
        countryChange(newValue)
      }}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === 'clear') {
          countryChange([])

          return
        }
      }}
      renderInput={params => <CustomTextField {...params} variant='outlined' label={label} />}
      renderOption={(props, option, { selected }) => (
        <li {...props} data-option={option}>
          <Checkbox sx={{ marginRight: 8 }} checked={selected} />
          {option.country_name}
        </li>
      )}
      renderGroup={params => {
        if (params.children) {
          const subGroups = (params.children as any[]).reduce((acc, cur) => {
            if (acc[cur.props['data-option'].macro_region]) {
              acc[cur.props['data-option'].macro_region].push(cur)
            } else {
              acc[cur.props['data-option'].macro_region] = [cur]
            }

            return acc
          }, {} as any)

          return (
            <li key={params.key}>
              {params.group && (
                <Button
                  fullWidth
                  onClick={() => {
                    const t = (params.children as any[]).filter(child => {
                      return !countries.some(g => g.country_name === child.props['data-option'].country_name)
                    })

                    if (!t.length) {
                      countryChange(
                        countries.filter(child => {
                          return !(params.children as any[]).some(
                            g => child.country_name === g.props['data-option'].country_name
                          )
                        })
                      )

                      return
                    }
                    countryChange([
                      ...countries,
                      ...(params.children as any[]).map(child => child.props['data-option'])
                    ])
                  }}
                  sx={{
                    fontSize: '18px',
                    fontWeight: 600,
                    justifyContent: 'flex-start'
                  }}
                >
                  {params.group}
                </Button>
              )}

              {Object.entries(subGroups).map((g: [string, any]) => {
                return (
                  <Box key={g[0]}>
                    {g[0] && (
                      <Button
                        sx={{
                          fontSize: '15px',
                          fontWeight: 500,
                          px: 4,
                          mt: 1,
                          justifyContent: 'flex-start'
                        }}
                        fullWidth
                        onClick={() => {
                          const t = g[1].filter((child: any) => {
                            return !countries.some(g => g.country_name === child.props['data-option'].country_name)
                          })

                          if (!t.length) {
                            countryChange(
                              countries.filter(child => {
                                return !g[1].some(
                                  (c: any) => child.country_name === c.props['data-option'].country_name
                                )
                              })
                            )

                            return
                          }
                          countryChange([...countries, ...g[1].map((child: any) => child.props['data-option'])])
                        }}
                      >
                        {g[0]}
                      </Button>
                    )}
                    <p>{g[1]}</p>
                  </Box>
                )
              })}
            </li>
          )
        }

        return null
      }}
    />
  )
}

export default CountrySelector
