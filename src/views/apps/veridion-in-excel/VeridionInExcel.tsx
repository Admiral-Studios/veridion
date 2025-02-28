import { Box, Button, Grid, Typography } from '@mui/material'
import { downloadFile } from 'src/utils/file/downloadFile'

const VeridionInExcel = () => {
  const download = () => {
    downloadFile('Excel Veridion Addin Template.xlsx', '/data_samples/Excel Veridion Addin Template.xlsx')
  }

  return (
    <Grid container spacing={4} mt={4}>
      <Grid item xs={12} sx={{ textAlign: 'center' }}>
        <Typography variant='h3' textAlign='center'>
          Bring our entire data universe directly in your Excel models
        </Typography>

        <Typography
          textAlign='center'
          mt={6}
          sx={{
            fontSize: '19px'
          }}
        >
          Enrich & search through our universe of over{' '}
          <Typography
            component='span'
            sx={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'primary.main'
            }}
          >
            129M
          </Typography>{' '}
          companies and over{' '}
          <Typography
            component='span'
            sx={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'primary.main'
            }}
          >
            200
          </Typography>{' '}
          attributes
        </Typography>

        <Button variant='contained' sx={{ mt: 4 }} onClick={download}>
          Download the excel template
        </Button>
      </Grid>

      <Grid item xs={12} mt={6}>
        <Box
          sx={{
            height: '800px',
            maxHeight: '80vh',
            width: '100%',
            position: 'relative'
          }}
        >
          <iframe
            src='https://app.supademo.com/embed/cm6gnrla303eh2p0it7r2z4r4?embed_v=2'
            loading='lazy'
            title='Veridion Excel add-in walkthrough'
            allow='clipboard-write'
            frameBorder={0}
            allowFullScreen={true}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          ></iframe>
        </Box>
      </Grid>
    </Grid>
  )
}

export default VeridionInExcel
