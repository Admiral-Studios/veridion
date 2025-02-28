import React, { SyntheticEvent, useCallback, useMemo } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Link from '@mui/material/Link'
import {
  DataGrid,
  GridColDef,
  gridFilteredSortedRowIdsSelector,
  GridRowSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  useGridApiRef
} from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import {
  CsvCompanyUploadType,
  CompanyMatchEnrichFromDb,
  MatchDetails,
  CompanyMatchEnrichTypeForSave,
  InputFieldsType,
  Address,
  CodeLabel,
  MatchMethod,
  LocationAttribute
} from 'src/types/apps/veridionTypes'
import {
  Alert,
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tab,
  TextField,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { Box } from '@mui/system'
import { darken, lighten } from '@mui/material/styles'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import jwt from 'jsonwebtoken'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import nProgress from 'nprogress'
import EnrichSingleCompany from '../match_enrich/EnrichSingleCompany'
import { mainDataGridColumns, mainDataGridColumnsNames } from './configs/mainDataGridColumns'
import { fetchDataFromDb } from 'src/utils/db/fetchDataFromDb'
import { uploadFile } from 'src/utils/file/upload'
import { companyInputRecords, companyRecordsToEnrich, expectedHeaders } from './constants'
import { companyInputColumns } from './configs/inputDataGridColumns'
import { handleFileDownload } from 'src/utils/file/downloadEnrichmentSample'
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

//TODO: delete after implementing all fields as in the product API
import { useAuth } from 'src/hooks/useAuth'
import { columnVisibilityModel } from './configs/columnVisabilityModel'
import ExportButton from 'src/shared/components/DataGrid/ExportButton'
import ComplexFieldsDialog from 'src/shared/components/ComplexFieldsDialog'
import ExpandableCell from 'src/shared/components/DataGrid/ExpandableCell'

const setBackgroundColor = (color: string, mode: string) => (mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7))

const setHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6)

const setSelectedBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5)

const setSelectedHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4)

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderRight: 0,
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 'auto',
    lineHeight: 1,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    },
    '& svg': {
      marginBottom: 0,
      marginRight: theme.spacing(2)
    }
  },
  '& .MuiTabs-flexContainer': {
    display: 'grid',
    gridTemplateColumns: '120px 24px 120px',
    justifyContent: 'center',
    flexDirection: 'row'
  }
}))

const MAX_COMPANIES_TO_ENRICH = 1000

const validateParsedCsvData = (csvData: CsvCompanyUploadType[]) => {
  return csvData
    .filter(item => {
      return !(
        (item.legal_names![0] !== '' || item.commercial_names![0] !== '') &&
        (item.address_txt !== '' || item.website !== '' || item.phone_number !== '' || item.registry_id !== '')
      )
    })
    .map((item, key) => ({ ...item, id: key }))
}

function CustomToolbar(
  selectedCompaniesHaveLength: boolean,
  deleteCompaniesHandler: () => void,
  onClickExportButton: () => CompanyMatchEnrichFromDb[]
) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />

      <ExportButton
        columns={mainDataGridColumnsNames}
        datagridName='enriched_companies'
        onClickToGetExportedCompanies={onClickExportButton}
      />
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

const saveEnrichedData = async (company: CsvCompanyUploadType, enrich_response: CompanyMatchEnrichTypeForSave) => {
  const res = await fetch('/api/db_transactions/save_enriched_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputData: company,
      enrichedData: {
        ...enrich_response,
        product: {
          headline: '',
          content: '',
          url: ''
        }
      }
    })
  })

  const result = await res.json()

  return result.id
}

async function prepareCSVDataForEnrichment(csvData: CsvCompanyUploadType[]) {
  const sanitizedCSVData = csvData.map(item => {
    const newItem: any = {}
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        // Remove leading invisible characters
        const sanitizedKey = key.replace(/^\uFEFF/, '')
        newItem[sanitizedKey] = item[key as keyof CsvCompanyUploadType]
      }
    }

    return newItem
  })

  return sanitizedCSVData.map(item => ({
    ...item,
    legal_names: [item.legal_names],
    commercial_names: [item.commercial_names]
  }))
}

