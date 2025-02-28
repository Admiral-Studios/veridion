import { Box, Checkbox, FormControlLabel } from '@mui/material'
import React, { FC, memo, useEffect, useState } from 'react'
import {
  CompanySearchProductFromDb,
  CompanyMatchEnrichFromDb,
  ProductsProjectType,
  ShortlistType,
  ShortlistTypeFromDb
} from 'src/types/apps/veridionTypes'
import { fetchDataFromDb } from 'src/utils/db/fetchDataFromDb'
import { shortlistDataGridColumns } from './configs/shortlistDataGridColumns'
import { DataGrid, GridToolbarFilterButton } from '@mui/x-data-grid'
import ShortlistModal from './ShortlistModal'
import { useAuth } from 'src/hooks/useAuth'
import axios from 'axios'
import toast from 'react-hot-toast'

interface IProps {
  selectedCompanies: (CompanyMatchEnrichFromDb | CompanySearchProductFromDb)[]
  setSelectedCompanies: (c: CompanyMatchEnrichFromDb[]) => void
  addCompaniesAndProductsFromShortlist: (c: CompanyMatchEnrichFromDb[], p: CompanySearchProductFromDb[]) => void
}

const Shortlist: FC<IProps> = memo(
  ({ selectedCompanies, setSelectedCompanies, addCompaniesAndProductsFromShortlist }) => {
    const { user } = useAuth()

    const [companies, setCompanies] = useState<CompanyMatchEnrichFromDb[]>([])
    const [products, setProducts] = useState<CompanySearchProductFromDb[]>([])

    const [shortlists, setShortlists] = useState<ShortlistType[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [openShortlistModal, setOpenShortlistModal] = useState(false)
    const [modalMode] = useState('edit')
    const [showEnrichedCompanies, setShowEnrichedCompanies] = useState(true)
    const [showSavedProducts, setShowSavedProducts] = useState(false)

    const addToShortlist = async (shortlistName: string) => {
      try {
        const index = shortlists.findIndex(obj => obj.name === shortlistName)

        if (index !== -1) {
          const idsToAdd = selectedCompanies.filter(
            company => !shortlists[index].companies.find(({ id }) => id === company.id)
          )

          if (idsToAdd.length) {
            await axios.post('/api/db_transactions/add_to_shortlist', {
              ids: idsToAdd.map(({ id }) => id),
              name: shortlistName,
              user_id: user?.id
            })

            const updatedShortlists = [...shortlists]

            updatedShortlists[index] = {
              ...updatedShortlists[index],
              companies: [
                ...updatedShortlists[index].companies,
                ...idsToAdd.map(
                  company => companies.find(({ id }) => id === company.id) || ({} as CompanyMatchEnrichFromDb)
                )
              ]
            }

            setShortlists(updatedShortlists)
          }

          setSelectedCompanies([])
        }
      } catch (error) {
        toast.error('Failed to add new shortlist')
      }
    }

    const createStageShortlist = (newShortlist: ShortlistType) => {
      setShortlists(prev => [newShortlist, ...prev])
    }

    const removeShortlistGroup = async (shortlistName: string) => {
      try {
        await axios.post('/api/db_transactions/delete_shortlist_group', {
          name: shortlistName,
          user_id: user?.id
        })

        setShortlists(shortlists.filter(({ name }) => name !== shortlistName))
      } catch (error) {
        toast.error('Failed to delete shortlists')
      }
    }

    const removeShortlists = async (name: string, ids: number[]) => {
      try {
        await axios.post('/api/db_transactions/delete_shortlist_items', {
          name,
          user_id: user?.id,
          ids
        })

        const index = shortlists.findIndex(obj => obj.name === name)

        const updatedShortlists = [...shortlists]

        updatedShortlists[index] = {
          ...updatedShortlists[index],
          companies: [...updatedShortlists[index].companies.filter(({ id }) => !ids.includes(id))]
        }

        setShortlists(updatedShortlists)
      } catch (error) {
        toast.error('Failed to delete shortlists')
      }
    }

    useEffect(() => {
      setIsLoading(true)

      const fetchData = async () => {
        async function fetchCompaniesFromDb() {
          const companiesFromDb = await fetchDataFromDb<CompanyMatchEnrichFromDb[]>(
            '/api/db_transactions/fetch_watchlist_entries_from_db'
          )
          if (companiesFromDb) {
            const companiesWithStatus: CompanyMatchEnrichFromDb[] = companiesFromDb.filter(
              company => company.status === 'Enriched'
            )

            setCompanies(companiesWithStatus)
          }

          const { data } = await axios.get<ShortlistTypeFromDb[]>(
            `/api/db_transactions/fetch_shortlists?user_id=${user?.id}`
          )

          const shortlists = data.map(shortlist => ({
            ...shortlist,
            companies: shortlist.companies.map(
              watchlistId => companiesFromDb.find(({ id }) => id === watchlistId) || ({} as CompanyMatchEnrichFromDb)
            )
          }))

          setShortlists(shortlists)

          setIsLoading(false)

          return companiesFromDb.filter(company => company.status === 'Enriched')
        }

        async function fetchProducts() {
          const productsFromDb = await fetchDataFromDb<CompanySearchProductFromDb[]>(
            '/api/db_transactions/fetch_watchlist_entries_from_db?entries=products'
          )

          const productsProjects = await fetchDataFromDb<ProductsProjectType[]>(
            '/api/db_transactions/fetch_product_projects'
          )

          let products

          if (productsFromDb) {
            products = productsFromDb.map(p => ({
              ...p,
              project_name: productsProjects.find(({ watchlist_id }) => p.id === watchlist_id)?.name
            }))

            setProducts(products)
          }

          setIsLoading(false)

          return products || []
        }

        const companies = await fetchCompaniesFromDb()

        const products = await fetchProducts()

        addCompaniesAndProductsFromShortlist(companies, products)
      }

      fetchData()
    }, [])

    return (
      <Box>
        <Box>
          <FormControlLabel
            label='Enriched companies'
            sx={{
              '.MuiTypography-root': {
                fontSize: '16px'
              }
            }}
            control={
              <Checkbox
                checked={showEnrichedCompanies}
                onChange={e => setShowEnrichedCompanies(e.target.checked)}
                sx={{ svg: { width: '32px', height: '32px' } }}
              />
            }
          />

          <FormControlLabel
            label='Saved projects'
            sx={{
              '.MuiTypography-root': {
                fontSize: '16px'
              }
            }}
            control={
              <Checkbox
                checked={showSavedProducts}
                onChange={e => setShowSavedProducts(e.target.checked)}
                sx={{ svg: { width: '32px', height: '32px' } }}
              />
            }
          />
        </Box>

        <DataGrid
          style={{ overflow: 'hidden' }}
          autoHeight={false}
          rows={[...(showEnrichedCompanies ? companies : []), ...(showSavedProducts ? products : [])]}
          columns={shortlistDataGridColumns(showEnrichedCompanies, showSavedProducts)}
          pagination
          checkboxSelection
          disableRowSelectionOnClick
          getRowHeight={() => null}
          onRowSelectionModelChange={s => {
            setSelectedCompanies(
              s.map(id => companies.find(company => company.id === id) || ({} as CompanyMatchEnrichFromDb))
            )
          }}
          rowSelectionModel={selectedCompanies.map(({ id }) => id)}
          loading={isLoading}
          slots={{
            toolbar: () => <GridToolbarFilterButton />
          }}
          sx={{
            height: 500
          }}
        />

        <ShortlistModal
          open={openShortlistModal}
          onClose={() => setOpenShortlistModal(false)}
          handleSubmit={addToShortlist}
          shortlists={shortlists}
          createStageShortlist={createStageShortlist}
          mode={modalMode}
          setToSelected={setSelectedCompanies}
          removeShortlistGroup={removeShortlistGroup}
          removeShortlists={removeShortlists}
        />
      </Box>
    )
  }
)

export default Shortlist
