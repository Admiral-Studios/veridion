import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'

import Icon from 'src/@core/components/icon'

import CustomTextField from 'src/@core/components/mui/text-field'
import nProgress from 'nprogress'
import { ICompany } from 'src/d3/types/interfaces'

import GraphSection from 'src/views/apps/d3_graph_section/GraphSection'
import toast from 'react-hot-toast'
import Shortlist from 'src/views/apps/product_search/Shortlist'
import {
  CompanySearchProductFromDb,
  CompanyMatchEnrichFromDb,
  ThreadFromDb,
  ThreadType
} from 'src/types/apps/veridionTypes'
import { useAuth } from 'src/hooks/useAuth'
import StepperIndicator from './components/StepperIndicator'
import OperandsInput from '../../../shared/components/OperandsInput'
import { generalStrictnessLabels, generalStrictnessTitles, locationStrictnessLabels } from './configs/labels'
import { CountryType, countriesMapping } from './configs/countriesMapping'
import CountrySelector from './components/CountrySelector'
import { getPromptMessage } from './configs/promptMessageConfiguration'
import MessagesList from './components/MessagesList'
import JsonEditor from './components/JsonEditor'
import { getNumberOfCompaniesToReturn } from './utils/utils'
import Badge from 'src/@core/components/mui/badge'
import Image from 'next/image'
import Banner from './components/Banner'

const DEFAULT_LIMIT = 5000

