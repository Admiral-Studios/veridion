import { Box, IconButton } from '@mui/material'
import ProductFilter from './ProductFilter'
import { FC } from 'react'
import LocationFilter from './LocationFilter'
import StringValueFilter from './StringValueFilter'
import { AllFiltersType, ComplexValueFilterTypes, RangeFilterValueTypes, StringValueFilterTypes } from '../types/enums'
import RangeValueFilter from './RangeValueFilter'
import Icon from 'src/@core/components/icon'
import IndustryCategoryFilter from './IndustryCategoryFilter'

type Props = {
  type: AllFiltersType
  removeItem: (p: AllFiltersType) => void
}

const getFilterProps = (type: StringValueFilterTypes | RangeFilterValueTypes) => {
  switch (type) {
    case StringValueFilterTypes.CompanyPostcode: {
      return {
        title: 'Postcode',
        icon: 'mdi:post'
      }
    }
    case StringValueFilterTypes.CompanyName: {
      return {
        title: 'Company Name',
        icon: 'mdi:rename'
      }
    }
    case StringValueFilterTypes.CompanyCategory: {
      return {
        title: 'Category',
        icon: 'mdi:category-outline'
      }
    }
    case StringValueFilterTypes.CompanyIndustry: {
      return {
        title: 'Industry',
        icon: 'mdi:company'
      }
    }
    case StringValueFilterTypes.CompanyNaicsCode: {
      return {
        title: 'NAICS Code',
        icon: 'mdi:123'
      }
    }
    case StringValueFilterTypes.CompanyWebsite: {
      return {
        title: 'Website',
        icon: 'mdi:web'
      }
    }
    case RangeFilterValueTypes.CompanyEmployeeCount: {
      return {
        title: 'Employee Count',
        icon: 'mdi:people'
      }
    }
    case RangeFilterValueTypes.CompanyEstimatedRevenue: {
      return {
        title: 'Estimated Revenue',
        icon: 'majesticons:coins'
      }
    }
    case RangeFilterValueTypes.CompanyYearFounded: {
      return {
        title: 'Year Founded',
        icon: 'mdi:calendar'
      }
    }

    default:
      return { title: '', icon: '' }
  }
}

const FilterItem: FC<Props> = ({ type, removeItem }) => {
  const getFilter = () => {
    switch (type) {
      case ComplexValueFilterTypes.CompanyProducts: {
        return <ProductFilter type='company_products' />
      }
      case ComplexValueFilterTypes.CompanyLocation: {
        return <LocationFilter />
      }
      case ComplexValueFilterTypes.CompanyKeywords: {
        return <ProductFilter type='company_keywords' />
      }
      case StringValueFilterTypes.CompanyName: {
        return (
          <StringValueFilter
            filterType={StringValueFilterTypes.CompanyName}
            {...getFilterProps(StringValueFilterTypes.CompanyName)}
          />
        )
      }
      case StringValueFilterTypes.CompanyCategory: {
        return <IndustryCategoryFilter type='company_category' />
      }
      case StringValueFilterTypes.CompanyIndustry: {
        return <IndustryCategoryFilter type='company_industry' />
      }
      case StringValueFilterTypes.CompanyNaicsCode: {
        return (
          <StringValueFilter
            filterType={StringValueFilterTypes.CompanyNaicsCode}
            {...getFilterProps(StringValueFilterTypes.CompanyNaicsCode)}
          />
        )
      }
      case StringValueFilterTypes.CompanyPostcode: {
        return (
          <StringValueFilter
            filterType={StringValueFilterTypes.CompanyPostcode}
            {...getFilterProps(StringValueFilterTypes.CompanyPostcode)}
          />
        )
      }
      case StringValueFilterTypes.CompanyWebsite: {
        return (
          <StringValueFilter
            filterType={StringValueFilterTypes.CompanyWebsite}
            {...getFilterProps(StringValueFilterTypes.CompanyWebsite)}
          />
        )
      }
      case RangeFilterValueTypes.CompanyEmployeeCount: {
        return (
          <RangeValueFilter
            filterType={RangeFilterValueTypes.CompanyEmployeeCount}
            {...getFilterProps(RangeFilterValueTypes.CompanyEmployeeCount)}
          />
        )
      }
      case RangeFilterValueTypes.CompanyEstimatedRevenue: {
        return (
          <RangeValueFilter
            filterType={RangeFilterValueTypes.CompanyEstimatedRevenue}
            {...getFilterProps(RangeFilterValueTypes.CompanyEstimatedRevenue)}
          />
        )
      }
      case RangeFilterValueTypes.CompanyYearFounded: {
        return (
          <RangeValueFilter
            filterType={RangeFilterValueTypes.CompanyYearFounded}
            {...getFilterProps(RangeFilterValueTypes.CompanyYearFounded)}
          />
        )
      }
      default:
        return null
    }
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: 1.25,
        transition: 'box-shadow .1s ease-in-out',
        backgroundColor: '#F8F8F8',
        '&:hover': {
          boxShadow: '0px 2px 4px 0px rgba(29, 29, 29, 0.251)'
        }
      }}
    >
      {getFilter()}

      <IconButton onClick={() => removeItem(type)}>
        <Icon icon='mdi:trash-can-outline' />
      </IconButton>
    </Box>
  )
}

export default FilterItem
