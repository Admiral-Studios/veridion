export type IndustryType = {
  name: string
  type: string
  children: ChildIndustryType[]
}

export type ChildIndustryType = {
  name: string
  type: string
}

export type IndustryCategoriesType = {
  name: string
  type: string
  parent: string
}
