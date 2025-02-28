import React, { useState } from 'react'

import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem, { ListItemProps } from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Icon from 'src/@core/components/icon'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import { Autocomplete, Box, Button, Link, TextField, Tooltip, styled } from '@mui/material'
import { ICompany } from 'src/d3/types/interfaces'
import toast from 'react-hot-toast'
import { ProductsProjectType } from 'src/types/apps/veridionTypes'

interface CompanyDetailsProps {
  company: ICompany | undefined
  saved: boolean
  projects: ProductsProjectType[]
  addProductProject: (company: ICompany, projectName: string) => Promise<void>
  changeSavedIds: React.Dispatch<React.SetStateAction<string[] | undefined>>
  searchBy: 'company_products' | 'company_keywords' | 'company_name'
}

const formatArrayOfObjects = (arr: any) =>
  arr
    .map((item: { [key: string]: string }) => {
      return Object.entries(item)
        .map(([key, value]) => {
          if (key === 'latitude' || key === 'longitude') return value ? parseFloat(value).toFixed(3) : ''

          return value
        })
        .join(', ')
    })
    .join(' | ')

const GridListItem = styled(ListItem)<ListItemProps>(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)'
}))

const CompanyProductsAccordion: React.FC<CompanyDetailsProps> = ({
  company,
  saved,
  projects,
  addProductProject,
  changeSavedIds,
  searchBy
}) => {
  const [isSaved, setIsSaved] = useState(saved)
  const [openTooltip, setOpenTooltip] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [createMode, setCreateMode] = useState(false)

  const [projectName, setProjectName] = useState<ProductsProjectType | null>(null)
  const [inputProjectValue, setInputProjectValue] = useState('')

  const [newProjectName, setNewProjectName] = useState('')

  const saveProductToWatchlist = async (company: ICompany) => {
    setOpenTooltip(false)
    setLoadingSave(true)
    try {
      await addProductProject(company, createMode ? newProjectName : projectName?.name || '')

      setProjectName(null)
      setNewProjectName('')
      setInputProjectValue('')

      setLoadingSave(false)

      toast.success('Company saved to watchlist')

      setCreateMode(false)

      setIsSaved(true)
    } catch (e: any) {
      if (e.message === 'exceeding the limit') {
        toast.error(
          <Box>
            You saved 100 companies. If you want to save more, please contact{' '}
            <Link href='mailto:sales@veridion.com'>sales@veridion.com</Link>.
          </Box>
        )
      } else {
        toast.error('Failed to save company to watchlist')
      }

      setLoadingSave(false)
    }
  }

  const deleteProductFromWatchlist = async (id: string) => {
    setLoadingSave(true)
    try {
      fetch('/api/db_transactions/delete_product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(id)
      })

      setIsSaved(false)
      setLoadingSave(false)
      changeSavedIds(prev => prev?.filter(savedId => id !== savedId))
    } catch (error) {
      toast.error('Failed to delete company from watchlist')
      setLoadingSave(false)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {company && (
          <Accordion key={company.id}>
            <AccordionSummary expandIcon={<Icon fontSize='1.5rem' icon='tabler:chevron-down' />}>
              <Box sx={{ width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 4,
                    borderBottom: '1px solid rgba(47, 43, 61, 0.18)'
                  }}
                >
                  {company?.website_url ? (
                    <Typography variant='h5'>
                      <Link href={company?.website_url} target='_blank'>
                        {company?.company_name}
                      </Link>
                    </Typography>
                  ) : (
                    <Typography variant='h5'>{company?.company_name}</Typography>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {!isSaved ? (
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
                            <Typography>
                              Add {searchBy === 'company_products' ? 'product' : 'company'} to project
                            </Typography>

                            {!createMode ? (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Autocomplete
                                  options={[
                                    ...projects,
                                    {
                                      id: 0,
                                      watchlist_id: 0,
                                      user_id: 0,
                                      name: 'add_new',
                                      created_at: '',
                                      updated_at: ''
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
                                  saveProductToWatchlist(company)
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
                          startIcon={<Icon icon='material-symbols:star' color={isSaved ? '#FBB03B' : '#e6e5e7'} />}
                          disabled={loadingSave}
                          onClick={e => {
                            e.stopPropagation()
                            setOpenTooltip(true)
                          }}
                          sx={{
                            color: '#b6b6b6'
                          }}
                        >
                          Save to shortlist
                        </Button>
                      </Tooltip>
                    ) : (
                      <Button
                        startIcon={<Icon icon='material-symbols:star' color={isSaved ? '#FBB03B' : '#e6e5e7'} />}
                        onClick={e => {
                          e.stopPropagation()
                          deleteProductFromWatchlist(company.veridion_id)
                        }}
                      >
                        Save to shortlist
                      </Button>
                    )}
                  </Box>
                </Box>

                <Box>
                  {searchBy === 'company_products' ? (
                    <>
                      <List
                        sx={{
                          display: 'flex',
                          gap: 2,
                          py: 2,
                          '.MuiListItem-root': {
                            p: 0
                          }
                        }}
                      >
                        <ListItem>
                          <ListItemText
                            primary='Product link:'
                            secondary={
                              company?.search_details?.product_match?.context?.url ? (
                                <Link href={company?.search_details?.product_match?.context?.url} target='_blank'>
                                  {company?.search_details?.product_match?.context?.headline}
                                </Link>
                              ) : (
                                company?.search_details?.product_match?.context?.headline
                              )
                            }
                          />
                        </ListItem>

                        {!!company?.search_details?.product_match?.supplier_types?.length && (
                          <ListItem>
                            <ListItemText
                              primary='Company supplier types:'
                              secondary={company?.search_details?.product_match?.supplier_types?.join(', ')}
                            />
                          </ListItem>
                        )}

                        <ListItem>
                          <ListItemText primary='Main country:' secondary={company.main_address.country} />
                        </ListItem>
                      </List>

                      <Typography variant='body2' fontSize={15} component='span'>
                        {company?.search_details?.product_match?.context?.content}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <List
                        sx={{
                          display: 'flex',
                          gap: 2,
                          py: 2,
                          '.MuiListItem-root': {
                            p: 0
                          }
                        }}
                      >
                        {searchBy === 'company_keywords' ? (
                          <ListItem>
                            <ListItemText
                              primary='Keywords match snippets:'
                              secondary={
                                company?.search_details?.keyword_match?.context?.snippets.length
                                  ? company?.search_details?.keyword_match?.context?.snippets.join(', ')
                                  : ''
                              }
                            />
                          </ListItem>
                        ) : (
                          <ListItem>
                            <ListItemText primary='Short description:' secondary={company?.short_description || ''} />
                          </ListItem>
                        )}

                        <ListItem>
                          <ListItemText primary='Main business category:' secondary={company.main_business_category} />
                        </ListItem>

                        <ListItem>
                          <ListItemText primary='City:' secondary={company.main_address.city} />
                        </ListItem>
                      </List>

                      <Typography variant='body2' fontSize={15} component='span'>
                        {company?.short_description}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container item xs={12} spacing={6}>
                {searchBy === 'company_products' && (
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title='Product Information' />
                      <CardContent>
                        <List sx={{ width: '100%', maxWidth: 1500, bgcolor: 'background.paper' }}>
                          <ListItem>
                            <ListItemText
                              primary='Product Headline'
                              secondary={
                                company?.search_details?.product_match?.context?.headline
                                  ? company?.search_details?.product_match?.context?.headline
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  : ''
                              }
                            />
                          </ListItem>

                          <ListItem>
                            <ListItemText
                              primary='Product Content'
                              secondary={
                                company?.search_details?.product_match?.context?.content
                                  ? company?.search_details?.product_match?.context?.content
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  : ''
                              }
                            />
                          </ListItem>

                          <ListItem>
                            <ListItemText
                              primary='Product Match Snippets'
                              secondary={
                                company?.search_details?.product_match?.context?.snippets.length
                                  ? company?.search_details?.product_match?.context?.snippets.join(', ')
                                  : ''
                              }
                            />
                          </ListItem>

                          {company?.search_details?.product_match?.context?.url && (
                            <ListItem>
                              <ListItemText
                                primary='Product URL'
                                secondary={
                                  <Link href={company?.search_details?.product_match?.context?.url} target='_blank'>
                                    {company?.search_details?.product_match?.context?.url || ''}
                                  </Link>
                                }
                              />
                            </ListItem>
                          )}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                <Grid item xs={12} md={8}>
                  <Card>
                    <CardHeader title='Company Information' icon='mdi:company' />
                    <CardContent>
                      <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                        <ListItem>
                          <ListItemText primary='Company Name' secondary={company.company_name} />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='Company Website'
                            secondary={
                              company.website_url ? <Link href={company.website_url}>{company.website_url}</Link> : ''
                            }
                          />
                        </ListItem>

                        <ListItem>
                          <ListItemText
                            primary='Company Type'
                            secondary={
                              company.search_details?.product_match?.supplier_types?.length
                                ? company.search_details?.product_match.supplier_types.join(', ')
                                : ''
                            }
                          />
                        </ListItem>

                        <ListItem>
                          <ListItemText
                            primary='Long Generated Description'
                            secondary={company.long_description_extracted ? company.long_description_extracted : ''}
                          />
                        </ListItem>
                        <GridListItem>
                          <ListItemText primary='Main Country Code' secondary={company.main_address.country_code} />

                          <ListItemText primary='Main Country' secondary={company.main_address.country} />

                          <ListItemText primary='Main Region' secondary={company.main_address.region} />
                        </GridListItem>

                        <GridListItem>
                          <ListItemText primary='Main City' secondary={company.main_address.city} />

                          <ListItemText
                            primary='Main Latitude'
                            secondary={
                              company.main_latitude ? parseFloat(`${company.main_address.latitude}`).toFixed(3) : ''
                            }
                          />

                          <ListItemText
                            primary='Main Longitude'
                            secondary={
                              company.main_longitude ? parseFloat(`${company.main_address.longitude}`).toFixed(3) : ''
                            }
                          />
                        </GridListItem>

                        <GridListItem>
                          <ListItemText primary='Main Postcode' secondary={company.main_address.postcode} />

                          <ListItemText primary='Main Street' secondary={company.main_address.street} />

                          <ListItemText primary='Main Street Number' secondary={company.main_address.street_number} />
                        </GridListItem>

                        <ListItem>
                          <ListItemText
                            primary='NAICS 2022 Primary Label'
                            secondary={company.naics_2022?.primary?.label}
                          />
                        </ListItem>

                        <ListItem>
                          <ListItemText
                            primary='NAICS 2022 Primary Code'
                            secondary={company.naics_2022?.primary?.code}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardHeader title='Company Information' />
                    <CardContent>
                      <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                        <ListItem
                          sx={{
                            gap: 8
                          }}
                        >
                          <ListItemText
                            primary='Revenue'
                            secondary={
                              company.revenue?.value
                                ? company.revenue.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                : ''
                            }
                          />

                          <ListItemText
                            primary='Employee Count'
                            secondary={
                              company.employee_count?.value
                                ? company.employee_count.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                : ''
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='Number of Locations'
                            secondary={company.num_locations ? company.num_locations : ''}
                          />

                          <ListItemText
                            primary='Year Founded'
                            secondary={company.year_founded ? company.year_founded : ''}
                          />
                        </ListItem>

                        <ListItem>
                          <ListItemText
                            primary='All Locations'
                            secondary={company.locations ? formatArrayOfObjects(company.locations) : ''}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='Business Tags'
                            secondary={
                              company.business_tags_generated ? company.business_tags_generated.join(' | ') : ''
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='Primary Phone'
                            secondary={company.primary_phone ? company.primary_phone : ''}
                          />
                        </ListItem>

                        <ListItem>
                          <ListItemText
                            primary='Primary Email'
                            secondary={company.primary_email ? company.primary_email : ''}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}
      </Grid>
    </Grid>
  )
}

export default CompanyProductsAccordion
