import React from 'react'
import { InputBase, InputLabel, MenuItem, Select, styled } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { Settings } from '../../../../d3/settings'

type ClusterItem = {
  key: string
  value: string[]
}

type ClusterKey = keyof typeof Settings.clusters

interface SelectItemProps {
  data: ClusterItem
  updateClustersProps?: (key: ClusterKey, newItem: string[]) => void
  value?: string
  handleChangeProps?: (newItem: string) => void
}

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(1)
  },
  '#demo-simple-select-standard': {},
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 25px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  }
}))
const SelectItem: React.FC<SelectItemProps> = ({ data, updateClustersProps, value, handleChangeProps }) => {
  const handleChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value as string
    const updatedValue = data.value.slice(0, data.value.indexOf(selectedValue) + 1)

    if (updateClustersProps) {
      updateClustersProps(data.key as ClusterKey, updatedValue)
    }
  }

  return (
    <div className={'select_item_classname'}>
      <InputLabel id='demo-simple-select-standard-label'>{data.key}</InputLabel>
      <Select
        labelId='demo-simple-select-standard-label'
        id='demo-simple-select-standard'
        sx={{
          width: '100%',
          height: 50
        }}
        value={value}
        onChange={e => {
          if (handleChangeProps) {
            handleChangeProps(e.target.value)
          } else {
            handleChange(e)
          }
        }}
        input={<BootstrapInput />}
      >
        {data.value.map((value: string) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}

export default SelectItem
