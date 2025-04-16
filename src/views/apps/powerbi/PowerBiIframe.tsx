import React, { FC, useCallback, useContext, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/router'

import * as pbi from 'powerbi-client'

import { PowerBIEmbed } from 'powerbi-client-react'
import { models } from 'powerbi-client'
import { Theme, useMediaQuery, useTheme } from '@mui/material'

import { PowerBICredentials } from 'src/types/apps/powerbiTypes'

import { ReportContext } from 'src/context/ReportContext'
import { initializeTokenManager, stopTokenManager } from 'src/utils/powerbi/powerbiRefresh'
import { initializePagination } from 'src/utils/powerbi/powerbiPagination'

import { usePowerbiTheme } from 'src/hooks/powerbi/useTheme'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const darkTheme = require(process.env.NEXT_PUBLIC_DARK_THEME || '')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lightTheme = require(process.env.NEXT_PUBLIC_LIGHT_THEME || '')

const fetcher = (url: string) => fetch(url).then(res => res.json())

const PowerBiIframe: FC<{ type?: string }> = ({ type = 'dashboard' }) => {
  const { setReport, report } = useContext(ReportContext) || {}

  const isMobileScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const { data } = useSWR<PowerBICredentials>(`/api/powerbi?type=${type}`, fetcher)

  const tokenManagerInitialized = useRef(false)

  const theme = useTheme()
  usePowerbiTheme()

  const { query } = useRouter()

  const initializeToken = useCallback(async () => {
    if (report && !tokenManagerInitialized.current) {
      tokenManagerInitialized.current = true

      await initializeTokenManager(report)
    }
  }, [report])

  useEffect(() => {
    initializeToken()

    return () => {
      if (tokenManagerInitialized.current) {
        stopTokenManager()
      }
    }
  }, [initializeToken])

  useEffect(() => {
    if (report && query?.page) {
      initializePagination(report, query.page as string)
    }
  }, [report, query])

  if (!data) return null
  const reportToken = data.reportToken
  const embedUrl = data.embedURL

  let reportId = process.env.NEXT_PUBLIC_POWER_BI_REPORT_ID
  let reportTheme = theme.palette.mode === 'dark' ? darkTheme : lightTheme
  switch (type) {
    case 'analytics':
      reportId = process.env.NEXT_PUBLIC_POWER_BI_WATCHLIST_REPORT_ID
      break
    case 'logins':
      reportId = process.env.NEXT_PUBLIC_POWER_BI_LOGINS_REPORT_ID
      reportTheme = ''
    default:
      break
  }

  return (
    <div>
      <PowerBIEmbed
        embedConfig={{
          type: 'report',
          id: reportId,
          embedUrl: embedUrl,
          accessToken: reportToken,
          tokenType: models.TokenType.Embed,
          theme: reportTheme,
          settings: {
            navContentPaneEnabled: false,
            filterPaneEnabled: false,
            layoutType: isMobileScreen ? models.LayoutType.MobilePortrait : models.LayoutType.Master,
            background: models.BackgroundType.Transparent
          }
        }}
        cssClassName={'power-bi-iframe'}
        getEmbeddedComponent={embeddedReport => {
          if (setReport && embeddedReport) {
            setReport(embeddedReport as pbi.Report)
          }
        }}
      />
    </div>
  )
}

export default PowerBiIframe
