import { Box } from '@mui/material'
import { FC } from 'react'

const FixedButtonsGroup: FC<{ children: React.ReactElement | React.ReactElement[] }> = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        left: '50%',
        zIndex: 11,
        bottom: 4,
        transform: 'translateX(-50%)',
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        border: '1px solid rgba(47, 43, 61, 0.3)',
        borderRadius: 8,
        backgroundColor: '#fff'
      }}
    >
      {children}
    </Box>
  )
}

export default FixedButtonsGroup
