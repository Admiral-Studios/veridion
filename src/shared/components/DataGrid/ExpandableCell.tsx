import { Box, Link } from '@mui/material'
import { GridCell, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, ReactNode, useLayoutEffect, useRef, useState } from 'react'

const ExpandableCell: FC<GridRenderCellParams & { children: ReactNode }> = ({
  children,
  formattedValue,
  value,
  ...params
}) => {
  const [expanded, setExpanded] = useState(false)
  const [isOverflow, setIsOverflow] = useState(false)

  const contentRef = useRef(null)

  useLayoutEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current
      setIsOverflow(scrollHeight > clientHeight + 10)
    }
  }, [value])

  return (
    <GridCell {...params}>
      <Box py={2}>
        <Box
          ref={contentRef}
          sx={{
            maxHeight: expanded ? 'auto' : '58px',
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            textOverflow: 'ellipsis'
          }}
        >
          {children ? children : formattedValue || value}
        </Box>

        {isOverflow && (
          <Link
            type='button'
            component='button'
            sx={{ fontSize: 'inherit', letterSpacing: 'inherit' }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'view less' : 'view more'}
          </Link>
        )}
      </Box>
    </GridCell>
  )
}

export default ExpandableCell
