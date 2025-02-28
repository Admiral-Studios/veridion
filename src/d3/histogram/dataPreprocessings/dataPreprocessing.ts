import { clustering } from '../../dataPreprocessing/dataPreprocessing'
import { ICompany, INode } from '../../types/interfaces'

export function histogramDataPreprocessing(data: ICompany[], selectedHierarchy: string) {
  const clusterFormatData: any = clustering('histogram', data, [selectedHierarchy])
  const histogramData: INode[] = clusterFormatData.children
  histogramData.sort((a: any, b: any) => b.size - a.size)

  return histogramData
}
