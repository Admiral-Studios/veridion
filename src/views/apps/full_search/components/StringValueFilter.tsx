import { Grid, IconButton, Menu, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, useState } from 'react'
import FilterItemLabel from './FilterItemLabel'
import { StringValueFilterTypes } from '../types/enums'
import CustomTextField from 'src/@core/components/mui/text-field'
import FilterItemValueBox from './FilterItemValueBox'
import { useFilterStore } from '../store/filterStore'
import Icon from 'src/@core/components/icon'
import OperandsInput from 'src/shared/components/OperandsInput'

type Props = {
  filterType: StringValueFilterTypes
  title: string
  icon: string
}

const getRelations = {
  company_name: ['equals', 'matches', 'in'],
  company_website: ['equals', 'in'],
  company_postcode: ['equals', 'not_equals', 'in', 'not_in'],
  company_category: ['equals', 'not_equals', 'in', 'not_in'],
  company_industry: ['equals', 'not_equals', 'in', 'not_in'],
  company_naics_code: ['equals', 'not_equals', 'in', 'not_in']
}

const StringValueFilter: FC<Props> = ({ filterType, title, icon }) => {
  const { onSetData, data } = useFilterStore()

  const filter = data[filterType]

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [relation, setRelation] = useState('equals')
  const [value, setValue] = useState('')
  const [values, setValues] = useState<string[]>([])

  const openMenu = Boolean(anchorEl)

  const onChangeValues = (operands: string[]) => {
    setValues(operands)

    onSetData(filterType, 'value', operands)
  }

  const onChangeRelation = (rel: string) => {
    setRelation(rel)

    onSetData(filterType, 'relation', rel)

    if (rel === 'in' || rel === 'not_in') {
      setValues(value ? [value] : [])
      setValue('')

      onSetData(filterType, 'value', value ? [value] : [])
    } else {
      if (values.length) {
        setValues([])

        onSetData(filterType, 'value', [])
      }
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
          values={[
            {
              label: 'Value',
              value: relation === 'equals' || relation === 'matches' ? [filter.value || ''] : filter.value || []
            }
          ]}
        />
      </Box>

      <Menu
        id={`${filterType}-filter-menu`}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        variant='menu'
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
                {relation === 'equals' || relation === 'not_equals' || relation === 'matches' ? (
                  <CustomTextField
                    fullWidth
                    placeholder='Value'
                    label='Value'
                    value={filter.value || ''}
                    onChange={e => {
                      setValue(e.target.value)
                      onSetData(filterType, 'value', e.target.value)
                    }}
                  />
                ) : (
                  <OperandsInput
                    operands={filter.value || []}
                    addOperands={onChangeValues}
                    placeholder='Value'
                    label='Value'
                    type='exclude'
                    hideGroups
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Box>
      </Menu>
    </>
  )
}

export default StringValueFilter
