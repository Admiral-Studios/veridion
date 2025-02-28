import { Link, List, ListItem, ListItemText, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, ReactNode } from 'react'
import Icon from 'src/@core/components/icon'
import ComplexFieldsDialog from 'src/shared/components/ComplexFieldsDialog'
import IconLink from 'src/shared/components/IconLink'
import { CompanySearchProductFromDb } from 'src/types/apps/veridionTypes'
import { addThousandsDelimiter } from 'src/utils/numbers/addThousandsDelimeter'

type Props = {
  moreData: CompanySearchProductFromDb | null
  onClose: () => void
  preview?: boolean
}

const MoreSavedDataModal: FC<Props> = ({ moreData, onClose, preview }) => {
  return (
    <ComplexFieldsDialog
      open={!!moreData}
      onClose={onClose}
      maxWidth='xl'
      title={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            py: 4,
            borderBottom: '1px solid #F2F2F2'
          }}
        >
          <Typography variant='h4' color='#000'>
            Company Name
          </Typography>

          <Box>
            <IconLink icon='mdi:web' value={moreData?.website_url} />

            <IconLink icon='mdi:linkedin' value={moreData?.linkedin_url} />

            <IconLink icon='mdi:facebook' value={moreData?.facebook_url} />

            <IconLink icon='mdi:instagram' value={moreData?.instagram_url} />

            <IconLink icon='line-md:twitter-x' value={moreData?.twitter_url} />
          </Box>
        </Box>
      }
    >
      <Box
        sx={{
          py: 4,
          borderBottom: '1px solid #F2F2F2'
        }}
      >
        <Box sx={{ p: 3, borderRadius: 1, backgroundColor: '#F8F8F8' }}>
          <Typography variant='h5' color='#000' mb={2}>
            Description
          </Typography>

          <Typography>{moreData?.long_description_extracted}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          py: 4,
          px: 3,
          borderBottom: '1px solid #F2F2F2'
        }}
      >
        <Typography variant='h5' color='#000' mb={2}>
          Company Information
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            alignItems: 'flex-start',

            '@media (max-width: 688px)': {
              gridTemplateColumns: 'repeat(1, 1fr)'
            }
          }}
        >
          <Box
            sx={{
              '.MuiBox-root': {
                mb: 4,

                '&:last-of-type': {
                  mb: 0
                }
              },

              '.value-text': { ...(preview && { filter: 'blur(4px)' }) }
            }}
          >
            <Field
              icon='tabler:map-2'
              title='Main Location'
              value={`${moreData?.main_street_number} ${moreData?.main_street}, ${moreData?.main_city}, ${moreData?.main_postcode}, ${moreData?.main_region}, ${moreData?.main_country}`}
            />

            <Field icon='mdi:location-multiple-outline' title='Number of locations' value={moreData?.num_locations} />

            <Field
              icon='majesticons:coins'
              title='Revenue'
              value={addThousandsDelimiter(moreData?.revenue_value || 0)}
            />

            <Field icon='mdi:people' title='Employee Count' value={moreData?.employee_count_value} />

            <Field icon='mdi:calendar-search-outline' title='Year Founded' value={moreData?.year_founded} />

            <Field
              icon='material-symbols:settings-backup-restore-rounded'
              title='NAICS'
              value={
                moreData?.naics_2022_primary_code
                  ? `${moreData?.naics_2022_primary_code} - ${moreData?.naics_2022_primary_label}`
                  : ''
              }
            />

            <Typography variant='h6' color='#000' mb={2}>
              Company Information
            </Typography>

            <Field
              icon='mdi:email-outline'
              title='Email'
              value={
                moreData?.primary_email ? (
                  <Link href={`mailto:${moreData.primary_email}`}>{moreData?.primary_email}</Link>
                ) : (
                  ''
                )
              }
            />

            <Field
              icon='mdi:phone-outline'
              title='Phone'
              value={
                moreData?.primary_phone ? (
                  <Link href={`tel:${moreData.primary_phone}`}>{moreData?.primary_phone}</Link>
                ) : (
                  ''
                )
              }
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Icon color='#FBB03B' icon='mdi:hashtag' />

              <Typography color='#000' fontWeight={500} sx={{ ml: 2 }}>
                Business Tags:
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, ...(preview && { filter: 'blur(4px)' }) }}>
              {moreData?.business_tags_extracted?.length
                ? moreData?.business_tags_extracted.map(tag => (
                    <Box
                      key={tag}
                      sx={{ px: 1.5, py: 1, display: 'inline-block', border: '1px solid #F2F2F2', borderRadius: 1 }}
                    >
                      {tag}
                    </Box>
                  ))
                : ''}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 4,
          p: 3,
          border: '1px solid #FBB03B',
          borderRadius: 1,

          '.value-text': { ...(preview && { filter: 'blur(4px)' }) },

          '.MuiListItemText-secondary': { ...(preview && { filter: 'blur(4px)' }) }
        }}
      >
        <Typography variant='h5' color='#000' mb={2}>
          Product Information
        </Typography>

        <Box
          sx={{
            '.MuiBox-root': {
              mb: 4,

              '&:last-of-type': {
                mb: 0
              }
            }
          }}
        >
          <Field
            icon='tabler:box'
            title='Supplier Type'
            value={moreData?.company_supplier_types?.length ? moreData?.company_supplier_types.join(', ') : ''}
          />

          <Field
            icon='mdi:link'
            title='Product Link'
            value={
              moreData?.website_url ? (
                <Link target='_blank' href={moreData.website_url}>
                  {moreData.website_url}
                </Link>
              ) : (
                ''
              )
            }
          />
        </Box>

        <List
          sx={{
            mt: 4,
            pb: 0,
            '.MuiListItemText-primary': {
              fontWeight: 500,
              color: '#000'
            },
            '.MuiListItem-root': {
              px: 0
            }
          }}
        >
          <ListItem>
            <ListItemText primary='Product Headline:' secondary={moreData?.product_headline || ''} />
          </ListItem>

          <ListItem>
            <ListItemText primary='Product Content:' secondary={moreData?.product_content || ''} />
          </ListItem>

          <ListItem sx={{ pb: 0 }}>
            <ListItemText
              primary='Product Match Snippets:'
              secondary={moreData?.match_snippets?.length ? moreData?.match_snippets.join(', ') : ''}
            />
          </ListItem>
        </List>
      </Box>
    </ComplexFieldsDialog>
  )
}

type FieldProps = {
  icon: string
  title: string
  value: string | number | null | undefined | ReactNode
}

const Field: FC<FieldProps> = ({ title, icon, value }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Icon color='#FBB03B' icon={icon} />

      <Typography sx={{ ml: 2 }}>
        <Typography component='span' color='#000' fontWeight={500}>
          {title}:{' '}
        </Typography>
        <Typography component='span' className='value-text'>
          {value}
        </Typography>
      </Typography>
    </Box>
  )
}

export default MoreSavedDataModal
