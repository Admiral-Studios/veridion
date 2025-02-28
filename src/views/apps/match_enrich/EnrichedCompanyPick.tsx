import React from 'react'

import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'

import { CompanyMatchEnrichFromDb } from 'src/types/apps/veridionTypes'
import useSWR from 'swr'
import { Grid } from '@mui/material'

interface CompanyPickProps {
  onDataReceived: (data: CompanyMatchEnrichFromDb[] | undefined) => void
  enrichedCompanies: CompanyMatchEnrichFromDb[] | undefined
  companies: CompanyMatchEnrichFromDb[]
  isLoading: boolean
}

const getUniqueFileNames = (companies: CompanyMatchEnrichFromDb[]) => {
  const files = companies.map(({ input_file_name }) => input_file_name)

  return files.filter((value, index, self) => value && self.indexOf(value) === index)
}

const filterCompanies = (companies: CompanyMatchEnrichFromDb[], files: string[]) => {
  return companies.filter(({ input_file_name }) => files.includes(input_file_name))
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const CompanyPick: React.FC<CompanyPickProps> = ({ onDataReceived, enrichedCompanies, companies, isLoading }) => {
  const [value, setValue] = React.useState<CompanyMatchEnrichFromDb[] | undefined>([])
  const [inputValue, setInputValue] = React.useState('')
  const [fileValue, setFileValue] = React.useState<string[] | undefined>([])
  const [inputFileValue, setInputFileValue] = React.useState('')

  const { data } = useSWR<CompanyMatchEnrichFromDb[]>('/api/db_transactions/fetch_watchlist_entries_from_db', fetcher)

  React.useEffect(() => {
    if (isLoading && data) {
      if (enrichedCompanies) {
        setValue(undefined)
      }
    }
  }, [isLoading, data, onDataReceived, value, enrichedCompanies])

  if (!companies) return null

  return (
    <Grid
      xs={12}
      container
      spacing={4}
      sx={{
        minWidth: '100%'
      }}
    >
      <Grid item xs={12} md={6}>
        <Autocomplete
          size='small'
          options={getUniqueFileNames(companies)}
          loading={isLoading}
          renderInput={params => <TextField {...params} variant='outlined' label='Select input file' />}
          multiple
          value={fileValue}
          inputValue={inputFileValue}
          onChange={(_, newValue) => {
            if (newValue) {
              setFileValue(newValue)
            }
          }}
          onInputChange={(_, newInputValue: string) => {
            setInputFileValue(newInputValue)
          }}
          sx={{ marginBottom: 4 }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Autocomplete
          size='small'
          options={fileValue?.length ? filterCompanies(companies, fileValue) : companies}
          loading={isLoading}
          filterSelectedOptions
          multiple
          getOptionLabel={option => `${option.company_name} | ${option.company_commercial_names}`}
          value={value}
          inputValue={inputValue}
          onChange={(_, newValue) => {
            if (newValue) {
              setValue(newValue)
              onDataReceived(newValue)
            }
          }}
          onInputChange={(_, newInputValue: string) => {
            setInputValue(newInputValue)
          }}
          renderOption={(props, option) => (
            <Box component='li' {...props} key={option.id}>
              {`${option.company_name} | ${option.company_commercial_names} | ${option.main_city}`}
            </Box>
          )}
          renderInput={params => <TextField {...params} variant='outlined' label='Pick a company' />}
        />
      </Grid>
    </Grid>
  )
}

export default CompanyPick
