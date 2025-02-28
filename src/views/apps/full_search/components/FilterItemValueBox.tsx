import { Box, SxProps, Typography } from '@mui/material'
import React, { FC, Fragment } from 'react'

type Props = {
  values: {
    label: string
    value: (string | number)[]
  }[]
  ellipsis?: boolean
  sxLabel?: SxProps
  sxValue?: SxProps
}

const FilterItemValueBox: FC<Props> = ({ values, ellipsis = false, sxLabel, sxValue }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
        gap: 2,
        backgroundColor: '#fff',
        borderRadius: 1.25
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
                  ...(ellipsis && { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }),
                  ...(sxValue && { ...sxValue })
                }}
              >
                {value}
              </Box>
            ))}
        </Fragment>
      ))}
    </Box>
  )
}

export default FilterItemValueBox