const getJsonFromEditor = () => {
  const editorNodes = document.querySelector('#json-editor')?.children

  let json = ''

  if (editorNodes?.length) {
    for (let i = 0; i < editorNodes?.length; i++) {
      const node = editorNodes[i]
      if (node?.tagName === 'SPAN') {
        json += editorNodes[i].textContent
      }
    }
  }

  const formattedJson = json.replace(/'/g, '"').replace(/(\w+):/g, '"$1":')

  return formattedJson
}

const SearchPageScreen = () => {
  const { user, trackOnClick } = useAuth()

  const isDpwadamRole = user?.role === 'dpwadam'

  const numberOfCompanies = getNumberOfCompaniesToReturn(user?.role || '')

  const [naturalValue, setNaturalValue] = useState('')
  const [isLoadingJsonResponse, setIsLoadingJsonResponse] = useState(false)
  const [jsonRes, setJsonRes] = useState('')
  const [editorValue, setEditorValue] = useState('')
  const [isApiKeyError, setIsApiKeyError] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [searchError, setSearchError] = useState('')
  const [companies, setCompanies] = useState<ICompany[]>([])
  const [isPendingMatchRequest, setIsPendingMatchRequest] = useState(false)
  const [selectedCompaniesFromWatchlist, setSelectedCompaniesFromWatchlist] = useState<
    (CompanyMatchEnrichFromDb | CompanySearchProductFromDb)[]
  >([])
  const [threads, setThreads] = useState<ThreadType[]>([])
  const [activeStep, setActiveStep] = useState<number>(0)
  const [messages, setMessages] = useState<string[]>([])
  const [selectedThreadId, setSelectedThreadId] = useState<number | null | ''>('')
  const [loadingInsertQuery, setLoadingInsertQuery] = useState(false)
  const [productsCount, setProductsCount] = useState(0)
  const [isOpenSubjectModal, setIsOpenSubjectModal] = useState(false)
  const [subject, setSubject] = useState('')
  const [searchVariant, setSearchVariant] = useState('search')
  const [inputOperands, setInputOperands] = useState<string[]>([])
  const [excludeOperands, setExcludeOperands] = useState<string>('')
  const [supplierTypes, setSupplierTypes] = useState<string[]>([])
  const [geographyIn, setGeographyIn] = useState<CountryType[]>([])
  const [geographyNotIn, setGeographyNotIn] = useState<CountryType[]>([])
  const [strictness, setStrictness] = useState<number>(2)
  const [inStrictness, setInStrictness] = useState<number>(3)
  const [notInStrictness, setNotInStrictness] = useState<number>(3)
  const [searchBy, setSearchBy] = useState<'company_products' | 'company_keywords'>('company_products')
  const [showCompaniesDatagrid, setShowCompaniesDatagrid] = useState(false)
  const [savedCompaniesAndProducts, setSavedCompaniesAndProducts] = useState<{
    companies: CompanyMatchEnrichFromDb[]
    products: CompanySearchProductFromDb[]
  }>({ companies: [], products: [] })
  const [showWorkspace, setShowWorkspace] = useState(false)
  const [numberToReturn, setNumbersToReturn] = useState(numberOfCompanies[numberOfCompanies.length - 1])
  const [gifUrl, setGifUrl] = useState('')
  const [openYoutubeModal, setOpenYoutubeModal] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const isMdScreen = useMediaQuery('(max-width: 900px)')

  const handleApiKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isApiKeyError) {
      setIsApiKeyError(false)
    }
    setApiKey(e.target.value)
  }

  const resetAll = () => {
    setInputOperands([])
    setExcludeOperands('')
    setSupplierTypes([])
    setStrictness(2)
    setGeographyIn([])
    setInStrictness(3)
    setNotInStrictness(3)
    setGeographyNotIn([])
    setSelectedCompaniesFromWatchlist([])
    setMessages([])
    setNaturalValue('')
    setSelectedThreadId(null)
  }

  const stageReset = () => {
    setInputOperands([])
    setExcludeOperands('')
    setStrictness(2)
    setInStrictness(3)
    setNotInStrictness(3)
    setGeographyIn([])
    setGeographyNotIn([])
    setExcludeOperands('')
  }

  const updateSearchFilter = (filter: string) => {
    if (filter) {
      const filters = JSON.parse(filter).filters?.and

      if (filters) {
        const getCountryValues = (values: any) => {
          const result: CountryType[] = []

          values.forEach((c: any) => {
            const foundCountry = countriesMapping.find(
              ({ country_code }) => country_code.toLowerCase() === c.country.toLowerCase()
            )

            if (foundCountry) {
              result.push(foundCountry)
            }
          })

          return result
        }

        filters.forEach((filter: any) => {
          if (filter.attribute === 'company_products' || filter.attribute === 'company_keywords') {
            const operands = filter.value.match?.operands?.length
              ? filter.value.match.operands.map((o: any) => o.operands.join(', '))
              : []

            setInputOperands(operands)

            if (filter.value.exclude?.operands) {
              console.log(filter.value.exclude?.operands)
              if (typeof filter.value.exclude?.operands[0] === 'string') {
                setExcludeOperands(filter.value.exclude.operands.join(', '))
              } else {
                setExcludeOperands(filter.value.exclude.operands[0].operands.join(', '))
              }
            } else {
              setExcludeOperands('')
            }

            if (filter.supplier_types?.length) {
              setSupplierTypes([...filter.supplier_types])
            }

            setStrictness(filter.strictness)

            const attribute = filter?.attribute

            if (attribute) {
              if (attribute === 'company_products') {
                setSearchBy('company_products')
              } else {
                setSearchBy('company_keywords')
              }
            }
          }

          if (filter.relation === 'in' && filter.attribute === 'company_location') {
            const countriesIn = getCountryValues(filter.value)

            setGeographyIn(countriesIn)

            if (filter.strictness) {
              setInStrictness(filter.strictness)
            }
          }

          if (filter.relation === 'not_in' && filter.attribute === 'company_location') {
            const countriesNotIn = getCountryValues(filter.value)

            setGeographyNotIn(countriesNotIn)

            if (filter.strictness) {
              setNotInStrictness(filter.strictness)
            }
          }

          if (filter.relation === 'in' && filter.attribute === 'company_website') {
            if (filter.value.length) {
              const companiesFromDomains: (CompanyMatchEnrichFromDb | CompanySearchProductFromDb)[] = []

              filter.value.forEach((v: string) => {
                const foundCompany = [
                  ...savedCompaniesAndProducts.companies,
                  ...savedCompaniesAndProducts.products
                ].find(({ website_domain }) => website_domain === v)

                if (foundCompany) companiesFromDomains.push(foundCompany)
              })

              if (companiesFromDomains.length) {
                setSelectedCompaniesFromWatchlist(companiesFromDomains)
              }
            }
          }
        })
      } else {
        resetAll()
      }
    }

    return filter
  }

  const updateJsonFilter = () => {
    if (!inputOperands.length && !excludeOperands.length) {
      setJsonRes(JSON.stringify({}))

      setEditorValue(JSON.stringify({}))

      return
    }

    const filter = {
      filters: {
        and: [] as any[]
      }
    }

    if (inputOperands.length || excludeOperands.length) {
      const objToAdd: any = {
        attribute: searchBy,
        relation: 'match_expression',
        value: {}
      }

      if (inputOperands.length) {
        objToAdd.value.match = {
          operator: 'and',
          operands: inputOperands.map(o => ({ operator: 'or', operands: o.split(',').map(o => o.trim()) }))
        }
      }

      if (excludeOperands.length) {
        objToAdd.value.exclude = {
          operator: 'and',
          operands: [{ operator: 'or', operands: excludeOperands.split(',').map(o => o.trim()) }]
        }
      }

      if (strictness !== undefined) {
        objToAdd.strictness = strictness
      }

      if (supplierTypes.length) {
        objToAdd.supplier_types = supplierTypes
      }

      filter.filters.and.push(objToAdd)
    }

    if (geographyIn.length) {
      const objToAdd: any = {
        attribute: 'company_location',
        relation: 'in',
        value: geographyIn.map(g => ({ country: g.country_code.toUpperCase() }))
      }

      if (inStrictness !== undefined) {
        objToAdd.strictness = inStrictness
      }

      filter.filters.and.push(objToAdd)
    }

    if (geographyNotIn.length) {
      const objToAdd: any = {
        attribute: 'company_location',
        relation: 'not_in',
        value: geographyNotIn.map(g => ({ country: g.country_code.toUpperCase() }))
      }

      if (notInStrictness !== undefined) {
        objToAdd.strictness = notInStrictness
      }

      filter.filters.and.push(objToAdd)
    }

    if (selectedCompaniesFromWatchlist.length) {
      const objToAdd: any = {
        attribute: 'company_website',
        relation: 'in',
        value: selectedCompaniesFromWatchlist.map(({ website_domain }) => website_domain)
      }

      filter.filters.and.push(objToAdd)
    }

    setEditorValue(JSON.stringify(filter))
    setJsonRes(JSON.stringify(filter))

    return filter
  }

  const sendNaturalQuery = async (variationsPrompt?: string) => {
    nProgress.start()
    setIsLoadingJsonResponse(true)
    try {
      if (user && user.id) {
        if (!variationsPrompt) {
          setMessages(prev => [...prev, naturalValue])
        }

        const prompt = getPromptMessage(
          variationsPrompt || naturalValue,
          inputOperands,
          excludeOperands,
          strictness,
          supplierTypes,
          geographyIn.map(g => g.country_name),
          inStrictness,
          geographyNotIn.map(g => g.country_name),
          notInStrictness
        )

        const { data } = await axios.post<{ result: string; threadId: string }>(
          '/api/veridion/thread/send_query',
          {
            userId: user.id,
            query: prompt,
            history
          },
          {
            headers: {
              Authorization: jwt.sign(
                { apiKey: isDpwadamRole ? process.env.NEXT_PUBLIC_VERIDION_PRESENTATION_API_KEY : apiKey },
                process.env.NEXT_PUBLIC_JWT_SECRET || ''
              )
            }
          }
        )

        setHistory(prev => [...prev, prompt, data.result])

        const isObject = typeof JSON.parse(data.result) !== 'string'

        if (isObject) {
          if (selectedCompaniesFromWatchlist.length) {
            const parsedFilter = JSON.parse(data.result)

            const companiesDomains = selectedCompaniesFromWatchlist.map(({ website_domain }) => website_domain)

            parsedFilter.filters.and.push({
              attribute: 'company_website',
              relation: 'in',
              value: companiesDomains
            })

            const jsonFilter = JSON.stringify(parsedFilter)
            updateSearchFilter(jsonFilter)

            if (searchVariant === 'json') {
              setTimeout(() => {
                updateJsonFilter()
              })
            }
          } else {
            updateSearchFilter(data.result)

            if (searchVariant === 'json') {
              setTimeout(() => {
                updateJsonFilter()
              })
            }
          }
        }

        if (!variationsPrompt) {
          setNaturalValue('')
        }
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message, { duration: 5000 })
    }
    setIsLoadingJsonResponse(false)
    nProgress.done()
  }

  const handleRunSearch = async (nextToken: string, companiesCurrentLength: number) => {
    setIsPendingMatchRequest(true)
    nProgress.start()
    let companiesLength = companiesCurrentLength || 0

    try {
      const maxUserLimit = (user && user?.max_product_limit >= 100 ? 100 : user?.max_product_limit) || 0

      const res = await axios.post(
        `/api/veridion/company_search?pagination_token=${nextToken || ''}&page_size=${
          numberToReturn <= maxUserLimit ? numberToReturn : maxUserLimit
        }`,
        {
          filters:
            searchVariant === 'search' ? JSON.stringify(updateJsonFilter()) : updateSearchFilter(getJsonFromEditor())
        },
        {
          headers: {
            Authorization: jwt.sign(
              { apiKey: isDpwadamRole ? process.env.NEXT_PUBLIC_VERIDION_PRESENTATION_API_KEY : apiKey },
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

      if (companiesCurrentLength === 0) {
        setCompanies(() => [...res.data.result])

        if (res.data.result.length) setActiveStep(() => 1)
      } else {
        setCompanies(prev => [...prev, ...res.data.result])
      }
      await new Promise(resolve => setTimeout(resolve, 1000))

      const next = res.data?.pagination?.next

      if (next && companiesLength < numberToReturn && companiesLength < (user?.max_product_limit || DEFAULT_LIMIT)) {
        handleRunSearch(next, companiesLength)
      } else {
        setIsPendingMatchRequest(false)
        nProgress.done()
      }
    } catch (error: any) {
      const message = error.response.data.message
      if (message === 'Missing or invalid authorization key.') {
        toast.error(message)
      } else {
        setSearchError(message)
      }
      setIsPendingMatchRequest(false)
      nProgress.done()
    }
  }

  const changeShortlistCompanies = useCallback(
    (selectedCompanies: CompanyMatchEnrichFromDb[]) => {
      setSelectedCompaniesFromWatchlist(selectedCompanies)

      if (searchVariant === 'json') {
        const parsedFilter = JSON.parse(getJsonFromEditor())

        const companyWebsiteFilter = parsedFilter?.filters?.and?.find(
          (filter: any) => filter.attribute === 'company_website'
        )

        const domains = selectedCompanies.map(({ website_domain }) => website_domain)

        if (companyWebsiteFilter) {
          companyWebsiteFilter.value = domains
        } else {
          if (parsedFilter?.filters?.and) {
            parsedFilter.filters.and.push({
              attribute: 'company_website',
              relation: 'in',
              value: domains
            })
          } else {
            parsedFilter.filters = {}

            parsedFilter.filters.and = []

            parsedFilter.filters.and.push({
              attribute: 'company_website',
              relation: 'in',
              value: domains
            })
          }
        }

        setEditorValue(JSON.stringify(parsedFilter))
        setJsonRes(JSON.stringify(parsedFilter))
      }
    },
    [searchVariant]
  )

  const addCompaniesAndProductsFromShortlist = useCallback(
    (companies: CompanyMatchEnrichFromDb[], products: CompanySearchProductFromDb[]) => {
      setSavedCompaniesAndProducts({ companies, products })
    },
    []
  )

  const clickThreadChip = (thread: ThreadType) => {
    if (!showWorkspace) {
      setShowWorkspace(true)
    }

    stageReset()
    setSelectedThreadId(thread.id)
    setJsonRes(thread.json_query)
    setEditorValue(thread.json_query)
    updateSearchFilter(thread.json_query)
    setMessages(thread.messages)
  }

  const deleteThread = async (threadId: number) => {
    try {
      await axios.post('/api/db_transactions/thread/delete', { id: threadId, user_id: user?.id })

      setThreads(threads => threads.filter(thread => thread.id !== threadId))
    } catch (error) {
      toast.error('Failed to delete thread')
    }
  }

  const saveThreadWithMessages = async () => {
    setLoadingInsertQuery(true)

    const foundThread = threads.find(thread => subject === thread.subject)

    if (!foundThread) {
      const jsonForSave = searchVariant === 'json' ? getJsonFromEditor() : JSON.stringify(updateJsonFilter())

      const { data: threadData } = await axios.post<{ id: number }>('/api/db_transactions/thread/add', {
        user_id: user?.id,
        subject: subject,
        json_query: jsonForSave,
        messages
      })

      if (user?.id) {
        setThreads(prev => [
          ...prev,
          {
            user_id: user.id,
            subject: subject,
            json_query: jsonForSave,
            id: threadData.id,
            messages,
            type: 'filter'
          }
        ])

        setSelectedThreadId(threadData.id)
      }
    } else {
      const { data: threadData } = await axios.post<ThreadType>('/api/db_transactions/thread/patch', {
        user_id: user?.id,
        subject: subject,
        json_query: searchVariant === 'json' ? getJsonFromEditor() : JSON.stringify(updateJsonFilter()),
        messages,
        id: foundThread.id
      })

      const elemPosition = threads.findIndex(({ id }) => id === threadData.id)

      const updatedThreads = [...threads.slice(0, elemPosition), threadData, ...threads.slice(elemPosition + 1)]

      setThreads(updatedThreads)
      setSelectedThreadId(threadData.id)
      setLoadingInsertQuery(false)
    }

    setSubject('')
    setLoadingInsertQuery(false)
    setIsOpenSubjectModal(false)
  }

  const addOperands = (operands: string[]) => {
    setInputOperands(operands)
  }

  const addExcludeOperands = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExcludeOperands(e.target.value)
  }

  const handleChangeSearchVariant = (variant: string) => {
    try {
      if (variant !== searchVariant) {
        if (variant === 'search') {
          stageReset()

          updateSearchFilter(getJsonFromEditor())
        }

        if (variant === 'json') {
          updateJsonFilter()
        }

        setSearchVariant(variant)
      }
    } catch (error: any) {
      setSearchError(error.message)
    }
  }

  const handleChangeJsonEditor = useCallback((value: string) => {
    setEditorValue(value)
  }, [])

  const backButtonHandler = useCallback(() => {
    setActiveStep(0)

    if (searchVariant === 'json') {
      updateJsonFilter()
    }
  }, [])

  useEffect(() => {
    const fetchThreads = async () => {
      const { data } = await axios.post<ThreadFromDb[]>('/api/db_transactions/thread/get', { user_id: user?.id })

      setThreads(
        data.map(thread => ({
          ...thread,
          type: thread.json_query
            ? typeof JSON.parse(thread.json_query) !== 'string'
              ? 'filter'
              : 'message'
            : 'message'
        }))
      )
    }

    fetchThreads()
  }, [])

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            {isLoadingJsonResponse && (
              <Box
                sx={{
                  position: 'fixed',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1000000,
                  background: 'rgba(203, 202, 206, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CircularProgress />
              </Box>
            )}

            <Grid item xs={12} container spacing={2} mt={4}>
              <Banner isMd={isMdScreen} />

              <Grid item xs={12} container spacing={4} mt={1} mb={4}>
                {!isDpwadamRole && (
                  <Grid item md={8} xs={12}>
                    <CustomTextField
                      value={apiKey}
                      onChange={handleApiKeyInputChange}
                      placeholder='Enter API key to activate supplier discovery'
                      error={isApiKeyError}
                      translate='no'
                      autoComplete='off'
                      type='password'
                      sx={{ width: '100%', '.MuiInputBase-root': { width: '100%' } }}
                    />
                  </Grid>
                )}

                <Grid item md={4} xs={12}>
                  <Button
                    variant='outlined'
                    endIcon={<Icon icon='octicon:video-24' />}
                    fullWidth
                    onClick={() => setOpenYoutubeModal(true)}
                  >
                    Supplier Discovery Demo
                  </Button>
                </Grid>
              </Grid>

              <Grid item xs={12} mt={4}>
                <Card sx={{ width: '100%' }}>
                  <CardContent>
                    <Grid xs={12} item container spacing={8} mb={4} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Grid item xs={12}>
                        <Typography fontSize={18} sx={{ pb: 4, borderBottom: '1px solid #FBB03B' }}>
                          1. Start or continue your search
                        </Typography>
                      </Grid>
                      <Grid xs={6} md={2} item>
                        <Button
                          fullWidth
                          variant='contained'
                          onClick={() => {
                            if (!showWorkspace) {
                              setShowWorkspace(true)
                            } else {
                              resetAll()
                            }
                            trackOnClick('new_search')
                          }}
                          startIcon={<Icon icon='carbon:reset' />}
                        >
                          New search
                        </Button>
                      </Grid>

                      {!isMdScreen && !!threads.length && (
                        <Grid xs={0.1} item sx={{ height: '100%', width: '100%' }}>
                          <Box sx={{ width: '1px', height: '40px', backgroundColor: 'rgba(47, 43, 61, 0.16)' }}></Box>
                        </Grid>
                      )}

                      <Grid
                        item
                        xs={12}
                        md={7}
                        sx={{
                          '@media (max-width: 899px)': {
                            order: 1
                          }
                        }}
                      >
                        {!!threads.length && (
                          <CustomTextField
                            select
                            fullWidth
                            defaultValue=''
                            value={selectedThreadId}
                            label='Saved searches:'
                            sx={{
                              '.MuiInputBase-root': {
                                '.MuiButtonBase-root': {
                                  display: 'none'
                                }
                              },

                              '.MuiFormLabel-root': {
                                overflow: 'visible'
                              }
                            }}
                            SelectProps={{
                              onChange: e => {
                                const thread = threads.find(({ id }) => id === e.target.value)

                                if (thread) {
                                  clickThreadChip(thread)
                                } else {
                                  const emptyFilter = JSON.stringify({})
                                  setSelectedThreadId(null)
                                  setJsonRes(emptyFilter)
                                  setEditorValue(emptyFilter)
                                  updateSearchFilter(emptyFilter)
                                  setMessages([])
                                }
                              }
                            }}
                          >
                            <MenuItem value={''}>None</MenuItem>

                            {threads.map(thread => (
                              <MenuItem
                                key={thread.id}
                                value={thread.id}
                                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                              >
                                {thread.subject}
                                <IconButton
                                  size='small'
                                  onClick={e => {
                                    e.stopPropagation()
                                    deleteThread(thread.id)
                                  }}
                                >
                                  <Icon icon='basil:cross-outline' />
                                </IconButton>
                              </MenuItem>
                            ))}
                          </CustomTextField>
                        )}
                      </Grid>

                      <Grid xs={0.1} item sx={{ height: '100%', width: '100%' }}>
                        <Box sx={{ width: '1px', height: '40px', backgroundColor: 'rgba(47, 43, 61, 0.16)' }}></Box>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={2.2}
                        sx={{
                          '@media (max-width: 899px)': {
                            order: 1
                          }
                        }}
                      >
                        <CustomTextField
                          label='№ of companies to return'
                          variant='outlined'
                          size='small'
                          select
                          fullWidth
                          value={numberToReturn}
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
                            onChange: (e: any) => setNumbersToReturn(e.target.value)
                          }}
                        >
                          {numberOfCompanies.map(v => (
                            <MenuItem
                              key={v}
                              value={v}
                              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                              {v}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      </Grid>
                    </Grid>

                    {showWorkspace && (
                      <>
                        {searchVariant === 'search' ? (
                          <>
                            <Grid xs={12} item container spacing={4}>
                              <Grid item xs={12}>
                                <Grid item xs={12}>
                                  <Typography fontSize={18} sx={{ pb: 4, borderBottom: '1px solid #FBB03B' }}>
                                    2. Use natural language to build your search query
                                  </Typography>
                                </Grid>

                                {!!messages.length && <MessagesList messages={messages} userName={user?.name || ''} />}

                                <Grid xs={12} item pt={6}>
                                  <Tooltip
                                    title={
                                      !isDpwadamRole
                                        ? 'In order to use the AI for search, please provide a valid Veridion API key in the API key field at the top of the page'
                                        : ''
                                    }
                                  >
                                    <Box>
                                      <Badge
                                        badgeContent='?'
                                        color='info'
                                        sx={{ width: '100%', cursor: 'pointer' }}
                                        componentsProps={{
                                          badge: {
                                            onClick: () => setGifUrl('/images/gifs/veridion_search.gif')
                                          }
                                        }}
                                      >
                                        <CustomTextField
                                          value={naturalValue}
                                          onChange={e => setNaturalValue(e.target.value)}
                                          fullWidth
                                          multiline
                                          maxRows={8}
                                          placeholder='Search example: Find companies that make lithium-ion batteries'
                                          InputProps={{
                                            endAdornment: (
                                              <Button
                                                variant='contained'
                                                sx={{ p: 1, minWidth: 'auto' }}
                                                disabled={
                                                  isDpwadamRole
                                                    ? !naturalValue.trim() || isLoadingJsonResponse
                                                    : !naturalValue.trim() || isLoadingJsonResponse || !apiKey
                                                }
                                                onClick={() => sendNaturalQuery(undefined)}
                                              >
                                                <Icon icon='mdi:arrow-right' />
                                              </Button>
                                            ),
                                            sx: {
                                              py: '3.5px !important'
                                            }
                                          }}
                                        />
                                      </Badge>
                                    </Box>
                                  </Tooltip>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Typography fontSize={18} sx={{ pb: 4, borderBottom: '1px solid #FBB03B', mt: 6 }}>
                              3. Review and edit search query
                            </Typography>

                            <Grid xs={12} item py={4} sx={{ display: 'flex' }}>
                              <Box>
                                <FormControlLabel
                                  label='Search by company products'
                                  sx={{
                                    '.MuiTypography-root': {
                                      fontSize: '14px'
                                    }
                                  }}
                                  control={
                                    <Checkbox
                                      checked={searchBy === 'company_products'}
                                      onChange={() => setSearchBy('company_products')}
                                      sx={{ svg: { width: '32px', height: '32px' } }}
                                    />
                                  }
                                />
                              </Box>

                              <Box>
                                <FormControlLabel
                                  label='Search by company keywords'
                                  sx={{
                                    '.MuiTypography-root': {
                                      fontSize: '14px'
                                    }
                                  }}
                                  control={
                                    <Checkbox
                                      checked={searchBy === 'company_keywords'}
                                      onChange={() => setSearchBy('company_keywords')}
                                      sx={{ svg: { width: '32px', height: '32px' } }}
                                    />
                                  }
                                />
                              </Box>
                            </Grid>

                            <Grid item container spacing={4} xs={12}>
                              <Grid item xs={12}>
                                <OperandsInput
                                  addOperands={addOperands}
                                  operands={inputOperands}
                                  badgeHandler={(s: string) => setGifUrl(s)}
                                  label={
                                    <Badge
                                      badgeContent='?'
                                      color='info'
                                      sx={{ width: '100%', '.MuiBadge-badge': { right: -10, cursor: 'pointer' } }}
                                      componentsProps={{
                                        badge: {
                                          onClick: () => setGifUrl('/images/gifs/edit_keywords.gif')
                                        }
                                      }}
                                    >
                                      Add keyword buckets
                                    </Badge>
                                  }
                                  placeholder='Add search operands. Separate operands by "," and organize them by groups by pressing the "return" key.'
                                  variationsQueryHandler={sendNaturalQuery}
                                />
                              </Grid>

                              <Grid item xs={12} mt={4}>
                                <CustomTextField
                                  onChange={addExcludeOperands}
                                  value={excludeOperands}
                                  fullWidth
                                  label={'Exclude keyword buckets'}
                                  placeholder='Add exception operands. Organize them by groups by pressing the "return" key.'
                                />
                              </Grid>

                              <Grid item container xs={12} spacing={4} mt={2}>
                                <Grid item container xs={12} md={4}>
                                  <Autocomplete
                                    id='supplier-select'
                                    size='small'
                                    value={supplierTypes}
                                    fullWidth
                                    multiple
                                    disableCloseOnSelect
                                    options={['distributor', 'manufacturer', 'service_provider']}
                                    getOptionLabel={option => option}
                                    onChange={(e, newValue) => {
                                      setSupplierTypes(newValue)
                                    }}
                                    onInputChange={(event, newInputValue, reason) => {
                                      if (reason === 'clear') {
                                        setSupplierTypes([])

                                        return
                                      }
                                    }}
                                    renderOption={(props, option, { selected }) => (
                                      <li {...props} data-option={option}>
                                        <Checkbox sx={{ marginRight: 8 }} checked={selected} />
                                        {option}
                                      </li>
                                    )}
                                    renderInput={params => (
                                      <CustomTextField {...params} variant='outlined' label='Supplier types' />
                                    )}
                                  />

                                  <CustomTextField
                                    label='Search strictness'
                                    variant='outlined'
                                    size='small'
                                    select
                                    fullWidth
                                    value={strictness}
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
                                      onChange: (e: any) => setStrictness(+e.target.value)
                                    }}
                                  >
                                    {[1, 2, 3].map((v, id) => (
                                      <MenuItem
                                        key={v}
                                        value={v}
                                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                      >
                                        {generalStrictnessTitles[id]}
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
                                      </MenuItem>
                                    ))}
                                  </CustomTextField>
                                </Grid>

                                <Grid item xs={12}>
                                  <Grid item md={4} xs={12} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <Typography sx={{ py: 4, borderBottom: '1px solid #FBB03B' }}>Geography</Typography>

                                    <CountrySelector
                                      countries={geographyIn}
                                      countryChange={c => setGeographyIn(c)}
                                      label='In'
                                      id='geography-in'
                                    />

                                    {!!geographyIn.length && (
                                      <CustomTextField
                                        label='In strictness'
                                        variant='outlined'
                                        size='small'
                                        select
                                        fullWidth
                                        value={inStrictness}
                                        sx={{
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
                                          onChange: (e: any) => setInStrictness(+e.target.value)
                                        }}
                                      >
                                        {[1, 2, 3].map(v => (
                                          <MenuItem
                                            key={v}
                                            value={v}
                                            sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'space-between'
                                            }}
                                          >
                                            {locationStrictnessLabels[v - 1]}
                                          </MenuItem>
                                        ))}
                                      </CustomTextField>
                                    )}

                                    <CountrySelector
                                      countries={geographyNotIn}
                                      countryChange={c => setGeographyNotIn(c)}
                                      label='Not in'
                                      id='geography-not-in'
                                    />

                                    {!!geographyNotIn.length && (
                                      <CustomTextField
                                        label='Not in strictness'
                                        variant='outlined'
                                        size='small'
                                        select
                                        fullWidth
                                        value={notInStrictness}
                                        sx={{
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
                                          onChange: (e: any) => setNotInStrictness(+e.target.value)
                                        }}
                                      >
                                        {[1, 2, 3].map(v => (
                                          <MenuItem
                                            key={v}
                                            value={v}
                                            sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'space-between'
                                            }}
                                          >
                                            {locationStrictnessLabels[v - 1]}
                                          </MenuItem>
                                        ))}
                                      </CustomTextField>
                                    )}
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={12} mt={6}>
                              <Typography fontSize={18} sx={{ pb: 4, borderBottom: '1px solid #FBB03B' }}>
                                4. Optional: Perform Search on a Pre-Defined set of Companies
                              </Typography>

                              <FormControlLabel
                                label='Select Companies'
                                sx={{
                                  '.MuiTypography-root': {
                                    fontSize: '18px'
                                  },
                                  py: 4
                                }}
                                control={
                                  <Checkbox
                                    checked={showCompaniesDatagrid}
                                    onChange={e => {
                                      setShowCompaniesDatagrid(e.target.checked)

                                      if (!e.target.checked) {
                                        setSelectedCompaniesFromWatchlist([])
                                      }
                                    }}
                                    sx={{ svg: { width: '32px', height: '32px' } }}
                                  />
                                }
                              />

                              {showCompaniesDatagrid && (
                                <Shortlist
                                  selectedCompanies={selectedCompaniesFromWatchlist}
                                  setSelectedCompanies={changeShortlistCompanies}
                                  addCompaniesAndProductsFromShortlist={addCompaniesAndProductsFromShortlist}
                                />
                              )}
                            </Grid>
                          </>
                        ) : (
                          <Grid item xs={12} mt={8}>
                            {searchError && (
                              <Alert
                                severity='error'
                                sx={{ mt: 4 }}
                                action={
                                  <IconButton
                                    size='small'
                                    color='inherit'
                                    aria-label='close'
                                    onClick={() => setSearchError('')}
                                  >
                                    <Icon icon='tabler:x' />
                                  </IconButton>
                                }
                              >
                                {searchError}
                              </Alert>
                            )}

                            <JsonEditor
                              placeholder={jsonRes ? JSON.parse(jsonRes) : {}}
                              handleChange={handleChangeJsonEditor}
                            />
                          </Grid>
                        )}
                      </>
                    )}

                    <Grid item container xs={12} mt={8} sx={{ justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', gap: 4 }}>
                        <Badge
                          badgeContent='?'
                          color='info'
                          sx={{ cursor: 'pointer' }}
                          componentsProps={{
                            badge: {
                              onClick: () => setGifUrl('/images/gifs/saved_search.gif')
                            }
                          }}
                        >
                          <Button
                            variant='contained'
                            startIcon={<Icon icon='material-symbols:save-outline' />}
                            disabled={loadingInsertQuery || isLoadingJsonResponse || !showWorkspace}
                            onClick={() => setIsOpenSubjectModal(true)}
                          >
                            Save search
                          </Button>
                        </Badge>

                        <Badge
                          badgeContent='?'
                          color='info'
                          sx={{ cursor: 'pointer' }}
                          componentsProps={{
                            badge: {
                              onClick: () => setGifUrl('/images/gifs/view_json.gif')
                            }
                          }}
                        >
                          <Button
                            variant='contained'
                            startIcon={<Icon icon={searchVariant === 'search' ? 'mdi:code-json' : 'bi:ui-radios'} />}
                            disabled={!showWorkspace}
                            onClick={() => handleChangeSearchVariant(searchVariant === 'search' ? 'json' : 'search')}
                          >
                            {searchVariant === 'search' ? 'View JSON' : 'View UI'}
                          </Button>
                        </Badge>
                      </Box>

                      <Button
                        variant='contained'
                        endIcon={<Icon icon='mdi:arrow-right' />}
                        disabled={
                          (searchVariant === 'json'
                            ? (!jsonRes || jsonRes === '{}') && (!editorValue || editorValue === '{}')
                            : !inputOperands.length) ||
                          isPendingMatchRequest ||
                          (!isDpwadamRole && !apiKey) ||
                          isLoadingJsonResponse
                        }
                        onClick={() => {
                          handleRunSearch('', 0)
                          trackOnClick('run_search')
                        }}
                      >
                        Run Search
                      </Button>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Dialog
                open={isOpenSubjectModal}
                onClose={() => setIsOpenSubjectModal(false)}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                fullWidth
                maxWidth='sm'
              >
                <DialogContent>
                  <CustomTextField
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder='Save subject'
                    fullWidth
                  />
                </DialogContent>

                <DialogActions>
                  <Button variant='outlined' onClick={() => setIsOpenSubjectModal(false)}>
                    Cancel
                  </Button>

                  <Button
                    variant='contained'
                    disabled={!subject || loadingInsertQuery}
                    onClick={saveThreadWithMessages}
                  >
                    Save
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={!!gifUrl}
                onClose={() => setGifUrl('')}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                fullWidth
                maxWidth='sm'
              >
                <DialogContent sx={{ height: 300 }}>
                  {!!gifUrl && <Image src={gifUrl} alt='Search GIF' fill />}
                </DialogContent>
              </Dialog>
            </Grid>

            <Dialog
              open={openYoutubeModal}
              onClose={() => setOpenYoutubeModal(false)}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
              fullWidth
              maxWidth='lg'
            >
              <IconButton sx={{ position: 'absolute', top: 4, right: 6 }} onClick={() => setOpenYoutubeModal(false)}>
                <Icon icon='material-symbols:close' />
              </IconButton>

              <DialogContent>
                <Box sx={{ p: 4 }}>
                  <iframe
                    width='100%'
                    height='480'
                    src='https://www.youtube.com/embed/wJti3bcysFM?si=djZyVMieLowMHkXO'
                    title='YouTube video player'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; allowfullscreen;'
                    style={{
                      border: 'none'
                    }}
                  ></iframe>
                </Box>
              </DialogContent>
            </Dialog>
          </>
        )
      case 1:
        return (
          <>
            {!!companies.length && (
              <Grid item xs={12} marginTop={4}>
                <GraphSection
                  companies={companies}
                  productsCount={productsCount}
                  searchBy={searchBy}
                  backButtonHandler={backButtonHandler}
                />
              </Grid>
            )}
          </>
        )

      default:
        return 'Unknown Step'
    }
  }

  return (
    <Grid container>
      <StepperIndicator activeStep={activeStep} changeStepByClick={(step: number) => setActiveStep(step)} />

      {getStepContent(activeStep)}
    </Grid>
  )
}

export default SearchPageScreen
