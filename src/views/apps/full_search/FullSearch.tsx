import { Alert, Box, Button, Card, CardContent, IconButton, Skeleton, Tab, Typography } from '@mui/material'
import React, { memo, SyntheticEvent, useState } from 'react'
import Icon from 'src/@core/components/icon'
import FilterItem from './components/FilterItem'
import { AllFiltersType } from './types/enums'
import AddFilterButton from './components/AddFilterButton'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useFilterStore } from './store/filterStore'
import { prepareFilter } from './utils/prepareFilter'
import nProgress from 'nprogress'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import toast from 'react-hot-toast'
import NoFiltersIcon from 'src/shared/icons/NoFiltersIcon'
import CompaniesList from './components/CompaniesList'
import { CompanySearchProductType } from 'src/types/apps/veridionTypes'
import SaveTemplateDialogWithButton from './components/SaveTemplateDialog'
import AiSection from './components/AiSection'
import LogicBox from './components/LogicBox'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import FilterTemplates from './components/FilterTemplates'
import { setFilterFromJson } from './utils/setFilterFromJson'
import CompanyCard from './components/CompanyCard'
import MoreDataModal from './components/MoreDataModal'
import { useAuth } from 'src/hooks/useAuth'
import SavedLists from './components/SavedLists'
import NewJsonEditor from 'src/shared/components/NewJsonEditor'

const pageSizeSteps = [10, 50, 100, 500, 1000, 5000]

const DEFAULT_LIMIT = 5000

