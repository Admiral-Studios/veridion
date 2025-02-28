import { DefaultStateType } from 'src/types/apps/dataMarketplaceTypes'

export const defaultStateData: DefaultStateType[] = [
  {
    title: 'Company Digital Data Sample',
    shortDescription: 'Short description',
    detailedDescription: 'Detailed description',
    tags: [
      'Supplier Sourcing',
      'Supplier Risk Monitoring',
      'Supplier Enrichment',
      'Book Management',
      'Pre-fill',
      'Quote to Bind',
      'Market Intelligence'
    ],
    useCases: ['Procurement', 'Insurance', 'Market Intelligence'],
    lastUpdate: '2024-06-11',
    geography: 'Global',
    deliveryType: 'API & Batch',
    contact: process.env.NEXT_PUBLIC_SALES_EMAIL || '',
    price: '$100',
    previewField: 'companyData',
    csv: 'digital_company',
    icon: 'mdi:company',
    db_field: 'digital_sample_data_date',
    click_track_event: 'digital_data_sample'
  },
  {
    title: 'Company Legal Data Sample',
    shortDescription: 'Short description',
    detailedDescription: 'Detailed description',
    tags: [
      'Supplier Sourcing',
      'Supplier Risk Monitoring',
      'Supplier Enrichment',
      'Book Management',
      'Pre-fill',
      'Quote to Bind',
      'Market Intelligence'
    ],
    useCases: ['Procurement', 'Insurance', 'Market Intelligence'],
    lastUpdate: '2024-06-11',
    geography: 'Global',
    deliveryType: 'Batch',
    contact: process.env.NEXT_PUBLIC_SALES_EMAIL || '',
    price: '$100',
    previewField: 'legalData',
    csv: 'legal_company',
    icon: 'carbon:location-company',
    db_field: 'legal_sample_data_date',
    click_track_event: 'legal_data_sample'
  },
  {
    title: 'Products & Services Data Sample',
    shortDescription: 'Short description',
    detailedDescription: 'Detailed description',
    tags: ['Supplier Sourcing', 'Supplier Enrichment'],
    useCases: ['Procurement', 'Insurance', 'Market Intelligence'],
    lastUpdate: '2024-06-11',
    geography: 'Global',
    deliveryType: 'Batch',
    contact: process.env.NEXT_PUBLIC_SALES_EMAIL || '',
    price: '$100',
    previewField: 'productsServicesData',
    csv: 'products_services',
    icon: 'fluent-mdl2:product',
    db_field: 'products_services_sample_data_date',
    click_track_event: 'products_data_sample'
  },
  {
    title: 'ESG Data Sample',
    shortDescription: 'Short description',
    detailedDescription: 'Detailed description',
    tags: ['ESG'],
    useCases: ['ESG'],
    lastUpdate: '2024-06-11',
    geography: 'Global',
    deliveryType: 'Batch',
    contact: process.env.NEXT_PUBLIC_SALES_EMAIL || '',
    price: '$100',
    previewField: 'esgData',
    csv: 'sustainability_sample',
    icon: 'ph:leaf',
    db_field: 'esg_sample_data_date',
    click_track_event: 'esg_data_sample'
  }
]
