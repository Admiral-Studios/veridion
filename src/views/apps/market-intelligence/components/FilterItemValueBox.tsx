import { Box, IconButton, SxProps, Typography } from '@mui/material'
import React, { Fragment } from 'react'
import Icon from 'src/@core/components/icon'

type Props = {
  values: {
    label: string
    value: (string | number)[]
  }[]
  ellipsis?: boolean
  sxLabel?: SxProps
  sxValue?: SxProps
  onDelete?: (value: string | number) => void
}

const FilterItemValueBox = ({ values, ellipsis = false, sxLabel, sxValue, onDelete }: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        p: 1,
        gap: 2,
        backgroundColor: '#fff',
        borderRadius: 1.25,
        maxHeight: '156px',
        overflowY: 'auto'
      }}
    >
      {values.map(item => (
        <Fragment key={item.label}>
          {item.label && (
            <Typography
              sx={{
                fontWeight: 600,
                lineHeight: 1,
                color: '#000',
                whiteSpace: 'nowrap',
                ...(sxLabel && { ...sxLabel })
              }}
            >
              {item.label}
            </Typography>
          )}
          {!!item.value.length &&
            item.value.map(value => (
              <Box
                key={value}
                sx={{
                  p: 1.2,
                  borderRadius: 1,
                  color: '#757575',
                  backgroundColor: '#F8F8F8',
                  fontWeight: 500,
                  lineHeight: 1,
                  maxWidth: '444px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  ...(ellipsis && { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }),
                  ...(sxValue && { ...sxValue })
                }}
              >
                {value}

                {onDelete && (
                  <IconButton
                    sx={{
                      p: 0,
                      svg: {
                        color: 'rgba(47, 43, 61, 0.26)'
                      },
                      '&:hover': {
                        svg: {
                          color: 'rgba(47, 43, 61, 0.36)'
                        }
                      }
                    }}
                    onClick={() => onDelete(value)}
                  >
                    <Icon icon='material-symbols:cancel' fontSize='18px' />
                  </IconButton>
                )}
              </Box>
            ))}
        </Fragment>
      ))}
    </Box>
  )
}

export default FilterItemValueBox
