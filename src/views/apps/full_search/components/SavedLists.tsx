import { Box, Button, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { format } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import Icon from 'src/@core/components/icon'
import useDebounce from 'src/hooks/useDebounce'
import { CompanyMatchEnrichFromDb, CompanySearchProductFromDb, ProductsProjectType } from 'src/types/apps/veridionTypes'
import { fetchDataFromDb } from 'src/utils/db/fetchDataFromDb'
import { downloadCSV, exportDatagridData } from 'src/utils/file/csv'
import {
  productDataGridColumnsNames,
  productsDataGridColumns
} from '../../saved_products/configs/productDataGridColumns'
import SavedProductCard from './SavedProductCard'
import MoreSavedDataModal from './MoreSavedDataModal'
import axios from 'axios'
import toast from 'react-hot-toast'

type ProjectWithProducts = ProductsProjectType & { products: CompanySearchProductFromDb[] }

type DataType = CompanyMatchEnrichFromDb | (CompanySearchProductFromDb & { project_name?: string })

const SavedLists = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [productProjects, setProductProjects] = useState<ProjectWithProducts[]>([])
  const [screen, setScreen] = useState<'datagrid' | 'list'>('datagrid')
  const [moreData, setMoreData] = useState<CompanySearchProductFromDb | null>(null)
  const [companiesProducts, setCompaniesProduct] = useState<null | CompanySearchProductFromDb[]>(null)

  const debouncedSearchValue = useDebounce(searchTerm, 500)

  const searchedCompanies = useMemo(
    () =>
      (productProjects || []).filter(({ name }) =>
        name.toLowerCase().includes(debouncedSearchValue.toLowerCase().trim())
      ),
    [debouncedSearchValue, productProjects]
  )

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 300
    },
    {
      field: 'size',
      headerName: 'Size',
      width: 200,
      valueGetter: params => {
        return `${params.row.products?.length || 0} companies`
      }
    },
    {
      field: 'created_at',
      headerName: 'Created on',
      width: 200,
      renderCell: params => (params.value ? format(new Date(params.value), 'MMM. dd, yyyy') : '')
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      cellClassName: 'actions',
      getActions: ({ id, row }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<Icon width={24} height={24} icon='mdi:eye-outline' />}
            label='View'
            onClick={() => onSelectProject(row.products)}
            sx={{
              color: 'secondary.contrastText'
            }}
          />,

          <GridActionsCellItem
            key={id}
            icon={<Icon width={24} height={24} icon='mdi:file-export-outline' />}
            label='Copy'
            onClick={() => exportHandler(row.products, row.name)}
            sx={{
              color: 'secondary.contrastText'
            }}
          />,

          <GridActionsCellItem
            key={id}
            icon={<Icon width={24} height={24} icon='mdi:trash-can-outline' />}
            label='Remove'
            sx={{
              color: 'secondary.contrastText'
            }}
            onClick={() => deleteProjectWithProducts(row)}
          />
        ]
      }
    }
  ]

  const deleteProjectWithProducts = async (project: ProjectWithProducts) => {
    setIsLoading(true)
    try {
      await axios.post('/api/db_transactions/delete_project_with_products', {
        name: project.name,
        ids: project.products.map(({ veridion_id }) => veridion_id)
      })

      setProductProjects(productProjects.filter(({ name }) => name !== project.name))
    } catch (error) {
      toast.error('Failed to remove project!')
    }
    setIsLoading(false)
  }

  const onSelectProject = (products: CompanySearchProductFromDb[]) => {
    setCompaniesProduct(products)

    setScreen('list')
  }

  const exportHandler = (products: CompanySearchProductFromDb[], name: string) => {
    const dataColumn = products.map(company => {
      const dataGridColumns = productsDataGridColumns().filter(f => !f.disableExport)

      return productDataGridColumnsNames.map(c => {
        const config = dataGridColumns.find(({ headerName }) => headerName === c.column_name)

        const valueGetter = config?.valueGetter

        const valueGetterParams = {
          value: config?.field ? company[config.field as keyof DataType] : '',
          row: company
        }

        return {
          headerName: c.column_name,
          value: valueGetter
            ? valueGetter(valueGetterParams as GridValueGetterParams<any, any>)
            : config?.field
            ? company[config.field as keyof DataType]
            : ''
        }
      })
    })

    downloadCSV(exportDatagridData(dataColumn), name || 'project_data')
  }

  const moreButtonHandler = (company: CompanySearchProductFromDb) => {
    setMoreData(company)
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
        const productsWithProjects = productsProjects.reduce((acc, cur) => {
          if (acc[cur.name]) {
            const watchListItem = productsFromDb.find(({ id }) => id === cur.watchlist_id)

            if (watchListItem) {
              acc[cur.name] = {
                ...acc[cur.name],
                created_at:
                  acc[cur.name].created_at && cur.created_at
                    ? new Date(acc[cur.name].created_at) < new Date(cur.created_at)
                      ? acc[cur.name].created_at
                      : cur.created_at
                    : acc[cur.name].created_at || cur.created_at,
                updated_at:
                  acc[cur.name].updated_at && cur.updated_at
                    ? new Date(acc[cur.name].updated_at) > new Date(cur.updated_at)
                      ? acc[cur.name].updated_at
                      : cur.updated_at
                    : acc[cur.name].updated_at || cur.updated_at,
                products: [...acc[cur.name].products, watchListItem]
              }
            }
          } else {
            const watchListItem = productsFromDb.find(({ id }) => id === cur.watchlist_id)

            if (watchListItem) {
              acc[cur.name] = {
                ...cur,
                products: [watchListItem]
              }
            }
          }

          return acc
        }, {} as { [key: string]: ProjectWithProducts })

        setProductProjects(Object.values(productsWithProjects))
      }

      setIsLoading(false)
    }
    fetchProducts()
  }, [])

  return screen === 'datagrid' ? (
    <Box>
      <Grid md={6} xs={12} container mt={4}>
        <TextField
          placeholder='Search by name'
          fullWidth
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{
            '.Mui-focused': {
              '.iconify': {
                color: '#fbb03b'
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Icon icon='mdi:search' />
              </InputAdornment>
            )
          }}
        />
      </Grid>

      <DataGrid
        columns={columns}
        rows={searchedCompanies}
        loading={isLoading}
        autoHeight={false}
        disableRowSelectionOnClick
        getRowHeight={() => null}
        sx={{
          height: 500
        }}
      />
    </Box>
  ) : (
    <Box>
      <Button
        startIcon={<Icon icon='mdi:arrow-back' />}
        onClick={() => {
          setScreen('datagrid')
          setCompaniesProduct(null)
        }}
      >
        Back to lists
      </Button>

      <Typography variant='h4' fontWeight={600} mt={2}>
        <Typography variant='h4' sx={{ display: 'inline', color: '#fbb03b' }}>
          {companiesProducts?.length || 0}
        </Typography>{' '}
        companies
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 6 }}>
        {companiesProducts &&
          companiesProducts.map(company => (
            <SavedProductCard
              key={company.veridion_id}
              company={company}
              selected={false}
              saved={false}
              onClickMoreButton={moreButtonHandler}
            />
          ))}

        <MoreSavedDataModal moreData={moreData} onClose={() => setMoreData(null)} />
      </Box>
    </Box>
  )
}

export default SavedLists
