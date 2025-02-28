import { Theme, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

import { ReportContext } from 'src/context/ReportContext'
import { initializeChangeLayout } from 'src/utils/powerbi/powerbiLayout'

export const useChangeLayout = () => {
  const { report } = useContext(ReportContext) || {}
  const { query } = useRouter()
  const isMobileScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  useEffect(() => {
    if (isMobileScreen && report) {
      initializeChangeLayout(report, isMobileScreen, query.page as string)
    }
  }, [isMobileScreen, report, query])
}
