import * as pbi from 'powerbi-client'

export const powerBiPagesConfig = {
  coverage: 'Coverage',
  fill_rates: 'Fill Rates',
  historical_data: 'Historical Data',
  detailed_fill_rates: 'Detailed Fill Rates',
  categories: 'Categories',
  locations: 'Locations',
  products_and_services: 'Products & Services',
  esg_report: 'ESG Report',
  esg_score_by_pillar: 'ESG Score by Pillar',
  commitments_news: 'Commitments:News',
  esg_companies_compared: 'ESG Companies Compared',
  esg_score_by_risk_criteria: 'ESG Score by Risk  Criteria',
  esg_emissions_and_targets: 'ESG Emissions & Targets',
  esg_score_comparison: 'ESG Score Comparison'
}

let pages = [] as pbi.Page[]

const setActivePage = async (queryPage: string) => {
  try {
    const page = pages.find(
      ({ displayName }) => displayName === powerBiPagesConfig[queryPage as keyof typeof powerBiPagesConfig]
    )

    if (page) {
      await page.setActive()
    }
  } catch (error) {
    console.log(error)
  }
}

export const initializePagination = async (report: pbi.Report, queryPage: string) => {
  report.on('loaded', async () => {
    pages = await report.getPages()

    await setActivePage(queryPage)
  })

  await setActivePage(queryPage)
}
