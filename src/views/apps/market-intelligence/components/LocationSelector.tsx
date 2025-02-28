import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  Radio,
  Typography
} from '@mui/material'
import React, { memo, useCallback, useMemo, useState } from 'react'

import Icon from 'src/@core/components/icon'
import FilterItemLabel from './FilterItemLabel'
import FilterItemValueBox from './FilterItemValueBox'
import { CountryType } from '../../product_search/configs/countriesMapping'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { groupByContinentAndRegion } from '../utils/searchCountries'
import CustomTextField from 'src/@core/components/mui/text-field'
import useDebounce from 'src/hooks/useDebounce'

type Props = {
  geographyIn: CountryType[]
  geographyNotIn: CountryType[]
  setGeographyIn: (newLocations: CountryType[]) => void
  setGeographyNotIn: (newLocations: CountryType[]) => void
  types: { main: boolean; secondary: boolean }
  setTypes: (newTypes: { main: boolean; secondary: boolean }) => void
}

const LocationSelector = ({
  geographyIn,
  geographyNotIn,
  setGeographyIn,
  setGeographyNotIn,
  types,
  setTypes
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [radioValue, setRadioValue] = useState('any_of')
  const [inputValue, setInputValue] = useState('')
  const [opened, setOpened] = useState<string[]>([])

  const debouncedSearch = useDebounce(inputValue, 1000)

  const openMenu = Boolean(anchorEl)

  const countries = useMemo(() => {
    const searchData = groupByContinentAndRegion(debouncedSearch)
    setOpened(searchData.currentLocations)

    return searchData.locations
  }, [debouncedSearch])

  const setSelected = useCallback(
    (newSelection: CountryType[]) => {
      if (radioValue === 'any_of') {
        setGeographyNotIn([])

        setGeographyIn(newSelection)
      } else {
        setGeographyIn([])

        setGeographyNotIn(newSelection)
      }
    },
    [radioValue]
  )

  const onDeleteGeographyIn = (value: string | number) => {
    setGeographyIn(geographyIn.filter(({ country_name }) => country_name !== value))
  }

  const onDeleteGeographyNotIn = (value: string | number) => {
    setGeographyNotIn(geographyNotIn.filter(({ country_name }) => country_name !== value))
  }

  const handleOpen = useCallback((location: string) => {
    setOpened(prev => (prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]))
  }, [])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          borderRadius: 1.25,
          transition: 'box-shadow .1s ease-in-out',
          backgroundColor: '#F8F8F8',
          boxShadow: '0px 2px 8px 0px rgba(29, 29, 29, 0.151)',
          width: '100%',
          '&:hover': {
            boxShadow: '0px 2px 4px 0px rgba(29, 29, 29, 0.251)'
          }
        }}
        onClick={e => setAnchorEl(e.currentTarget)}
        id='locations-filter'
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            px: 1,
            py: 0.3,
            borderRadius: 1.25,
            backgroundColor: '#F8F8F8'
          }}
        >
          <FilterItemLabel icon='mdi:location' label='Location' />

          {!!geographyIn?.length && (
            <FilterItemValueBox
              sxValue={{
                whiteSpace: 'nowrap'
              }}
              values={[
                {
                  label: 'Is any of',
                  value: geographyIn[0]
                    ? [
                        `${geographyIn[0]?.country_name}${
                          geographyIn.length > 1 ? `, +${geographyIn.length - 1} criteria` : ''
                        }`
                      ]
                    : []
                }
              ]}
            />
          )}

          {!!geographyNotIn?.length && (
            <FilterItemValueBox
              sxValue={{
                whiteSpace: 'nowrap'
              }}
              values={[
                {
                  label: 'Is none of',
                  value: geographyNotIn[0]
                    ? [
                        `${geographyNotIn[0]?.country_name}${
                          geographyNotIn.length > 1 ? `, +${geographyNotIn.length - 1} criteria` : ''
                        }`
                      ]
                    : []
                }
              ]}
            />
          )}
        </Box>

        <IconButton
          disabled={!geographyIn.length && !geographyNotIn.length}
          onClick={e => {
            e.stopPropagation()
            setGeographyIn([])
            setGeographyNotIn([])
          }}
        >
          <Icon icon='mdi:trash-can-outline' />
        </IconButton>
      </Box>

      <Menu
        id='location-filter-menu'
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        sx={{
          '.MuiMenu-paper': {
            mt: 2,
            maxHeight: '80vh'
          }
        }}
        variant='menu'
        disableAutoFocusItem
      >
        <Box
          sx={{
            px: 2,
            position: 'relative',
            maxWidth: '524px'
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
            </Box>

            <CustomTextField
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder='Search by Country Name'
              fullWidth
              sx={{ mt: 6 }}
            />

            <Box
              sx={{
                mt: 4,
                width: '100%'
              }}
            >
              {countries.map(node => (
                <TreeNode
                  key={node.label}
                  node={node}
                  selected={radioValue === 'any_of' ? geographyIn : geographyNotIn}
                  setSelected={setSelected}
                  opened={opened}
                  handleOpen={handleOpen}
                />
              ))}
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
                  <Checkbox checked={types.main} onChange={e => setTypes({ ...types, main: e.target.checked })} />
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
                    checked={types.secondary}
                    onChange={e => setTypes({ ...types, secondary: e.target.checked })}
                  />
                }
              />
            </Box>
          </Grid>

          <Box mt={4}>
            {!!geographyIn.length && (
              <FilterItemValueBox
                sxValue={{
                  whiteSpace: 'nowrap'
                }}
                values={[
                  {
                    label: 'Is any of',
                    value: geographyIn.map(({ country_name }) => country_name)
                  }
                ]}
                onDelete={onDeleteGeographyIn}
              />
            )}

            {!!geographyNotIn.length && (
              <FilterItemValueBox
                sxValue={{
                  whiteSpace: 'nowrap'
                }}
                values={[
                  {
                    label: 'Is none of',
                    value: geographyNotIn.map(({ country_name }) => country_name)
                  }
                ]}
                onDelete={onDeleteGeographyNotIn}
              />
            )}
          </Box>
        </Box>
      </Menu>
    </>
  )
}

