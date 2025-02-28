import { AppendableSelection, INode, IPosition, Selection } from '../types/interfaces'
import { measureWidth } from './textInCircle'

export function drawTooltip(container: AppendableSelection, data: INode, show: boolean) {
  let draw = show ? [true] : []

  const x: number = !data.x ? 0 : data.x
  const y: number = !data.y ? 0 : data.y
  const clusterName: string = data.clusterName
  const name: string = data.name

  const line3 = `${data.size} / ${data.percentage}% out of total`
  let line4 = ''
  let bigTooltipMode = false
  if (data.numberOfCommonCompanies && data.commonCompanyPercentage) {
    line4 = `${data.numberOfCommonCompanies} / ${(data.commonCompanyPercentage * 100).toFixed(1)}% out of ${
      data.commonCompanyPercentageWithNode
    }`
    bigTooltipMode = true
  }

  const tooltipWidth: number =
    Math.max(measureWidth(clusterName), measureWidth(name), measureWidth(line3), measureWidth(line4)) * 2.5

  const rectHeight = bigTooltipMode ? 110 : 90

  const tooltipGSelection: Selection = container.selectAll('g').data(draw)
  const tooltipG: AppendableSelection = tooltipGSelection
    .enter()
    .append('g')
    .attr('class', 'tooltipForeignObject')
    .merge(tooltipGSelection)
    .attr('transform', `translate(${x} ${y - rectHeight - 5})`)

  tooltipGSelection.exit().remove()

  const tooltipRectSelection: Selection = tooltipG.selectAll('.tooltipRect').data(draw)
  tooltipRectSelection
    .enter()
    .append('rect')
    .attr('class', 'tooltipRect')
    .attr('fill', '#ffffff')
    .attr('stroke', '#5e5d5d')
    .attr('fill-opacity', '90%')
    .merge(tooltipRectSelection)
    .attr('width', tooltipWidth)
    .attr('height', rectHeight)
    .attr('x', -tooltipWidth / 2)
    .attr('y', -rectHeight / 2)
  tooltipRectSelection.exit().remove()

  const tooltipHeaderTextSelection: Selection = tooltipG.selectAll('.tooltipHeaderText').data(draw)
  tooltipHeaderTextSelection
    .enter()
    .append('text')
    .attr('class', 'tooltipHeaderText')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .merge(tooltipHeaderTextSelection)
    .attr('font-size', '13px')
    .attr('font-weight', 'lighter')
    .attr('stroke', '#5b5a5a')
    .text(clusterName)
    .attr('x', 0)
    .attr('y', bigTooltipMode ? -35 : -25)
  tooltipHeaderTextSelection.exit().remove()

  const tooltipTextSelection: Selection = tooltipG.selectAll('.tooltipText').data(draw)
  tooltipTextSelection
    .enter()
    .append('text')
    .attr('class', 'tooltipText')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .merge(tooltipTextSelection)
    .attr('x', 0)
    .attr('y', bigTooltipMode ? -10 : -0)
    .attr('font-size', '20px')
    .attr('font-weight', 700)
    .text(name)
  tooltipTextSelection.exit().remove()

  const percentTextSelection: Selection = tooltipG.selectAll('.percentText').data(draw)
  percentTextSelection
    .enter()
    .append('text')
    .attr('class', 'percentText')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')

    .merge(percentTextSelection)
    .attr('x', 0)
    .attr('y', bigTooltipMode ? 13 : 25)
    .attr('font-size', '13px')
    .attr('font-weight', 'lighter')
    .text(line3)
  percentTextSelection.exit().remove()

  draw = bigTooltipMode ? draw : []
  const commonPercentTextSelection: Selection = tooltipG.selectAll('.commonPercentText').data(draw)
  commonPercentTextSelection
    .enter()
    .append('text')
    .attr('class', 'commonPercentText')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .merge(commonPercentTextSelection)
    .attr('x', 0)
    .attr('y', 35)
    .attr('font-size', '13px')
    .attr('font-weight', 'lighter')
    .text(line4)
  commonPercentTextSelection.exit().remove()
}

export function drawLinkTooltip(container: AppendableSelection, data: INode, position: IPosition, show: boolean) {
  let draw = show ? [true] : []

  const x: number = position.x
  const y: number = position.y
  const name: string = data.name

  let line4 = ''
  let bigTooltipMode = false
  if (data.numberOfCommonCompanies && data.commonCompanyPercentage) {
    line4 = `${data.numberOfCommonCompanies} / ${(data.commonCompanyPercentage * 100).toFixed(1)}% out of ${
      data.commonCompanyPercentageWithNode
    }`
    bigTooltipMode = true
  }

  const tooltipWidth: number = Math.max(measureWidth(name), measureWidth(line4)) * 2.5

  const rectHeight = 70

  const tooltipGSelection: Selection = container.selectAll('g').data(draw)
  const tooltipG: AppendableSelection = tooltipGSelection
    .enter()
    .append('g')
    .attr('class', 'tooltipForeignObject')
    .merge(tooltipGSelection)
    .attr('transform', `translate(${x} ${y})`)

  tooltipGSelection.exit().remove()

  const tooltipRectSelection: Selection = tooltipG.selectAll('.tooltipRect').data(draw)
  tooltipRectSelection
    .enter()
    .append('rect')
    .attr('class', 'tooltipRect')
    .attr('fill', '#ffffff')
    .attr('stroke', '#5e5d5d')
    .attr('fill-opacity', '90%')
    .merge(tooltipRectSelection)
    .attr('width', tooltipWidth)
    .attr('height', rectHeight)
    .attr('x', -tooltipWidth / 2)
    .attr('y', -rectHeight / 2)
  tooltipRectSelection.exit().remove()

  const tooltipTextSelection: Selection = tooltipG.selectAll('.tooltipText').data(draw)
  tooltipTextSelection
    .enter()
    .append('text')
    .attr('class', 'tooltipText')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .merge(tooltipTextSelection)
    .attr('x', 0)
    .attr('y', -16)
    .attr('font-size', '20px')
    .attr('font-weight', 700)
    .text(name)
  tooltipTextSelection.exit().remove()

  draw = bigTooltipMode ? draw : []
  const commonPercentTextSelection: Selection = tooltipG.selectAll('.commonPercentText').data(draw)
  commonPercentTextSelection
    .enter()
    .append('text')
    .attr('class', 'commonPercentText')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .merge(commonPercentTextSelection)
    .attr('x', 0)
    .attr('y', 14)
    .attr('font-size', '13px')
    .attr('font-weight', 'lighter')
    .text(line4)
  commonPercentTextSelection.exit().remove()
}
