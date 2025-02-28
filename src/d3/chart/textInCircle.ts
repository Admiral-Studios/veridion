import { AppendableSelection } from '../types/interfaces'
import { max } from 'd3'

export function textInCircle(constianer: AppendableSelection, text: string, circleRadius: number) {
  if (text === undefined || text === null) {
    text = ''
  }

  const lineHeight = 13
  const targetWidth: number = Math.sqrt(measureWidth(text.trim()) * lineHeight)

  const linesData = lines(words(text), targetWidth)
  const l = linesData.length
  let scale = circleRadius / textRadius(linesData)
  if (isNaN(scale)) {
    scale = 1
  }
  const y = l > 2 ? (-10 * l * scale) / 2 : 0

  constianer
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('pointer-events', 'none')
    .attr('transform', d => {
      d.fontScale = scale

      return `translate(${0},${y}) scale(${scale})`
    })
    .selectAll('tspan')
    .data(lines(words(text), targetWidth))
    .enter()
    .append('tspan')
    .style('pointer-events', 'none')
    .style('display', scale < 0.15 ? 'none' : 'block')
    .attr('x', 0)
    .attr('y', (d, i) => i * lineHeight)
    .text(d => d.text)
}

export function measureWidth(text: string) {
  const context: any = document.createElement('canvas').getContext('2d')

  return context.measureText(text).width
}

export function lines(words: string[], targetWidth: number) {
  let line: any = {}
  let lineWidth0 = Infinity
  const lines = []
  for (let i = 0, n = words.length; i < n; ++i) {
    const lineText1 = (line ? line.text + ' ' : '') + words[i]
    const lineWidth1 = measureWidth(lineText1)
    if ((lineWidth0 + lineWidth1) / 2 < targetWidth) {
      line.width = lineWidth0 = lineWidth1
      line.text = lineText1
    } else {
      lineWidth0 = measureWidth(words[i])
      line = { width: lineWidth0, text: words[i] }
      lines.push(line)
    }
  }

  return lines
}

export function words(text: string): string[] {
  const words = text.split(/\s+/g) // To hyphenate: /\s+|(?<=-)/
  if (!words[words.length - 1]) words.pop()
  if (!words[0]) words.shift()

  return words
}

function textRadius(lines: any): any {
  return max(lines, (l: any) => l.width)
}
