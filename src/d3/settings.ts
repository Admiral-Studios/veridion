import { SettingsType } from './types/interfaces'

export const Settings: SettingsType = {
  // Details window
  universeSize: 8000000,

  // force directed graph
  svg: {
    width: 4000,
    height: 3000
  },

  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  },

  colorPalette: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],

  clusters: {
    Geography: ['continent', 'macro_region', 'country_name', 'city'],
    NAICS: ['naics2_label', 'naics3_label', 'naics4_label', 'naics5_label', 'naics6_label'],
    'Sector/Industry': ['main_sector', 'main_industry']

    // "Business Category": ["main_business_category"],
  },

  histogramDefaultHierarchy: 'continent',

  clustersSearch: {
    Search: [
      'continent',
      'macro_region',
      'country_name',
      'city',
      'naics2_label',
      'naics3_label',
      'naics4_label',
      'naics5_label',
      'naics6_label',
      'main_sector',
      'main_industry',
      'main_business_category'
    ]
  },

  clustersDefault: {
    Geography: ['continent', 'macro_region', 'country_name'],
    NAICS: ['naics2_label', 'naics3_label', 'naics4_label'],
    'Sector/Industry': ['main_sector', 'main_industry']

    // "Business Category": ["main_business_category"],
  },

  clustersDefaultSearchG: {
    Geography: ['continent', 'macro_region', 'country_name', 'city'],
    NAICS: ['naics2_label', 'naics3_label', 'naics4_label', 'naics5_label', 'naics6_label'],
    'Sector/Industry': ['main_sector', 'main_industry', 'main_business_category']
  },

  clusterColors: {
    Geography: '#efb605',
    NAICS: '#b5005b',
    'Sector/Industry': '#6151a3'

    // "Business Category": "#138fb4",
  },

  style: {
    externalLinkColor: '#5689e8',
    externalLinkOpacity: 0.6,
    node: {
      strokeWidth: 2,
      strokeColor: '#87acf1',
      backgroundColor: '#ffffff',

      minRadius: 5,
      maxRadius: 50,

      externalNodeColor: '#e8e556',
      rootNodeColor: '#b73030',

      textAroundCircleColor: '#494949',
      textAroundCircleColorSecondary: '#757575'
    },
    selectedNode: {
      strokeWidth: 2,
      strokeColor: '#ea0751'
    }
  },

  histogramSettings: {
    svg: { width: 270 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    defaultSelectedHierarchy: 'continent',
    histogram: {
      rowHeight: 35,
      fill: '#FFFFFF',
      stroke: '#4682b4',
      fontSize: '0.9375rem'
    }
  }
}
