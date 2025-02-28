import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  darken,
  lighten,
  useTheme
} from '@mui/material'
import {
  DataGrid,
  gridFilteredSortedRowIdsSelector,
  GridRowSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  useGridApiRef
} from '@mui/x-data-grid'
import React, { useEffect, useMemo, useState } from 'react'
import { Address, CompanySearchProductFromDb, ProductsProjectType } from 'src/types/apps/veridionTypes'
import { fetchDataFromDb } from 'src/utils/db/fetchDataFromDb'
import { productDataGridColumnsNames, productsDataGridColumns } from './configs/productDataGridColumns'
import Icon from 'src/@core/components/icon'
import nProgress from 'nprogress'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { ApexOptions } from 'apexcharts'
import ExportButton from 'src/shared/components/DataGrid/ExportButton'
import ComplexFieldsDialog from 'src/shared/components/ComplexFieldsDialog'
import { columnVisibilityModel } from './configs/columnVisibilityModel'
import { useAuth } from 'src/hooks/useAuth'
import ExpandableCell from 'src/shared/components/DataGrid/ExpandableCell'

const setBackgroundColor = (color: string, mode: string) => (mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7))

const setHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6)

const setSelectedBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5)

const setSelectedHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4)

function CustomToolbar(
  selectedCompaniesHaveLength: boolean,
  deleteCompaniesHandler: () => void,
  onClickExportButton: () => CompanySearchProductFromDb[],
  isHideExport?: boolean
) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      {!isHideExport && (
        <ExportButton
          columns={productDataGridColumnsNames}
          datagridName='supplier_shortlist'
          onClickToGetExportedCompanies={onClickExportButton}
        />
      )}
      <Button
        variant='text'
        size='small'
        disabled={!selectedCompaniesHaveLength}
        onClick={deleteCompaniesHandler}
        startIcon={<Icon icon='material-symbols:close' />}
      >
        Delete
      </Button>
    </GridToolbarContainer>
  )
}

