import { Box, Grid, Typography } from '@mui/material'
import { FC } from 'react'

const MessagesList: FC<{ messages: string[]; userName: string }> = ({ messages, userName }) => {
  return (
    <Grid container item xs={12} sx={{ pt: 6 }}>
      <Grid item xs={1}>
        <Box
          sx={{
            width: '48px',
            height: '48px',
            ml: 2,
            mt: 2,
            border: '2px solid #FBB03B',
            borderRadius: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 500
          }}
        >
          {userName
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </Box>
      </Grid>

      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'flex-start'
        }}
      >
        {messages.map(message => (
          <Box
            key={message}
            sx={{
              p: 4,
              display: 'inline-flex',
              alignItems: 'center',
              boxShadow: '0px 4px 18px 0px rgba(47, 43, 61, 0.1)',
              borderRadius: '6px',
              backgroundColor: '#fff'
            }}
          >
            <Typography>{message}</Typography>
          </Box>
        ))}
      </Grid>
    </Grid>
  )
}

export default MessagesList
