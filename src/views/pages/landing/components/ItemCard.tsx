import { Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { FC, ReactNode } from 'react'
import Icon from 'src/@core/components/icon'

type Props = {
  title: string
  icon: string
  text?: string
  sx?: { [key: string]: any }
  link?: string
  body?: ReactNode
  titleButton?: ReactNode
}

const ItemCard: FC<Props> = ({ title, icon, text, sx, link, body, titleButton }) => {
  const { push } = useRouter()

  return (
    <Box sx={{ ...(sx && { ...sx }) }}>
      <Box
        sx={theme => ({
          height: '100%',
          p: 4,
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          transition: 'box-shadow .2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 2px 6px 0px rgba(47, 43, 61, 0.14)'
          }
        })}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
            <Icon icon={icon} fontSize='48px' color='#fbb03b' />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Typography variant='h5'>{title}</Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {titleButton && titleButton}

                {link && (
                  <Button onClick={() => push(link)} fullWidth sx={{ display: 'block' }}>
                    Go to page
                  </Button>
                )}
              </Box>
            </Box>
          </Box>

          {text && <Typography sx={{ mt: 5, fontSize: '16px' }}>{text}</Typography>}

          {body && body}
        </Box>
      </Box>
    </Box>
  )
}

export default ItemCard
