import { Box, Checkbox, FormControlLabel, Grid, IconButton, Menu, Radio, Tooltip, Typography } from '@mui/material'
import React, { FC, useState } from 'react'
import FilterItemLabel from './FilterItemLabel'
import FilterItemValueBox from './FilterItemValueBox'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useFilterStore } from '../store/filterStore'
import { generalStrictnessLabels } from '../../product_search/configs/labels'
import Icon from 'src/@core/components/icon'
import OperandsInput from 'src/shared/components/OperandsInput'

type Props = {
  type: 'company_products' | 'company_keywords'
}

const supplier_types = ['distributor', 'manufacturer', 'service_provider']

const strictnessTypes = {
  high: 1,
  medium: 2,
  low: 3
}

const ProductFilter: FC<Props> = ({ type }) => {
  const { onSetData, data } = useFilterStore()

  const filter = data[type]

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [supplierTypes, setSupplierTypes] = useState({
    distributor: false,
    manufacturer: false,
    service_provider: false
  })

  const openMenu = Boolean(anchorEl)

  const addOperands = (operands: string[]) => {
    onSetData(type, 'input_operands', operands)
  }

  const sendNaturalQuery = async () => {
    console.log(123)
  }

  const addExcludeOperands = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSetData(type, 'exclude_operands', e.target.value)
  }

  const displayedSupplierTypes = supplier_types.filter(
    t => (filter?.supplier_types || supplierTypes)[t as keyof typeof supplierTypes]
  )

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          p: 1,
          borderRadius: 1.25,
          backgroundColor: '#F8F8F8'
        }}
        onClick={e => setAnchorEl(e.currentTarget)}
        id={`${type}-filter`}
      >
        <FilterItemLabel
          icon={type === 'company_products' ? 'ant-design:product-filled' : 'mdi:key-change'}
          label={type === 'company_products' ? 'Product' : 'Keywords'}
        />

        {(!!filter?.input_operands?.length || filter?.exclude_operands) && (
          <FilterItemValueBox
            values={[
              { label: 'Match', value: filter?.input_operands || [] },
              { label: 'Exclude', value: [filter?.exclude_operands || ''] }
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
              value: [Object.entries(strictnessTypes).find(v => v[1] === filter?.strictness)?.[0] || '']
            }
          ]}
        />
      </Box>

      <Menu
        id={`${type}-filter-menu`}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': `${type}-filter`
        }}
        variant='menu'
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
                  operands={filter?.input_operands || []}
                  label=''
                  placeholder='Add search operands. Separate operands by "," and organize them by groups by pressing the "return" key.'
                  variationsQueryHandler={sendNaturalQuery}
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
                  value={filter?.exclude_operands || ''}
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
                        checked={(filter?.supplier_types || supplierTypes)[t as keyof typeof supplierTypes]}
                        onChange={e => {
                          const updatedSupplierTypes = {
                            ...(filter?.supplier_types || supplierTypes),
                            [t]: e.target.checked
                          }

                          setSupplierTypes(updatedSupplierTypes)
                          onSetData(type, 'supplier_types', updatedSupplierTypes)
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
                          checked={(filter?.strictness || 2) === value}
                          onChange={() => {
                            onSetData(type, 'strictness', value)
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

export default ProductFilter
