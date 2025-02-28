import { AppendableSelection, ICompany, IHistogramState, INode, ISize } from './types/interfaces'
import { histogramDataPreprocessing } from './histogram/dataPreprocessings/dataPreprocessing'
import { renderHistogram } from './histogram/chart/renderHistogram'
import { Dashboard } from './dashboard'
import { Settings } from './settings'
import { toId } from './utiils/utilityFunctions'

export const histogramState: any = {}

export function drawHistogram(
  dashboard: Dashboard,
  container: AppendableSelection,
  data: ICompany[],
  firstRender: boolean,
  histogramDivSize: ISize,
  selectedHistogramHierarchy: string,
  type: string,
  updateAfterFilter: any
) {
  if (histogramDivSize.width) {
    Settings.histogramSettings.svg.width = histogramDivSize.width
  }

  histogramState[type] = {
    dashboard: dashboard,
    e: {
      svg: container
    },
    flags: {
      firstRender
    },
    data: {
      highlight: false,
      rawData: data
    },
    attributes: {
      innerWidth:
        Settings.histogramSettings.svg.width -
        Settings.histogramSettings.margin.left -
        Settings.histogramSettings.margin.right
    },
    settings: Settings.histogramSettings,
    selectedHierarchy: selectedHistogramHierarchy,
    histogramType: type,
    updateAfterFilter
  }

  updateHistogram(histogramState[type], histogramState[type].data.rawData)
}

// search will show autoscroll and show animation if the searched item is in the list
export function searchInHistogram(name: string, type: string) {
  const id = toId(name) // name to valid id

  const selection = document.getElementById('barG' + id)
  if (selection !== null) {
    selection.scrollIntoView({ behavior: 'smooth', block: 'center' }) // autoscroll
  }

  histogramState[type].e.svg
    .select('#barG' + id)
    .selectAll('text')
    .transition()
    .delay(500) //animation duration
    .attr('font-size', '18px')
    .attr('fill', '#4682b4')
    .transition()
    .attr('font-size', 9)
    .attr('font-weight', 600)
    .attr('fill', '#505050')
}

// on histogram Hierarchy change
export function histogramHierarchyChange(name: string, type: string) {
  histogramState[type].selectedHierarchy = name
  histogramState[type].dashboard.selectedHistogramHierarchy = name //set the Hierarchy in dashboard
  if (histogramState[type].data.highlighted) {
    updateHistogram(histogramState[type], histogramState[type].data.filteredData) // highlighted mode
  } else {
    updateHistogram(histogramState[type], histogramState[type].data.rawData)
  }

  histogramState[type].dashboard._selectedHistogramHierarchy[type] = name
}

export function resetFilters(type: string) {
  histogramState[type]?.dashboard?.resetFilters(type)
}

export function updateHistogram(state: IHistogramState, data: ICompany[]) {
  state.data.histogramData = histogramDataPreprocessing(data, state.selectedHierarchy)

  state.attributes.numberOfHistogramRows = state.data.histogramData.length
  if (state.attributes.numberOfHistogramRows) {
    state.attributes.innerHeight = state.attributes.numberOfHistogramRows * state.settings.histogram.rowHeight
    state.settings.svg.height = state.attributes.innerHeight + state.settings.margin.top + state.settings.margin.bottom
  }

  if (state.settings.svg.height) {
    state.e.svg
      .attr('height', state.settings.svg.height)
      .attr('width', Settings.histogramSettings.svg.width)
      .attr('viewBox', `0,0,${state.settings.svg.width},${state.settings.svg.height}`)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('preserveAspectRatio', 'xMidYMin meet')
      .attr('style', 'max-width: 100%; height: auto;')

    state.e.svg.selectAll('*').remove() // removes the old elements
  }

  state.e.svgG = state.e.svg
    .append('g')
    .attr('class', 'svgG')
    .attr('transform', `translate(${state.settings.margin.left}, ${state.settings.margin.top})`)

  renderHistogram(state)
}

// when node is clicked  filter/highlight selected nodes in histogram
export function highlightHistogram(clickedNode: INode, type: string) {
  const filteredData: ICompany[] = [...clickedNode.data]

  histogramState[type].data.highlighted = true
  histogramState[type].data.filteredData = filteredData

  updateHistogram(histogramState[type], filteredData)
}

export function resetHistogram(type: string) {
  histogramState[type].data.highlighted = false
  updateHistogram(histogramState[type], histogramState[type].data.rawData)
}

export function updateOnBreadcrumbClick(filterStrings: string[], index: number, type: string) {
  histogramState[type].dashboard.breadcrumbClick(filterStrings, index, type)
}

export function updateData(newData: any) {
  histogramState['geography'].dashboard.filteredData = newData

  histogramState['geography'].updateAfterFilter.call(histogramState['geography'].dashboard, newData)
}
