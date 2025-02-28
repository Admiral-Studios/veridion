import { AppendableSelection, Selection, IState, INode } from '../types/interfaces'
import { Settings } from '../settings'

export function drawTextAroundCircle(state: IState, nodeG: AppendableSelection, data: INode) {
  function circlePath(cx: number, cy: number, r: number) {
    return (
      'M ' +
      cx +
      ' ' +
      cy +
      ' m -' +
      r +
      ', 0 a ' +
      r +
      ',' +
      r +
      ' 0 1,1 ' +
      r * 2 +
      ',0 a ' +
      r +
      ',' +
      r +
      ' 0 1,1 -' +
      r * 2 +
      ',0'
    )
  }

  const id = `${data.nodeId}_path`

  const pathSelection: Selection = nodeG
    .selectAll('path')
    .data((data.selected || data.hovered) && data.link ? [data] : [])
  pathSelection
    .enter()
    .append('path')
    .attr('stroke', 'none')
    .attr('fill', 'none')
    .attr('transform', 'rotate(45)')
    .style('pointer-events', 'none')
    .merge(pathSelection)
    .attr('id', id)
    .attr('d', () => {
      if (!data.fontScale) {
        return 0
      } else {
        return circlePath(
          0,
          0,
          state.radiusScale(data.size) +
            Math.max((12 * data.fontScale) / 2, 2) +
            (data.commonCompanyPercentage ? state.radiusScale(data.size) / 8 : 0)
        )
      }
    })
  pathSelection.exit().remove()

  const textSelection: Selection = nodeG.selectAll('.rotatedText').data(data.selected || data.hovered ? [data] : [])
  const text = textSelection
    .enter()
    .append('text')
    .style('pointer-events', 'none')
    .attr('class', 'rotatedText')
    .attr('fill', Settings.style.node.textAroundCircleColor)
    .merge(textSelection)
  textSelection.exit().remove()

  const textPathSelection: Selection = text.selectAll('textPath').data(data.selected || data.hovered ? [data] : [])
  textPathSelection
    .enter()
    .append('textPath')
    .attr('href', '#' + id)
    .style('pointer-events', 'none')
    .merge(textPathSelection)
    .text((d: INode) => {
      return `${d.size} / ${d.percentage}%`
    })
    .attr('font-size', (d: INode) => state.radiusScale(d.size) / 2)
  textPathSelection.exit().remove()

  if (data.commonCompanyPercentage) {
    const id = `${data.nodeId}_path2`

    const pathSelection2: Selection = nodeG
      .selectAll('.secondaryPath')
      .data(data.selected || data.hovered ? [data] : [])
    pathSelection2
      .enter()
      .append('path')
      .attr('stroke', 'none')
      .attr('class', 'secondaryPath')
      .attr('fill', 'none')
      .attr('transform', 'rotate(90)')
      .style('pointer-events', 'none')
      .merge(pathSelection2)
      .attr('id', id)
      .attr('d', () => {
        if (!data.fontScale) {
          return 0
        } else {
          return circlePath(
            0,
            0,
            state.radiusScale(data.size) + Math.max((12 * data.fontScale) / 2, 2) - state.radiusScale(data.size) / 10
          )
        }
      })
    pathSelection2.exit().remove()

    const textSelection2: Selection = nodeG.selectAll('.rotatedText2').data(data.selected || data.hovered ? [data] : [])
    const text2 = textSelection2
      .enter()
      .append('text')
      .style('pointer-events', 'none')
      .attr('fill', Settings.style.node.textAroundCircleColorSecondary)
      .attr('class', 'rotatedText2')
      .merge(textSelection2)
    textSelection2.exit().remove()

    const textPathSelection2: Selection = text2
      .selectAll('.textPath2')
      .data(data.selected || data.hovered ? [data] : [])
    textPathSelection2
      .enter()
      .append('textPath')
      .attr('href', '#' + id)
      .attr('class', 'textPath2')
      .style('pointer-events', 'none')
      .merge(textPathSelection2)
      .text((d: INode) => {
        if (d.commonCompanyPercentage !== undefined) {
          return `${d.numberOfCommonCompanies} / ${(d.commonCompanyPercentage * 100).toFixed(1)}%`
        } else {
          return ''
        }
      })
      .attr('font-size', d => state.radiusScale(d.size) / 4)
    textPathSelection2.exit().remove()
  }
}
