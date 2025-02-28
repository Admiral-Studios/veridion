import { Box, Button, Divider, Grid, IconButton, Typography } from '@mui/material'
import axios from 'axios'
import { FC, useState } from 'react'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'

const Banner: FC<{ isMd: boolean }> = ({ isMd }) => {
  const [open, setOpen] = useState(true)
  const { user } = useAuth()

  const trialAccessRequest = async () => {
    if (!localStorage.getItem('requestedTrialAcces')) {
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

  if (!open) return null

  return (
    <Grid xs={12} item position='relative'>
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
          borderRadius: 2,
          opacity: 0.7,
          zIndex: -1
        }}
      ></Box>

      <IconButton sx={{ position: 'absolute', top: 4, right: 6 }} onClick={() => setOpen(false)}>
        <Icon icon='material-symbols:close' />
      </IconButton>

      <Grid
        xs={12}
        item
        container
        sx={{
          padding: 7,
          borderRadius: 2
        }}
      >
        <Typography
          variant='h1'
          sx={{
            width: '100%',
            fontSize: '20px',
            lineHeight: '34px',
            textAlign: 'center',
            mb: 6
          }}
        >
          We have developed a standalone supplier search application with upgraded search capabilities and powerful
          insights
        </Typography>

        <Grid container item xs={12}>
          <Grid
            xs={12}
            md={5.6}
            item
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyItems: 'center'
            }}
          >
            <Typography
              variant='h3'
              sx={{
                fontSize: '17px',
                lineHeight: '28px',
                textAlign: 'center',
                mb: 2
              }}
            >
              You can access it here
            </Typography>

            <Button href='https://platform.veridion.com/' target='_blank' variant='contained'>
              Access Full Supplier Search
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            md={0.8}
            display={isMd ? 'block' : 'flex'}
            justifyContent='center'
            sx={{ py: isMd ? 8 : 0, height: isMd ? 'auto' : '100%' }}
          >
            <Divider orientation={isMd ? 'horizontal' : 'vertical'} />
          </Grid>

          <Grid
            xs={12}
            md={5.6}
            item
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyItems: 'center'
            }}
          >
            <Button onClick={trialAccessRequest} variant='contained' fullWidth>
              Request Trial Access
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid xs={12} item container sx={{ my: 4, px: 6 }}>
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
