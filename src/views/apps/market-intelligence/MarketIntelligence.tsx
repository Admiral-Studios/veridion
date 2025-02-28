import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import jwt from 'jsonwebtoken'
import CustomTextField from 'src/@core/components/mui/text-field'
import { CountryType } from '../product_search/configs/countriesMapping'
import axios from 'axios'
import { DataCard } from './components/Card'
import { makeCardsData } from './utils/makeCardsData'
import { makeChartsData } from './utils/makeChartsData'
import nProgress from 'nprogress'
import NaicsSelect from './components/NaicsSelect'
import LocationSelector from './components/LocationSelector'
import KeywordsInput from './components/KeywordsInput'
import { prepareFilter } from './utils/prepareFilterForSearch'
import Chart from './components/BarChart'
import toast from 'react-hot-toast'
import { CompanySearchProductType } from 'src/types/apps/veridionTypes'
import NoFiltersIcon from 'src/shared/icons/NoFiltersIcon'
import IconifyIcon from 'src/@core/components/icon'
import { addThousandsDelimiter } from 'src/utils/numbers/addThousandsDelimeter'

const DEFAULT_LIMIT = 1000

type CardsDataType = {
  companiesLength: number
  companiesWithInternationalPresence: number
  companiesBranches: number
  companiesCountReturnedByApi: number
}

