import { useTheme } from '@mui/material'
import { useContext, useEffect } from 'react'

import { ReportContext } from 'src/context/ReportContext'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const darkTheme = require(process.env.NEXT_PUBLIC_DARK_THEME || '')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lightTheme = require(process.env.NEXT_PUBLIC_LIGHT_THEME || '')

export const usePowerbiTheme = () => {
  const { report } = useContext(ReportContext) || {}

  const theme = useTheme()

  useEffect(() => {
    if (report) {
      const changeTheme = async () => {
        if (theme.palette.mode === 'dark') {
          await report.applyTheme({ themeJson: darkTheme })
        } else {
          await report.applyTheme({ themeJson: lightTheme })
        }
      }
      changeTheme()
    }
  }, [report, theme.palette.mode])
}
