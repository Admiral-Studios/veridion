import { Box, Checkbox, FormControlLabel, Grid, IconButton, Menu, Radio, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'

import Icon from 'src/@core/components/icon'
import FilterItemLabel from './FilterItemLabel'
import FilterItemValueBox from './FilterItemValueBox'
import OperandsInput from '../../../../shared/components/OperandsInput'
import CustomTextField from 'src/@core/components/mui/text-field'
import { generalStrictnessLabels } from '../../product_search/configs/labels'

const supplier_types = ['distributor', 'manufacturer', 'service_provider']

const strictnessTypes = {
  high: 1,
  medium: 2,
  low: 3
}

type Props = {
  inputKeywords: string[]
  excludeKeywords: string
  keywordsSupplierTypes: any
  strictness: number | undefined
  setInputKeywords: (newKeywords: string[]) => void
  setExcludeKeywords: (newKeywords: string) => void
  setSupplierTypes: (newSupplierTypes: any) => void
  setStrictness: (newStrictness: number) => void
}

const KeywordsInput = ({
  inputKeywords,
  excludeKeywords,
  keywordsSupplierTypes,
  strictness,
  setInputKeywords,
  setExcludeKeywords,
  setStrictness,
  setSupplierTypes
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const openMenu = Boolean(anchorEl)

  const displayedSupplierTypes = supplier_types.filter(
    t => keywordsSupplierTypes[t as keyof typeof keywordsSupplierTypes]
  )

  const addOperands = (operands: string[]) => {
    setInputKeywords(operands)
  }

  const addExcludeOperands = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExcludeKeywords(e.target.value)
  }

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
          <FilterItemLabel icon='mdi:key-change' label='Keywords' />

          {(!!inputKeywords?.length || excludeKeywords) && (
            <FilterItemValueBox
              values={[
                { label: 'Match', value: inputKeywords || [] },
                { label: 'Exclude', value: [excludeKeywords || ''] }
              ]}
            />
          )}

          {!!displayedSupplierTypes.length && (
            <FilterItemValueBox
              values={[
                {
                  label: 'Supplier Types',
                  value: displayedSupplierTypes
                }
              ]}
            />
          )}

          <FilterItemValueBox
            values={[
              {
                label: 'Strictness',
                value: [Object.entries(strictnessTypes).find(v => v[1] === strictness)?.[0] || '']
              }
            ]}
          />
        </Box>

        <IconButton
          disabled={!inputKeywords.length && !excludeKeywords.length}
          onClick={e => {
            e.stopPropagation()
            setInputKeywords([])
            setExcludeKeywords('')
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
        variant='menu'
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
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#000'
                  }}
                >
                  Match
                </Typography>

                <OperandsInput
                  addOperands={addOperands}
                  operands={inputKeywords || []}
                  label=''
                  hideGroups={true}
                  placeholder='Add search operands. Separate operands by "," and organize them by groups by pressing the "return" key.'
                />
              </Grid>

              <Grid item xs={12} mt={4}>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#000'
                  }}
                >
                  Exclude
                </Typography>

                <CustomTextField
                  onChange={addExcludeOperands}
                  value={excludeKeywords || ''}
                  fullWidth
                  label={''}
                  placeholder='Add exception operands. Organize them by groups by pressing the "return" key.'
                />
              </Grid>
            </Box>

            <Grid item container xs={12} mt={4}>
              <Box
                sx={{
                  width: '100%',
                  padding: '15px 10px',
                  border: '1px solid #F8F8F8',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#000'
                  }}
                >
                  Supplier Type:
                </Typography>

                {supplier_types.map(t => (
                  <FormControlLabel
                    key={t}
                    label={t}
                    sx={{
                      '.MuiCheckbox-root': {
                        p: 0
                      },
                      '.MuiTypography-root': {
                        marginLeft: 1
                      },
                      marginLeft: 0,
                      marginRight: 0
                    }}
                    control={
                      <Checkbox
                        checked={keywordsSupplierTypes[t as keyof typeof keywordsSupplierTypes]}
                        onChange={e => {
                          const updatedSupplierTypes = {
                            ...(keywordsSupplierTypes || keywordsSupplierTypes),
                            [t]: e.target.checked
                          }

                          setSupplierTypes(updatedSupplierTypes)
                        }}
                      />
                    }
                  />
                ))}
              </Box>

              <Box
                sx={{
                  width: '100%',
                  padding: '15px 10px',
                  border: '1px solid #F8F8F8',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mt: 4
                }}
              >
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#000'
                  }}
                >
                  Strictness
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  {Object.entries(strictnessTypes).map(([key, value], id) => (
                    <FormControlLabel
                      key={key}
                      label={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                          }}
                        >
                          {key}

                          <Tooltip title={generalStrictnessLabels[id]}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              <Icon icon='material-symbols:info-outline' />
                            </Box>
                          </Tooltip>
                        </Box>
                      }
                      sx={{
                        '.MuiRadio-root': {
                          p: 0
                        },
                        '.MuiTypography-root': {
                          marginLeft: 1
                        },
                        marginLeft: 0,
                        marginRight: 0
                      }}
                      control={
                        <Radio
                          checked={(strictness || 2) === value}
                          onChange={() => {
                            setStrictness(value)
                          }}
                        />
                      }
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Menu>
    </>
  )
}

export default KeywordsInput
