import {
  forceCollide,
  forceY,
  forceLink,
  forceManyBody,
  forceSimulation,
  extent,
  scaleLinear,
  forceX,
  select,
  line,
  curveBundle
} from 'd3'

import { AppendableSelection, IEdge, INode, IPosition, IState, Selection } from '../types/interfaces'
import { Settings } from '../settings'
import { textInCircle } from './textInCircle'
import { drawTextAroundCircle } from './textAroundCircle'
import { drawLinkTooltip, drawTooltip } from './tooltip'
import { initGradient } from './gradient'
import { toId } from '../utiils/utilityFunctions'

export function renderForceDirectedGraph(state: IState, updateCompaniesForDisplay: any) {
  state.flags.isHovered = false
  state.flags.isClicked = false
  state.data.visibleExternalEdges = []
  state.saved.clickedElement = undefined

  if (!state.data.edges || !state.data.nodes) return
  const nodeMinMax: [any, any] = extent(state.data.nodes, (d: INode) => d.size)

  state.radiusScale = scaleLinear()
    .domain([nodeMinMax[0], nodeMinMax[1]]) // unit: km
    .range([Settings.style.node.minRadius, Settings.style.node.maxRadius]) // unit: pixels

  const links: IEdge[] = state.data.edges.map((d: IEdge) => ({ ...d }))
  const nodes: any[] = state.data.nodes.map((d: INode) => ({ ...d }))

  // todo must be refactored
  state.dashboard.numberOfNodes = nodes.length

  //  force simulation
  state.simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink(links)
        .strength((d: any) => {
          return d.innerLink ? 3 : 0
        })
        .distance(1)
        .id((d: any) => d.nodeId)
    )
    .force('forceX', forceX(0).strength(0.09))
    .force('forceY', forceY(0).strength(0.09))
    .force('charge', forceManyBody().strength(-20))
    .force(
      'collision',
      forceCollide().radius(function (d: any) {
        return 2 * state.radiusScale(d.size) // Set the radius of each node
      })
    )
    .on('tick', ticked)

  // appending the links

  if (!state.e.forcePackG) return
  const linksWrapperGSelection: AppendableSelection = state.e.forcePackG.selectAll('.linksWrapperG').data([true])
  const linksWrapperG = linksWrapperGSelection
    .enter()
    .append('g')
    .attr('class', 'linksWrapperG')
    .merge(linksWrapperGSelection)
    .attr('transform', `translate(${state.attributes.innerWidth / 2} ${state.attributes.innerHeight / 2})`)
  linksWrapperGSelection.exit().remove()

  const linkSelection: AppendableSelection = linksWrapperG.selectAll('.link').data(links)
  const link = linkSelection
    .enter()
    .append('line')
    .attr('class', 'link')
    .attr('stroke-width', 1)
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .style('pointer-events', 'none')
    .merge(linkSelection)
  linkSelection.exit().remove()

  // appending the links
  const externalLinksWrapperGSelection: AppendableSelection = state.e.forcePackG
    .selectAll('.externalLinksWrapperG')
    .data([true])
  const externalLinksWrapperG = externalLinksWrapperGSelection
    .enter()
    .append('g')
    .attr('class', 'externalLinksWrapperG')
    .merge(externalLinksWrapperGSelection)
    .attr('transform', `translate(${state.attributes.innerWidth / 2} ${state.attributes.innerHeight / 2})`)
  externalLinksWrapperGSelection.exit().remove()

  // appending the links
  const hoveredLinksWrapperGSelection: AppendableSelection = state.e.forcePackG
    .selectAll('.hoveredLinksWrapperG')
    .data([true])
  const hoveredLinksWrapperG = hoveredLinksWrapperGSelection
    .enter()
    .append('g')
    .attr('class', 'hoveredLinksWrapperG')
    .merge(hoveredLinksWrapperGSelection)
    .attr('transform', `translate(${state.attributes.innerWidth / 2} ${state.attributes.innerHeight / 2})`)
  hoveredLinksWrapperGSelection.exit().remove()

  //appending the nodes
  const nodesWrapperGSelection: AppendableSelection = state.e.forcePackG.selectAll('.nodesWrapperG').data([true])
  const nodesWrapperG = nodesWrapperGSelection
    .enter()
    .append('g')
    .attr('class', 'nodesWrapperG')
    .merge(nodesWrapperGSelection)
    .attr('transform', `translate(${state.attributes.innerWidth / 2} ${state.attributes.innerHeight / 2})`)
  nodesWrapperGSelection.exit().remove()

  //appending the tooltipG
  const tooltipGSelection: AppendableSelection = state.e.forcePackG.selectAll('.tooltipG').data([true])
  state.e.tooltipG = nodesWrapperGSelection
    .enter()
    .append('g')
    .attr('class', 'tooltipG')
    .merge(tooltipGSelection)
    .attr('transform', `translate(${state.attributes.innerWidth / 2} ${state.attributes.innerHeight / 2})`)
  tooltipGSelection.exit().remove()

  //appending the tooltipG
  const gradientGSelection: AppendableSelection = state.e.forcePackG.selectAll('.gradientG').data([true])
  state.e.gradientG = gradientGSelection
    .enter()
    .append('g')
    .attr('class', 'gradientG')
    .merge(gradientGSelection)
    .attr('transform', `translate(${state.attributes.innerWidth / 2} ${state.attributes.innerHeight / 2})`)
  gradientGSelection.exit().remove()

  const nodeSelection: AppendableSelection = nodesWrapperG.selectAll('.node').data(nodes)
  const node = nodeSelection
    .enter()
    .append('g')
    .attr('class', 'node')
    .merge(nodeSelection)
    .style('cursor', (d: INode) => (d.link ? 'pointer' : 'default'))
  nodeSelection.exit().remove()

  //appending circles
  const nodeCircleSelection: AppendableSelection = node.selectAll('circle').data((d: any) => [d])
  nodeCircleSelection
    .enter()
    .append('circle')
    .merge(nodeCircleSelection)
    .attr('r', (d: INode) => state.radiusScale(d.size))
    .attr('fill', Settings.style.node.backgroundColor)
    .attr('stroke', (d: INode) => {
      return d.link ? Settings.clusterColors[d.clusterName] : '#cbc7c7'
    })
    .attr('stroke-width', Settings.style.node.strokeWidth)
  nodeCircleSelection.exit().remove()

  node.each(function (this: any, d: INode) {
    const container = select(this)
    textInCircle(container, d.name, state.radiusScale(d.size))
  })

  initGradient(state)
  initInteractions(state, node, nodes, externalLinksWrapperG, hoveredLinksWrapperG, updateCompaniesForDisplay)

  // for each render set of force simulation tun tick
  function ticked() {
    // setting links attributes on tick
    link
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y)

    // setting nodes attributes on tick
    node.attr('transform', (d: any) => {
      return `translate(${d.x},${d.y})`
    })

    if (state.data.visibleExternalEdges) {
      drawExternalLinks(state, externalLinksWrapperG, state.data.visibleExternalEdges)
    }
  }
}

