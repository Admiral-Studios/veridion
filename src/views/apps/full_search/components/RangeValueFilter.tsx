import React, { FC, useState } from 'react'
import FilterItemLabel from './FilterItemLabel'
import { Box, Grid, IconButton, Menu, MenuItem } from '@mui/material'
import { RangeFilterValueTypes } from '../types/enums'
import CustomTextField from 'src/@core/components/mui/text-field'
import FilterItemValueBox from './FilterItemValueBox'
import { useFilterStore } from '../store/filterStore'
import Icon from 'src/@core/components/icon'
import { addThousandsDelimiter } from 'src/utils/numbers/addThousandsDelimeter'

type Props = {
  filterType: RangeFilterValueTypes
  title: string
  icon: string
}

const getRelations = {
  company_employee_count: [
    'equals',
    'between',
    'greater_than',
    'greater_than_or_equal',
    'less_than',
    'less_than_or_equal'
  ],
  company_estimated_revenue: [
    'equals',
    'between',
    'greater_than',
    'greater_than_or_equal',
    'less_than',
    'less_than_or_equal'
  ],
  company_year_founded: [
    'equals',
    'between',
    'greater_than',
    'greater_than_or_equal',
    'less_than',
    'less_than_or_equal'
  ]
}

const RangeValueFilter: FC<Props> = ({ filterType, title, icon }) => {
  const { onSetData, data } = useFilterStore()

  const filter = data[filterType]

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const openMenu = Boolean(anchorEl)

  const onChangeRelation = (rel: string) => {
    onSetData(filterType, 'relation', rel)

    if (rel === 'between') {
      onSetData(filterType, 'value', filter?.value ? { min: filter?.value, max: NaN } : { min: NaN, max: NaN })
    } else {
      onSetData(filterType, 'value', NaN)
    }
  }

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
          backgroundColor: '#F8F8F8'
        }}
        onClick={e => setAnchorEl(e.currentTarget)}
        id={`${filterType}-filter`}
      >
        <FilterItemLabel icon={icon} label={title} />

        <FilterItemValueBox
          values={[
            {
              label: 'Relation',
              value: [filter?.relation || 'equals']
            }
          ]}
        />

        <FilterItemValueBox
          values={
            filter?.relation === 'between'
              ? [
                  {
                    label: 'Min Value',
                    value: filter?.value?.min
                      ? [
                          filter?.value?.min
                            ? filterType === 'company_year_founded'
                              ? filter.value?.min
                              : addThousandsDelimiter(filter.value?.min)
                            : ''
                        ]
                      : []
                  },
                  {
                    label: 'Max Value',
                    value: filter?.value?.max
                      ? [
                          filter?.value?.max
                            ? filterType === 'company_year_founded'
                              ? filter.value?.max
                              : addThousandsDelimiter(filter.value?.max)
                            : ''
                        ]
                      : []
                  }
                ]
              : [
                  {
                    label: 'Value',
                    value:
                      filter?.value && typeof filter?.value !== 'object'
                        ? [
                            filter?.value
                              ? filterType === 'company_year_founded'
                                ? filter.value
                                : addThousandsDelimiter(filter.value)
                              : ''
                          ]
                        : []
                  }
                ]
          }
        />
      </Box>

      <Menu
        id={`${filterType}-filter-menu`}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': `${filterType}-filter`
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
          <IconButton
            sx={{ position: 'absolute', top: 0, right: 0, p: 1, zIndex: 10 }}
            onClick={() => setAnchorEl(null)}
          >
            <Icon icon='material-symbols:close' />
          </IconButton>

          <Grid item container xs={12}>
            <Box
              sx={{
                width: '100%',
                minWidth: '244px',
                maxWidth: '366px'
              }}
            >
              <CustomTextField
                label='Relation'
                variant='outlined'
                size='small'
                select
                fullWidth
                value={filter?.relation || 'equals'}
                sx={{
                  mt: 4,
                  '.MuiInputBase-root .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',

                    '.MuiBox-root': {
                      mr: 4
                    }
                  }
                }}
                SelectProps={{
                  onChange: e => onChangeRelation(e.target.value as string)
                }}
              >
                {getRelations[filterType].map(v => (
                  <MenuItem
                    key={v}
                    value={v}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    {v}
                  </MenuItem>
                ))}
              </CustomTextField>

              <Box sx={{ mt: 4, width: '100%' }}>
                {filter?.relation !== 'between' ? (
                  <CustomTextField
                    fullWidth
                    placeholder='Value'
                    label='Value'
                    value={
                      filter?.value
                        ? filterType === 'company_year_founded'
                          ? filter.value
                          : addThousandsDelimiter(filter.value)
                        : ''
                    }
                    onKeyDown={e => {
                      if (isNaN(+e.key) && e.key !== 'Backspace') {
                        e.preventDefault()
                      }
                    }}
                    onChange={e => {
                      onSetData(filterType, 'value', +e.target.value.split(',').join(''))
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <CustomTextField
                      fullWidth
                      placeholder='Min'
                      label='Min'
                      value={
                        filter?.value?.min
                          ? filterType === 'company_year_founded'
                            ? filter.value?.min
                            : addThousandsDelimiter(filter.value?.min)
                          : ''
                      }
                      onKeyDown={e => {
                        if (isNaN(+e.key) && e.key !== 'Backspace') {
                          e.preventDefault()
                        }
                      }}
                      onChange={e => {
                        onSetData(filterType, 'value', { ...filter?.value, min: +e.target.value.split(',').join('') })
                      }}
                    />

                    <CustomTextField
                      fullWidth
                      placeholder='Max'
                      label='Max'
                      value={
                        filter?.value?.max
                          ? filterType === 'company_year_founded'
                            ? filter.value?.max
                            : addThousandsDelimiter(filter.value?.max)
                          : ''
                      }
                      onKeyDown={e => {
                        if (isNaN(+e.key) && e.key !== 'Backspace') {
                          e.preventDefault()
                        }
                      }}
                      onChange={e => {
                        onSetData(filterType, 'value', { ...filter?.value, max: +e.target.value.split(',').join('') })
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Box>
      </Menu>
    </>
  )
}

export default RangeValueFilter
