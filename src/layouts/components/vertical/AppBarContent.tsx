// ** MUI Imports
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  const { user, changeUser, trackOnClick } = useAuth()

  const [isUnlockLoading, setIsUnlockLoading] = useState(false)

  const theme = useTheme()
  const isSmScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const unlockAllFeaturesHandler = async () => {
    setIsUnlockLoading(true)
    trackOnClick('unlock_full_portal')
    await axios.post('/api/veridion/unlock-all-features', { email: user?.email })

    changeUser({ ...user, industryVertical: user?.industry || '', requested_elevanted_access: true }, () => {
      toast.success('Thank you for your response, we will contact you soon!')
      setIsUnlockLoading(false)
    })
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon fontSize='1.5rem' icon='tabler:menu-2' />
          </IconButton>
        ) : null}

        <ModeToggler settings={settings} saveSettings={saveSettings} />
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {user?.role === 'visitor' && (
          <Button
            variant='contained'
            sx={{
              mr: 4,
              fontSize: isSmScreen ? '12px' : '14px',
              px: isSmScreen ? 2 : 4
            }}
            disabled={user.requested_elevanted_access || isUnlockLoading}
            onClick={unlockAllFeaturesHandler}
            startIcon={<Icon icon='fluent:premium-32-regular' />}
          >
            Unlock the Full Explore Veridion Portal
          </Button>
        )}

        {user?.role !== 'visitor' && (
          <Button
            target='_blank'
            href='https://coda.io/form/Veridion-Data-Discovery-Platform-Feedback_dDcvbUuiPTr'
            variant='contained'
            color='secondary'
            sx={{
              mr: 4,
              fontSize: isSmScreen ? '12px' : '14px',
              px: isSmScreen ? 2 : 4
            }}
          >
            Share Your Thoughts
          </Button>
        )}

        <Button
          target='_blank'
          href='https://docs.veridion.com/'
          variant='contained'
          color='secondary'
          sx={{
            mr: 4,
            fontSize: isSmScreen ? '12px' : '14px',
            px: isSmScreen ? 2 : 4
          }}
          onClick={() => {
            trackOnClick('resources')
          }}
        >
          Resources
        </Button>

        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
