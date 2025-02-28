import React from 'react'

import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import Checkbox from '@mui/material/Checkbox'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import { debounce } from '@mui/material/utils'

import { CompanyType } from 'src/types/apps/veridionTypes'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

interface CompanySearchProps {
  onDataReceived: (data: CompanyType[]) => void
}

const CompanySearch: React.FC<CompanySearchProps> = ({ onDataReceived }) => {
  const [value, setValue] = React.useState<CompanyType[]>([])
  const [inputValue, setInputValue] = React.useState('')
  const [companies, setCompanies] = React.useState<CompanyType[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const fetchCompanies = React.useMemo(
    () =>
      debounce(async searchTerm => {
        setIsLoading(true)
        try {
          const response = await fetch('/api/veridion/company_search', {
            method: 'POST',
            body: searchTerm
          })

          if (response.ok) {
            const data = await response.json()
            setCompanies(data)
            setIsLoading(false)
          } else {
            console.error('Request error:', response.statusText)
            setIsLoading(false)
          }
        } catch (error) {
          console.error('Request error:', error)
        }
      }, 1000),
    []
  )

  React.useEffect(() => {
    if (inputValue !== '') {
      fetchCompanies(inputValue)
    }

    onDataReceived(value)
  }, [inputValue, fetchCompanies, value, onDataReceived])

  return (
    <div>
      <Autocomplete
        multiple
        id='company-search-autocomplete'
        options={companies}
        autoComplete
        loading={isLoading}
        includeInputInList
        filterSelectedOptions
        disableCloseOnSelect={true}
        getOptionLabel={option => `${option.company_name} | ${option.company_commercial_names}`}
        filterOptions={x => x}
        value={value ? value : []}
        inputValue={inputValue}
        onChange={(_, newValue: CompanyType[]) => {
          setValue(newValue)
        }}
        onInputChange={(_, newInputValue: string) => {
          setInputValue(newInputValue)
        }}
        renderOption={(props, option, { selected }) => (
          <Box component='li' {...props} key={option.veridion_id}>
            <Checkbox
              key={`checkbox-${option.veridion_id}`}
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {`${option.company_name} | ${option.company_commercial_names} | ${option.main_address.city}`}
          </Box>
        )}
        style={{ width: 500 }}
        renderInput={params => (
          <TextField
            {...params}
            variant='outlined'
            label='Search companies'
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
          />
        )}
      />
    </div>
  )
}

export default CompanySearch
