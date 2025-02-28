import { Box, Button, Grid } from '@mui/material'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

const Banner = () => {
  const { user } = useAuth()

  const trialAccessRequest = async () => {
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

  return (
    <Grid xs={12} item position='relative'>
      <Grid
        xs={12}
        item
        container
        sx={{
          borderRadius: 2,
          p: 4
        }}
      >
        <Grid container item xs={12}>
          <Grid
            xs={12}
            item
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button
              onClick={trialAccessRequest}
              variant='outlined'
              sx={{
                maxWidth: '340px',
                width: '100%'
              }}
            >
              Request Trial Access
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid xs={12} item container sx={{ my: 8 }}>
        <Box sx={{ width: '100%', height: '600px' }}>
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
      </Grid>
    </Grid>
  )
}

export default Banner