const MarketIntelligence = () => {
  const [naics, setNaics] = useState<{ [key: number]: string }>({})
  const [naicsRelation, setNaicsRelation] = useState('in')
  const [geographyIn, setGeographyIn] = useState<CountryType[]>([])
  const [geographyNotIn, setGeographyNotIn] = useState<CountryType[]>([])
  const [locationTypes, setLocationTypes] = useState({ main: false, secondary: false })
  const [inputKeywords, setInputKeywords] = useState<string[]>([])
  const [excludeKeywords, setExcludeKeywords] = useState('')
  const [keywordsSupplierTypes, setKeywordsSupplierTypes] = useState({
    distributor: false,
    service_provider: false,
    manufacturer: false
  })
  const [strictness, setStrictness] = useState<number | undefined>(undefined)

  const [apiKey, setApiKey] = useState('')
  const [isApiKeyError, setIsApiKeyError] = useState(false)

  const [cardsData, setCardsData] = useState<CardsDataType | null>(null)
  const [chartsData, setChartsData] = useState<ReturnType<typeof makeChartsData> | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const showKeywordsInput = !!Object.keys(naics) && (!!geographyIn.length || !!geographyNotIn.length)

  const onSelectNaics = useCallback((newSelection: { [key: number]: string }) => {
    setNaics(newSelection)
  }, [])

  const search = async () => {
    setIsLoading(true)
    nProgress.start()

    const filter = prepareFilter(
      Object.keys(naics).filter(code => code.length === 6),
      naicsRelation,
      geographyIn,
      geographyNotIn,
      locationTypes,
      inputKeywords,
      excludeKeywords,
      strictness,
      keywordsSupplierTypes
    )

    try {
      const allResults: CompanySearchProductType[] = []
      let paginationToken: string | undefined = undefined
      let companiesCountReturnedByApi: number | null = null

      while (allResults.length < DEFAULT_LIMIT) {
        const res: any = await axios.post(
          `/api/veridion/company_search${paginationToken ? `?pagination_token=${paginationToken}` : ''}`,
          { filters: JSON.stringify(filter) },
          {
            headers: {
              Authorization: jwt.sign({ apiKey }, process.env.NEXT_PUBLIC_JWT_SECRET || '')
            }
          }
        )

        if (!companiesCountReturnedByApi) {
          companiesCountReturnedByApi = res.data.count
        }

        allResults.push(...res.data.result)

        paginationToken = res.data?.pagination?.next
        if (!paginationToken || allResults.length >= DEFAULT_LIMIT) break
      }

      setCardsData(makeCardsData(allResults, geographyIn, companiesCountReturnedByApi))
      setChartsData(makeChartsData(allResults))
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong, please try again')
    }

    setIsLoading(false)
    nProgress.done()
  }

  const onChangeNaicsRelation = (newRelation: string) => {
    if (newRelation === 'equals' || newRelation === 'not_equals') {
      const firstMatch = Object.entries(naics).find(([code]) => code.length === 6)

      if (firstMatch) {
        setNaics({ [firstMatch[0]]: firstMatch[1] })
      }
    }

    setNaicsRelation(newRelation)
  }

  const handleApiKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isApiKeyError) {
      setIsApiKeyError(false)
    }
    setApiKey(e.target.value)
  }

  return (
    <Grid container spacing={4}>
      <Grid item md={12} xs={12}>
        <CustomTextField
          value={apiKey}
          onChange={handleApiKeyInputChange}
          error={isApiKeyError}
          placeholder='Enter API key to activate supplier discovery'
          translate='no'
          autoComplete='off'
          type='password'
          sx={{ width: '100%', '.MuiInputBase-root': { width: '100%' }, mb: 4 }}
        />
      </Grid>

      <Grid item md={6} xs={12}>
        <LocationSelector
          geographyIn={geographyIn}
          geographyNotIn={geographyNotIn}
          setGeographyIn={newLocations => setGeographyIn(newLocations)}
          setGeographyNotIn={newLocations => setGeographyNotIn(newLocations)}
          types={locationTypes}
          setTypes={newTypes => setLocationTypes(newTypes)}
        />
      </Grid>

      <Grid item md={6} xs={12}>
        <NaicsSelect
          naics={naics}
          onSelectNaics={onSelectNaics}
          relation={naicsRelation}
          onChangeRelation={onChangeNaicsRelation}
        />
      </Grid>

      <Grid container item xs={12} spacing={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Grid item md={9} xs={12}>
          <KeywordsInput
            inputKeywords={inputKeywords}
            excludeKeywords={excludeKeywords}
            strictness={strictness}
            keywordsSupplierTypes={keywordsSupplierTypes}
            setInputKeywords={(newKeywords: string[]) => setInputKeywords(newKeywords)}
            setExcludeKeywords={(newKeywords: string) => setExcludeKeywords(newKeywords)}
            setSupplierTypes={(newSupplierTypes: any) => setKeywordsSupplierTypes(newSupplierTypes)}
            setStrictness={(newStrictness: number) => setStrictness(newStrictness)}
          />
        </Grid>

        <Grid item md={3} xs={12}>
          <Button variant='contained' fullWidth onClick={search} disabled={isLoading || !showKeywordsInput || !apiKey}>
            Search
          </Button>
        </Grid>
      </Grid>

      {cardsData ? (
        cardsData.companiesLength ? (
          <Grid item xs={12} container spacing={4} mt={4}>
            <Grid item xs={12} md={4}>
              <DataCard
                data={
                  cardsData.companiesCountReturnedByApi > cardsData.companiesLength
                    ? [
                        {
                          title: 'Number of companies',
                          count: addThousandsDelimiter(cardsData.companiesCountReturnedByApi)
                        },
                        { title: 'Number of returned companies', count: cardsData.companiesLength }
                      ]
                    : [{ title: 'Number of returned companies', count: cardsData.companiesLength }]
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <DataCard
                data={[
                  {
                    title: 'Number of companies with international presence',
                    count: cardsData.companiesWithInternationalPresence
                  }
                ]}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <DataCard
                data={[{ title: 'Number of locations', count: addThousandsDelimiter(cardsData.companiesBranches) }]}
              />
            </Grid>
          </Grid>
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
            <IconifyIcon icon='ic:round-search-off' fontSize='112px' />

            <Typography sx={{ mt: 6, color: '#BEBEBE', fontWeight: 500, fontSize: '36px' }}>
              No companies found.
            </Typography>
            <Typography sx={{ mt: 1, color: '#DBDBDB', fontWeight: 500, fontSize: '24px' }}>
              Please try again with a different set of filters.
            </Typography>
          </Box>
        )
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
          <NoFiltersIcon />

          <Typography sx={{ mt: 6, color: '#BEBEBE', fontWeight: 500, fontSize: '36px' }}>
            No filters applied.
          </Typography>
          <Typography sx={{ mt: 1, color: '#DBDBDB', fontWeight: 500, fontSize: '24px' }}>
            Please add the filter value to view results.
          </Typography>
        </Box>
      )}

      {chartsData && !!cardsData?.companiesLength && (
        <>
          <Grid item xs={12} container spacing={6} mt={10}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: '100%'
                }}
              >
                <Typography variant='h5' textAlign='center'>
                  Number of companies by revenue brackets
                </Typography>

                <Box
                  mt={4}
                  sx={{
                    width: '100%'
                  }}
                >
                  <Chart data={chartsData.revenuesValues} seriesName='Number of companies' />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: '100%'
                }}
              >
                <Typography variant='h5' textAlign='center'>
                  Number of companies by employee brackets
                </Typography>

                <Box
                  mt={4}
                  sx={{
                    width: '100%'
                  }}
                >
                  <Chart data={chartsData.employeesCount} seriesName='Number of companies' />
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box
            mt={10}
            sx={{
              width: '100%',

              overflowY: 'auto'
            }}
          >
            <Typography variant='h5' textAlign='center'>
              Number of companies by business tags
            </Typography>

            <Box
              mt={4}
              sx={{
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                px: 8
              }}
            >
              <Chart data={chartsData.businessTags} seriesName='Number of companies' isVertical />
            </Box>
          </Box>

          <Box
            mt={10}
            sx={{
              width: '100%',
              overflowX: 'auto',
              overflowY: 'hidden'
            }}
          >
            <Typography variant='h5' textAlign='center'>
              Number of companies by city
            </Typography>

            <Box
              mt={4}
              sx={{
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                px: 8
              }}
            >
              <Chart data={chartsData.companiesByCities} seriesName='Number of companies' isVertical />
            </Box>
          </Box>
        </>
      )}
    </Grid>
  )
}

export default MarketIntelligence
