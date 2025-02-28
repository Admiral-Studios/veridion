import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

// Define the structure of items inside the value array
interface ValueItem {
  key: string
  value: string[]
}

// type ClusterItem = {
//   key: string
//   value: ValueItem
// }

interface SelectItemProps {
  data: ValueItem
  value?: string
  handleChangeProps?: (newItem: string) => void
}

const SelectItemGroup: React.FC<SelectItemProps> = ({ data, value, handleChangeProps }) => {
  return (
    <div>
      <InputLabel htmlFor='grouped-native-select'>{data.key}</InputLabel>

      <FormControl sx={{ marginTop: 1, width: '100%' }}>
        <Select
          value={value}
          native
          id='grouped-native-select'
          onChange={e => {
            if (handleChangeProps) {
              handleChangeProps(e.target.value as string)
            }
          }}
          size='small'
        >
          {data.value.map((v: string, index: number) => (
            <option value={v} key={index}>
              {v}
            </option>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default SelectItemGroup
