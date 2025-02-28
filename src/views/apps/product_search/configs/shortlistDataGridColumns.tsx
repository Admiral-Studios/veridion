import { GridColDef } from '@mui/x-data-grid'
import React from 'react'
import { Link } from '@mui/material'

export const shortlistDataGridColumns = (showCompanies: boolean, showProducts: boolean): GridColDef[] => {
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '№',
      renderCell: params => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    { field: 'company_name', headerName: 'Company Name', width: 200 },
    {
      field: 'website_url',
      headerName: 'Website',
      width: 200,
      renderCell: params =>
        !!params.value ? (
          <Link href={`${params.value}`} target='_blank'>
            {`${params.value}`}
          </Link>
        ) : (
          ''
        )
    },

    {
      field: 'main_country',
      headerName: 'Main Country',
      width: 200
    },
    {
      field: 'main_city',
      headerName: 'Main City',
      width: 200
    },
    {
      field: 'linkedin_url',
      headerName: 'Linkedin Url',
      width: 300,
      renderCell: params =>
        !!params.value ? (
          <Link href={`${params.value}`} target='_blank'>
            {`${params.value}`}
          </Link>
        ) : (
          ''
        )
    }
  ]

  if (showCompanies) {
    columns.splice(3, 0, {
      field: 'input_file_name',
      headerName: 'Input File',
      width: 200
    })
  }

  if (showProducts) {
    columns.splice(3, 0, {
      field: 'project_name',
      headerName: 'Project Name',
      width: 200
    })
  }

  return columns
}
