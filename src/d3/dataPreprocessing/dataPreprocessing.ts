import { ClusterData, ICompany, IEdge, INode, IState } from '../types/interfaces'
import { groups } from 'd3'

export function dataPreprocessing(state: IState, data: ICompany[], clusters: ClusterData) {
  const cluster: any = {}

  const r: number = state.settings.svg.height / 8
  const theta: number = (2 * Math.PI) / Object.entries(clusters).length
  let i = 0

  // todo must be refactored, move inside  clustering()
  // clusters initial positions
  for (const [key, value] of Object.entries(clusters)) {
    cluster[key] = clustering(key, data, <string[]>value)
    cluster[key].fixed = true

    cluster[key].fx = r * Math.cos(i * theta)
    cluster[key].fy = r * Math.sin(i * theta)
    i++
  }

  const { edges, nodes, miniLinks } = clusterToNodesAndEdges(cluster, clusters)

  state.data.nodes = nodes
  state.data.edges = edges
  state.data.externalEdges = miniLinks
  state.data.clusterData = cluster
}

const linkNodeLocations: any = {}

export function clustering(clusterName: string, data: any, hierarchy: string[]): any {
  linkNodeLocations[clusterName] = {}

  const copyData = JSON.parse(JSON.stringify(data))

  const result: any = {}
  groupData(stringToID(clusterName), clusterName, copyData, hierarchy, 0, clusterName, result, copyData.length, 'root')

  function groupData(
    clusterID: string,
    clusterName: string,
    data: any,
    hierarchy: string[],
    hierarchyIndex: number,
    name: string,
    obj: any,
    parentsSize: number,
    parentID: string
  ) {
    if (hierarchy.length > hierarchyIndex) {
      obj.data = data
      obj.children = groups(data, (d: any) => d[hierarchy[hierarchyIndex]]) // d3 groups
      obj.groupedBy = hierarchy[hierarchyIndex]

      obj.size = data.length
      obj.percentage = ((obj.size * 100) / parentsSize).toFixed(1)

      obj.parentID = parentID
      obj.link = false
      obj.depth = hierarchyIndex
      obj.name = name
      obj.nodeId = stringToID(`${clusterID}_${hierarchy[hierarchyIndex]}_${hierarchyIndex}_${name}`)
      obj.clusterID = clusterID
      obj.clusterName = clusterName
      obj.root = hierarchyIndex === 0

      // recursive tree structure part
      // do everything again for each  obj.children
      hierarchyIndex++
      obj.children.forEach((group: any, i: number) => {
        groupData(
          clusterID,
          clusterName,
          group[1],
          hierarchy,
          hierarchyIndex,
          group[0],
          obj.children[i],
          parentsSize,
          obj.nodeId
        )
      })
    } else {
      obj.groupedBy = hierarchy[hierarchyIndex - 1]
      obj.data = data
      obj.size = data.length
      obj.percentage = ((obj.size * 100) / parentsSize).toFixed(1)
      obj.link = true
      obj.depth = hierarchyIndex
      obj.name = name
      obj.clusterID = clusterID
      obj.clusterName = clusterName
      obj.nodeId = stringToID(`${clusterID}_leave_${hierarchyIndex}_${parentID}_${name}`)
      obj.parentID = parentID

      data.forEach((company: any) => {
        linkNodeLocations[clusterName][company.veridion_id] = obj.nodeId
        company.clusterName = clusterName
      })
    }
  }

  return result
}

function clusterToNodesAndEdges(cluster: any, clusters: ClusterData) {
  const nodes: INode[] = []
  const edges: IEdge[] = []

  const linkNodes: any = {}
  const miniLinks: IEdge[] = []

  Object.values(cluster).forEach(value => {
    convertToInternalNodesAndEdges(value)
  })

  function convertToInternalNodesAndEdges(cluster: any) {
    // cluster internal nodes
    nodes.push(cluster) // create all nodes
    if (cluster.children) {
      cluster.children.forEach((child: any) => {
        edges.push({ source: cluster.nodeId, target: child.nodeId, value: child.size, innerLink: true }) // create internal edges
        convertToInternalNodesAndEdges(child)
      })
    } else {
      // construct external nodes object
      if (linkNodes[cluster.clusterName]) {
        linkNodes[cluster.clusterName].push(cluster)
      } else {
        linkNodes[cluster.clusterName] = [cluster]
      }
    }
  }

  const linksMap = constructTheLinksMap(clusters)
  const reversLinkMap: any = {}

  for (const [key, value] of Object.entries(clusters)) {
    const lastEl = value[value.length - 1]
    reversLinkMap[lastEl] = key
  }

  for (const [key, value] of Object.entries(linkNodes)) {
    calculateExternalEdges(key, linksMap, <any[]>value)
  }

  function calculateExternalEdges(clusterName: string, linksMap: any, linkN: any[]) {
    linksMap[clusterName].forEach((attr: any) => {
      linkN.forEach(node => {
        const groupsData = groups(node.data, (d: any) => d[attr])
        groupsData.forEach((g: any) => {
          miniLinks.push({
            source: node.nodeId,
            target: linkNodeLocations[reversLinkMap[attr]][g[1][0].veridion_id],
            value: g[1].length,
            innerLink: false
          })
        })
      })
    })
  }

  return { edges, nodes, miniLinks }
}

function constructTheLinksMap(clusters: ClusterData) {
  const linkLevelClusterAttributes: any = {}
  for (const [key, value] of Object.entries(clusters)) {
    linkLevelClusterAttributes[key] = value[value.length - 1]
  }
  const liveAttributes = Object.values(linkLevelClusterAttributes)

  Object.keys(clusters).forEach(key => {
    const index = liveAttributes.indexOf(linkLevelClusterAttributes[key])
    if (index !== -1) {
      const copy = [...liveAttributes]
      copy.splice(index, 1)
      linkLevelClusterAttributes[key] = copy
    }
  })

  return linkLevelClusterAttributes
}

// string to valid html id
function stringToID(string: string): string {
  return string.replace(/\W/g, '_').replaceAll(' ', '')
}
