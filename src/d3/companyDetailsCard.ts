import { AppendableSelection, ICompany, IDetailsState, INode } from './types/interfaces'
import { Dashboard } from './dashboard'
import { Settings } from './settings'

export let detailsState: IDetailsState

export function drawDetails(dashboard: Dashboard, containerDiv: AppendableSelection, data: ICompany[]) {
  detailsState = {
    dashboard: dashboard,
    e: {
      container: containerDiv
    },
    flags: {},
    data: {
      rawData: data,
      numberOfNodes: dashboard.numberOfNodes
    },
    attributes: {}
  }

  updateDetails(detailsState, detailsState.data.rawData.length, detailsState.data.numberOfNodes)
}

function updateDetails(state: IDetailsState, numberOfComp: number, numberOfNodes: number) {
  state.e.container.selectAll('*').remove()

  state.e.container.style('text-align', 'center')

  state.e.container.append('h3').text(numberOfComp + ' companies ')

  state.e.container.append('p').text(`${(numberOfComp * 100) / Settings.universeSize} % of universe `)

  state.e.container.append('p').text(`${numberOfNodes} related nodes`)
}

// show details after node is clicked
export function showClickDetails(nodesData: INode[], clickedNode: INode) {
  const numberOfNodes: number = nodesData.filter((d: any) => d.selected).length

  const filteredData: any[] = detailsState.data.rawData.filter(
    (company: any) => company[clickedNode.groupedBy] === clickedNode.name
  )

  const numberOfCompanies: number = clickedNode.data.length

  detailsState.data.filtered = true
  detailsState.data.filteredData = filteredData

  updateDetails(detailsState, numberOfCompanies, numberOfNodes)
}

// show details after node click is resented
export function resetDetails() {
  detailsState.data.filtered = false
  updateDetails(detailsState, detailsState.data.rawData.length, detailsState.data.numberOfNodes)
}
