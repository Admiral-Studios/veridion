import Image from 'next/image'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <Image
        width={parseInt(process.env.NEXT_PUBLIC_MAIN_LOGO_WIDTH || '250')}
        height={parseInt(process.env.NEXT_PUBLIC_MAIN_LOGO_HEIGHT || '112')}
        alt='Veridion'
        src={process.env.NEXT_PUBLIC_MAIN_LOGO_PATH || '/images/branding/main_logo.png'}
        priority={true}
      />

      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
