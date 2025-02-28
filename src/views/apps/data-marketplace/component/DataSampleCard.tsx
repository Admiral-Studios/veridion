import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material'
import Image from 'next/image'
import Icon from 'src/@core/components/icon'

import { FC, useEffect, useState } from 'react'
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid'
import { dataDictionaryColumns } from '../configs/dataGridColumns'
import { DefaultStateType } from 'src/types/apps/dataMarketplaceTypes'
import axios from 'axios'
import { previewColumns } from '../configs/previewColumns'
import { handleFileDownload } from 'src/utils/file/downloadEnrichmentSample'
import { getDataDictionaryRows } from '../utils/getDataDictionaryRows'
import { format } from 'date-fns'

function Toolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />

      <GridToolbarFilterButton />
    </GridToolbarContainer>
  )
}

interface IProps {
  defaultState: DefaultStateType
  updatedAt: string
  trackOnClick: (event: string) => void
}

const DataSampleCard: FC<IProps> = ({ defaultState, updatedAt, trackOnClick }) => {
  const [previewData, setPreviewData] = useState<any>([])

  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    const fetchPreviewData = async () => {
      const { data } = await axios(`/api/utils/get_csv_data?filePath=${defaultState.csv}`)

      setPreviewData(data.slice(0, 10))
    }

    fetchPreviewData()
  }, [])

  return (
    <>
      <Box
        onClick={() => setOpenModal(true)}
        sx={theme => ({
          position: 'relative',
          p: 4,
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          cursor: 'pointer',
          transition: 'box-shadow .2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 2px 6px 0px rgba(47, 43, 61, 0.14)'
          }
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ zIndex: 1 }}>
            <Icon
              icon={defaultState.icon}
              fontSize='48px'
              color='#ebe8e8'
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: -1
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h5'>{defaultState.title}</Typography>
            </Box>

            <Box mt={6}>
              <Typography component='span' color='primary'>
                {defaultState.tags.map(tag => (
                  <Chip
                    key={tag}
                    size='small'
                    label={tag}
                    color='primary'
                    sx={{
                      mr: 2,
                      height: 20,
                      minWidth: 22
                    }}
                  />
                ))}
              </Typography>
            </Box>
          </Box>

          <Box mt={8} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image
              width={100}
              height={45}
              alt='Veridion'
              src={process.env.NEXT_PUBLIC_MAIN_LOGO_PATH || '/images/branding/main_logo.png'}
              style={{ marginLeft: '-12px' }}
            />

            <Box sx={{ display: 'flex' }}>
              <Button
                size='small'
                variant='contained'
                color='secondary'
                sx={{ mr: 2, height: '34px' }}
                onClick={e => {
                  e.stopPropagation()
                  handleFileDownload(defaultState.csv)
                  trackOnClick(defaultState.click_track_event)
                }}
              >
                Download Sample
              </Button>

              <Button
                size='small'
                variant='contained'
                href={`mailto:${process.env.NEXT_PUBLIC_SALES_EMAIL}`}
                sx={{ height: '34px' }}
                onClick={e => {
                  e.stopPropagation()
                  trackOnClick('talk_to_sales')
                }}
              >
                Talk to Sales
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth='lg'>
        <DialogContent sx={{ p: '2.25rem !important' }}>
          <IconButton sx={{ position: 'absolute', top: 2, right: 2 }} onClick={() => setOpenModal(false)}>
            <Icon icon='material-symbols:close' />
          </IconButton>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h3'>{defaultState.title}</Typography>

            <Box sx={{ display: 'flex' }}>
              <Button
                size='small'
                variant='contained'
                color='secondary'
                sx={{ mr: 2, height: '34px' }}
                onClick={() => {
                  handleFileDownload(defaultState.csv)
                  trackOnClick(defaultState.click_track_event)
                }}
              >
                Download Sample
              </Button>

              <Button
                size='small'
                variant='contained'
                href={`mailto:${process.env.NEXT_PUBLIC_SALES_EMAIL}`}
                onClick={() => trackOnClick('talk_to_sales')}
                sx={{ height: '34px' }}
              >
                Talk to Sales
              </Button>
            </Box>
          </Box>

          <Accordion
            sx={{
              mt: 8
            }}
          >
            <AccordionSummary expandIcon={<Icon fontSize='1.5rem' icon='tabler:chevron-down' />}>
              <Typography variant='h3'>Data dictionary</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DataGrid
                autoHeight={true}
                sx={{ mt: 4, height: 500 }}
                rowSelection={false}
                columns={dataDictionaryColumns}
                rows={getDataDictionaryRows(previewData[0] || [])}
                getRowId={row => row.attribute}
                slots={{
                  toolbar: () => Toolbar()
                }}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion
            sx={{
              mt: 8
            }}
          >
            <AccordionSummary expandIcon={<Icon fontSize='1.5rem' icon='tabler:chevron-down' />}>
              <Typography variant='h3'>Preview</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DataGrid
                autoHeight={true}
                sx={{ mt: 8, height: 500 }}
                rowSelection={false}
                columns={previewColumns[defaultState.previewField]}
                getRowId={row =>
                  defaultState.previewField === 'companyData'
                    ? row.company_id
                    : defaultState.previewField === 'productsServicesData'
                    ? row.company_id
                    : defaultState.previewField === 'legalData'
                    ? row.registry_id
                    : row.veridion_id
                }
                rows={previewData}
                slots={{
                  toolbar: () => Toolbar()
                }}
              />

              <Box
                sx={{
                  position: 'relative',
                  mt: 4,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 8
                }}
              >
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
                    borderRadius: 2
                  }}
                ></Box>

                <Button
                  variant='contained'
                  color='secondary'
                  onClick={() => {
                    handleFileDownload(defaultState.csv)
                    trackOnClick(defaultState.click_track_event)
                  }}
                >
                  Download Sample
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Typography variant='h5' sx={{ mt: 8 }}>
            Use Cases
          </Typography>

          <List>
            {[...defaultState.tags, ...defaultState.useCases].map(useCase => (
              <Chip
                key={useCase}
                size='small'
                label={useCase}
                color='primary'
                sx={{
                  mr: 2,
                  height: 20,
                  minWidth: 22
                }}
              />
            ))}

            <ListItem sx={{ mt: 4 }}>
              <ListItemText
                primary='Last update'
                secondary={updatedAt ? format(new Date(updatedAt), 'yyyy-MM-dd') : ''}
              />

              <ListItemText primary='Geography' secondary={defaultState.geography} />

              <ListItemText primary='Delivery type' secondary={defaultState.deliveryType} />

              <ListItemText
                primary='Contact'
                secondary={<Link href={`mailto:${defaultState.contact}`}>{defaultState.contact}</Link>}
              />
            </ListItem>
          </List>

          <Box mt={6}>
            <Image
              width={160}
              height={70}
              alt='Veridion'
              src={process.env.NEXT_PUBLIC_MAIN_LOGO_PATH || '/images/branding/main_logo.png'}
              style={{ marginLeft: '-12px' }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DataSampleCard