function initInteractions(
  state: IState,
  node: AppendableSelection,
  nodesData: INode[],
  externalLinksWrapperG: AppendableSelection,
  hoveredLinksWrapperG: AppendableSelection,
  updateCompaniesForDisplay: any
) {
  const externalEdges = state.data.externalEdges
  let visibleExternalEdges: any = {}
  let hoveredEdges: any = {}

  // click
  node.on('click', (e: any, d: INode) => {
    if (d.link) {
      const sourceId = d.nodeId
      if (state.saved.clickedElement === sourceId) {
        //  clicked out
        state.flags.isClicked = false
        state.saved.clickedElement = undefined
        clickOut(true)

        showInnerNodes()
        updateCompaniesForDisplay(state.data.rawData)
      } else {
        // clicked
        clickOut(false)
        state.flags.isClicked = true
        state.saved.clickedElement = sourceId
        clickNode(sourceId, d)
        hoverOut(true)

        hideInnerNodes()
        updateCompaniesForDisplay(d.data)
      }
    }
  })

  // hover
  node.on('mouseenter', (e: any, d: INode) => {
    if (!state.e.tooltipG) return
    drawTooltip(state.e.tooltipG, d, true)
    if (d.link) {
      state.flags.isHovered = true
      const sourceId = d.nodeId
      if (state.saved.clickedElement !== sourceId) {
        hover(sourceId, d)
      }

      hideInnerNodes()
    }
  })

  // hover out
  node.on('mouseout', (e: any, d: any) => {
    if (!state.e.tooltipG) return
    drawTooltip(state.e.tooltipG, d, false)
    if (d.link) {
      state.flags.isHovered = false
      const sourceId = d.nodeId
      if (state.saved.clickedElement !== sourceId) {
        hoverOut(true)
        if (!state.flags.isClicked) {
          showInnerNodes()
        }
      }
    }
  })

  // background click for reset the clicked nodes
  if (!state.e.backgroundRect) return
  state.e.backgroundRect.on('click', () => {
    state.flags.isClicked = false
    state.saved.clickedElement = undefined
    clickOut(true)
    showInnerNodes()

    updateCompaniesForDisplay(state.data.rawData)
  })

  function clickNode(id: string, d: INode) {
    d.selected = true
    selectParents(d)

    if (!externalEdges) return
    const links = externalEdges.filter((edge: IEdge) => edge.source === id)

    const linkObject = visibleExternalEdges
    links.forEach((link: IEdge) => {
      link.startNode = d
      linkObject[link.target] = link
    })

    const keysArray = Object.keys(linkObject)

    nodesData.forEach((node: INode) => {
      if (keysArray.includes(node.nodeId)) {
        linkObject[node.nodeId].endNode = node
        node.selected = true
      }
    })

    state.data.visibleExternalEdges = Object.values(visibleExternalEdges)

    calculateSharedCompanyPercentage(state.data.visibleExternalEdges)
    drawExternalLinks(state, externalLinksWrapperG, state.data.visibleExternalEdges)
    updateNodeAttributes()

    // update histogram and details
    state.dashboard.clickNode(nodesData, d)
  }

  // recursively selects the parent node
  function selectParents(data: INode) {
    if (data.parentID !== 'root') {
      nodesData.forEach(node => {
        if (node.nodeId === data.parentID) {
          node.selected = true
          selectParents(node)
        }
      })
    }
  }

  // hovers the parent nodes
  function hoverParents(data: any) {
    if (data.parentID !== 'root') {
      nodesData.forEach(node => {
        if (node.nodeId === data.parentID) {
          node.hovered = true
          hoverParents(node)
        }
      })
    }
  }

  // if resetAttributes === true then updates the node attributes
  function clickOut(resetAttributes: boolean) {
    // handle the dashboard interactions
    state.dashboard.clickOutNode()

    if (state.data.visibleExternalEdges) {
      resetSharedCompanyPercentage(state.data.visibleExternalEdges)
    }

    state.data.visibleExternalEdges = []
    visibleExternalEdges = {}
    drawExternalLinks(state, externalLinksWrapperG, state.data.visibleExternalEdges)

    nodesData.forEach(node => {
      node.selected = false
    })
    if (resetAttributes) {
      updateNodeAttributes()
    }
  }

  // hover
  // on node hover hovers the external nodes
  function hover(id: string, d: INode) {
    d.hovered = true
    hoverParents(d) // hover parents

    if (!externalEdges) return // if externalEdges is undefined return
    const links = externalEdges.filter((edge: IEdge) => edge.source === id) // filters the correct links

    links.forEach((link: IEdge) => {
      link.startNode = d
      hoveredEdges[link.target] = link
    })

    const keysArray = Object.keys(hoveredEdges)

    nodesData.forEach(node => {
      if (keysArray.includes(node.nodeId)) {
        hoveredEdges[node.nodeId].endNode = node
        node.hovered = true
      }
    })

    state.data.hoveredEdges = Object.values(hoveredEdges)

    drawExternalLinks(state, hoveredLinksWrapperG, state.data.hoveredEdges)
    updateNodeAttributes()
  }

  function hoverOut(resetAttributes: boolean) {
    state.data.hoveredEdges = []
    hoveredEdges = {}
    drawExternalLinks(state, hoveredLinksWrapperG, state.data.hoveredEdges)

    nodesData.forEach(node => {
      node.hovered = false
    })
    if (resetAttributes) {
      updateNodeAttributes()
    }
  }

  // update node attributes : stroke-width, opacity, TextAroundCircle
  function updateNodeAttributes() {
    node
      .selectAll('circle')
      .attr('stroke-width', (d: any) =>
        d.selected || d.hovered ? Settings.style.selectedNode.strokeWidth : Settings.style.node.strokeWidth
      )

    node.attr('opacity', (d: INode) => {
      if (state.flags.isClicked || state.flags.isHovered) {
        if (d.hovered || d.selected) {
          return 1
        } else {
          return 0.3
        }
      } else {
        return 1
      }
    })

    node.each(function (this: any, d: INode) {
      const nodeG = select(this)
      drawTextAroundCircle(state, nodeG, d)
    })
  }
}

