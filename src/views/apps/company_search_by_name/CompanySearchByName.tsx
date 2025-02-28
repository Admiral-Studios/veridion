import { Box, Button, Card, CardContent, CircularProgress, Grid, MenuItem } from '@mui/material'
import { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import toast from 'react-hot-toast'
import jwt from 'jsonwebtoken'
import { CompanySearchProductFromDb } from 'src/types/apps/veridionTypes'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { addThousandsDelimiter } from 'src/utils/numbers/addThousandsDelimeter'
import CompanyDetailsAccordion from './components/CompanyDetailsAccordion'

const relations = ['equals', 'fuzzy match']

const CompanySearchByName = () => {
  const [isApiKeyError, setIsApiKeyError] = useState(false)
  const [apiKey, setApiKey] = useState('')

  const [isLoadingJsonResponse, setIsLoadingJsonResponse] = useState(false)

  const [relation, setRelation] = useState(relations[0])
  const [companyNameValue, setCompanyNameValue] = useState('')

  const [companiesCount, setCompaniesCount] = useState(NaN)

  const [companies, setCompanies] = useState<CompanySearchProductFromDb[]>([])

  const handleApiKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isApiKeyError) {
      setIsApiKeyError(false)
    }
    setApiKey(e.target.value)
  }

  const onChangeRelation = (rel: string) => {
    setRelation(rel)
  }

  const runSearch = async (paginationToken?: string) => {
    try {
      setIsLoadingJsonResponse(true)
      const filter = {
        filters: {
          and: [
            {
              attribute: 'company_name',
              relation: relation === 'fuzzy match' ? 'matches' : relation,
              value: companyNameValue
            }
          ]
        }
      }

      const { data } = await axios.post(
        `/api/veridion/company_search?page_size=10&${paginationToken ? `&pagination_token=${paginationToken}` : ''}`,
        {
          filters: JSON.stringify(filter)
        },
        {
          headers: {
            Authorization: jwt.sign({ apiKey }, process.env.NEXT_PUBLIC_JWT_SECRET || '')
          }
        }
      )

      setCompanies(data.result)
      setCompaniesCount(data.count)
      setIsLoadingJsonResponse(false)
    } catch (error) {
      toast.error('Failed to search')
      setIsLoadingJsonResponse(false)
    }
  }

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
      <Grid item xs={12} container spacing={2} mt={4} sx={{ pb: 10 }}>
        <Grid item xs={12} container spacing={4} mt={1} mb={4}>
          <Grid item xs={12}>
            <CustomTextField
              value={apiKey}
              onChange={handleApiKeyInputChange}
              placeholder='Enter API key to activate company search by name'
              error={isApiKeyError}
              translate='no'
              autoComplete='off'
              type='password'
              sx={{ width: '100%', '.MuiInputBase-root': { width: '100%' } }}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} mt={4}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Grid xs={12} item container spacing={8} sx={{ alignItems: 'flex-end' }}>
                <Grid xs={12} md={6} item>
                  <CustomTextField
                    fullWidth
                    placeholder='Company Name'
                    label='Company Name'
                    value={companyNameValue}
                    onChange={e => setCompanyNameValue(e.target.value)}
                  />
                </Grid>

                <Grid xs={12} md={3} item>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=''
                    value={relation}
                    label='Relation'
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
                      onChange: e => onChangeRelation(e.target.value as string)
                    }}
                  >
                    {relations.map(relation => (
                      <MenuItem
                        key={relation}
                        value={relation}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        {relation}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                <Grid xs={12} md={3} item>
                  <Button
                    fullWidth
                    variant='contained'
                    endIcon={<Icon icon='mdi:arrow-right' />}
                    disabled={!apiKey || isLoadingJsonResponse || !companyNameValue}
                    onClick={() => runSearch()}
                  >
                    Run Search
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} mt={4}>
          {!!companies.length && (
            <Box sx={{ display: 'flex', mb: 4 }}>
              <CustomAvatar
                color='primary'
                variant='rounded'
                sx={{
                  width: 'auto',
                  p: 2,
                  height: 30,
                  fontWeight: 500,
                  color: 'common.white',
                  backgroundColor: 'primary.dark'
                }}
              >
                Companies Count: {addThousandsDelimiter(companiesCount)}
              </CustomAvatar>
            </Box>
          )}

          {companies.map(company => (
            <CompanyDetailsAccordion key={company.veridion_id} company={company} />
          ))}
        </Grid>
      </Grid>
    </>
  )
}

export default CompanySearchByName
