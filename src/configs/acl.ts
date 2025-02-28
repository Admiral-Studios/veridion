import { AbilityBuilder, Ability } from '@casl/ability'
import { SubjectTypes } from 'src/types/acl/subjectTypes'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */

const visitorAbilities = [
  SubjectTypes.AclPAge,
  SubjectTypes.Dashboard,
  SubjectTypes.DashboardCoverage,
  SubjectTypes.DashboardPage,
  SubjectTypes.DashboardCoveragePage,
  SubjectTypes.ProfilePage,
  SubjectTypes.MatchEnrich,
  SubjectTypes.DataMarketplacePage,
  SubjectTypes.EnrichCompanies,
  SubjectTypes.EnrichCompaniesPage,
  SubjectTypes.CompanyDetails,
  SubjectTypes.CompanyDetailsPage,
  SubjectTypes.CompanyAnalytics,
  SubjectTypes.CompanyAnalyticsPage,
  SubjectTypes.SearchPage,
  SubjectTypes.SavedProducts,
  SubjectTypes.SavedProductsPage,
  SubjectTypes.CompanySearchPage,
  SubjectTypes.SupplierDiscovery,
  SubjectTypes.HomePage,
  SubjectTypes.VeridionInExcel,
  SubjectTypes.FullSearchPage
]

const memberAbilities = [
  SubjectTypes.AclPAge,
  SubjectTypes.Dashboard,
  SubjectTypes.DashboardCoverage,
  SubjectTypes.DashboardPage,
  SubjectTypes.DashboardCoveragePage,
  SubjectTypes.DashboardFillRates,
  SubjectTypes.DashboardHistoricalData,
  SubjectTypes.DashboardHistoricalDataPage,
  SubjectTypes.DashboardFillRatesPage,
  SubjectTypes.MatchEnrich,
  SubjectTypes.EnrichCompaniesPage,
  SubjectTypes.EnrichCompanies,
  SubjectTypes.ProfilePage,
  SubjectTypes.CompanyDetailsPage,
  SubjectTypes.CompanyDetails,
  SubjectTypes.CompanyAnalyticsPage,
  SubjectTypes.CompanyAnalytics,
  SubjectTypes.SearchPage,
  SubjectTypes.SavedProducts,
  SubjectTypes.SavedProductsPage,
  SubjectTypes.DataMarketplacePage,
  SubjectTypes.CompanySearchPage,
  SubjectTypes.SupplierDiscovery,
  SubjectTypes.HomePage,
  SubjectTypes.MarketIntelligencePage,
  SubjectTypes.VeridionInExcel,
  SubjectTypes.FullSearchPage
]

const veridionerAbilities = [
  SubjectTypes.AclPAge,
  SubjectTypes.Dashboard,
  SubjectTypes.DashboardCoverage,
  SubjectTypes.DashboardPage,
  SubjectTypes.DashboardCoveragePage,
  SubjectTypes.DashboardFillRates,
  SubjectTypes.DashboardHistoricalData,
  SubjectTypes.DashboardHistoricalDataPage,
  SubjectTypes.DashboardFillRatesPage,
  SubjectTypes.DashboardProductsAndServices,
  SubjectTypes.DashboardProductsAndServicesPage,
  SubjectTypes.DashboardESG,
  SubjectTypes.DashboardESGPage,
  SubjectTypes.MatchEnrich,
  SubjectTypes.EnrichCompaniesPage,
  SubjectTypes.EnrichCompanies,
  SubjectTypes.ProfilePage,
  SubjectTypes.CompanyDetailsPage,
  SubjectTypes.CompanyDetails,
  SubjectTypes.CompanyAnalyticsPage,
  SubjectTypes.CompanyAnalytics,
  SubjectTypes.SearchPage,
  SubjectTypes.DashboardDetailedFillRates,
  SubjectTypes.SavedProducts,
  SubjectTypes.SavedProductsPage,
  SubjectTypes.LoginsReport,
  SubjectTypes.DataMarketplacePage,
  SubjectTypes.DashboardCategories,
  SubjectTypes.DashboardLocations,
  SubjectTypes.DashboardLocationsPage,
  SubjectTypes.DashboardCategoriesPage,
  SubjectTypes.CompanySearchPage,
  SubjectTypes.SupplierDiscovery,
  SubjectTypes.HomePage,
  SubjectTypes.DashboardESGPage,
  SubjectTypes.DashboardProductsAndServicesPage,
  SubjectTypes.MarketIntelligencePage,
  SubjectTypes.VeridionInExcel,
  SubjectTypes.FullSearchPage,
  SubjectTypes.HomePage,
  SubjectTypes.DashboardESGPage,
  SubjectTypes.DashboardProductsAndServicesPage,
  SubjectTypes.DashboardESGCompaniesCompared,
  SubjectTypes.DashboardESGCompaniesComparedPage,
  SubjectTypes.DashboardESGScoreByPillar,
  SubjectTypes.DashboardESGScoreByPillarPage,
  SubjectTypes.DashboardCommitmentsNews,
  SubjectTypes.DashboardCommitmentsNewsPage,
  SubjectTypes.DashboardESGScoreByRiskCriteria,
  SubjectTypes.DashboardESGScoreByRiskCriteriaPage,
  SubjectTypes.DashboardESGEmissionsAndTargets,
  SubjectTypes.DashboardESGEmissionsAndTargetsPage,
  SubjectTypes.DashboardESGScoreComparison,
  SubjectTypes.DashboardESGScoreComparisonPage
]

const dpwadamAbilities = [
  SubjectTypes.AclPAge,
  SubjectTypes.ProfilePage,
  SubjectTypes.Dashboard,
  SubjectTypes.DashboardCoverage,
  SubjectTypes.DashboardPage,
  SubjectTypes.DashboardCoveragePage,
  SubjectTypes.DashboardFillRates,
  SubjectTypes.DashboardHistoricalData,
  SubjectTypes.DashboardHistoricalDataPage,
  SubjectTypes.DashboardFillRatesPage,
  SubjectTypes.SavedProducts,
  SubjectTypes.SavedProductsPage,
  SubjectTypes.SearchPage,
  SubjectTypes.DataMarketplacePage,
  SubjectTypes.SupplierDiscovery,
  SubjectTypes.HomePage,
  SubjectTypes.VeridionInExcel
]

const defineRulesFor = (role: string, subject: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  if (role === 'visitor') {
    visitorAbilities.forEach(subject => can(['read'], subject))
    can(['read'], 'home-page')
  } else if (role === 'admin') {
    can('manage', 'all')
  } else if (role === 'member') {
    memberAbilities.forEach(subject => can(['read'], subject))
  } else if (role === 'veridioner') {
    veridionerAbilities.forEach(subject => can(['read'], subject))
  } else if (role === 'dpwadam') {
    dpwadamAbilities.forEach(subject => can(['read'], subject))
  } else {
    can(['read', 'create', 'update', 'delete'], subject)
  }

  return rules
}

export const buildAbilityFor = (role: string, subject: string): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
