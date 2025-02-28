import React, { ChangeEvent, MutableRefObject, memo, useEffect, useMemo, useRef, useState } from 'react'
import { Settings } from '../../../d3/settings'
import SelectItemGroup from './components/selectItemGroup'
import Button from '@mui/material/Button'

import NodesModal from './components/NodesModal'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import {
  histogramHierarchyChange,
  resetFilters,
  searchInHistogram,
  updateData,
  updateOnBreadcrumbClick
} from '../../../d3/drawHistogram'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import { useSettings } from 'src/@core/hooks/useSettings'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { Dashboard } from '../../../d3/dashboard'
import { BreadcrumbsType, ICompany, ISize } from '../../../d3/types/interfaces'
import { Box, Grid, Pagination } from '@mui/material'
import CompanyProductsAccordion from '../product_search/components/CompanyProductsAccordion'
import { addCountryAndNaicsData } from 'src/d3/dataPreprocessing/dataMapping'
import CompaniesAnalytics from '../analytics/CompanyAnalytics'
import { CompanyMatchEnrichFromDb, ProductsProjectType } from 'src/types/apps/veridionTypes'
import { useAuth } from 'src/hooks/useAuth'
import Icon from 'src/@core/components/icon'

type ClusterKey = keyof typeof Settings.clusters

type ClusterItem = {
  key: string
  value: any
}

const defaultAutocompleteKeys = {
  geography: 'continent',
  naics: 'naics2_label',
  sector: 'main_sector'
}

function containsWhitespace(str: string) {
  return /\s/.test(str)
}

interface Props {
  companies: ICompany[]
  productsCount: number
  searchBy: 'company_products' | 'company_keywords'
  backButtonHandler: () => void
}

type KeyType = 'Geography' | 'NAICS' | 'Sector/Industry'
type FormattedKeyType = 'geography' | 'naics' | 'sector'

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

interface ValueItem {
  key: KeyType
  value: string[]
}

const filterDisplayedCompaniesByBreadcrumbs = (
  companies: ICompany[],
  fields: { name: string; selectedHierarchy: string }[]
) => {
  const filteredCompanies = companies.filter(item => {
    for (const field of fields) {
      if (item[field.selectedHierarchy] !== field.name) {
        return false
      }
    }

    return true
  })

  return filteredCompanies
}

const keys = {
  Geography: 'geography',
  NAICS: 'naics',
  'Sector/Industry': 'sector'
}

let resetFiltersHandler: any