const FullSearch = memo(() => {
  const { user } = useAuth()
  const { data, params, onRemoveParam, resetAll, operator, onChangeOperator } = useFilterStore()

  const allParams = Object.keys(data) as AllFiltersType[]

  const [pageSize, setPageSize] = useState(10)
  const [companies, setCompanies] = useState<CompanySearchProductType[]>([])
  const [apiKey, setApiKey] = useState('')
  const [searchError, setSearchError] = useState('')
  const [isApiKeyError, setIsApiKeyError] = useState(false)
  const [searchVariant, setSearchVariant] = useState('search')
  const [jsonRes, setJsonRes] = useState('')
  const [activeTab, setActiveTab] = useState('discover')
  const [previewCompanies, setPreviewCompanies] = useState<CompanySearchProductType[]>([])
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [morePreviewData, setMorePreviewData] = useState<CompanySearchProductType | null>(null)
  const [productsCount, setProductsCount] = useState(0)
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)

  const handleApiKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isApiKeyError) {
      setIsApiKeyError(false)
    }
    setApiKey(e.target.value)
  }

  const removeParam = (param: AllFiltersType) => {
    onRemoveParam(param)
  }

  const runSearch = async (preview?: boolean, nextToken?: string, companiesCurrentLength?: number) => {
    setIsLoadingCompanies(true)

    const data = useFilterStore.getState().data

    const filter = prepareFilter(params, data, operator)

    let companiesLength = companiesCurrentLength || 0

    if (companiesLength === 0 && companies.length > 0) {
      setCompanies([])
    }

    nProgress.start()

    if (preview) {
      setIsLoadingPreview(true)
    }

    try {
      const maxUserLimit = (user && user?.max_product_limit >= 100 ? 100 : user?.max_product_limit) || 0

      const res = await axios.post(
        `/api/veridion/company_search?pagination_token=${nextToken || ''}&page_size=${
          pageSize <= maxUserLimit ? pageSize : maxUserLimit
        }`,
        {
          filters: searchVariant === 'search' ? JSON.stringify(filter) : jsonRes
        },
        {
          headers: {
            Authorization: jwt.sign(
              { apiKey: preview ? process.env.NEXT_PUBLIC_VERIDION_PRESENTATION_API_KEY : apiKey },
              process.env.NEXT_PUBLIC_JWT_SECRET || ''
            )
          }
        }
      )

      setProductsCount(res.data.count)

      companiesLength += res.data.result.length

      if (!res.data.result.length) {
        toast.error('No products found. Please try different search terms')
      }

      if (preview) {
        setPreviewCompanies(res.data.result.slice(0, 3))
      } else {
        setPreviewCompanies([])

        if (companiesCurrentLength === 0) {
          setCompanies(() => [...res.data.result])
        } else {
          setCompanies(prev => [...prev, ...res.data.result])
        }
        await new Promise(resolve => setTimeout(resolve, 1000))

        const next = res.data?.pagination?.next

        if (next && companiesLength < pageSize && companiesLength < (user?.max_product_limit || DEFAULT_LIMIT)) {
          runSearch(false, next, companiesLength)
        }
      }

      nProgress.done()
      setIsLoadingCompanies(false)
    } catch (error: any) {
      const message = error.response.data.message

      if (message === 'Missing or invalid authorization key.') {
        toast.error(message)
      } else {
        setSearchError(message)
      }

      nProgress.done()
      setIsLoadingCompanies(false)
    }

    if (preview) {
      setIsLoadingPreview(false)
    }
  }

  const handleChangeSearchVariant = (variant: string) => {
    if (variant !== searchVariant) {
      if (variant === 'search') {
        const filters = JSON.parse(jsonRes)?.filters

        if (filters) {
          const newOperator = filters?.and ? 'and' : 'or'

          onChangeOperator(newOperator)

          resetAll()

          setFilterFromJson(filters, newOperator)
        }
      }

      if (variant === 'json') {
        const data = useFilterStore.getState().data

        setJsonRes(JSON.stringify(prepareFilter(params, data, operator), null, 2))
      }

      setSearchVariant(variant)
    }
  }

  const increasePageSize = () => {
    let next: any

    pageSizeSteps.forEach(s => {
      if (s > pageSize && !next) {
        next = s
      }
    })

    if (next) {
      setPageSize(next)
    }
  }

  const decreasePageSize = () => {
    let next

    pageSizeSteps.forEach(s => {
      if (s < pageSize) {
        next = s
      }
    })

    if (next) {
      setPageSize(next)
    }
  }

  const handleChangeTab = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  const onSelectJsonTemplate = (jsonFilter: string) => {
    setActiveTab('discover')

    if (searchVariant === 'search') {
      const filters = JSON.parse(jsonFilter)?.filters

      if (filters) {
        const newOperator = filters?.and ? 'and' : 'or'

        onChangeOperator(newOperator)

        resetAll()

        setFilterFromJson(filters, newOperator)
      }
    } else {
      setJsonRes(JSON.stringify(JSON.parse(jsonFilter), null, 2))
    }
  }

  const moreButtonHandler = (company: CompanySearchProductType) => {
    setMorePreviewData(company)
  }

  const enableChangingOperator = !params.includes('company_keywords') && !params.includes('company_products')

  return (
    <>
      <Box sx={{ height: '100%' }}>
        <TabContext value={activeTab}>
          <TabList
            variant='scrollable'
            onChange={handleChangeTab}
            aria-label='full search tabs'
            scrollButtons={false}
            sx={{
              mb: 6,
              '.MuiTabs-flexContainer': {
                justifyContent: 'flex-end'
              }
            }}
          >
            <Tab value='discover' label='Discover Companies' />

            <Tab value='templates' label='Filter Templates' />

            <Tab value='lists' label='Saved Lists' />
          </TabList>

          <TabPanel sx={{ p: 0 }} value='discover'>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CustomTextField
                value={apiKey}
                onChange={handleApiKeyInputChange}
                placeholder='Enter API key to activate supplier discovery'
                error={isApiKeyError}
                translate='no'
                autoComplete='off'
                type='password'
                sx={{ width: '100%', '.MuiInputBase-root': { width: '100%' }, mb: 4 }}
              />
              {searchError && (
                <Alert
                  severity='error'
                  sx={{ mt: 4 }}
                  action={
                    <IconButton size='small' color='inherit' aria-label='close' onClick={() => setSearchError('')}>
                      <Icon icon='tabler:x' />
                    </IconButton>
                  }
                >
                  {searchError}
                </Alert>
              )}

              <AiSection apiKey={apiKey} />

              <Card sx={{ width: '100%' }}>
                <CardContent sx={{ p: 10 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h3'>Filters</Typography>

                    <Box>
                      <Button
                        startIcon={<Icon icon={searchVariant === 'search' ? 'mdi:code-json' : 'bi:ui-radios'} />}
                        color='info'
                        onClick={() => handleChangeSearchVariant(searchVariant === 'search' ? 'json' : 'search')}
                      >
                        {searchVariant === 'search' ? 'View JSON' : 'View UI'}
                      </Button>

                      <SaveTemplateDialogWithButton
                        operator={operator}
                        searchVariant={searchVariant}
                        disabled={!params.length}
                      />

                      <Button startIcon={<Icon icon='material-symbols:redo-rounded' />} color='info' onClick={resetAll}>
                        Reset
                      </Button>
                    </Box>
                  </Box>

                  {searchVariant === 'search' ? (
                    <Box
                      sx={{
                        padding: '16px 16px 16px 48px',
                        mt: 4,
                        borderRadius: 2,
                        border: '1px solid #F2F2F2',
                        position: 'relative'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                        {params.map((param: any) => {
                          if (typeof param === 'string') {
                            return <FilterItem key={param} type={param as AllFiltersType} removeItem={removeParam} />
                          }

                          return (
                            <LogicBox
                              key={param.id}
                              operator={param.operator}
                              params={allParams}
                              childParams={param.params}
                              index={param.id}
                            />
                          )
                        })}

                        <AddFilterButton params={allParams} />
                      </Box>

                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '0',
                          transform: 'translate(-50%, -50%)',
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#F2F2F2',
                          p: 2,
                          color: '#000',
                          borderRadius: 2,
                          textTransform: 'uppercase',
                          cursor: enableChangingOperator ? 'pointer' : 'auto'
                        }}
                        onClick={() => enableChangingOperator && onChangeOperator(operator === 'and' ? 'or' : 'and')}
                      >
                        {operator}
                        <Icon icon='mdi:exchange' color='#000' />
                      </Box>
                    </Box>
                  ) : (
                    <Box mt={4}>
                      <NewJsonEditor jsonRes={jsonRes} onChange={(v: string) => setJsonRes(v)} />
                    </Box>
                  )}

                  <Box
                    mt={4}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Button
                      startIcon={<Icon icon='mdi:play-box-outline' />}
                      color='info'
                      onClick={() => runSearch(true)}
                      disabled={!params.length}
                    >
                      Preview
                    </Button>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                      }}
                    >
                      <Box
                        sx={{
                          color: '#00CFE8'
                        }}
                      >
                        Show first{' '}
                        <IconButton onClick={decreasePageSize}>
                          <Icon icon='mdi:minus' color='#00CFE8' />
                        </IconButton>{' '}
                        <Typography
                          component='span'
                          sx={{
                            border: '1px solid #ececec',
                            borderRadius: 2,
                            py: 0.5,
                            px: 3
                          }}
                        >
                          {pageSize}
                        </Typography>
                        <IconButton onClick={increasePageSize}>
                          <Icon icon='mdi:plus' color='#00CFE8' />
                        </IconButton>{' '}
                        results
                      </Box>

                      <Button
                        disabled={!apiKey || !params.length}
                        startIcon={<Icon icon='mdi:search' />}
                        color='info'
                        variant='contained'
                        onClick={() => runSearch(false)}
                      >
                        Run Search
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {isLoadingPreview && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 6 }}>
                  <Skeleton sx={{ width: '100%', height: '200px', transform: 'none' }} />

                  <Skeleton sx={{ width: '100%', height: '200px', transform: 'none' }} />

                  <Skeleton sx={{ width: '100%', height: '200px', transform: 'none' }} />
                </Box>
              )}

              {!!previewCompanies.length && (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 6 }}>
                    {previewCompanies.map(company => (
                      <CompanyCard
                        key={company.veridion_id}
                        company={company}
                        selected={false}
                        saved={false}
                        preview
                        onClickMoreButton={moreButtonHandler}
                      />
                    ))}
                  </Box>

                  <MoreDataModal moreData={morePreviewData} onClose={() => setMorePreviewData(null)} preview />
                </>
              )}

              {!companies.length && !isLoadingPreview && !previewCompanies.length ? (
                isLoadingCompanies ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 6 }}>
                    <Skeleton sx={{ width: '100%', height: '200px', transform: 'none' }} />

                    <Skeleton sx={{ width: '100%', height: '200px', transform: 'none' }} />

                    <Skeleton sx={{ width: '100%', height: '200px', transform: 'none' }} />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      flexGrow: 1,
                      mt: 8
                    }}
                  >
                    {
                      <>
                        <NoFiltersIcon />
                        <Typography sx={{ mt: 6, color: '#BEBEBE', fontWeight: 500, fontSize: '36px' }}>
                          No filters applied.
                        </Typography>
                        <Typography sx={{ mt: 1, color: '#DBDBDB', fontWeight: 500, fontSize: '24px' }}>
                          Please add the filter value to view results.
                        </Typography>
                      </>
                    }
                  </Box>
                )
              ) : (
                !!companies.length && <CompaniesList companies={companies} total={productsCount} />
              )}
            </Box>
          </TabPanel>

          <TabPanel sx={{ p: 0 }} value='templates'>
            <FilterTemplates onSelectJsonTemplate={onSelectJsonTemplate} />
          </TabPanel>

          <TabPanel sx={{ p: 0 }} value='lists'>
            <SavedLists />
          </TabPanel>
        </TabContext>
      </Box>
    </>
  )
})

export default FullSearch
