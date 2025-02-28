import Box from '@mui/material/Box'

const AppBrand = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
      <img
        src={process.env.NEXT_PUBLIC_SECONDARY_FAVICON_PATH || '/images/branding/secondary-favicon.png'}
        alt='logo'
        width={process.env.NEXT_PUBLIC_SECONDARY_FAVICON_WIDTH || 60}
        height={process.env.NEXT_PUBLIC_SECONDARY_FAVICON_HEIGHT || 50}
      />
    </Box>
  )
}

export default AppBrand
