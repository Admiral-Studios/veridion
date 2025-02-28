import { IState } from '../types/interfaces'
import { zoom } from 'd3'

export function drawChartBackbone(state: IState) {
  if (!state.e.svg) return
  state.e.svg
    .attr('width', state.settings.svg.width)
    .attr('height', state.settings.svg.height)
    .attr('viewBox', [0, 0, state.settings.svg.width, state.settings.svg.height])
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('style', 'max-width: 100%; height: auto;')

  state.e.svgG = state.e.svg
    .append('g')
    .attr('class', 'mainG')
    .attr('transform', `translate(${state.settings.margin.left} ${state.settings.margin.top})`)

  state.e.svgG.call(
    zoom()
      .extent([
        [0, 0],
        [state.settings.svg.width, state.settings.svg.height]
      ])
      .scaleExtent([0.9, 30])
      .on('zoom', e => {
        handleZoom(e, state)
      })
  )

  state.e.backgroundRect = state.e.svgG
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', state.attributes.innerWidth)
    .attr('height', state.attributes.innerHeight)
    .attr('fill', '#FFFFFF00')

  state.e.forcePackG = state.e.svgG.append('g').attr('class', 'forcePackG')
}

function handleZoom(e: any, state: IState) {
  const transform = e.transform
  const transformString = `translate(${transform.x} ${transform.y}) scale(${transform.k})`

  if (!state.e.forcePackG) return
  state.e.forcePackG.attr('transform', transformString)
}
