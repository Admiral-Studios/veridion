import { naicsData } from 'src/shared/data/naics'

type NaicsJsonDataType = {
  naics2_code: string
  naics3_code: string
  naics4_code: string
  naics5_code: string
  naics6_code: string
  naics2: string
  naics3: string
  naics4: string
  naics5: string
  naics6: string
}

function addChildCodes(node: any) {
  if (!node.children || Object.keys(node.children).length === 0) {
    node.childCodes = []

    return node
  }

  const allDescendants: any = []

  for (const key in node.children) {
    node.children[key] = addChildCodes(node.children[key])
    allDescendants.push({
      code: node.children[key].code,
      label: node.children[key].label
    })

    allDescendants.push(...node.children[key].childCodes)
  }

  node.childCodes = allDescendants

  return node
}

const buildHierarchy = (node: any): any => {
  return Object.values(node).map((child: any) =>
    addChildCodes({
      code: child.code,
      label: child.label,
      children: buildHierarchy(child.children)
    })
  )
}

const groupByHierarchy = (data: NaicsJsonDataType[]) => {
  const grouped: any = {}

  data.forEach(item => {
    const { naics2_code, naics3_code, naics4_code, naics5_code, naics6_code, naics2, naics3, naics4, naics5, naics6 } =
      item

    if (!grouped[naics2]) {
      grouped[naics2] = {
        code: naics2_code,
        label: naics2.trim(),
        children: {}
      }
    }

    if (!grouped[naics2].children[naics3]) {
      grouped[naics2].children[naics3] = {
        code: naics3_code,
        label: naics3.trim(),
        children: {}
      }
    }

    if (!grouped[naics2].children[naics3].children[naics4]) {
      grouped[naics2].children[naics3].children[naics4] = {
        code: naics4_code,
        label: naics4.trim(),
        children: {}
      }
    }

    if (!grouped[naics2].children[naics3].children[naics4].children[naics5]) {
      grouped[naics2].children[naics3].children[naics4].children[naics5] = {
        code: naics5_code,
        label: naics5.trim(),
        children: {}
      }
    }

    if (!grouped[naics2].children[naics3].children[naics4].children[naics5].children[naics6]) {
      grouped[naics2].children[naics3].children[naics4].children[naics5].children[naics6] = {
        code: naics6_code,
        label: naics6.trim(),
        children: []
      }
    }
  })

  return buildHierarchy(grouped)
}

export const getSearchedNaics = (searchTerm: string) => {
  const filteredData = naicsData.filter(naic =>
    Object.values(naic).some(n => n.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const groupedData = groupByHierarchy(filteredData)

  return {
    groupedData,
    currentCodes: searchTerm
      ? filteredData.reduce((acc, cur, id) => {
          if (id <= 50) {
            if (!acc.includes(cur.naics2_code)) {
              acc.push(cur.naics2_code)
            }

            if (!acc.includes(cur.naics3_code)) {
              acc.push(cur.naics3_code)
            }

            if (!acc.includes(cur.naics3_code)) {
              acc.push(cur.naics3_code)
            }

            if (!acc.includes(cur.naics4_code)) {
              acc.push(cur.naics4_code)
            }

            if (!acc.includes(cur.naics5_code)) {
              acc.push(cur.naics5_code)
            }
          }

          return acc
        }, [] as string[])
      : []
  }
}
