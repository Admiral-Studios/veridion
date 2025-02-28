import * as d3 from 'd3'
import { Dashboard } from '../dashboard'
import { CompanySearchProductType } from '../../types/apps/veridionTypes'

export type Selection = d3.Selection<any, any, any, any>
export type AppendableSelection = d3.Selection<any, any, any, any>

// TODO Temporal set to any. Must be changed
export interface IState {
  dashboard: Dashboard
  e: {
    svg?: AppendableSelection
    forcePackG?: AppendableSelection
    tooltipG?: AppendableSelection
    svgG?: AppendableSelection
    backgroundRect?: AppendableSelection
    gradientG?: AppendableSelection
  }
  flags: {
    isFirstRender?: boolean
    isHovered?: boolean
    isClicked?: boolean
  }
  data: {
    rawData?: ICompany[]
    clusters?: any
    clustersProps?: ClusterData
    visibleExternalEdges?: IEdge[]
    nodes?: INode[]
    edges?: IEdge[]
    externalEdges?: IEdge[]
    hoveredEdges?: IEdge[]
    clusterData?: any
  }
  attributes: {
    innerWidth: number
    innerHeight: number
  }
  settings: SettingsType

  saved: {
    clickedElement: string | undefined
  }
  simulation: any
  radiusScale?: any
}

export interface IHistogramState {
  dashboard: Dashboard
  e: {
    svg: AppendableSelection
    svgG?: AppendableSelection
    barsContainerG?: AppendableSelection
    barG?: AppendableSelection
  }
  flags: {
    firstRender: boolean
  }
  data: {
    highlight: boolean
    rawData: ICompany[]
    histogramData?: INode[]
  }
  attributes: {
    innerWidth: number
    numberOfHistogramRows?: number
    innerHeight?: number
  }
  settings: HistogramSettingsType
  selectedHierarchy: string
  histogramType: string
}

export interface IEdge {
  innerLink: boolean
  source: string
  target: string
  value: number
  startNode?: INode
  endNode?: INode
}

export interface IDetailsState {
  dashboard: Dashboard
  e: {
    container: AppendableSelection
  }
  flags: {}
  data: {
    rawData: ICompany[]
    numberOfNodes: number
    filtered?: boolean
    filteredData?: ICompany[]
  }
  attributes: {}
}

export interface INode {
  0: string
  1: ICompany[]
  clusterID: string
  clusterName: string
  data: ICompany[]
  depth: number
  groupedBy: string
  link: boolean
  name: string
  nodeId: string
  parentID: string
  percentage: string
  size: number
  selected?: boolean
  hovered?: boolean
  x?: number
  y?: number
  commonCompanyPercentage?: number
  fontScale?: number
  numberOfCommonCompanies?: number
  commonCompanyPercentageWithNode?: number
}

export interface ISize {
  width: number | undefined
  height: number | undefined
}

export interface INaicsMapping {
  [key: string]: {
    naics2_code: number
    naics3_code: number
    naics4_code: number
    naics5_code: number
    naics6_code: number
    naics2_label: string
    naics3_label: string
    naics4_label: string
    naics5_label: string
    naics6_label: string
  }
}

export interface ICountryMap {
  [key: string]: {
    country_name: string
    continent: string
    macro_region: string
  }
}

export type ClusterData = {
  [key: string]: string[]
}

export type SettingsType = {
  universeSize: number
  svg: {
    width: number
    height: number
  }
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
  colorPalette: string[]
  clusters: {
    [key: string]: string[]
  }
  histogramDefaultHierarchy: string
  clustersSearch: {
    [key: string]: string[]
  }
  clustersDefault: ClusterData
  clustersDefaultSearchG: ClusterData
  clusterColors: {
    [key: string]: string
  }
  style: {
    externalLinkColor: string
    externalLinkOpacity: number

    node: {
      strokeWidth: number
      strokeColor: string
      backgroundColor: string
      minRadius: number
      maxRadius: number
      externalNodeColor: string
      rootNodeColor: string
      textAroundCircleColor: string
      textAroundCircleColorSecondary: string
    }

    selectedNode: {
      strokeWidth: number
      strokeColor: string
    }
  }

  histogramSettings: HistogramSettingsType
}

export type HistogramSettingsType = {
  svg: {
    width: number
    height?: number
  }
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
  defaultSelectedHierarchy: string
  histogram: {
    rowHeight: number
    fill: string
    stroke: string
    fontSize: string
  }
}

export type ICompany = CompanySearchProductType & {
  continent?: any
  country_name?: any
  macro_region?: any
  city?: any
  naics2_label?: any
  naics3_label?: any
  naics4_label?: any
  naics5_label?: any
  naics6_label?: any

  [key: string]: any | undefined
}

export type IGradientData = {
  name: string
  color: string
  x: number
  y: number
}

export type IPosition = {
  x: number
  y: number
}

export type HierarchyType = {
  geography: string
  naics: string
  sector: string
}

type BreadcrumbItem = {
  name: string
  selectedHierarchy: string
}

export type BreadcrumbsType = {
  geography: BreadcrumbItem[]
  naics: BreadcrumbItem[]
  sector: BreadcrumbItem[]
}

export type BreadcrumbsForDisplayType = {
  geography: string[]
  naics: string[]
  sector: string[]
}
