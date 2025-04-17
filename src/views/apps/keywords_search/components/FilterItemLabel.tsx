import { Box, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

type Props = {
  icon: string
  label: string
}

const FilterItemLabel = ({ icon, label }: Props) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Icon icon={icon} color='#FBB03B' />

      <Typography
        sx={{
          fontWeight: 600,
          lineHeight: 1,
          color: '#000'
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}

export default FilterItemLabel
