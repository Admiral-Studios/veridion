import { drawChartBackbone } from './chart/drawChartBackbone'
import { Settings } from './settings'
import { renderForceDirectedGraph } from './chart/renderForceDirectedPack'
import { dataPreprocessing } from './dataPreprocessing/dataPreprocessing'
import { AppendableSelection, ICompany, IState } from './types/interfaces'
import { selectAll } from 'd3'
import { Dashboard } from './dashboard'

export let state: IState

export function drawForceDirectedPack(
  dashboard: Dashboard,
  container: AppendableSelection,
  data: ICompany[],
  isFirstRender: boolean,
  clustersProps: any,
  updateCompaniesForDisplay: any
) {
  isFirstRender = state === undefined

  if (isFirstRender) {
    state = {
      dashboard: dashboard,
      e: { svg: container },
      flags: {
        isFirstRender
      },
      data: {
        rawData: undefined,
        clusters: {}
      },
      attributes: {
        innerWidth: Settings.svg.width - Settings.margin.left - Settings.margin.right,
        innerHeight: Settings.svg.height - Settings.margin.top - Settings.margin.bottom
      },
      settings: Settings,
      saved: {
        clickedElement: undefined
      },
      simulation: undefined
    }
  }

  state.flags.isFirstRender = isFirstRender
  state.data.rawData = data
  state.e.svg = container
  state.data.clusters = clustersProps

  if (!state.flags.isFirstRender) {
    state.e.svg.selectAll('*').remove()
    state.simulation.stop()
  }

  updateForceDirectedPack(data, updateCompaniesForDisplay)
}

export function updateForceDirectedPack(data: ICompany[], updateCompaniesForDisplay: any) {
  selectAll('.mainG').remove()
  drawChartBackbone(state)
  dataPreprocessing(state, data, state.data.clusters)
  renderForceDirectedGraph(state, updateCompaniesForDisplay)
}
