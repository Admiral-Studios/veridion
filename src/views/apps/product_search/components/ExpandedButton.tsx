import { Button, Typography } from '@mui/material'
import React, { FC, useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'

interface IProps {
  onClick: () => void
  label: string
  icon: string
  iconPosition: 'start' | 'end'
  disabled?: boolean
}

const ExpandedButton: FC<IProps> = ({ onClick, label, icon, iconPosition = 'start', disabled }) => {
  const [isHover, setIsHover] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isHover) {
      timer = setTimeout(() => {
        setExpanded(true)
      }, 1200)
    } else {
      setExpanded(false)
    }

    return () => clearTimeout(timer)
  }, [isHover])

  return (
    <Button
      variant='contained'
      {...(iconPosition === 'start' ? { startIcon: <Icon icon={icon} /> } : { endIcon: <Icon icon={icon} /> })}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      disabled={disabled}
      sx={{
        borderRadius: expanded ? 8 : '100%',
        padding: expanded ? '11px 11px 11px 14px' : '11px',
        minWidth: 'auto',
        alignItems: 'normal',
        '.MuiButton-startIcon': {
          marginRight: 0,
          marginLeft: 0
        },

        '.MuiButton-endIcon': {
          marginRight: 0,
          marginLeft: 0
        },

        '.MuiTypography-root': expanded
          ? {
              maxWidth: '200px',
              ...(iconPosition === 'start' ? { marginLeft: '8px' } : { marginRight: '8px' }),
              opacity: 1
            }
          : {}
      }}
      onClick={onClick}
    >
      <Typography
        sx={{
          color: '#fff',
          maxWidth: 0,
          opacity: 0,

          maxHeight: '1em',
          whiteSpace: 'nowrap',

          transition: '.2s'
        }}
      >
        {label}
      </Typography>
    </Button>
  )
}

export default ExpandedButton
