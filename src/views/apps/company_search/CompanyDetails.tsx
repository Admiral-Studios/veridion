import React from 'react'

import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
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

import { CompanyType } from 'src/types/apps/veridionTypes'

interface CompanyDetailsProps {
  returnedCompanies: CompanyType[]
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ returnedCompanies }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {returnedCompanies
          ? returnedCompanies.map(company => (
              <Accordion key={company.veridion_id}>
                <AccordionSummary expandIcon={<Icon fontSize='1.5rem' icon='tabler:chevron-down' />}>
                  <Typography variant='h1'>{company.company_name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container item xs={12} spacing={6}>
                    <Grid item xs={6} md={3}>
                      <Card>
                        <CardHeader title='Fundamentals' />
                        <CardContent>
                          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='mdi:company' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary='Company Name' secondary={company.company_name} />
                            </ListItem>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='tabler:image' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary='Commercial Names'
                                secondary={company.company_commercial_names ? company.company_commercial_names : ''}
                              />
                            </ListItem>
                            <ListItemButton
                              component='a'
                              href={company.website_url ? company.website_url : ''}
                              target='_blank'
                              sx={{ marginLeft: -1 }}
                            >
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='fluent-mdl2:website' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary='Website'
                                secondary={company.website_url ? company.website_url : ''}
                                secondaryTypographyProps={{
                                  noWrap: true
                                }}
                              />
                            </ListItemButton>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='tabler:image' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary='Year Founded'
                                secondary={company.year_founded ? company.year_founded : ''}
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card>
                        <CardHeader title='Geo' />
                        <CardContent>
                          <List sx={{ width: '100%', minWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='tabler:image' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary='Country' secondary={company.main_address.country} />
                            </ListItem>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='tabler:image' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary='Region' secondary={company.main_address.region} />
                            </ListItem>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='tabler:image' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary='City' secondary={company.main_address.city} />
                            </ListItem>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='tabler:image' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary='Address' secondary={company.main_address.street} />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader title='Descriptions' />
                        <CardContent>
                          <List sx={{ width: '100%', minWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='tabler:image' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary='Short'
                                secondary={company.short_description ? company.short_description : ''}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='tabler:image' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary='Long'
                                secondary={company.long_description_extracted ? company.long_description_extracted : ''}
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card>
                        <CardHeader title='SICS' />
                        <CardContent>
                          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='tabler:image' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary='SIC Sector'
                                secondary={
                                  company.sics_sector
                                    ? company.sics_sector.code + ' | ' + company.sics_sector.label
                                    : ''
                                }
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='tabler:image' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary='SIC Sub Sector'
                                secondary={
                                  company.sics_subsector
                                    ? company.sics_subsector.code + ' | ' + company.sics_subsector.label
                                    : ''
                                }
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='tabler:image' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary='SIC Industry'
                                secondary={
                                  company.sics_industry
                                    ? company.sics_industry.code + ' | ' + company.sics_industry.label
                                    : ''
                                }
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card>
                        <CardHeader title='Stats' />
                        <CardContent>
                          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='ic:outline-people' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary='Employees'
                                secondary={company.employee_count?.value ? company.employee_count?.value : ''}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='solar:dollar-broken' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary='Revenue'
                                secondary={company.revenue?.value ? company.revenue.value : ''}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='material-symbols:update' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary='Updated at'
                                secondary={company.last_updated_at ? company.last_updated_at.split('T')[0] : ''}
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader title='Socials' />
                        <CardContent>
                          <List sx={{ width: '100%', maxWidth: 660, bgcolor: 'background.paper' }}>
                            <ListItemButton
                              component='a'
                              href={company.facebook_url ? company.facebook_url : ''}
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
                                secondary={company.facebook_url ? company.facebook_url : ''}
                                secondaryTypographyProps={{
                                  noWrap: true
                                }}
                              />
                            </ListItemButton>
                            <ListItemButton
                              component='a'
                              href={company.linkedin_url ? company.linkedin_url : ''}
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
                                secondary={company.linkedin_url ? company.linkedin_url : ''}
                                secondaryTypographyProps={{
                                  noWrap: true
                                }}
                              />
                            </ListItemButton>
                            <ListItemButton
                              component='a'
                              href={company.twitter_url ? company.twitter_url : ''}
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
                                secondary={company.twitter_url ? company.twitter_url : ''}
                                secondaryTypographyProps={{
                                  noWrap: true
                                }}
                              />
                            </ListItemButton>
                            <ListItemButton
                              component='a'
                              href={company.instagram_url ? company.instagram_url : ''}
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
                                secondary={company.instagram_url ? company.instagram_url : ''}
                                secondaryTypographyProps={{
                                  noWrap: true
                                }}
                              />
                            </ListItemButton>
                            <ListItemButton
                              component='a'
                              href={company.youtube_url ? company.youtube_url : ''}
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
                                secondary={company.youtube_url ? company.youtube_url : ''}
                                secondaryTypographyProps={{
                                  noWrap: true
                                }}
                              />
                            </ListItemButton>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='cib:app-store-ios' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary='iOS App'
                                secondary={company.ios_app_url ? company.ios_app_url : ''}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Icon fontSize='1.5rem' icon='material-symbols:android' />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary='Android App'
                                secondary={company.android_app_url ? company.android_app_url : ''}
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          : ''}
      </Grid>
    </Grid>
  )
}

export default CompanyDetails
