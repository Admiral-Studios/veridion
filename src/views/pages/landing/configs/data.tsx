import { Box, Button, IconButton, Typography } from '@mui/material'
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { UserDataType } from 'src/context/types'
import { SubjectTypes } from 'src/types/acl/subjectTypes'
import { handleFileDownload } from 'src/utils/file/downloadEnrichmentSample'

const trialAccessRequest = async (user: UserDataType) => {
  if (!localStorage.getItem('requestedTrialAccess')) {
    try {
      await axios.post('/api/veridion/request-trial-access', {
        name: user?.name,
        email: user?.email,
        role: user?.role
      })

      toast.success('Thanks! Our team has been notified and will contact you soon!')
      localStorage.setItem('requestedTrialAcces', 'true')
    } catch (error) {
      toast.error('Something went wrong')
    }
  } else {
    toast.error('You have already requested access')
  }
}

export const itemsCardsData = (user: UserDataType) => [
  {
    title: 'Market Intelligence',
    icon: 'solar:chart-line-duotone',
    text: 'Explore the coverage of our data. Over 129M companies.',
    subject: SubjectTypes.DashboardCoveragePage,
    link: '/dashboard/coverage'
  },
  {
    title: 'Entity Resolution',
    icon: 'carbon:data-enrichment-add',
    text: 'Bulk and single enrich any company you want.',
    subject: SubjectTypes.EnrichCompaniesPage,
    link: '/match-enrich/enrich_companies'
  },
  {
    title: 'Supplier Search Discovery',
    titleButton: (
      <Button
        onClick={() => trialAccessRequest(user)}
        variant='outlined'
        fullWidth
        sx={{
          maxWidth: '340px',
          width: '100%'
        }}
      >
        Request Trial Access
      </Button>
    ),
    icon: 'line-md:search',
    body: (
      <Box sx={{ width: '100%', height: '644px', mt: 5 }}>
        <iframe
          data-version='2'
          src='https://app.supademo.com/showcase/embed/cm3lxlbds0dx3qdk92thl53o1?embed_v=2'
          loading='lazy'
          title='Veridion: Supplier Discovery App'
          allow='clipboard-write'
          allowFullScreen
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
        ></iframe>
      </Box>
    ),
    sx: {
      gridColumn: 'span 2',
      gridRow: 'span 2',
      '@media(max-width: 944px)': {
        gridTemplateColumns: 'span 1',
        order: 1
      }
    },
    subject: SubjectTypes.SupplierDiscovery
  },
  {
    title: 'Company Search',
    icon: 'fluent:database-search-20-regular',
    text: "Know the name of the company you're looking for? Chances are we have it.",
    subject: SubjectTypes.CompanySearchPage,
    link: '/company-search'
  },
  {
    title: 'Search by keywords',
    icon: 'mdi:key-change',
    text: 'Use your keywords - find the companies that use them',
    subject: SubjectTypes.CompanySearchPage,
    link: '/search-by-keywords'
  },
  {
    title: 'Veridion Excel add-in',
    icon: 'mdi:microsoft-excel',
    link: '/veridion-in-excel',
    body: (
      <Box sx={{ width: '100%', height: '644px', mt: 5 }}>
        <iframe
          src='https://app.supademo.com/embed/cm6gnrla303eh2p0it7r2z4r4?embed_v=2'
          loading='lazy'
          title='Veridion Excel add-in walkthrough'
          allow='clipboard-write'
          frameBorder={0}
          allowFullScreen={true}
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
        ></iframe>
      </Box>
    ),
    sx: {
      gridColumn: 'span 2',
      gridRow: 'span 2',
      '@media(max-width: 944px)': {
        gridTemplateColumns: 'span 1',
        order: 1
      }
    },
    subject: SubjectTypes.VeridionInExcel
  },
  {
    title: 'Data Marketplace',
    icon: 'simple-icons:marketo',
    body: (
      <Box sx={{ mt: 5 }}>
        <Box
          sx={theme => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            p: 2,
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: 2
          })}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon='mdi:company' fontSize='38px' color='#b4b4b4' />

            <Typography>Company Digital Data Sample</Typography>
          </Box>

          <IconButton
            onClick={e => {
              e.preventDefault()
              handleFileDownload('digital_company')
            }}
          >
            <Icon icon='mdi:tray-download' />
          </IconButton>
        </Box>

        <Box
          sx={theme => ({
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            p: 2,
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: 2
          })}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon='carbon:location-company' fontSize='38px' color='#b4b4b4' />

            <Typography>Company Legal Data Sample</Typography>
          </Box>

          <IconButton
            onClick={e => {
              e.preventDefault()
              handleFileDownload('legal_company')
            }}
          >
            <Icon icon='mdi:tray-download' />
          </IconButton>
        </Box>

        <Box
          sx={theme => ({
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            p: 2,
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: 2
          })}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon='fluent-mdl2:product' fontSize='38px' color='#b4b4b4' />

            <Typography>Products & Services Data Sample</Typography>
          </Box>

          <IconButton
            onClick={e => {
              e.preventDefault()
              handleFileDownload('products_services')
            }}
          >
            <Icon icon='mdi:tray-download' />
          </IconButton>
        </Box>

        <Box
          sx={theme => ({
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            p: 2,
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: 2
          })}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon='ph:leaf' fontSize='38px' color='#b4b4b4' />

            <Typography>ESG Data Sample</Typography>
          </Box>

          <IconButton
            onClick={e => {
              e.preventDefault()
              handleFileDownload('sustainability_sample')
            }}
          >
            <Icon icon='mdi:tray-download' />
          </IconButton>
        </Box>
      </Box>
    ),
    subject: SubjectTypes.DataMarketplacePage,
    link: '/data-marketplace'
  },
  {
    title: 'Logins Report',
    icon: 'material-symbols:login',
    subject: SubjectTypes.LoginsReport,
    link: '/logins-report'
  }
]
