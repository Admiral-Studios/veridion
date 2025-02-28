import { Autocomplete, Box, Button, Link, Pagination, TextField, Tooltip, Typography } from '@mui/material'
import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import CompanyCard from './CompanyCard'
import Icon from 'src/@core/components/icon'
import { CompanySearchProductType, CompanyType, ProductsProjectType } from 'src/types/apps/veridionTypes'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import nProgress from 'nprogress'
import MoreDataModal from './MoreDataModal'
import { addThousandsDelimiter } from 'src/utils/numbers/addThousandsDelimeter'

type Props = {
  companies: CompanySearchProductType[]
  total: number
  disableSaving?: boolean
}

const inputCompanyInitialState = {
  commercial_names: [],
  legal_names: [],
  address_txt: '',
  phone_number: '',
  website: '',
  email: '',
  facebook_url: '',
  linkedin_url: ''
}

const MAX_SAVE_LIMIT = 100

const CompaniesList: FC<Props> = ({ companies, total, disableSaving = false }) => {
  const { user } = useAuth()

  const [moreData, setMoreData] = useState<CompanySearchProductType | null>(null)
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [savedIds, setSavedIds] = useState<string[] | undefined>(undefined)
  const [productProjects, setProductProjects] = useState<ProductsProjectType[]>([])
  const [openTooltip, setOpenTooltip] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [createMode, setCreateMode] = useState(false)
  const [page, setPage] = useState<number>(1)

  const [projectName, setProjectName] = useState<ProductsProjectType | null>(null)
  const [inputProjectValue, setInputProjectValue] = useState('')

  const [newProjectName, setNewProjectName] = useState('')

  const moreButtonHandler = (company: CompanySearchProductType) => {
    setMoreData(company)
  }

  const handleChangePage = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const selectAll = () => {
    if (companies.length !== selectedCompanies.length) {
      const allCompaniesIds = companies.map(({ veridion_id }) => veridion_id).filter(id => !savedIds?.includes(id))

      setSelectedCompanies(allCompaniesIds)
    }
  }

  const resetAll = () => {
    if (selectedCompanies.length !== 0) {
      setSelectedCompanies([])
    }
  }

  const handleSelect = (id: string) => {
    if (selectedCompanies.includes(id)) {
      setSelectedCompanies(selectedCompanies.filter(companyId => companyId !== id))
    } else {
      setSelectedCompanies([...selectedCompanies, id])
    }
  }

  const addProductProject = async (company: CompanySearchProductType | CompanyType, projectName: string) => {
    if (savedIds && MAX_SAVE_LIMIT <= savedIds?.length) {
      throw new Error('exceeding the limit')
    }

    const res = await fetch('/api/db_transactions/save_enriched_product_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputData: inputCompanyInitialState,
        enrichedData: {
          search_details: {
            product_match: {
              context: {
                headline: '',
                content: '',
                url: '',
                snippets: []
              },
              supplier_types: []
            }
          },
          ...company,
          status: 'Enriched',
          api_error: '',
          input_file_name: '',
          is_product: true
        }
      })
    })

    const data: { id: number } = await res.json()

    const addProjectRes = await fetch('/api/db_transactions/add_product_project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: data.id,
        name: projectName
      })
    })

    const newProjectId = await addProjectRes.json()

    if (!productProjects.find(({ name }) => name === projectName)) {
      setProductProjects(prev => [
        ...prev,
        {
          id: newProjectId,
          name: projectName,
          watchlist_id: data.id,
          user_id: user?.id || 0,
          created_at: '',
          updated_at: ''
        }
      ])
    }

    if (savedIds) {
      setSavedIds(prev => (prev ? [...prev, company.veridion_id] : [...savedIds, company.veridion_id]))
    }
  }

  const saveProductsToWatchlist = async () => {
    setOpenTooltip(false)
    setLoadingSave(true)
    nProgress.start()
    try {
      for (let i = 0; i < selectedCompanies.length; i++) {
        const company = companies.find(({ veridion_id }) => selectedCompanies[i] === veridion_id)

        if (company) {
          await addProductProject(company, createMode ? newProjectName : projectName?.name || '')
        }
      }

      setProjectName(null)
      setNewProjectName('')
      setInputProjectValue('')

      setLoadingSave(false)

      toast.success('Companies saved to watchlist')

      setSelectedCompanies([])
      setCreateMode(false)
    } catch (e: any) {
      if (e.message === 'exceeding the limit') {
        toast.error(
          <Box>
            You saved 100 companies. If you want to save more, please contact{' '}
            <Link href='mailto:sales@veridion.com'>sales@veridion.com</Link>.
          </Box>
        )
      } else {
        toast.error('Failed to save companies to watchlist')
      }

      setLoadingSave(false)
    }
    nProgress.done()
  }

  useEffect(() => {
    const fetchSavedIdsAndProjects = async () => {
      const res = await (await fetch('/api/db_transactions/fetch_products_ids')).json()

      const projects = await (await fetch('/api/db_transactions/fetch_product_projects')).json()

      const unique: ProductsProjectType[] = []

      projects.forEach((r: any) => {
        if (!unique.find(u => u.name === r.name)) {
          unique.push(r)
        }
      })

      setSavedIds(res)

      setProductProjects(unique)
    }

    fetchSavedIdsAndProjects()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [total])

  return (
    <>
      <Box>
        <Box mt={8} sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              pb: 4,
              borderBottom: '1px solid #ececec'
            }}
          >
            <Typography variant='h3' fontWeight={600}>
              <Typography variant='h3' sx={{ display: 'inline', color: '#fbb03b' }}>
                {companies.length}
              </Typography>
              /
              <Typography variant='h3' sx={{ display: 'inline', color: '#fbb03b' }}>
                {`${addThousandsDelimiter(total)} `}
              </Typography>
              Retrieved Companies
            </Typography>

            {!disableSaving && (
              <Tooltip
                PopperProps={{
                  sx: {
                    '.MuiTooltip-tooltip': {
                      background: '#fff',
                      boxShadow: '0px 2px 6px 0px rgba(47, 43, 61, 0.14);',
                      minWidth: '284px'
                    }
                  },
                  onClick: e => {
                    e.stopPropagation()
                  }
                }}
                open={openTooltip}
                title={
                  <Box>
                    <Typography>Add items to project</Typography>

                    {!createMode ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Autocomplete
                          options={[
                            ...productProjects,
                            {
                              id: 0,
                              watchlist_id: 0,
                              user_id: 0,
                              created_at: '',
                              updated_at: '',
                              name: 'add_new'
                            }
                          ]}
                          sx={{ my: 2 }}
                          fullWidth
                          onClick={e => {
                            e.stopPropagation()
                          }}
                          value={projectName}
                          getOptionLabel={option => option.name}
                          inputValue={inputProjectValue}
                          onChange={(_, newValue) => {
                            if (newValue) {
                              setProjectName(newValue)
                            }
                          }}
                          onInputChange={(_, newInputValue: string) => {
                            setInputProjectValue(newInputValue)
                          }}
                          disablePortal
                          renderOption={(props, option) =>
                            option.id === 0 && option.name === 'add_new' ? (
                              <li
                                {...props}
                                onClick={e => {
                                  e.stopPropagation()
                                  setCreateMode(true)
                                }}
                              >
                                <Icon icon='mdi:plus' color='#FBB03B' style={{ marginRight: 2 }} />
                                Add New
                              </li>
                            ) : (
                              <li {...props} data-option={option.id}>
                                {option.name}
                              </li>
                            )
                          }
                          renderInput={params => (
                            <TextField
                              {...params}
                              variant='outlined'
                              label='Select existing project'
                              size='small'
                              fullWidth
                              onClick={e => {
                                e.stopPropagation()
                              }}
                            />
                          )}
                        />
                      </Box>
                    ) : (
                      <TextField
                        size='small'
                        placeholder='New project name'
                        fullWidth
                        sx={{ my: 2 }}
                        value={newProjectName}
                        onChange={e => setNewProjectName(e.target.value)}
                      />
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Button
                        onClick={e => {
                          e.stopPropagation()
                          setOpenTooltip(false)
                          setCreateMode(false)
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant='contained'
                        onClick={e => {
                          e.stopPropagation()
                          saveProductsToWatchlist()
                        }}
                        disabled={createMode ? !newProjectName : !projectName}
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>
                }
              >
                <Button
                  disabled={!selectedCompanies.length || loadingSave}
                  startIcon={<Icon icon='material-symbols:list' />}
                  onClick={e => {
                    e.stopPropagation()
                    setOpenTooltip(true)
                  }}
                >
                  Add to list
                </Button>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Box mb={4}>
          <Button onClick={selectAll}>Select all</Button>

          <Button onClick={resetAll}>Reset selection</Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {companies.slice((page - 1) * 10, (page - 1) * 10 + 10).map(company => (
            <CompanyCard
              key={company.veridion_id}
              company={company}
              onClickMoreButton={moreButtonHandler}
              selected={selectedCompanies.includes(company.veridion_id)}
              handleSelect={handleSelect}
              saved={!!savedIds?.includes(company.veridion_id)}
            />
          ))}
        </Box>

        <Pagination
          count={Math.ceil(companies.length / 10)}
          page={page}
          onChange={handleChangePage}
          color='primary'
          sx={{
            mt: 2,
            '.MuiPagination-ul': {
              justifyContent: 'center'
            }
          }}
        />
      </Box>

      <MoreDataModal moreData={moreData} onClose={() => setMoreData(null)} />
    </>
  )
}

export default CompaniesList