const SavedProducts = () => {
  const { user } = useAuth()

  const isDpwadamRole = user?.role === 'dpwadam'

  const [products, setProducts] = useState<(CompanySearchProductFromDb & { project_name: string })[]>([])
  const [selectedProducts, setSelectedProducts] = useState<GridRowSelectionModel>([])
  const [productProjects, setProductProjects] = useState<ProductsProjectType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = React.useState<string[] | undefined>([])
  const [inputValue, setInputValue] = React.useState('')
  const [mainAddress, setMainAddress] = React.useState<Address | null>(null)

  const apiRef = useGridApiRef()

  const projectsNames = useMemo(() => {
    const map = new Map()
    productProjects.forEach(({ name }) => {
      if (name) {
        map.set(name, name)
      }
    })

    return Array.from(map.values()).sort()
  }, [productProjects])

  const filteredProducts = useMemo(() => {
    if (value?.length && products.length) {
      return products.filter(({ project_name }) => value.includes(project_name))
    }

    return products
  }, [value, products])

  const deleteProducts = async () => {
    nProgress.start()
    try {
      for (let i = 0; i < selectedProducts.length; i++) {
        await fetch('/api/db_transactions/delete_entry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(selectedProducts[i])
        })
      }

      setProducts(products.filter(({ id }) => !selectedProducts.includes(id)))

      setProductProjects(productProjects.filter(({ watchlist_id }) => !selectedProducts.includes(watchlist_id)))

      setSelectedProducts([])
    } catch (error) {
      console.log(error)
    } finally {
      nProgress.done()
    }
  }

  const setMainAddressHandler = (newMainAddress: Address) => {
    setMainAddress(newMainAddress)
  }

  const onClickExportButton = () => {
    const idsToExport = gridFilteredSortedRowIdsSelector(apiRef).filter(id =>
      selectedProducts.length ? selectedProducts.includes(id) : true
    )

    const productsToExport: CompanySearchProductFromDb[] = []

    idsToExport.forEach(id => {
      const company = products.find(c => c.id === id)

      if (company) {
        productsToExport.push(company)
      }
    })

    return productsToExport
  }

  useEffect(() => {
    setIsLoading(true)
    async function fetchProducts() {
      const productsFromDb = await fetchDataFromDb<CompanySearchProductFromDb[]>(
        '/api/db_transactions/fetch_watchlist_entries_from_db?entries=products'
      )

      const productsProjects = await fetchDataFromDb<ProductsProjectType[]>(
        '/api/db_transactions/fetch_product_projects'
      )

      if (productsFromDb) {
        setProducts(
          productsFromDb.map(p => ({
            ...p,
            project_name: productsProjects.find(({ watchlist_id }) => p.id === watchlist_id)?.name || ''
          }))
        )
      }

      setProductProjects(productsProjects)
      setIsLoading(false)
    }
    fetchProducts()
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} marginTop={4}>
        <Grid xs={12} md={4} marginBottom={4}>
          <Autocomplete
            size='small'
            options={projectsNames}
            renderInput={params => <TextField {...params} variant='outlined' label='Select projects' />}
            filterSelectedOptions
            multiple
            value={value}
            inputValue={inputValue}
            onChange={(_, newValue) => {
              if (newValue) {
                setValue(newValue)
              }
            }}
            onInputChange={(_, newInputValue: string) => {
              setInputValue(newInputValue)
            }}
          />
        </Grid>

        <div>
          {products ? (
            <DataGrid
              apiRef={apiRef}
              style={{ overflow: 'hidden' }}
              autoHeight={false}
              rows={filteredProducts}
              columns={productsDataGridColumns(setMainAddressHandler)}
              pagination
              checkboxSelection
              disableRowSelectionOnClick
              getRowHeight={() => 'auto'}
              onRowSelectionModelChange={setSelectedProducts}
              rowSelectionModel={selectedProducts}
              loading={isLoading}
              initialState={{
                columns: {
                  columnVisibilityModel
                }
              }}
              slots={{
                toolbar: () => CustomToolbar(!!products.length, deleteProducts, onClickExportButton, isDpwadamRole),
                cell: params => <ExpandableCell {...params} />
              }}
              sx={theme => ({
                height: 500,
                '& .super-app-theme--Rejected': {
                  backgroundColor: setBackgroundColor(theme.palette.error.main, theme.palette.mode),
                  '&:hover': {
                    backgroundColor: setHoverBackgroundColor(theme.palette.error.main, theme.palette.mode)
                  },
                  '&.Mui-selected': {
                    backgroundColor: setSelectedBackgroundColor(theme.palette.error.main, theme.palette.mode),
                    '&:hover': {
                      backgroundColor: setSelectedHoverBackgroundColor(theme.palette.error.main, theme.palette.mode)
                    }
                  }
                },
                '& .super-app-theme--Not-Enriched': {
                  backgroundColor: setBackgroundColor('#808080', theme.palette.mode),
                  '&:hover': {
                    backgroundColor: setBackgroundColor('#808080', theme.palette.mode)
                  }
                }
              })}
            />
          ) : (
            ''
          )}
        </div>
      </Grid>

      {!!products.length && (
        <Grid xs={12} container item spacing={4} mt={8}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader sx={{ pb: 0, mb: 4 }} title='Count by company supplier types' />

              <CardContent
                sx={{
                  '@media(max-width: 424px)': {
                    paddingLeft: 2,
                    paddingRight: 2
                  }
                }}
              >
                <ProductsAnalytics
                  statistics={products.reduce((acc, cur) => {
                    if (cur?.company_supplier_types?.length)
                      cur.company_supplier_types.forEach(type => {
                        if (!acc[type]) {
                          acc[type] = 1
                        } else {
                          acc[type] = acc[type] + 1
                        }
                      })

                    return acc
                  }, {} as { [key: string]: number })}
                  length={products.length}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader sx={{ pb: 0, mb: 4 }} title='Count by NAICS 2022 labels' />

              <CardContent
                sx={{
                  '@media(max-width: 424px)': {
                    paddingLeft: 2,
                    paddingRight: 2
                  }
                }}
              >
                <ProductsAnalytics
                  statistics={products.reduce((acc, cur) => {
                    if (!acc[cur.naics_2022_primary_label]) {
                      acc[cur.naics_2022_primary_label] = 1
                    } else {
                      acc[cur.naics_2022_primary_label] = acc[cur.naics_2022_primary_label] + 1
                    }

                    return acc
                  }, {} as { [key: string]: number })}
                  length={products.length}
                  leftCoord={64}
                />
              </CardContent>
            </Card>
          </Grid>

          {!!productProjects.length && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader sx={{ pb: 0, mb: 4 }} title='Count by projects' />

                <CardContent
                  sx={{
                    '@media(max-width: 424px)': {
                      paddingLeft: 2,
                      paddingRight: 2
                    }
                  }}
                >
                  <ProductsAnalytics
                    statistics={productProjects.reduce((acc, cur) => {
                      if (!acc[cur.name]) {
                        acc[cur.name] = 1
                      } else {
                        acc[cur.name] = acc[cur.name] + 1
                      }

                      return acc
                    }, {} as { [key: string]: number })}
                    length={productProjects.length}
                  />
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      <ComplexFieldsDialog open={!!mainAddress} onClose={() => setMainAddress(null)} title='Main Address'>
        {mainAddress && (
          <Card>
            <CardContent>
              <List
                sx={{
                  gap: 4,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  alignItems: 'flex-start',
                  '.MuiListItem-root': {
                    p: 0
                  }
                }}
              >
                {Object.entries(mainAddress).map(([field, value]) => (
                  <ListItem key={field} sx={{ mb: 4 }}>
                    <ListItemText
                      primary={field.split('_').join(' ')}
                      secondary={value || ''}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </ComplexFieldsDialog>
    </Grid>
  )
}

const ProductsAnalytics: React.FC<{ statistics: { [key: string]: number }; length: number; leftCoord?: number }> = ({
  statistics,
  length,
  leftCoord
}) => {
  const theme = useTheme()

  const dataArray = Object.values(statistics)

  const series = [{ data: dataArray.map(value => (value * 100) / length) }]

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      type: 'bar'
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        endingShape: 'rounded',
        startingShape: 'rounded',
        horizontal: true
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',

      style: {
        colors: [theme.palette.grey[600]]
      },
      formatter: (value: number) => {
        return `${value.toFixed()}%`
      }
    },
    colors: [hexToRGBA(theme.palette.primary.main, 1)],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -28,
        left: leftCoord || 0,
        right: 0,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: Object.keys(statistics).map(label => label.split('_').join(' ')),
      labels: {
        show: false,
        rotate: 0
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: '12px',
          cssClass: 'chart-label'
        }
      }
    }
  }

  return <ReactApexcharts type='bar' height={300} series={series} options={options} />
}

export default SavedProducts
