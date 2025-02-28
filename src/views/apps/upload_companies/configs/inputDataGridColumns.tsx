import { Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

export const companyInputColumns: GridColDef[] = [
  {
    field: 'address_txt',
    headerName: 'Address',
    width: 200
  },
  {
    field: 'commercial_names',
    headerName: 'Commercial names',
    width: 200,
    renderCell: params => <Typography>{params.value.join(', ')}</Typography>
  },
  {
    field: 'legal_names',
    headerName: 'Legal names',
    width: 200,
    renderCell: params => <Typography>{params.value.join(', ')}</Typography>
  },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'phone_number', headerName: 'Phone Number', width: 200 },
  { field: 'website', headerName: 'Website', width: 300 }
]
