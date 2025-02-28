import React from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Divider from '@mui/material/Divider'
import CustomTextField from 'src/@core/components/mui/text-field'

import nProgress from 'nprogress'
import { CompanyMatchEnrichFromDb, SingleCompanyEnrichType } from 'src/types/apps/veridionTypes'
import jwt from 'jsonwebtoken'
import toast from 'react-hot-toast'
import { Box, Link } from '@mui/material'

//TODO: delete after implementing all fields as in the product API
import { useAuth } from 'src/hooks/useAuth'
import { companyRecordsToEnrich } from '../upload_companies/constants'

interface EnrichSingleCompanyProps {
  addEnrichedCompany: (company: CompanyMatchEnrichFromDb) => void
  checkIsCompanyUnique: (company: CompanyMatchEnrichFromDb) => boolean
  isOverLimitTotalLength: boolean
  maxLimit: number
  companiesLength: number
}

const inputCompanyInitialState: SingleCompanyEnrichType = {
  commercial_names: [],
  legal_names: [],
  address_txt: '',
  phone_number: '',
  website: '',
  email: '',
  registry_id: ''
}

const EnrichSingleCompany: React.FC<EnrichSingleCompanyProps> = React.memo(
  ({ addEnrichedCompany, checkIsCompanyUnique, isOverLimitTotalLength, maxLimit, companiesLength }) => {
    const [apiKey, setApiKey] = React.useState('')
    const [isApiKeyError, setIsApiKeyError] = React.useState(false)
    const [companyInputs, setCompanyInputs] = React.useState<SingleCompanyEnrichType>(inputCompanyInitialState)

    const { trackOnClick } = useAuth()

    const saveEnrichedData = async (company: SingleCompanyEnrichType, enrich_response: any) => {
      if (checkIsCompanyUnique(enrich_response)) {
        nProgress.start()
        const res = await fetch('/api/db_transactions/save_enriched_data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputData: company,
            enrichedData: {
              ...companyRecordsToEnrich,
              ...enrich_response,
              status: 'Enriched',
              api_error: '',
              input_file_name: '',
              is_product: false,
              product: {
                headline: '',
                content: '',
                url: ''
              }
            }
          })
        })

        if (res.ok) {
          toast.success('The company was successfully added to watchlist', { duration: 3000 })
        } else {
          nProgress.done()
          toast.error('Failed to add company to watchlist', { duration: 3000 })
        }

        const result = await res.json()

        if (result.id) {
          addEnrichedCompany({
            ...enrich_response,
            id: result.id,
            status: 'Enriched',
            api_error: '',
            input_file_name: '',
            input_legal_names: companyInputs.legal_names?.join(' | '),
            input_commercial_names: companyInputs.commercial_names?.join(' | '),
            input_phone_number: companyInputs.phone_number,
            input_website: companyInputs.website,
            input_email: companyInputs.email,
            input_registry_id: companyInputs.registry_id,
            input_address_txt: companyInputs.address_txt
          })
        }
        nProgress.done()
        toast.success('Enrichment is complete')

        return result.id
      }

      toast.error('You already have this company in your watchlist')

      nProgress.done()
    }

    const handleEnrichCompany = async (company: SingleCompanyEnrichType) => {
      nProgress.start()

      if (isOverLimitTotalLength) {
        toast.error(
          <Box>
            In the current version, we don't allow enriching more than {maxLimit} companies in total. We will enrich the
            first {maxLimit - companiesLength + 1} number of companies and disregard the rest. If you'd like to enrich
            more than {maxLimit} companies, please contact us at{' '}
            <Link href='mailto:sales@veridion.com'>sales@veridion.com</Link> or you can try to
          </Box>
        )

        return
      }

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
            nProgress.done()
            toast.error('Invalid API Key, please, try again', { duration: 5000 })

            return
          }

          if (enrich_response.error) {
            nProgress.done()
            toast.error(enrich_response.message, { duration: 8000 })
          } else {
            nProgress.done()
            setApiKey('')
            setCompanyInputs(inputCompanyInitialState)

            saveEnrichedData(companyInputs, enrich_response)

            // onDataReceived(enrich_response)
          }
        } else {
          switch (match_enrich_response.status) {
            case 404: {
              nProgress.done()
              toast.error('Company could not be enriched. Please try different inputs.', {
                duration: 5000
              })

              break
            }

            case 401: {
              setIsApiKeyError(true)
              nProgress.done()
              toast.error('Invalid API Key, please, try again', {
                duration: 5000
              })

              break
            }

            default: {
              nProgress.done()
              toast.error('Invalid inputs provided. Please try different ones.', {
                duration: 5000
              })
            }
          }
        }

        await new Promise(resolve => resolve)
      } catch (error) {
        console.error('Enrich error:', error)
      }

      setApiKey('')
    }

    const handleApiKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isApiKeyError) {
        setIsApiKeyError(false)
      }
      setApiKey(e.target.value)
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Divider textAlign='left'>
            <Typography paddingBottom={2} paddingTop={2} fontSize={12}>
              Required - press enter after each commercial or legal name
            </Typography>
          </Divider>

          <Grid container xs={12} spacing={2}>
            <Grid item xs={6}>
              <Autocomplete
                id='commercial-names-input'
                size='small'
                multiple
                freeSolo
                value={companyInputs.commercial_names || []}
                options={[]}
                getOptionLabel={option => option}
                onChange={(event, newInputValue) => {
                  setCompanyInputs((prevCompany: SingleCompanyEnrichType) => {
                    return { ...prevCompany, commercial_names: newInputValue }
                  })

                  return
                }}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === 'clear') {
                    setCompanyInputs((prevCompany: SingleCompanyEnrichType) => {
                      return { ...prevCompany, commercial_names: [] }
                    })

                    return
                  }
                }}
                renderInput={params => <TextField {...params} variant='outlined' label='Commercial Names' />}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                id='legal-names-input'
                size='small'
                multiple
                freeSolo
                value={companyInputs.legal_names || []}
                options={[]}
                getOptionLabel={option => option}
                onChange={(event, newInputValue) => {
                  setCompanyInputs((prevCompany: SingleCompanyEnrichType) => {
                    return { ...prevCompany, legal_names: newInputValue }
                  })

                  return
                }}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === 'clear') {
                    setCompanyInputs((prevCompany: SingleCompanyEnrichType) => {
                      return { ...prevCompany, legal_names: [] }
                    })

                    return
                  }
                }}
                renderInput={params => <TextField {...params} variant='outlined' label='Legal Names' />}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                id='country-input'
                size='small'
                freeSolo
                value={companyInputs.address_txt}
                options={[]}
                getOptionLabel={option => option}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === 'clear') {
                    setCompanyInputs((prevCompany: SingleCompanyEnrichType) => {
                      return { ...prevCompany, address_txt: '' }
                    })

                    return
                  } else {
                    setCompanyInputs((prevCompany: SingleCompanyEnrichType) => {
                      return { ...prevCompany, address_txt: newInputValue }
                    })
                  }
                }}
                renderInput={params => <TextField {...params} variant='outlined' label='Address' />}
              />
            </Grid>
          </Grid>

          <Divider textAlign='left'>
            <Typography paddingBottom={2} paddingTop={2} fontSize={12}>
              Optional
            </Typography>
          </Divider>

          <Grid container xs={12} spacing={2}>
            <Grid item xs={12} mb={4}>
              <Autocomplete
                id='registry-id-input'
                multiple={false}
                size='small'
                freeSolo
                value={companyInputs.registry_id}
                options={[]}
                getOptionLabel={option => option}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === 'clear') {
                    setCompanyInputs((prevCompany: SingleCompanyEnrichType) => {
                      return { ...prevCompany, registry_id: '' }
                    })

                    return
                  } else {
                    setCompanyInputs((prevCompany: SingleCompanyEnrichType) => {
                      return { ...prevCompany, registry_id: newInputValue }
                    })
                  }
                }}
                renderInput={params => <TextField {...params} variant='outlined' label='Registry Id' />}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                id='phone-number-input'
                multiple={false}
                size='small'
                freeSolo
                value={companyInputs.phone_number}
                options={[]}
                getOptionLabel={option => option}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === 'clear') {
                    setCompanyInputs((prevCompany: SingleCompanyEnrichType) => {
                      return { ...prevCompany, phone_number: '' }
                    })

                    return
                  } else {
                    setCompanyInputs((prevCompany: SingleCompanyEnrichType) => {
                      return { ...prevCompany, phone_number: newInputValue }
                    })
                  }
                }}
                renderInput={params => <TextField {...params} variant='outlined' label='Phone number' />}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                id='website-input'
                size='small'
                freeSolo
                value={companyInputs.website}
                options={[]}
                getOptionLabel={option => option}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === 'clear') {
                    setCompanyInputs((prevCompany: SingleCompanyEnrichType) => {
                      return { ...prevCompany, website: '' }
                    })

                    return
                  } else {
                    setCompanyInputs((prevCompany: SingleCompanyEnrichType) => {
                      return { ...prevCompany, website: newInputValue }
                    })
                  }
                }}
                renderInput={params => <TextField {...params} variant='outlined' label='Website' />}
              />
            </Grid>
          </Grid>

          <Divider textAlign='left'>
            <Typography paddingBottom={2} paddingTop={2} fontSize={12}>
              Submit
            </Typography>
          </Divider>

          <Grid container xs={12} spacing={2}>
            <Grid item xs={6}>
              <CustomTextField
                value={apiKey}
                onChange={handleApiKeyInputChange}
                placeholder='API Key'
                error={isApiKeyError}
                translate='no'
                autoComplete='off'
                type='password'
                sx={{ width: '100%', '.MuiInputBase-root': { width: '100%' } }}
              />
            </Grid>

            <Grid item xs={3}>
              <div>
                <Button
                  variant='outlined'
                  size='medium'
                  sx={{ width: '100%' }}
                  disabled={
                    ((companyInputs.commercial_names && companyInputs.commercial_names?.length > 0) ||
                      (companyInputs.legal_names && companyInputs.legal_names?.length > 0)) &&
                    companyInputs.address_txt
                      ? false
                      : true
                  }
                  endIcon={<Icon fontSize='1.5rem' icon='iconoir:spark' />}
                  onClick={() => {
                    if (companyInputs) {
                      handleEnrichCompany(companyInputs)
                      trackOnClick('enrich_company')
                    }
                  }}
                >
                  Enrich
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
)

export default EnrichSingleCompany