const GraphSection: React.FC<Props> = memo(({ companies, productsCount, searchBy, backButtonHandler }) => {
  const { user } = useAuth()

  const { settings } = useSettings()
  const [clustersSearch, setClustersSearch] = useState<ClusterItem[]>([])
  const [renderFirst, setRenderFirst] = useState<boolean>(true)
  const [nodeVisible, setNodeVisible] = useState<boolean>(false)
  const [clustersDefault, setClustersDefault] = useState<Record<ClusterKey, string[]> | undefined>(
    Settings.clustersDefault
  )
  const [searchAutocomplete, setSearchAutocomplete] = React.useState({
    geography: [] as string[],
    naics: [] as string[],
    sector: [] as string[]
  })
  const [breadcrumbData, setBreadcrumbData] = React.useState<BreadcrumbsType>({
    geography: [],
    naics: [],
    sector: []
  })
  const [searchAutocompleteCheckValue, setSearchAutocompleteCheckValue] = React.useState({
    geography: '',
    naics: '',
    sector: ''
  })
  const [keyAutocomplete, setKeyAutocomplete] = React.useState(defaultAutocompleteKeys)
  const [page, setPage] = useState<number>(1)
  const [companiesForDisplay, setCompaniesForDisplay] = useState(companies)
  const [savedIds, setSavedIds] = useState<string[] | undefined>(undefined)
  const [productProjects, setProductProjects] = useState<ProductsProjectType[]>([])
  const [value, setValue] = React.useState<string[] | undefined>([])
  const [inputValue, setInputValue] = React.useState('')
  const [productsValue, setProductsValue] = React.useState<string[] | undefined>([])
  const [inputProductsValue, setInputProductsValue] = React.useState('')
  const [view, setView] = useState('list')

  const handleChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const companiesNames = useMemo(() => {
    const map = new Map()
    companies.forEach(({ company_name }) => {
      if (company_name) {
        map.set(company_name, company_name)
      }
    })

    return Array.from(map.values()).sort()
  }, [companies])

  const productsNames = useMemo(() => {
    const map = new Map()
    companies.forEach(({ search_details, company_name }) => {
      if (searchBy === 'company_products') {
        if (search_details.product_match.context.headline) {
          map.set(search_details.product_match.context.headline, search_details.product_match.context.headline)
        }
      } else {
        if (company_name) {
          map.set(company_name, company_name)
        }
      }
    })

    return Array.from(map.values()).sort()
  }, [companies])

  const filteredProducts = useMemo(() => {
    // return companies.filter(c => value && value?.includes(c.company_name))

    return companies.filter(c => {
      let matchesCompanyName = value?.length ? false : productsValue?.length ? false : true

      let matchesProduct = productsValue?.length ? false : value?.length ? false : true

      if (value?.length) {
        if (value.includes(c.company_name)) {
          return true
        }
        matchesCompanyName = false
      }

      if (productsValue?.length) {
        if (productsValue.includes(c.search_details.product_match.context.headline)) {
          return true
        }
        matchesProduct = false
      }

      return matchesCompanyName || matchesProduct
    })
  }, [productsValue, value, companies])

  const refSvg: MutableRefObject<SVGSVGElement | null> = useRef(null)
  const refSvg2: MutableRefObject<SVGSVGElement | null> = useRef(null)
  const refSvgNaics: MutableRefObject<SVGSVGElement | null> = useRef(null)
  const refSvgSector: MutableRefObject<SVGSVGElement | null> = useRef(null)
  const refSvg3 = useRef<HTMLDivElement | null>(null)
  const refDivSvg3 = useRef<HTMLDivElement | null>(null)

  const updateBreadcrumbs = (breadcrumbDataD3: BreadcrumbsType) => {
    setPage(1)

    const allFields = []

    for (const key in breadcrumbDataD3) {
      allFields.push(...breadcrumbDataD3[key as FormattedKeyType])
    }

    setCompaniesForDisplay(filterDisplayedCompaniesByBreadcrumbs(filteredProducts, allFields))

    setBreadcrumbData({ ...breadcrumbDataD3 })
  }

  useEffect(() => {
    if (companies.length > 0) {
      const histogramDivSize: ISize = {
        height: refDivSvg3.current?.offsetHeight,
        width: refDivSvg3.current?.offsetWidth
      }

      const containers = {
        forceContainer: refSvg.current,
        histogramContainer: refSvg2.current,
        naicsHistogramContainer: refSvgNaics.current,
        sectorIndustryHistogramContainer: refSvgSector.current,
        detailsContainer: refSvg3.current
      }

      const dashboard: Dashboard = new Dashboard(
        containers,
        companies,
        renderFirst,
        clustersDefault,
        settings.mode,
        histogramDivSize,
        updateBreadcrumbs,
        (companies: ICompany[]) => setCompaniesForDisplay(companies)
      )

      dashboard.update()

      resetFiltersHandler = dashboard.resetFilters.bind(dashboard)

      setRenderFirst(false)
    }
  }, [companies, clustersDefault, settings.mode, renderFirst, view])

  useEffect(() => {
    if (Settings.clustersDefaultSearchG) {
      let arr: object[] = []
      for (const [key, value] of Object.entries(Settings.clustersDefaultSearchG)) {
        if (key) {
          arr = arr.concat({ key, value })
        }
      }
      setClustersSearch([
        {
          key: 'Hierarchy',
          value: arr as object[]
        }
      ])

      const defaultValues = Object.values(Settings.clustersDefaultSearchG)

      const map: { [key: string]: Map<any, any> } = {}

      defaultValues.forEach(fields => {
        for (let i = 0; i < companies.length; i++) {
          const value = companies[i][fields[0]] as string | undefined
          if (value) {
            if (map[fields[0] as string]) {
              map[fields[0]].set(value, value)
            } else {
              map[fields[0]] = new Map()
              map[fields[0]].set(value, value)
            }
          }
        }
      })

      const getCorrectKey = (key: string) => {
        switch (key) {
          case 'continent':
            return 'geography'
          case 'main_sector':
            return 'sector'
          case 'naics2_label':
            return 'naics'
          default:
            return 'geography'
        }
      }

      const values = Object.entries(map).reduce((prev, next) => {
        prev[getCorrectKey(next[0])] = Array.from(next[1].values())

        return prev
      }, {} as { geography: string[]; naics: string[]; sector: string[] })

      setSearchAutocomplete(values)
    }
  }, [])

  useEffect(() => {
    if (filteredProducts.length) {
      const companiesWithAdditionalField = [...filteredProducts]
      addCountryAndNaicsData(companiesWithAdditionalField)
      setCompaniesForDisplay(companiesWithAdditionalField)
    }

    updateData(filteredProducts)
  }, [filteredProducts])

  const handleChangeProps = (key: string, type: string) => {
    const map = new Map()
    for (let i = 0; i < companies.length; i++) {
      const value = companies[i][key] as string | undefined
      if (value) {
        map.set(value, value)
      }
    }
    setKeyAutocomplete(prev => ({
      ...prev,
      [type]: key || ''
    }))

    histogramHierarchyChange(key || '', type)

    const values = Array.from(map.values())

    setSearchAutocomplete(prev => ({ ...prev, [type]: values }))
  }

  const _renderSearch = (): JSX.Element[] | null => {
    const refs = [refSvg2, refSvgNaics, refSvgSector]

    if (clustersSearch.length) {
      return clustersSearch[0].value.map((item: ValueItem, index: number) => {
        return (
          <React.Fragment key={item.key}>
            <Box className={'contSearch'} sx={{ mt: 2 }}>
              <SelectItemGroup
                data={item}
                handleChangeProps={key => handleChangeProps(key, keys[item.key])}
                key={index}
                value={keyAutocomplete[keys[item.key] as FormattedKeyType]}
              />

              <Autocomplete
                onChange={(e: React.SyntheticEvent, value: string | null) => {
                  const newValue = {
                    ...searchAutocompleteCheckValue,
                    [keys[item.key]]: value || ''
                  }

                  setPage(1)

                  setSearchAutocompleteCheckValue(newValue)

                  searchInHistogram(value || '', keys[item.key])
                }}
                id='free-solo-demo'
                freeSolo
                options={
                  !!searchAutocomplete[keys[item.key as KeyType] as FormattedKeyType]
                    ? searchAutocomplete[keys[item.key as KeyType] as FormattedKeyType].map(option => option)
                    : []
                }
                renderInput={params => <TextField {...params} label='Search' />}
                className='search_input'
                size='small'
              />

              {breadcrumbData[keys[item.key as KeyType] as FormattedKeyType]?.length ? (
                <div
                  role='presentation'
                  style={{ marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'start' }}
                >
                  <Breadcrumbs separator='›' aria-label='breadcrumb'>
                    {_renderBreadcrumbItem(
                      breadcrumbData[keys[item.key as KeyType] as FormattedKeyType].map(({ name }) => name),
                      keys[item.key] as FormattedKeyType
                    )}
                  </Breadcrumbs>
                  <IconButton
                    type='button'
                    sx={{ p: '0px', marginLeft: 1 }}
                    aria-label='search'
                    onClick={() => deleteBreadcrumb(keys[item.key as KeyType] as FormattedKeyType)}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : null}
            </Box>
            <div className='right_cont_block2'>
              <div className='right_cont_block2_1' ref={refDivSvg3}>
                <svg ref={refs[index]} />
              </div>
            </div>
          </React.Fragment>
        )
      })
    }

    return null
  }

  const updateBreadcrumbData = (index: number, type: FormattedKeyType) => {
    const arrSte: string[] = []
    breadcrumbData[type]
      .map(({ name }) => name)
      .slice(0, index + 1)
      .map(str => {
        arrSte.push(str)

        return containsWhitespace(str) ? str.trim().split(/\s+/) : str
      })

    setBreadcrumbData({ ...breadcrumbData, [type]: arrSte })

    updateOnBreadcrumbClick(arrSte, index, type)
  }

  const _renderBreadcrumbItem = (items: string[], type: FormattedKeyType): JSX.Element[] => {
    return items.map((item, index) => {
      return (
        <Link underline='hover' color='inherit' key={index} onClick={() => updateBreadcrumbData(index, type)}>
          {item}
        </Link>
      )
    })
  }

  const deleteBreadcrumb = (type: FormattedKeyType) => {
    const newBreadcrumbs = { ...breadcrumbData, [type]: [] }

    setBreadcrumbData(newBreadcrumbs)

    resetFilters(type)

    histogramHierarchyChange(keyAutocomplete[type], type)
    setPage(1)

    const allFields: {
      name: string
      selectedHierarchy: string
    }[] = []

    for (const key in newBreadcrumbs) {
      allFields.push(...newBreadcrumbs[key as FormattedKeyType])
    }

    setCompaniesForDisplay(filterDisplayedCompaniesByBreadcrumbs(filteredProducts, allFields))
  }

  const openNodesModal = () => {
    setNodeVisible(!nodeVisible)
  }

  const addProductProject = async (company: ICompany | CompanyMatchEnrichFromDb, projectName: string) => {
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
      setSavedIds([...savedIds, company.veridion_id])
    }
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
    return () => {
      resetFiltersHandler('geography')
      resetFiltersHandler('naics')
      resetFiltersHandler('sector')
    }
  }, [])

  return (
    <>
      <div className={'cont'}>
        <div className='right_cont'>
          <CompaniesAnalytics companies={companies} productsCount={productsCount} limit={user?.max_product_limit} />

          {_renderSearch()}
        </div>

        <div className='cont_b1'>
          <Grid xs={12} container item spacing={4} mb={4}>
            <Grid xs={12} item sx={{ display: 'grid', gridTemplateColumns: '2fr 3fr' }}>
              <Button
                variant='contained'
                startIcon={<Icon icon='material-symbols:arrow-back' />}
                sx={{ width: 188 }}
                onClick={backButtonHandler}
              >
                Back to Search
              </Button>

              <Box sx={{ position: 'relative', display: 'flex', gap: 4 }}>
                <Button
                  variant={view === 'list' ? 'contained' : 'outlined'}
                  onClick={() => {
                    if (view !== 'list') {
                      setView('list')
                      setPage(1)
                    }
                  }}
                >
                  List
                </Button>

                <Button
                  variant={view === 'graph' ? 'contained' : 'outlined'}
                  onClick={() => {
                    if (view !== 'graph') {
                      setView('graph')
                      setPage(1)
                    }
                  }}
                >
                  Graph
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                size='small'
                options={companiesNames}
                renderInput={params => <TextField {...params} variant='outlined' label='Select company names' />}
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

            {searchBy === 'company_products' && (
              <Grid item xs={12} md={6}>
                <Autocomplete
                  size='small'
                  options={productsNames}
                  renderInput={params => <TextField {...params} variant='outlined' label='Select product names' />}
                  filterSelectedOptions
                  multiple
                  value={productsValue}
                  inputValue={inputProductsValue}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setProductsValue(newValue)
                    }
                  }}
                  onInputChange={(_, newInputValue: string) => {
                    setInputProductsValue(newInputValue)
                  }}
                />
              </Grid>
            )}
          </Grid>

          {view === 'list' ? (
            <>
              <Box>
                {!!savedIds &&
                  companiesForDisplay
                    .slice((page - 1) * 10, (page - 1) * 10 + 10)
                    .map(company => (
                      <CompanyProductsAccordion
                        key={company.veridion_id}
                        company={company}
                        saved={!!savedIds?.includes(company.veridion_id)}
                        projects={productProjects}
                        addProductProject={addProductProject}
                        changeSavedIds={setSavedIds}
                        searchBy={searchBy}
                      />
                    ))}

                <Pagination
                  count={Math.ceil(companiesForDisplay.length / 10)}
                  page={page}
                  onChange={handleChange}
                  color='primary'
                  sx={{
                    '.MuiPagination-ul': {
                      justifyContent: 'center'
                    }
                  }}
                />
              </Box>
            </>
          ) : (
            <>
              <div className={'contSelect'}>
                <Button id='nodesButton' variant='contained' onClick={openNodesModal} sx={{ padding: '12px', mt: 10 }}>
                  Nodes
                </Button>
              </div>

              <Box mt={6} sx={{ border: '1px solid #FBB03B', borderRadius: 4 }}>
                <svg ref={refSvg} />
              </Box>

              {!!savedIds &&
                companiesForDisplay
                  .slice((page - 1) * 5, (page - 1) * 5 + 5)
                  .map(company => (
                    <CompanyProductsAccordion
                      key={company.veridion_id}
                      company={company}
                      saved={!!savedIds?.includes(company.veridion_id)}
                      projects={productProjects}
                      addProductProject={addProductProject}
                      changeSavedIds={setSavedIds}
                      searchBy={searchBy}
                    />
                  ))}

              <Pagination
                count={Math.ceil(companiesForDisplay.length / 5)}
                page={page}
                onChange={handleChange}
                color='primary'
                sx={{
                  '.MuiPagination-ul': {
                    justifyContent: 'center'
                  }
                }}
              />
            </>
          )}
        </div>

        <NodesModal
          open={nodeVisible}
          handleClose={() => setNodeVisible(false)}
          handleApply={data => {
            setClustersDefault(data)
            setNodeVisible(false)
          }}
        />
      </div>
    </>
  )
})

export default GraphSection
