import { AppendableSelection, IGradientData, IState } from '../types/interfaces'
import { getAllPossibleCouples, toId } from '../utiils/utilityFunctions'
import { extent, scaleLinear } from 'd3'

export function initGradient(state: IState) {
  const clustersData: IGradientData[] = Object.keys(state.data.clusters).map((cluster: string) => {
    return {
      name: cluster,
      color: state.settings.clusterColors[cluster],
      x: state.data.clusterData[cluster].fx,
      y: state.data.clusterData[cluster].fy
    }
  })

  // we need min max values for gradient normalization
  const minMaxX = extent(clustersData, d => d.x)
  const minMaxY = extent(clustersData, d => d.y)

  // X scales for gradient normalization
  let gradientXScale: any
  if (minMaxX[0] && minMaxX[1]) {
    gradientXScale = scaleLinear()
      .domain([minMaxX[0], minMaxX[1]]) // unit: km
      .range([0, 1]) // unit: pixels
  }

  // Y scales for gradient normalization
  let gradientYScale: any
  if (minMaxY[0] && minMaxY[1]) {
    gradientYScale = scaleLinear()
      .domain([minMaxY[0], minMaxY[1]]) // unit: km
      .range([0, 1]) // unit: pixels
  }

  const gradientData: any[] = getAllPossibleCouples(clustersData)
  if (!state.e.gradientG) return

  const defsSelection: AppendableSelection = state.e.gradientG.selectAll('.gDEFS').data([true])
  const defs = defsSelection.enter().append('defs').attr('class', 'gDEFS')
  defsSelection.exit().remove()

  const linearGradientSelection: AppendableSelection = defs.selectAll('.linearGradient').data(gradientData)
  const linearGradient = linearGradientSelection
    .enter()
    .append('linearGradient')
    .attr('class', 'linearGradient')
    .merge(linearGradientSelection)
    .attr('id', d => {
      return getGradientID(d)
    })
    .attr('x1', d => gradientXScale(d[0].x)) // values must be inbitwin  [0, 1]  // normalized
    .attr('x2', d => gradientXScale(d[1].x))
    .attr('y1', d => gradientYScale(d[0].y))
    .attr('y2', d => gradientYScale(d[1].y))

  linearGradientSelection.exit().remove()

  const gradientStopSelection: AppendableSelection = linearGradient.selectAll('.stop').data(d => d)
  gradientStopSelection
    .enter()
    .append('stop')
    .attr('class', 'stop')
    .merge(gradientStopSelection)
    .attr('offset', (d, i) => (i === 0 ? '0%' : '100%'))
    .attr('stop-color', d => d.color)
  gradientStopSelection.exit().remove()
}

export function getGradientID(gradientData: IGradientData[]) {
  const idString = gradientData.map((cluster: IGradientData) => cluster.name).toString()

  return toId(idString)
}
