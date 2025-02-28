import { select } from 'd3'
import {
  AppendableSelection,
  BreadcrumbsType,
  ClusterData,
  HierarchyType,
  ICompany,
  INode,
  ISize
} from './types/interfaces'
import { drawForceDirectedPack } from './forceDirectedPack'
import { drawHistogram, highlightHistogram, resetHistogram } from './drawHistogram'
import { drawDetails, resetDetails, showClickDetails } from './companyDetailsCard'
import { addCountryAndNaicsData } from './dataPreprocessing/dataMapping'

const emptyBreadcrumbs = {
  geography: [],
  naics: [],
  sector: []
}
export class Dashboard {
  set selectedHistogramHierarchy(value: { field: 'geography' | 'naics' | 'sector'; value: string }) {
    this._selectedHistogramHierarchy[value.field] = value.value
  }

  get numberOfNodes(): number {
    return this._numberOfNodes
  }

  set numberOfNodes(value: number) {
    this._numberOfNodes = value
  }

  forceContainer: AppendableSelection
  histogramContainer: AppendableSelection
  detailsContainer: AppendableSelection
  naicsHistogramContainer: AppendableSelection
  sectorIndustryHistogramContainer: AppendableSelection

  isFirstRender: boolean
  clustersProps: ClusterData
  darkMode: string
  histogramDivSize: ISize

  private _selectedHistogramHierarchy: HierarchyType

  data: ICompany[]
  filteredData: ICompany[] = []
  filteredDashboard = false

  updateBreadcrumbs: any
  breadcrumbs: BreadcrumbsType = {
    ...emptyBreadcrumbs
  }
  filterHistory: any[][] = []
  updateCompaniesForDisplay: any

  private _numberOfNodes = 0

  constructor(
    containers: {
      forceContainer: SVGSVGElement | null
      detailsContainer: HTMLDivElement | null
      histogramContainer: SVGSVGElement | null
      naicsHistogramContainer: SVGSVGElement | null
      sectorIndustryHistogramContainer: SVGSVGElement | null
    },
    data: ICompany[],
    isFirstRender: boolean,
    clustersProps: any,
    darkMode: string,
    histogramDivSize: ISize,
    updateBreadcrumbs: any,
    updateCompaniesForDisplay: any
  ) {
    addCountryAndNaicsData(data)

    this.forceContainer = select(containers.forceContainer)
    this.histogramContainer = select(containers.histogramContainer)
    this.naicsHistogramContainer = select(containers.naicsHistogramContainer)
    this.detailsContainer = select(containers.detailsContainer)
    this.sectorIndustryHistogramContainer = select(containers.sectorIndustryHistogramContainer)
    this.data = data
    this.isFirstRender = isFirstRender
    this.clustersProps = clustersProps
    this.darkMode = darkMode
    this.histogramDivSize = histogramDivSize
    this.updateBreadcrumbs = updateBreadcrumbs
    this._selectedHistogramHierarchy = { geography: 'continent', naics: 'naics2_label', sector: 'main_sector' }
    this.updateCompaniesForDisplay = updateCompaniesForDisplay
    this.breadcrumbs = { ...emptyBreadcrumbs }
  }

  update() {
    drawForceDirectedPack(
      this,
      this.forceContainer,
      this.data,
      this.isFirstRender,
      this.clustersProps,
      this.updateCompaniesForDisplay
    )
    drawHistogram(
      this,
      this.histogramContainer,
      this.data,
      this.isFirstRender,
      this.histogramDivSize,
      this._selectedHistogramHierarchy.geography,
      'geography',
      this.updateAfterFilter
    )

    drawHistogram(
      this,
      this.naicsHistogramContainer,
      this.data,
      this.isFirstRender,
      this.histogramDivSize,
      this._selectedHistogramHierarchy.naics,
      'naics',
      this.updateAfterFilter
    )

    drawHistogram(
      this,
      this.sectorIndustryHistogramContainer,
      this.data,
      this.isFirstRender,
      this.histogramDivSize,
      this._selectedHistogramHierarchy.sector,
      'sector',
      this.updateAfterFilter
    )

    drawDetails(this, this.detailsContainer, this.data)
  }

  clickNode(nodesData: INode[], d: INode) {
    highlightHistogram(d, 'geography')
    highlightHistogram(d, 'naics')
    highlightHistogram(d, 'sector')
    showClickDetails(nodesData, d)
    this.updateCompaniesForDisplay(d.data)
  }

  clickOutNode() {
    resetHistogram('geography')
    resetHistogram('naics')
    resetHistogram('sector')
    resetDetails()
  }

  histogramClick(name: string, d: ICompany[], type: 'geography' | 'naics' | 'sector', selectedHierarchy: string) {
    this.breadcrumbs[type] = [...this.breadcrumbs[type], { name, selectedHierarchy }]

    this._selectedHistogramHierarchy[type] = selectedHierarchy

    this.updateBreadcrumbs(this.breadcrumbs)
    this.filteredDashboard = true
    this.filteredData = d
    this.filterHistory.push(d)
    this.updateAfterFilter()
  }

  resetFilters(type: 'geography' | 'naics' | 'sector') {
    this.breadcrumbs = { ...this.breadcrumbs, [type]: [] }
    this.filterHistory = []
    this.updateAfterFilter()
  }

  updateAfterFilter(newData?: any[]) {
    const allFields: { name: string; selectedHierarchy: string }[] = []

    for (const key in this.breadcrumbs) {
      allFields.push(...this.breadcrumbs[key as 'geography' | 'naics' | 'sector'])
    }

    const filteredData = newData?.length
      ? newData
      : this.data.filter(item => {
          for (const field of allFields) {
            if (item[field.selectedHierarchy] !== field.name) {
              return false
            }
          }

          return true
        })

    drawForceDirectedPack(
      this,
      this.forceContainer,
      filteredData,
      this.isFirstRender,
      this.clustersProps,
      this.updateCompaniesForDisplay
    )

    drawHistogram(
      this,
      this.histogramContainer,
      filteredData,
      this.isFirstRender,
      this.histogramDivSize,
      this._selectedHistogramHierarchy.geography,
      'geography',
      this.updateAfterFilter
    )

    drawHistogram(
      this,
      this.naicsHistogramContainer,
      filteredData,
      this.isFirstRender,
      this.histogramDivSize,
      this._selectedHistogramHierarchy.naics,
      'naics',
      this.updateAfterFilter
    )

    drawHistogram(
      this,
      this.sectorIndustryHistogramContainer,
      filteredData,
      this.isFirstRender,
      this.histogramDivSize,
      this._selectedHistogramHierarchy.sector,
      'sector',
      this.updateAfterFilter
    )
    drawDetails(this, this.detailsContainer, filteredData)
  }

  breadcrumbClick(filterStrings: string[], index: number, type: 'geography' | 'naics' | 'sector') {
    this.filteredData = this.filterHistory[index]
    this.filterHistory.length = index + 1
    this.breadcrumbs[type].length = index + 1
    this.updateAfterFilter()
  }
}