const lineGenerator = line()
  .curve(curveBundle.beta(0.5))
  .x(function (d) {
    return d[0]
  })
  .y(function (d) {
    return d[1]
  })

//  draw the lines between different clusters
function drawExternalLinks(state: IState, g: AppendableSelection, data: IEdge[]) {
  // curved path data
  const pathData: any[] = []

  data.forEach((d: IEdge) => {
    if (d.startNode && d.endNode) {
      //the third point is necessary for constructing curved path
      const mid = calculateThirdPointIsosceles(d.startNode, d.endNode, 150)

      pathData.push({
        start: d.startNode,
        end: d.endNode,
        path: [[d.startNode.x, d.startNode.y], mid, [d.endNode.x, d.endNode.y]]
      })
    }
  })

  const linkSelection: Selection = g.selectAll('.externalLink').data(pathData)
  linkSelection
    .enter()
    .append('path')
    .attr('class', 'externalLink')
    .attr('stroke-width', 4)
    .attr('fill', 'none')
    .attr('stroke', d => {
      const idString = [d.start.clusterID, d.end.clusterID].toString()
      const validID = toId(idString)

      return `url(#${validID})`
    })
    .on('mouseenter', (e, d) => {
      if (state.e.tooltipG) {
        const position: IPosition = {
          x: (d.start.x + d.end.x) / 2,
          y: (d.start.y + d.end.y) / 2
        }

        drawLinkTooltip(state.e.tooltipG, d.end, position, true)
      }
    })
    .on('mouseout', (e, d) => {
      if (state.e.tooltipG) {
        const position: IPosition = {
          x: (d.start.x + d.end.x) / 2,
          y: (d.start.y + d.end.y) / 2
        }

        drawLinkTooltip(state.e.tooltipG, d.end, position, false)
      }
    })
    .attr('stroke-opacity', 1)
    .merge(linkSelection)
    .attr('d', (d: any) => lineGenerator(d.path))
  linkSelection.exit().remove()

  function calculateThirdPointIsosceles(startNode: INode, endNode: INode, angleDegrees: number) {
    if (startNode.x && startNode.y && endNode.x && endNode.y) {
      // Calculate midpoint between the two given points
      const midX = (startNode.x + endNode.x) / 2
      const midY = (startNode.y + endNode.y) / 2

      // Convert angle from degrees to radians
      const angleRadians = (angleDegrees * Math.PI) / 180

      // Calculate the distance from the midpoint to the third point
      const distance = Math.sqrt(Math.pow(endNode.x - startNode.x, 2) + Math.pow(endNode.y - startNode.y, 2)) / 2

      // Calculate the coordinates of the third point
      const x3 = midX + distance * Math.cos(angleRadians)
      const y3 = midY + distance * Math.sin(angleRadians)

      return [x3, y3]
    } else {
      return [0, 0]
    }
  }
}

