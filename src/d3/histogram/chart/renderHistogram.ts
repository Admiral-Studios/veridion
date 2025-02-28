import { max, scaleBand, scaleLinear } from 'd3'
import { IHistogramState, INode, Selection } from '../../types/interfaces'
import { histogramState } from '../../drawHistogram'
import { toId } from '../../utiils/utilityFunctions'

// renders the histogram
export function renderHistogram(state: IHistogramState) {
  if (!state.attributes.innerHeight || !state.data.histogramData) {
    return
  }

  const yScale = scaleBand()
    .domain(state.data.histogramData.map((d: INode) => d.name))
    .range([0, state.attributes.innerHeight])
    .padding(0.1)

  const maxSize: any = max(state.data.histogramData, (d: INode) => d.size)

  const xScale = scaleLinear()
    .domain([0, maxSize])
    .range([0, state.settings.svg.width - 1])

  if (state.e.svgG) {
    state.e.barsContainerG = state.e.svgG.append('g').attr('class', 'barsContainerG')
  }

  let ctrlClickData: any[] = []
  let ctrlClickName = ''

  // ctrl click for filter
  document.addEventListener('keyup', e => {
    if (e.key === 'Control') {
      if (ctrlClickData.length > 0) {
        state.dashboard.histogramClick(
          ctrlClickName,
          ctrlClickData,
          state.histogramType as 'geography' | 'naics' | 'sector',
          state.selectedHierarchy
        )
      }
      ctrlClickData = []
      ctrlClickName = ''
    }
  })

  if (!state.e.barsContainerG) return
  const barGSelection: Selection = state.e.barsContainerG.selectAll('.barG').data(state.data.histogramData)
  state.e.barG = barGSelection
    .enter()
    .append('g')
    .attr('class', 'barG')
    .attr('id', (d: INode) => 'barG' + toId(d.name))
    .attr('transform', (d: INode) => `translate(${0}, ${yScale(d.name)})`)
    .style('cursor', 'pointer')
    .on('click', (e, d: INode) => {
      // click histogram  filter event
      if (e.ctrlKey) {
        // ctrl click animation
        ctrlClickAnimation(d)

        ctrlClickData.push(...d.data)
        if (ctrlClickName === '') {
          ctrlClickName = d[0]
        } else {
          ctrlClickName = ctrlClickName + ' & ' + d[0]
        }
      } else {
        state.dashboard.histogramClick(
          d[0],
          d.data,
          state.histogramType as 'geography' | 'naics' | 'sector',
          state.selectedHierarchy
        )
      }
    })

  function ctrlClickAnimation(d: INode) {
    const id = toId(d[0])
    histogramState.e.svg
      .select('#barG' + id)
      .selectAll('text')
      .transition()
      .attr('font-size', 12)
      .attr('fill', '#4682b4')
      .transition()
      .attr('font-size', 9)
      .attr('fill', '#505050')
  }

  state.e.barG
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', (d: INode) => xScale(d.size))
    .attr('height', yScale.bandwidth())
    .attr('fill', state.settings.histogram.fill)
    .attr('stroke', state.settings.histogram.stroke)

  state.e.barG.append('svg:title').text((d: INode) => d.name)

  state.e.barG
    .append('text')
    .attr('x', 5)
    .attr('y', yScale.bandwidth() / 2)
    .attr('fill', '#868585')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', state.settings.histogram.fontSize)
    .text((d: INode) => {
      let text = d.name
      if (text && text.length > 25) {
        text = text.substring(0, 25) + '...'
      }

      return text
    })

  state.e.barG
    .append('text')
    .attr('x', state.settings.svg.width - 56)
    .attr('y', yScale.bandwidth() / 2)
    .attr('fill', '#505050')
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'end')
    .attr('font-size', state.settings.histogram.fontSize)
    .text((d: INode) => `${d.size}`)

  state.e.barG
    .append('text')
    .attr('x', state.settings.svg.width - 46)
    .attr('y', yScale.bandwidth() / 2)
    .attr('fill', '#505050')
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'start')
    .attr('font-size', state.settings.histogram.fontSize)
    .text((d: INode) => `${d.percentage}%`)
}
