import * as pbi from 'powerbi-client'
import { powerBiPagesConfig } from './powerbiPagination'

export const initializeChangeLayout = async (report: pbi.Report, isMobileScreen: boolean, queryPage: string) => {
  const pages = await report?.getPages()

  const page = pages.find(
    ({ displayName }) => displayName === powerBiPagesConfig[queryPage as keyof typeof powerBiPagesConfig]
  )

  if (page) {
    const hasMobileLayout = await page.hasLayout(
      isMobileScreen ? pbi.models.LayoutType.MobilePortrait : pbi.models.LayoutType.Master
    )

    if (hasMobileLayout) {
      report.updateSettings({
        layoutType: isMobileScreen ? pbi.models.LayoutType.MobilePortrait : pbi.models.LayoutType.Master
      })
    }
  }
}