type NodeType = {
  label: string
  childCountries: CountryType[]
  country_name?: string
  country_code?: string
  continent?: string
  macro_region?: string
  children: {
    label: string
    childCountries: CountryType[]
    country_name?: string
    country_code?: string
    continent?: string
    macro_region?: string
  }[]
}

const TreeNode = memo(
  ({
    node,
    selected,
    setSelected,
    opened,
    handleOpen
  }: {
    node: NodeType
    selected: CountryType[]
    setSelected: (newSelection: CountryType[]) => void
    opened: string[]
    handleOpen: (codes: string) => void
  }) => {
    const handleChange = (event: any) => {
      const checked = event.target.checked

      const isContinentOrRegion = !node.country_code

      if (!isContinentOrRegion) {
        if (checked) {
          setSelected([
            {
              continent: `${node.continent}`,
              country_code: `${node.country_code}`,
              country_name: `${node.country_name}`,
              macro_region: `${node.macro_region}`
            }
          ])
        } else {
          setSelected([])
        }
      }
    }

    return node.country_code ? (
      <AccordionSummary>
        <FormControlLabel
          control={
            <Radio
              checked={!!selected.find(({ country_name }) => country_name === node.country_name)}
              onChange={handleChange}
            />
          }
          label={<Typography>{node.country_name}</Typography>}
          onClick={event => event.stopPropagation()}
        />
      </AccordionSummary>
    ) : (
      <Accordion
        sx={{
          m: '0 !important',
          boxShadow: 'none',
          border: '1px solid #d4d4d4',
          borderRadius: 0,
          borderTop: 0,
          '.MuiAccordion-rounded': {
            boxShadow: 'none'
          },

          '&:first-of-type': {
            borderTopLeftRadius: '8px !important',
            borderTopRightRadius: '8px !important',
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px',
            borderTop: '1px solid #d4d4d4 !important'
          },

          '&:last-of-type': {
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: '8px !important',
            borderBottomRightRadius: '8px !important',
            borderTop: 0,
            borderBottom: '1px solid #d4d4d4 !important'
          }
        }}
        elevation={0}
        disableGutters
        expanded={opened.includes(node.label)}
      >
        <AccordionSummary
          expandIcon={node.children.length ? <GridExpandMoreIcon /> : null}
          onClick={() => handleOpen(node.label)}
        >
          <Typography sx={{ p: 3 }}>{node.label}</Typography>
        </AccordionSummary>

        <AccordionDetails>
          {node.children.length &&
            node.children.map((child: any) => (
              <TreeNode
                key={child.country_name ? child.country_name : `${child.label}${child.code}`}
                node={child}
                selected={selected}
                setSelected={setSelected}
                opened={opened}
                handleOpen={handleOpen}
              />
            ))}
        </AccordionDetails>
      </Accordion>
    )
  }
)

export default LocationSelector