const UploadCompanies = () => {
  const [file, setFile] = React.useState<File | null>(null)
  const [companies, setCompanies] = React.useState<CompanyMatchEnrichFromDb[]>([])
  const [parsedData, setParsedData] = React.useState<CsvCompanyUploadType[]>([])
  const [isOverLimit, setIsOverLimit] = React.useState<boolean>(false)
  const [isFileHasError, setFileError] = React.useState<boolean>(false)
  const [isApiKeyError, setIsApiKeyError] = React.useState(false)
  const [apiKey, setApiKey] = React.useState('')
  const [invalidCompanies, setInvalidCompanies] = React.useState<CsvCompanyUploadType[]>([])
  const [selectedCompanies, setSelectedCompanies] = React.useState<GridRowSelectionModel>([])
  const [enrichmentInProcess, setEnrichmentInProcess] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('batch')
  const [value, setValue] = React.useState<string[] | undefined>([])
  const [inputValue, setInputValue] = React.useState('')
  const [matchDetails, setMatchDetails] = React.useState<MatchDetails | null>(null)
  const [inputFields, setInputFields] = React.useState<InputFieldsType | null>(null)
  const [mainAddress, setMainAddress] = React.useState<Address | null>(null)
  const [registeredAddress, setRegisteredAddress] = React.useState<Address | null>(null)
  const [locations, setLocations] = React.useState<Address[] | null>(null)
  const [naicsSecondary, setNaicsSecondary] = React.useState<CodeLabel[] | null>(null)
  const [naceRev2, setNaceRev2] = React.useState<CodeLabel[] | null>(null)
  const [sic, setSic] = React.useState<CodeLabel[] | null>(null)
  const [isic, setIsic] = React.useState<CodeLabel[] | null>(null)
  const [ncci, setNcci] = React.useState<string[] | null>(null)

  const apiRef = useGridApiRef()

  const { trackOnClick } = useAuth()

  const isMdScreen = useMediaQuery('(max-width: 900px)')

  const isOverLimitTotalLength = MAX_COMPANIES_TO_ENRICH <= companies.length

  const inputFileNames = useMemo(() => {
    const map = new Map()
    companies.forEach(({ input_file_name }) => {
      if (input_file_name) {
        map.set(input_file_name, input_file_name)
      }
    })

    return Array.from(map.values()).sort()
  }, [companies])

  const filteredCompanies = useMemo(() => {
    if (value?.length && companies.length) {
      return companies.filter(({ input_file_name }) => value.includes(input_file_name))
    }

    return companies
  }, [value, companies])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
      event.target.files[0].name
    }
  }

  const processEnrichCompany = async (company: CsvCompanyUploadType, additionalEnrichData: any) => {
    const commercialNames = company.commercial_names ? (company.commercial_names as unknown as string[]).join(', ') : ''

    const legalNames = company.legal_names ? (company.legal_names as unknown as string[]).join(', ') : ''
    const id = await saveEnrichedData(
      {
        ...companyInputRecords,
        ...company,
        commercial_names: commercialNames
      },

      {
        ...companyRecordsToEnrich,
        ...additionalEnrichData,
        input_file_name: file ? file.name : '',
        is_product: false
      } as unknown as CompanyMatchEnrichTypeForSave
    )

    setCompanies(prevCompanies => [
      {
        ...companyInputRecords,
        ...company,
        id: id,
        ...additionalEnrichData,
        input_legal_names: legalNames,
        input_file_name: file ? file.name : ''
      } as any,
      ...prevCompanies
    ])
  }

  const handleEnrichCompanies = async (uploadedCompanies: CsvCompanyUploadType[]) => {
    const delayBetweenRequests = 1000

    const enrichedCompanies = companies.map(({ veridion_id }) => veridion_id)

    nProgress.start()
    setEnrichmentInProcess(true)

    for (let i = 0; i < uploadedCompanies.length; i++) {
      const company = uploadedCompanies[i]
      try {
        const match_enrich_response = await fetch('/api/veridion/match_enrich', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: jwt.sign({ apiKey }, process.env.NEXT_PUBLIC_JWT_SECRET || '')
          },
          body: JSON.stringify(company)
        })

        if (match_enrich_response.ok) {
          const enrich_response = await match_enrich_response.json()

          if (enrich_response?.status === 401) {
            setIsApiKeyError(true)
            toast.error('Invalid API Key, please, try again', { duration: 5000 })

            nProgress.done()

            return
          }

          enrichedCompanies.push(enrich_response.veridion_id)

          if (enrich_response.error) {
            await processEnrichCompany(company, { status: 'Error', api_error: enrich_response.message })
          } else {
            const isCompanyUnique = !(enrichedCompanies.filter(id => id === enrich_response.veridion_id).length > 1)

            await processEnrichCompany(company, {
              ...enrich_response,
              api_error: '',
              status: isCompanyUnique ? 'Enriched' : 'Duplicate'
            })
          }
        } else {
          switch (match_enrich_response.status) {
            case 404: {
              await processEnrichCompany(company, { api_error: '', status: 'Not Enriched' })
              nProgress.done()

              break
            }

            case 401: {
              setIsApiKeyError(true)
              toast.error('Invalid API Key, please, try again', {
                duration: 5000
              })
              nProgress.done()

              return
            }

            default: {
              const enrich_response = await match_enrich_response.json()

              await processEnrichCompany(company, { api_error: enrich_response.message, status: 'Error' })
              break
            }
          }
        }

        await new Promise(resolve => setTimeout(resolve, delayBetweenRequests))
      } catch (error) {
        nProgress.done()
        console.error('Upload error:', error)
      }
    }

    setEnrichmentInProcess(false)
    toast.success('Batch enrichment has finished')
    nProgress.done()

    setApiKey('')
  }

  const handleFileUpload = async () => {
    if (file) {
      try {
        const response = await uploadFile(file, expectedHeaders)

        if (response.ok) {
          const uploadResponse = await response.json()
          const uploadedCompanies = await prepareCSVDataForEnrichment(uploadResponse.rows as CsvCompanyUploadType[])
          const csvDataInvalidCompanies = validateParsedCsvData(uploadedCompanies)
          if (companies.length + uploadedCompanies.length > MAX_COMPANIES_TO_ENRICH) {
            setIsOverLimit(true)

            setParsedData(uploadedCompanies)

            if (!!csvDataInvalidCompanies.length) {
              setFileError(true)
              setInvalidCompanies(csvDataInvalidCompanies)

              return
            }

            return
          }

          if (!!csvDataInvalidCompanies.length) {
            setFileError(true)
            setParsedData(uploadedCompanies)
            setInvalidCompanies(csvDataInvalidCompanies)

            return
          }
          handleEnrichCompanies(uploadedCompanies)
        } else {
          const { error } = await response.json()

          toast.error(error)

          console.error('Upload error:', error)
        }
      } catch (error) {
        console.error('Upload error:', error)
      }
    }
  }

  const handleClose = () => {
    setIsOverLimit(false)
    setFileError(false)
    setInvalidCompanies([])
  }

  const handleProceedEnrichment = () => {
    if (parsedData.length < 1) {
      console.log('parsed data error')

      return
    }

    handleClose()

    const companiesLength = companies.length

    handleEnrichCompanies(parsedData.slice(0, isOverLimitTotalLength ? 0 : MAX_COMPANIES_TO_ENRICH - companiesLength))
  }

  const handleApiKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isApiKeyError) {
      setIsApiKeyError(false)
    }
    setApiKey(e.target.value)
  }

  const deleteCompaniesHandler = async () => {
    nProgress.start()
    try {
      for (let i = 0; i < selectedCompanies.length; i++) {
        await fetch('/api/db_transactions/delete_entry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(selectedCompanies[i])
        })
      }

      setCompanies(companies.filter(({ id }) => !selectedCompanies.includes(id)))
      setSelectedCompanies([])
    } catch (error) {
      console.log(error)
    } finally {
      nProgress.done()
    }
  }

  const addEnrichedCompany = useCallback((company: CompanyMatchEnrichFromDb) => {
    setCompanies(prev => [company, ...prev])
  }, [])

  const checkIsCompanyUnique = useCallback(
    (company: CompanyMatchEnrichFromDb) => {
      return !(companies.filter(c => c.veridion_id === company.veridion_id).length >= 1)
    },
    [companies]
  )

  const setMatchDetailsHandler = (newMatchDetails: MatchDetails) => {
    setMatchDetails(newMatchDetails)
  }

  const setInputFieldsHandler = (newInputFields: InputFieldsType) => {
    setInputFields(newInputFields)
  }

  const setMainAddressHandler = (newMainAddress: Address) => {
    setMainAddress(newMainAddress)
  }

  const setRegisteredAddressHandler = (newMainAddress: Address) => {
    setRegisteredAddress(newMainAddress)
  }

  const setLocationsHandler = (newLocations: Address[]) => {
    setLocations(newLocations)
  }

  const setNaicsSecondaryHandler = (newCodes: CodeLabel[]) => {
    setNaicsSecondary(newCodes)
  }

  const setNaceRev2Handler = (newCodes: CodeLabel[]) => {
    setNaceRev2(newCodes)
  }

  const setSicHandler = (newCodes: CodeLabel[]) => {
    setSic(newCodes)
  }

  const setIsicHandler = (newCodes: CodeLabel[]) => {
    setIsic(newCodes)
  }

  const setNcciHandler = (newCodes: string[]) => {
    setNcci(newCodes)
  }

  const onClickExportButton = () => {
    const idsToExport = gridFilteredSortedRowIdsSelector(apiRef).filter(id =>
      selectedCompanies.length ? selectedCompanies.includes(id) : true
    )

    const companiesToExport: CompanyMatchEnrichFromDb[] = []

    idsToExport.forEach(id => {
      const company = filteredCompanies.find(c => c.id === id)

      if (company) {
        companiesToExport.push(company)
      }
    })

    return companiesToExport
  }

  React.useEffect(() => {
    async function fetchCompaniesFromDb() {
      const companiesFromDb = await fetchDataFromDb<CompanyMatchEnrichFromDb[]>(
        '/api/db_transactions/fetch_watchlist_entries_from_db'
      )
      if (companiesFromDb) {
        const companiesWithStatus: CompanyMatchEnrichFromDb[] = companiesFromDb.map(company => ({
          ...company
        }))

        setCompanies(companiesWithStatus)
      }
    }
    fetchCompaniesFromDb()
  }, [])

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  return (
    <Grid container spacing={2}>
      {enrichmentInProcess && (
        <Grid item xs={12} marginBottom={4}>
          <Alert severity='info'>Please don't navigate away from the page while the batch enrichment is running.</Alert>
        </Grid>
      )}

      <Grid xs={12} item position='relative'>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundSize: 'cover',
            backgroundColor: 'transparent',
            backgroundImage: 'url(/images/pages/header-bg.png)',
            borderRadius: 2,
            opacity: 0.7,
            zIndex: -1
          }}
        ></Box>
        <Grid
          xs={12}
          item
          container
          sx={{
            padding: 7,
            borderRadius: 2
          }}
        >
          <TabContext value={activeTab}>
            <Grid container item xs={12}>
              <Grid xs={12} md={4.4} item>
                <Typography variant='h3' mb={4} textAlign='center'>
                  Choose the enrichment type
                </Typography>

                <TabList orientation='vertical' onChange={handleChange} sx={{ marginRight: 0 }}>
                  <Tab key='batch' value='batch' label='Batch' />

                  <Box display='flex' justifyContent='center'>
                    <Divider orientation='vertical' />
                  </Box>

                  <Tab key='single' value='single' label='Single' />
                </TabList>

                {!!companies.length && (
                  <Grid item xs={12} mt={8}>
                    <CompaniesAnalytics companies={companies} />
                  </Grid>
                )}
              </Grid>

              <Grid
                item
                xs={12}
                md={0.8}
                display={isMdScreen ? 'block' : 'flex'}
                justifyContent='center'
                sx={{ paddingTop: isMdScreen ? 8 : 0, height: isMdScreen ? 'auto' : '100%' }}
              >
                <Divider orientation={isMdScreen ? 'horizontal' : 'vertical'} />
              </Grid>

              <Grid xs={12} md={6.8} item>
                <Box
                  sx={{
                    marginTop: 8,
                    '@media (min-width: 900px)': {
                      marginTop: 0
                    }
                  }}
                >
                  <TabPanel
                    key='batch'
                    value='batch'
                    sx={{
                      padding: 0
                    }}
                  >
                    <Grid item container xs={12} display='flex' direction='column'>
                      <Stack
                        spacing={2}
                        direction='column'
                        alignItems='flex-end'
                        justifyContent='space-between'
                        flex='1 1 0'
                      >
                        <Grid container item xs={12}>
                          <Grid xs={3.5} item>
                            <Button
                              variant='outlined'
                              component='label'
                              sx={{ width: '100%' }}
                              startIcon={<Icon fontSize='1.5rem' icon='solar:file-broken' />}
                            >
                              Upload File
                              <input
                                hidden
                                accept={'.csv'}
                                type={'file'}
                                id={'csvFileInput'}
                                onChange={handleFileChange}
                              />
                            </Button>
                          </Grid>

                          <Grid xs={5.5} item>
                            <CustomTextField
                              value={apiKey}
                              onChange={handleApiKeyInputChange}
                              placeholder='API Key'
                              error={isApiKeyError}
                              translate='no'
                              autoComplete='off'
                              type='password'
                              sx={{ width: '100%', paddingInline: 2, '.MuiInputBase-root': { width: '100%' } }}
                            />
                          </Grid>

                          <Grid xs={3} item>
                            {file && apiKey.trim() ? (
                              <Button
                                variant='outlined'
                                sx={{ width: '100%' }}
                                startIcon={<Icon fontSize='1.5rem' icon='solar:upload-broken' />}
                                onClick={() => {
                                  handleFileUpload()
                                  trackOnClick('enrich_file')
                                }}
                              >
                                Enrich File
                              </Button>
                            ) : (
                              <Button
                                disabled
                                variant='outlined'
                                sx={{ width: '100%' }}
                                startIcon={<Icon fontSize='1.5rem' icon='solar:upload-broken' />}
                              >
                                Enrich File
                              </Button>
                            )}
                          </Grid>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          marginTop={2}
                          justifyContent='flex-end'
                          alignItems='flex-end'
                          display='flex'
                          width='100%'
                        >
                          <Stack
                            spacing={2}
                            direction='row'
                            alignItems='center'
                            justifyContent={file ? 'space-between' : 'flex-end'}
                            width='100%'
                          >
                            {file ? (
                              <Typography sx={{ fontSize: 14 }} color='text.secondary'>
                                <b>Uploaded file:</b> {file.name}
                              </Typography>
                            ) : (
                              ''
                            )}

                            <Button
                              variant='outlined'
                              startIcon={<Icon fontSize='1.5rem' icon='solar:download-broken' />}
                              onClick={() => handleFileDownload()}
                            >
                              Download sample
                            </Button>
                          </Stack>
                        </Grid>
                      </Stack>
                    </Grid>
                  </TabPanel>

                  <TabPanel key='single' value='single' sx={{ padding: 0 }}>
                    <Grid item xs={12}>
                      <EnrichSingleCompany
                        addEnrichedCompany={addEnrichedCompany}
                        checkIsCompanyUnique={checkIsCompanyUnique}
                        isOverLimitTotalLength={isOverLimitTotalLength}
                        maxLimit={MAX_COMPANIES_TO_ENRICH}
                        companiesLength={companies.length}
                      />
                    </Grid>
                  </TabPanel>
                </Box>
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      </Grid>

      <Grid xs={12} container item spacing={4} mb={8}>
        {!!companies.filter(({ status }) => status === 'Enriched').length && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader sx={{ pb: 0 }} title='Fill rates' />

              <CardContent>
                <FillRatesAnalytics companies={companies.filter(({ status }) => status === 'Enriched')} />
              </CardContent>
            </Card>
          </Grid>
        )}

        {!!companies.filter(({ status }) => status === 'Enriched').length && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader sx={{ pb: 0, mb: 4 }} title='Enriched companies by match method' />

              <CardContent
                sx={{
                  '@media(max-width: 424px)': {
                    paddingLeft: 2,
                    paddingRight: 2
                  }
                }}
              >
                <MatchMethodAnalytics companies={companies.filter(({ status }) => status === 'Enriched')} />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Grid item xs={12} md={4} marginTop={4}>
        <Autocomplete
          size='small'
          options={inputFileNames}
          renderInput={params => <TextField {...params} variant='outlined' label='Select input files' />}
          filterSelectedOptions
          multiple
          value={value}
          inputValue={inputValue}
          sx={{ marginLeft: 4 }}
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

      <Grid item xs={12} marginTop={8}>
        <div>
          {companies ? (
            <DataGrid
              apiRef={apiRef}
              style={{ overflow: 'hidden' }}
              autoHeight={false}
              rows={filteredCompanies}
              columns={mainDataGridColumns(
                setMatchDetailsHandler,
                setInputFieldsHandler,
                setMainAddressHandler,
                setRegisteredAddressHandler,
                setLocationsHandler,
                setNaicsSecondaryHandler,
                setNaceRev2Handler,
                setSicHandler,
                setIsicHandler,
                setNcciHandler
              )}
              pagination
              checkboxSelection
              disableRowSelectionOnClick
              getRowHeight={() => 'auto'}
              onRowSelectionModelChange={setSelectedCompanies}
              rowSelectionModel={selectedCompanies}
              initialState={{
                columns: {
                  columnVisibilityModel
                }
              }}
              slots={{
                toolbar: () => CustomToolbar(!!selectedCompanies.length, deleteCompaniesHandler, onClickExportButton),
                cell: params => <ExpandableCell {...params} />
              }}
              slotProps={{
                columnsPanel: {
                  sx: {
                    '.MuiDataGrid-columnsPanelRow:has(.Mui-disabled)': {
                      display: 'none'
                    }
                  }
                }
              }}
              getRowClassName={params => {
                switch (params.row.status) {
                  case 'Error':
                    return `super-app-theme--Rejected`
                  case 'Not Enriched':
                    return `super-app-theme--Not-Enriched`
                  default:
                    return ''
                }
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
                },

                '.MuiDataGrid-main .MuiDataGrid-virtualScroller .MuiDataGrid-cell': {
                  overflow: 'hidden'
                }
              })}
            />
          ) : (
            ''
          )}
        </div>
      </Grid>

      <Dialog
        open={isOverLimit || isFileHasError}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        fullWidth
        maxWidth='md'
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
            textAlign: 'center'
          }}
        >
          {isOverLimit &&
            (!isOverLimitTotalLength ? (
              <>
                <Typography id='modal-modal-title' variant='h5' component='h2'>
                  Too many companies
                </Typography>

                <Typography id='modal-modal-description' sx={{ mt: 2 }}>
                  In the current version, we don't allow enriching more than {MAX_COMPANIES_TO_ENRICH} companies in
                  total. We will enrich the first {MAX_COMPANIES_TO_ENRICH - companies.length} number of companies and
                  disregard the rest. If you'd like to enrich more than {MAX_COMPANIES_TO_ENRICH} companies, please
                  contact us at <Link href='mailto:sales@veridion.com'>sales@veridion.com</Link> or you can try to
                  upload a different file.
                </Typography>
              </>
            ) : (
              <>
                <Typography id='modal-modal-title' variant='h5' component='h2'>
                  You already enriched {MAX_COMPANIES_TO_ENRICH} companies
                </Typography>

                <Typography id='modal-modal-description' sx={{ mt: 2 }}>
                  If you'd like to enrich more than {MAX_COMPANIES_TO_ENRICH} companies, please contact us at{' '}
                  <Link href='mailto:sales@veridion.com'>sales@veridion.com</Link>.
                </Typography>
              </>
            ))}

          {isFileHasError && !isOverLimitTotalLength && (
            <>
              <Typography id='modal-modal-title' variant='h5' component='h2' sx={{ mt: 6 }}>
                Missing required fields
              </Typography>

              <Typography id='modal-modal-description' sx={{ mt: 2 }}>
                Records do not have the mandatory fields filled in. Each record must contain values for at least one of
                the 'legal_names' and 'commercial_names' fields, and at least one of the following fields:
                'address_txt', 'website', or 'phone_number'. If this condition is not met, the request for that record
                will be rejected with a 400 Bad Request response status.
              </Typography>

              <DataGrid
                autoHeight={true}
                rows={invalidCompanies}
                columns={companyInputColumns}
                hideFooterPagination={true}
                sx={{ mt: 4, height: 500 }}
                rowSelection={false}
              />
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button color='error' onClick={handleClose}>
              Cancel
            </Button>

            {!isOverLimitTotalLength && (
              <>
                <Button
                  variant='outlined'
                  component='label'
                  startIcon={<Icon fontSize='1.5rem' icon='solar:file-broken' />}
                >
                  Upload another file
                  <input
                    hidden
                    accept={'.csv'}
                    type={'file'}
                    id={'csvFileInput'}
                    onChange={e => {
                      handleFileChange(e)
                      setIsOverLimit(false)
                    }}
                  />
                </Button>

                <Button variant='contained' onClick={handleProceedEnrichment}>
                  OK, proceed
                </Button>
              </>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      <ComplexFieldsDialog open={!!matchDetails} onClose={() => setMatchDetails(null)} title='Match Details'>
        {matchDetails && (
          <Card>
            <CardContent>
              <List
                sx={{
                  gap: 2,
                  '.MuiListItem-root': {
                    p: 0
                  }
                }}
              >
                <ListItem sx={{ mb: 4 }}>
                  <ListItemText primary='Confidence Score' secondary={matchDetails.confidence_score} />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary='Matched On'
                    secondary={matchDetails.matched_on?.length ? matchDetails.matched_on.join(' | ') : ''}
                  />
                </ListItem>
              </List>

              {Object.entries(matchDetails.attributes).map(([key, field]) => {
                return (
                  <Card key={key} sx={{ mb: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                      <List
                        sx={{
                          gap: 2,
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          alignItems: 'flex-start',
                          '.MuiListItem-root': {
                            p: 0
                          }
                        }}
                      >
                        <ListItem>
                          <ListItemText primary='Attribute' secondary={key} />
                        </ListItem>

                        <ListItem>
                          <ListItemText primary='Confidence Score' secondary={field?.confidence_score} />
                        </ListItem>

                        {key === 'location' && (
                          <ListItem>
                            <ListItemText primary='Match Element' secondary={field?.match_element} />
                          </ListItem>
                        )}

                        <ListItem>
                          <ListItemText primary='Match Source' secondary={field?.match_source} />
                        </ListItem>

                        <ListItem>
                          <ListItemText primary='Match Type' secondary={field?.match_type} />
                        </ListItem>
                      </List>

                      <List
                        sx={{
                          '.MuiListItem-root': {
                            p: 0
                          }
                        }}
                      >
                        <ListItem>
                          <ListItemText
                            primary='Value'
                            secondary={
                              key === 'location' ? (
                                <List
                                  sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                    alignItems: 'flex-start',
                                    gap: 4
                                  }}
                                >
                                  {Object.entries(field.value).map(([locKey, locField]) => (
                                    <ListItem key={locKey}>
                                      <ListItemText
                                        primary={locKey.split('_').join(' ')}
                                        secondary={locField as string}
                                        sx={{
                                          textTransform: 'capitalize'
                                        }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              ) : (
                                field?.value
                              )
                            }
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                )
              })}
            </CardContent>
          </Card>
        )}
      </ComplexFieldsDialog>

      <ComplexFieldsDialog open={!!inputFields} onClose={() => setInputFields(null)} title='Input Fields'>
        {inputFields && (
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
                <ListItem sx={{ mb: 4 }}>
                  <ListItemText primary='Legal Names' secondary={inputFields.input_legal_names || ''} />
                </ListItem>

                <ListItem sx={{ mb: 4 }}>
                  <ListItemText primary='Commercial Names' secondary={inputFields.input_commercial_names || ''} />
                </ListItem>

                <ListItem sx={{ mb: 4 }}>
                  <ListItemText primary='Address' secondary={inputFields.input_address_txt || ''} />
                </ListItem>

                <ListItem sx={{ mb: 4 }}>
                  <ListItemText primary='Phone Number' secondary={inputFields.input_phone_number || ''} />
                </ListItem>

                <ListItem sx={{ mb: 4 }}>
                  <ListItemText
                    primary='Website'
                    secondary={
                      inputFields.input_website ? (
                        <Link href={inputFields.input_website} target='_blank'>
                          {inputFields.input_website}
                        </Link>
                      ) : (
                        ''
                      )
                    }
                  />
                </ListItem>

                <ListItem sx={{ mb: 4 }}>
                  <ListItemText
                    primary='Email'
                    secondary={
                      inputFields.input_email ? (
                        <Link href={`mailto:${inputFields.input_email}`} target='_blank'>
                          {inputFields.input_email}
                        </Link>
                      ) : (
                        ''
                      )
                    }
                  />
                </ListItem>

                <ListItem sx={{ mb: 4 }}>
                  <ListItemText primary='File Name' secondary={inputFields.input_file_name || ''} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        )}
      </ComplexFieldsDialog>

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

      <ComplexFieldsDialog
        open={!!registeredAddress}
        onClose={() => setRegisteredAddress(null)}
        title='Registered Address'
      >
        {registeredAddress && (
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
                {Object.entries(registeredAddress).map(([field, value]) => (
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

      <ComplexFieldsDialog open={!!locations} onClose={() => setLocations(null)} title='Locations'>
        {locations &&
          locations.map((location, key) => (
            <Card key={key} sx={{ mb: 4 }}>
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
                  {Object.entries(location).map(([field, value]) => (
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
          ))}
      </ComplexFieldsDialog>

      <ComplexFieldsDialog
        open={!!naicsSecondary}
        onClose={() => setNaicsSecondary(null)}
        title='NAICS Secondary Codes'
      >
        {naicsSecondary &&
          naicsSecondary.map((code, key) => (
            <Card key={key} sx={{ mb: 4 }}>
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
                  {Object.entries(code).map(([field, value]) => (
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
          ))}
      </ComplexFieldsDialog>

      <ComplexFieldsDialog open={!!naceRev2} onClose={() => setNaceRev2(null)} title='NACE REV 2 Codes'>
        {naceRev2 &&
          naceRev2.map((code, key) => (
            <Card key={key} sx={{ mb: 4 }}>
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
                  {Object.entries(code).map(([field, value]) => (
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
          ))}
      </ComplexFieldsDialog>

      <ComplexFieldsDialog open={!!sic} onClose={() => setSic(null)} title='SIC Codes'>
        {sic &&
          sic.map((code, key) => (
            <Card key={key} sx={{ mb: 4 }}>
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
                  {Object.entries(code).map(([field, value]) => (
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
          ))}
      </ComplexFieldsDialog>

      <ComplexFieldsDialog open={!!isic} onClose={() => setIsic(null)} title='ISIC V4 Codes'>
        {isic &&
          isic.map((code, key) => (
            <Card key={key} sx={{ mb: 4 }}>
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
                  {Object.entries(code).map(([field, value]) => (
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
          ))}
      </ComplexFieldsDialog>

      <ComplexFieldsDialog open={!!ncci} onClose={() => setNcci(null)} title='NCII Codes 28 1'>
        {ncci && (
          <Card sx={{ mb: 4 }}>
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
                {ncci.join(', ')}
              </List>
            </CardContent>
          </Card>
        )}
      </ComplexFieldsDialog>
    </Grid>
  )
}

const CompaniesAnalytics: React.FC<{ companies: CompanyMatchEnrichTypeForSave[] }> = ({ companies }) => {
  const slide = {
    details: {
      Enriched: companies.filter(({ status }) => status === 'Enriched').length,
      'Not Enriched': companies.filter(({ status }) => status === 'Not Enriched').length,
      Errors: companies.filter(({ status }) => status === 'Error').length,
      Duplicates: companies.filter(({ status }) => status === 'Duplicate').length
    }
  }

  return (
    <Box
      sx={{
        p: 6,
        borderRadius: 2,
        backgroundColor: 'primary.main',
        height: '100%',
        '& .MuiTypography-root': { color: 'common.white' }
      }}
    >
      <Typography variant='h5' sx={{ mb: 0.5 }}>
        Enriched companies stats
      </Typography>

      <Typography variant='body2' sx={{ mb: 4.5 }}>
        {companies.length} companies in total
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={12}>
          <Grid container spacing={4.5}>
            {Object.keys(slide.details).map((key: string, index: number) => {
              return (
                <Grid item key={index} xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontWeight: 500,
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {slide.details[key as keyof typeof slide.details]}
                    </CustomAvatar>
                    <Typography noWrap>{key}</Typography>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

const MatchMethodAnalytics: React.FC<{ companies: CompanyMatchEnrichFromDb[] }> = ({ companies }) => {
  const theme = useTheme()

  const statistics = companies.reduce((acc, cur) => {
    if (cur.match_details?.attributes) {
      const allAttributes: [string, MatchMethod | LocationAttribute][] = Object.entries(cur.match_details?.attributes)
      allAttributes.forEach(([key, values]) => {
        if (values.match_source && values.match_type) {
          const match_method =
            key === 'website'
              ? 'website'
              : key === 'location'
              ? `${values.match_type}_${values.match_source}_${
                  (values as LocationAttribute).match_element
                }`.toLowerCase()
              : `${values.match_type}_${values.match_source}`.toLowerCase()

          if (!acc[match_method]) {
            acc[match_method] = 1
          } else {
            acc[match_method] = acc[match_method] + 1
          }
        }
      })
    }

    return acc
  }, {} as { [key: string]: number })

  const dataArray = Object.values(statistics)

  const series = [{ data: dataArray.map(value => (value * 100) / companies.length) }]

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
        left: 0,
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

const hiddenFields = [
  'last_updated_at',
  'veridion_id',
  'id',
  'user_id',
  'status',
  'created_at',
  'updated_at',
  'api_error',
  'input_address_txt',
  'input_commercial_names',
  'input_email',
  'input_legal_names',
  'input_phone_number',
  'input_website'
]

const fillRatesColumns: GridColDef[] = [
  { field: 'attribute', headerName: 'Attribute', width: 200 },
  {
    field: 'num_of_companies',
    headerName: 'Companies',
    width: 120
  },
  {
    field: 'fill_rate',
    headerName: 'Fill Rate',
    width: 120,
    renderCell: params => `${params.value.toFixed(2)}%`
  }
]

const getFillRatesData = (companies: CompanyMatchEnrichTypeForSave[]) =>
  companies.reduce((acc, cur) => {
    Object.keys(cur).forEach(field => {
      if (!hiddenFields.includes(field)) {
        if (cur[field as keyof typeof cur]) {
          if (!acc[field]) {
            acc[field] = 1
          } else {
            acc[field] = acc[field] + 1
          }
        }
      }
    })

    return acc
  }, {} as { [key: string]: number })

const FillRatesAnalytics: React.FC<{ companies: CompanyMatchEnrichTypeForSave[] }> = ({ companies }) => {
  const fillRatesData = getFillRatesData(companies)

  const data = Object.entries(fillRatesData).map(([field, value]) => ({
    attribute: field,
    num_of_companies: value,
    fill_rate: (value * 100) / companies.length,
    id: field
  }))

  return (
    <DataGrid
      autoHeight={false}
      rows={data}
      columns={fillRatesColumns}
      hideFooterPagination={true}
      sx={{ mt: 4, height: 300 }}
      rowSelection={false}
      slotProps={{
        footer: {
          sx: {
            display: 'none'
          }
        }
      }}
    />
  )
}

export default UploadCompanies
