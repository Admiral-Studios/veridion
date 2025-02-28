import { Autocomplete, Checkbox, Grid, IconButton, Menu, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, useEffect, useState } from 'react'
import FilterItemLabel from './FilterItemLabel'
import CustomTextField from 'src/@core/components/mui/text-field'
import FilterItemValueBox from './FilterItemValueBox'
import { useFilterStore } from '../store/filterStore'
import Icon from 'src/@core/components/icon'

type Props = {
  type: 'company_industry' | 'company_category'
}

const IndustryFilter: FC<Props> = ({ type }) => {
  const { onSetData, data, industries, categories, fetchIndustries } = useFilterStore()

  const filter = data[type]

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [relation, setRelation] = useState('equals')

  const openMenu = Boolean(anchorEl)

  const onChangeRelation = (rel: string) => {
    setRelation(rel)

    onSetData(type, 'relation', rel)

    if (rel === 'in' || rel === 'not_in') {
      console.log(filter?.value)
      onSetData(type, 'value', filter?.value?.length ? [filter?.value] : [])
    } else {
      if (filter.value?.length) {
        onSetData(type, 'value', [])
      }
    }
  }

  useEffect(() => {
    if (!industries.length && !categories.length) {
      const fetch = async () => {
        await fetchIndustries()
      }

      fetch()
    }
  }, [industries, categories])

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
        id={`${type}-filter`}
      >
        <FilterItemLabel
          icon={type === 'company_industry' ? 'mdi:company' : 'mdi:category-outline'}
          label={type === 'company_industry' ? 'Industry' : 'Category'}
        />

        <FilterItemValueBox
          values={[
            {
              label: 'Relation',
              value: [filter?.relation || 'equals']
            }
          ]}
        />

        <FilterItemValueBox
          values={[
            {
              label: 'Value',
              value: relation === 'equals' || relation === 'matches' ? [filter?.value || ''] : filter?.value || []
            }
          ]}
        />
      </Box>

      <Menu
        id={`${type}-filter-menu`}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        variant='menu'
        MenuListProps={{
          'aria-labelledby': `${type}-filter`
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
                value={filter.relation || 'equals'}
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
                {['equals', 'not_equals', 'in', 'not_in'].map(v => (
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
                <Autocomplete
                  id={type}
                  size='small'
                  value={filter?.value || ''}
                  multiple={relation === 'in' || relation === 'not_in'}
                  disableCloseOnSelect
                  options={type === 'company_industry' ? industries : categories}
                  onChange={(e, newValue) => {
                    onSetData(type, 'value', newValue)
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason === 'clear') {
                      onSetData(type, 'value', [])

                      return
                    }
                  }}
                  renderInput={params => (
                    <CustomTextField {...params} variant='outlined' label='Value' placeholder='Value' />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li {...props} data-option={option}>
                      <Checkbox sx={{ marginRight: 2 }} checked={selected} />
                      {option}
                    </li>
                  )}
                />
              </Box>
            </Box>
          </Grid>
        </Box>
      </Menu>
    </>
  )
}

export default IndustryFilter
