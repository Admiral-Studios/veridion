import { Box, Button, Checkbox, IconButton, Link, List, ListItem, ListItemText, Typography } from '@mui/material'
import React, { FC } from 'react'
import Icon from 'src/@core/components/icon'
import IconLink from 'src/shared/components/IconLink'
import { CompanySearchProductType } from 'src/types/apps/veridionTypes'
import { downloadCSV, objectToCSV } from 'src/utils/file/csv'

type Props = {
  company: CompanySearchProductType
  onClickMoreButton: (c: CompanySearchProductType) => void
  selected: boolean
  handleSelect?: (id: string) => void
  saved: boolean
  preview?: boolean
}

const CompanyCard: FC<Props> = ({ company, onClickMoreButton, selected, handleSelect, saved, preview }) => {
  const productData = company?.search_details?.product_match?.context
  const address = company.main_address

  const exportHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    downloadCSV(objectToCSV([company]), company ? `${company.company_name.split(' ').join('_')}_data` : 'company_data')
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        p: 2,
        gap: 2,
        backgroundColor: '#fff',
        borderRadius: 2,
        border: '1px solid #F2F2F2'
      }}
    >
      {!preview && (
        <Box mt={0.5}>
          <Checkbox
            sx={{ p: 1 }}
            checked={selected || saved}
            onChange={() => handleSelect && handleSelect(company.veridion_id)}
            disabled={saved}
            color={saved ? 'secondary' : 'primary'}
          />
        </Box>
      )}
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            pb: 2,
            borderBottom: '1px solid #F2F2F2'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box>
              <Typography variant='h6' color='#000'>
                {company.company_name}
              </Typography>
            </Box>

            <IconButton onClick={exportHandler}>
              <Icon icon='mdi:file-export-outline' color='#FBB03B' />
            </IconButton>
          </Box>

          <Box>
            <IconLink icon='mdi:web' value={company.website_url} />

            <IconLink icon='mdi:linkedin' value={company.linkedin_url} />

            <IconLink icon='mdi:facebook' value={company.facebook_url} />

            <IconLink icon='mdi:instagram' value={company.instagram_url} />

            <IconLink icon='line-md:twitter-x' value={company.twitter_url} />
          </Box>
        </Box>

        <List
          sx={{
            display: 'grid',
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
            <ListItemText primary='Description' secondary={company.short_description} />
          </ListItem>

          <ListItem
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)'
            }}
          >
            {productData?.url && (
              <ListItemText
                sx={{
                  '.MuiListItemText-secondary': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }
                }}
                primary='Product Link:'
                secondary={
                  <Link target='_blank' href={productData?.url}>
                    {productData?.url}
                  </Link>
                }
              />
            )}

            {company?.search_details?.product_match?.supplier_types?.length && (
              <ListItemText
                primary='Supplier Type:'
                secondary={company.search_details.product_match.supplier_types.join(', ')}
              />
            )}

            <ListItemText
              primary='Location:'
              secondary={`${address?.street_number} ${address?.street}, ${address?.city}, ${address?.postcode}, ${address?.region}, ${address?.country}`}
            />
          </ListItem>
        </List>

        <Button sx={{ px: 0 }} onClick={() => onClickMoreButton(company)}>
          More...
        </Button>
      </Box>
    </Box>
  )
}

export default CompanyCard
