import React from 'react'

import { format } from 'date-fns'

import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem, { ListItemProps } from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Icon from 'src/@core/components/icon'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import { CompanyMatchEnrichFromDb } from 'src/types/apps/veridionTypes'
import { styled } from '@mui/material'

interface CompanyDetailsProps {
  company: CompanyMatchEnrichFromDb | undefined
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

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {company && (
          <Accordion key={company.id}>
            <AccordionSummary expandIcon={<Icon fontSize='1.5rem' icon='tabler:chevron-down' />}>
              <Typography variant='h1'>{company.company_name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container item xs={12} spacing={6}>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title='Core' />
                    <CardContent>
                      <List sx={{ width: '100%', maxWidth: 1500, bgcolor: 'background.paper' }}>
                        <ListItem>
                          <ListItemText
                            primary='Company ID'
                            secondary={company.veridion_id ? company.veridion_id : ''}
                          />
                          <ListItemText
                            primary='Created At'
                            secondary={company.created_at ? format(new Date(company.created_at), 'yyyy-MM-dd') : ''}
                          />
                          <ListItemText
                            primary='Last Updated At'
                            secondary={
                              company.last_updated_at ? format(new Date(company.last_updated_at), 'yyyy-MM-dd') : ''
                            }
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
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
                            primary='Company Commercial Names'
                            secondary={
                              company.company_commercial_names ? company.company_commercial_names.join(' | ') : ''
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='Company Legal Names'
                            secondary={company.company_legal_names ? company.company_legal_names.join(' | ') : ''}
                          />
                        </ListItem>

                        <ListItem>
                          <ListItemText primary='Company Type' secondary={company.company_type} />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='Extracted Short Description'
                            secondary={company.short_description ? company.short_description : ''}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='Extracted Long Description'
                            secondary={company.long_description_extracted ? company.long_description_extracted : ''}
                          />
                        </ListItem>
                        <GridListItem>
                          <ListItemText primary='Main Country Code' secondary={company.main_country_code} />
                          <ListItemText primary='Main Country' secondary={company.main_country} />
                          <ListItemText primary='Main Region' secondary={company.main_region} />
                        </GridListItem>
                        <GridListItem>
                          <ListItemText primary='Main City' secondary={company.main_city} />
                          <ListItemText
                            primary='Main Latitude'
                            secondary={company.main_latitude ? parseFloat(`${company.main_latitude}`).toFixed(3) : ''}
                          />
                          <ListItemText
                            primary='Main Longitude'
                            secondary={company.main_longitude ? parseFloat(`${company.main_longitude}`).toFixed(3) : ''}
                          />
                        </GridListItem>
                        <GridListItem>
                          <ListItemText primary='Main Postcode' secondary={company.main_postcode} />
                          <ListItemText primary='Main Street' secondary={company.main_street} />
                          <ListItemText primary='Main Street Number' secondary={company.main_street_number} />
                        </GridListItem>
                        <GridListItem>
                          <ListItemText
                            primary='Main Business Category'
                            secondary={company.main_business_category ? company.main_business_category : ''}
                          />
                          <ListItemText primary='Main Sector' secondary={company.main_sector} />
                          <ListItemText primary='Main Industry' secondary={company.main_industry} />
                        </GridListItem>
                        <GridListItem>
                          <ListItemText primary='Website Domain' secondary={company.website_domain} />
                          <ListItemText primary='Website Language Code' secondary={company.website_language_code} />
                          <ListItemText primary='Website TLD' secondary={company.website_tld} />
                        </GridListItem>
                        <ListItemButton
                          component='a'
                          href={company.website_url ? company.website_url : ''}
                          target='_blank'
                          sx={{ marginLeft: -1 }}
                        >
                          <ListItemText
                            primary='Website URL'
                            secondary={company.website_url ? company.website_url : ''}
                            secondaryTypographyProps={{
                              noWrap: true
                            }}
                          />
                        </ListItemButton>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardHeader title='Company Information' />
                    <CardContent>
                      <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
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
                              company.business_tags_extracted ? company.business_tags_extracted.join(' | ') : ''
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
                            primary='Phone Numbers'
                            secondary={company.phone_numbers ? company.phone_numbers.join(' | ') : ''}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='Primary Email'
                            secondary={company.primary_email ? company.primary_email : ''}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary='Emails' secondary={company.emails ? company.emails.join(' | ') : ''} />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title='Company Information' />
                    <CardContent>
                      <List sx={{ width: '100%', maxWidth: 1500, bgcolor: 'background.paper' }}>
                        <ListItem>
                          <ListItemText
                            primary='Employee Count'
                            secondary={
                              company.employee_count
                                ? company.employee_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                : ''
                            }
                          />
                          <ListItemText
                            primary='Revenue'
                            secondary={
                              company.revenue ? company.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                            }
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={7}>
                  <Card>
                    <CardHeader title='Industry & Insurance Classifications' />
                    <CardContent>
                      <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                        <ListItem>
                          <ListItemText
                            primary='NAICS 2022 Primary'
                            secondary={
                              company && company.naics_2022_primary_code
                                ? company.naics_2022_primary_code + ', ' + company.naics_2022_primary_label
                                : ''
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='NAICS 2022 Secondary'
                            secondary={
                              company && company.naics_2022_secondary
                                ? formatArrayOfObjects(company.naics_2022_secondary)
                                : ''
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='SIC'
                            secondary={company.sic ? formatArrayOfObjects(company.sic) : ''}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='SIC Sector'
                            secondary={
                              company.sics_sector ? company.sics_sector_code + '. ' + company.sics_sector_label : ''
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='SIC Sub Sector'
                            secondary={
                              company.sics_subsector_code
                                ? company.sics_subsector_code + ', ' + company.sics_subsector_label
                                : ''
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='SIC Industry'
                            secondary={
                              company.sics_industry_code
                                ? company.sics_industry_code + ', ' + company.sics_industry_label
                                : ''
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='ISIC 4'
                            secondary={company.isic_v4 ? formatArrayOfObjects(company.isic_v4) : ''}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='NACE Rev2'
                            secondary={company.nace_rev2 ? formatArrayOfObjects(company.nace_rev2) : ''}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='NCCI'
                            secondary={company.ncci_codes_28_1 ? company.ncci_codes_28_1.join(' | ') : ''}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary='IBC Insurance'
                            secondary={company.ibc_insurance ? formatArrayOfObjects(company.ibc_insurance) : ''}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={5}>
                  <Card>
                    <CardHeader title='Digital Presence' />
                    <CardContent>
                      <List sx={{ width: '100%', maxWidth: 660, bgcolor: 'background.paper' }}>
                        {company.linkedin_url ? (
                          <ListItemButton
                            component='a'
                            href={company.linkedin_url}
                            target='_blank'
                            sx={{ marginLeft: -1 }}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='mdi:linkedin' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='LinkedIn'
                              secondary={company.linkedin_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItemButton>
                        ) : (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='mdi:linkedin' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='LinkedIn'
                              secondary={company.linkedin_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItem>
                        )}
                        {company.facebook_url ? (
                          <ListItemButton
                            component='a'
                            href={company.facebook_url}
                            target='_blank'
                            sx={{ marginLeft: -1 }}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='ic:baseline-facebook' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='Facebook'
                              secondary={company.facebook_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItemButton>
                        ) : (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='ic:baseline-facebook' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='Facebook'
                              secondary={company.facebook_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItem>
                        )}
                        {company.twitter_url ? (
                          <ListItemButton
                            component='a'
                            href={company.twitter_url}
                            target='_blank'
                            sx={{ marginLeft: -1 }}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='simple-icons:x' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='Twitter'
                              secondary={company.twitter_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItemButton>
                        ) : (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='simple-icons:x' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='Twitter'
                              secondary={company.twitter_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItem>
                        )}
                        {company.instagram_url ? (
                          <ListItemButton
                            component='a'
                            href={company.instagram_url}
                            target='_blank'
                            sx={{ marginLeft: -1 }}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='mdi:instagram' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='Instagram'
                              secondary={company.instagram_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItemButton>
                        ) : (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='mdi:instagram' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='Instagram'
                              secondary={company.instagram_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItem>
                        )}
                        {company.youtube_url ? (
                          <ListItemButton
                            component='a'
                            href={company.youtube_url}
                            target='_blank'
                            sx={{ marginLeft: -1 }}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='ri:youtube-line' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='YouTube'
                              secondary={company.youtube_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItemButton>
                        ) : (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='ri:youtube-line' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='YouTube'
                              secondary={company.youtube_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItem>
                        )}
                        {company.ios_app_url ? (
                          <ListItemButton
                            component='a'
                            href={company.ios_app_url}
                            target='_blank'
                            sx={{ marginLeft: -1 }}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='cib:app-store-ios' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='iOS App'
                              secondary={company.ios_app_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItemButton>
                        ) : (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='cib:app-store-ios' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='iOS App'
                              secondary={company.ios_app_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItem>
                        )}
                        {company.android_app_url ? (
                          <ListItemButton
                            component='a'
                            href={company.android_app_url}
                            target='_blank'
                            sx={{ marginLeft: -1 }}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='material-symbols:android' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='Android App'
                              secondary={company.android_app_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItemButton>
                        ) : (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <Icon fontSize='1.5rem' icon='material-symbols:android' />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary='Android App'
                              secondary={company.android_app_url}
                              secondaryTypographyProps={{
                                noWrap: true
                              }}
                            />
                          </ListItem>
                        )}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title='Technology Insight' />
                    <CardContent>
                      <List sx={{ width: '100%', maxWidth: 1500, bgcolor: 'background.paper' }}>
                        <ListItem>
                          <ListItemText
                            primary='Technologies'
                            secondary={company.technologies ? company.technologies.join(' | ') : ''}
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

export default CompanyDetails
