import * as models from 'powerbi-models'

export type PowerBiStore = {
  status: string
  reportToken: string
  embedURL: string
  error: string
}

export type PowerBIIframeType = {
  store: PowerBiStore
}

export type PowerBIReportType = {
  type: string
  accessToken: string
  embedUrl: string
  id: string
  tokenType: number
  settings: {
    navContentPaneEnabled: boolean
    filterPaneEnabled: boolean
    layoutType: models.LayoutType.Master
  }
}

export type PowerBICredentials = {
  reportToken: string
  embedURL: string
}
