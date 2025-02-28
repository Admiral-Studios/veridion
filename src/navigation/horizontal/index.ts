// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'
import { SubjectTypes } from 'src/types/acl/subjectTypes'

const navigation = (): HorizontalNavItemsType => {
  return [
    { title: 'Home', icon: 'solar:home-outline', subject: SubjectTypes.HomePage, action: 'read', path: '/home' },
    {
      title: 'Market Intelligence',
      icon: 'solar:chart-line-duotone',
      subject: SubjectTypes.Dashboard,
      action: 'read',
      children: [
        {
          title: 'Global Overview',
          path: '/dashboard/coverage',
          subject: SubjectTypes.DashboardCoverage,
          action: 'read'
        },
        {
          title: 'Attribute Fill Rates',
          path: '/dashboard/fill_rates',
          subject: SubjectTypes.DashboardFillRates,
          action: 'read'
        },
        {
          title: 'Historical Trends',
          path: '/dashboard/historical_data',
          subject: SubjectTypes.DashboardHistoricalData,
          action: 'read'
        },
        {
          title: 'Detailed Fill Rates',
          path: '/dashboard/detailed_fill_rates',
          subject: SubjectTypes.DashboardDetailedFillRates,
          action: 'read'
        },
        {
          title: 'Categories',
          path: '/dashboard/categories',
          subject: SubjectTypes.DashboardCategories,
          action: 'read'
        },
        {
          title: 'Locations',
          path: '/dashboard/locations',
          subject: SubjectTypes.DashboardLocations,
          action: 'read'
        },
        {
          title: 'Products & Services',
          path: '/dashboard/products_and_services',
          subject: SubjectTypes.DashboardProductsAndServices,
          action: 'read'
        },
        {
          title: 'ESG',
          path: '/dashboard/esg_report',
          subject: SubjectTypes.DashboardESG,
          action: 'read'
        },
        {
          title: 'ESG Score by Pillar',
          path: '/dashboard/esg_score_by_pillar',
          subject: SubjectTypes.DashboardESGScoreByPillar,
          action: 'read'
        },
        {
          title: 'ESG Score by Risk Criteria',
          path: '/dashboard/esg_score_by_risk_criteria',
          subject: SubjectTypes.DashboardESGScoreByRiskCriteria,
          action: 'read'
        },
        {
          title: 'ESG Emissions & Targets',
          path: '/dashboard/esg_emissions_and_targets',
          subject: SubjectTypes.DashboardESGEmissionsAndTargets,
          action: 'read'
        },
        {
          title: 'ESG Score Comparison',
          path: '/dashboard/esg_score_comparison',
          subject: SubjectTypes.DashboardESGScoreComparison,
          action: 'read'
        },
        {
          title: 'ESG Companies Compared',
          path: '/dashboard/esg_companies_compared',
          subject: SubjectTypes.DashboardESGCompaniesCompared,
          action: 'read'
        }
      ]
    },
    {
      title: 'Entity Resolution',
      icon: 'carbon:data-enrichment-add',
      subject: SubjectTypes.MatchEnrich,
      action: 'read',
      children: [
        {
          title: 'Enrich Companies',
          path: '/match-enrich/enrich_companies',
          subject: SubjectTypes.EnrichCompanies,
          action: 'read'
        },
        {
          title: 'Company Details',
          path: '/match-enrich/company_details',
          subject: SubjectTypes.CompanyDetails,
          action: 'read'
        },
        {
          title: 'Company Analytics',
          path: '/match-enrich/company-analytics',
          subject: SubjectTypes.CompanyAnalytics,
          action: 'read'
        }
      ]
    },
    {
      title: 'Company Search',
      icon: 'fluent:database-search-20-regular',
      subject: SubjectTypes.CompanySearchPage,
      path: '/company-search',
      action: 'read'
    },
    {
      title: 'Supplier Discovery',
      icon: 'carbon:ibm-watson-discovery',
      subject: SubjectTypes.SupplierDiscovery,
      path: '/supplier-discovery',
      action: 'read'
    },
    {
      title: 'Search by Keywords',
      icon: 'mdi:key-change',
      subject: SubjectTypes.MarketIntelligencePage,
      path: '/search-by-keywords',
      action: 'read'
    },

    // TODO: delete when no longer needed
    // {
    //   title: 'Supplier Discovery',
    //   icon: 'line-md:search',
    //   subject: SubjectTypes.SearchPage,
    //   action: 'read',
    //   children: [
    //     {
    //       title: 'Supplier Search',
    //       subject: SubjectTypes.SearchPage,
    //       action: 'read',
    //       path: '/search'
    //     },
    //     {
    //       title: 'Supplier Shortlist',
    //       subject: SubjectTypes.SavedProducts,
    //       action: 'read',
    //       path: '/saved-products'
    //     }
    //   ]
    // },
    {
      title: 'Logins Report',
      icon: 'material-symbols:login',
      subject: SubjectTypes.LoginsReport,
      action: 'read',
      path: '/logins-report'
    },
    {
      title: 'Veridion In Excel',
      icon: 'mdi:microsoft-excel',
      subject: SubjectTypes.VeridionInExcel,
      action: 'read',
      path: '/veridion-in-excel'
    },
    {
      title: 'Data Marketplace',
      icon: 'simple-icons:marketo',
      subject: SubjectTypes.DataMarketplacePage,
      action: 'read',
      path: '/data-marketplace'
    }
  ]
}

export default navigation