// calculates the Percentage
function calculateSharedCompanyPercentage(clickedEdges: IEdge[]) {
  const startNode = clickedEdges[0].startNode
  if (!startNode) return
  const numberOfStartNodeCompanies = startNode.size
  const companyIDs: string[] = startNode.data.map((d: any) => d.veridion_id)

  clickedEdges.forEach((edge: any) => {
    let numberOfCommonCompanies = 0
    edge.endNode.data.forEach((company: any) => {
      if (companyIDs.includes(company.veridion_id)) {
        numberOfCommonCompanies = numberOfCommonCompanies + 1
      }
    })

    edge.endNode.commonCompanyPercentageWithNode = startNode.name
    edge.endNode.numberOfCommonCompanies = numberOfCommonCompanies
    edge.endNode.commonCompanyPercentage = numberOfCommonCompanies / numberOfStartNodeCompanies
  })
}

function resetSharedCompanyPercentage(elementsToReset: IEdge[]) {
  elementsToReset.forEach((edge: any) => {
    edge.endNode.numberOfCommonCompanies = undefined
    edge.endNode.commonCompanyPercentage = undefined
    edge.endNode.commonCompanyPercentageWithNode = undefined
  })
}

function hideInnerNodes() {
  select('.linksWrapperG').style('display', 'none')
}

function showInnerNodes() {
  select('.linksWrapperG').style('display', 'block')
}
