import { Icon } from '@iconify/react'
import { Button, Dialog, DialogActions, DialogContent, IconButton, Menu, MenuItem } from '@mui/material'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowSelectionModel,
  GridValueGetterParams
} from '@mui/x-data-grid'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CompanyMatchEnrichFromDb, CompanySearchProductFromDb, ExportSettingType } from 'src/types/apps/veridionTypes'
import { downloadCSV, exportDatagridData } from 'src/utils/file/csv'
import { productsDataGridColumns } from 'src/views/apps/saved_products/configs/productDataGridColumns'
import { mainDataGridColumns } from 'src/views/apps/upload_companies/configs/mainDataGridColumns'

type DataType = CompanyMatchEnrichFromDb | (CompanySearchProductFromDb & { project_name?: string })

type Props = {
  columns: { column_name: string; mapped_column_name: string }[]
  datagridName: string
  onClickToGetExportedCompanies: () => DataType[]
}

type ColumnType = {
  column_name: string
  field: string
  mapped_column_name: string
}

const ExportButton: React.FC<Props> = ({ columns, datagridName, onClickToGetExportedCompanies }) => {
  const [data, setData] = useState<DataType[]>([])

  const [exportSettings, setExportSettings] = useState<ExportSettingType | null>(null)

  const [columnsData, setColumnsData] = useState(columns)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [openNewExport, setOpenNewExport] = useState(false)

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>(
    columns.map(({ column_name }) => column_name)
  )

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    })
  }

  const dataGridColumns: GridColDef[] = [
    {
      field: 'column_name',
      headerName: 'Column Name',
      width: 200
    },
    {
      field: 'mapped_column_name',
      headerName: 'Mapped Column Name',
      width: 300,
      type: 'string',
      editable: true
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<Icon width={24} height={24} icon='material-symbols:save-outline' />}
              label='Save'
              sx={{
                color: 'primary.main'
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={id}
              icon={<Icon width={24} height={24} icon='iconoir:cancel' />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />
          ]
        } else {
          return [
            <GridActionsCellItem
              key={id}
              icon={<Icon width={24} height={24} icon='material-symbols:edit-outline' />}
              label='Edit'
              className='textPrimary'
              color='inherit'
              onClick={handleEditClick(id)}
            />
          ]
        }
      }
    }
  ]

  const openMenu = Boolean(anchorEl)

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    const companiesForExport = onClickToGetExportedCompanies()

    if (!!companiesForExport.length) {
      setAnchorEl(event.currentTarget)
      setData(companiesForExport)
    } else {
      toast.error('No companies available for export!')
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const standardExportHandler = () => {
    const dataColumn = data.map(company => {
      const dataGridColumns = (
        datagridName === 'enriched_companies' ? mainDataGridColumns() : productsDataGridColumns()
      ).filter(f => !f.disableExport)

      return columns.map(c => {
        const config = dataGridColumns.find(({ headerName }) => headerName === c.column_name)

        const valueGetter = config?.valueGetter

        const valueGetterParams = {
          value: config?.field ? company[config.field as keyof DataType] : '',
          row: company
        }

        return {
          headerName: c.column_name,
          value: valueGetter
            ? valueGetter(valueGetterParams as GridValueGetterParams<any, any>)
            : config?.field
            ? company[config.field as keyof DataType]
            : ''
        }
      })
    })

    downloadCSV(exportDatagridData(dataColumn), datagridName)

    handleClose()
  }

  const newCustomExportHandler = () => {
    setOpenNewExport(true)
  }

  const savedCustomExportHandler = () => {
    submitNewExport(false)
    handleClose()
  }

  const processColumnRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = newRow as ColumnType

    setColumnsData(
      columnsData.map(c => {
        if (c.column_name === newRow.column_name) {
          return updatedRow
        }

        return c
      })
    )

    return newRow
  }

  const submitNewExport = async (withSaving?: boolean) => {
    const exportedColumns = columnsData.filter(({ column_name }) => rowSelectionModel.includes(column_name))

    const dataColumn = data.map(company => {
      const dataGridColumns = (
        datagridName === 'enriched_companies' ? mainDataGridColumns() : productsDataGridColumns()
      ).filter(f => !f.disableExport)

      return exportedColumns.map(c => {
        const config = dataGridColumns.find(({ headerName }) => headerName === c.column_name)

        const valueGetter = config?.valueGetter

        const valueGetterParams = {
          value: config?.field ? company[config.field as keyof DataType] : '',
          row: company
        }

        return {
          headerName: c.mapped_column_name || c.column_name,
          value: valueGetter
            ? valueGetter(valueGetterParams as GridValueGetterParams<any, any>)
            : config?.field
            ? company[config.field as keyof DataType]
            : ''
        }
      })
    })

    if (withSaving) {
      if (!exportSettings) {
        const { data } = await axios.post<ExportSettingType>('/api/db_transactions/export_settings/add', {
          definedColumn: JSON.stringify(exportedColumns),
          datagridName
        })

        setExportSettings(data)
      } else {
        await axios.patch('/api/db_transactions/export_settings/update', {
          definedColumn: JSON.stringify(exportedColumns),
          settingsId: exportSettings.id
        })
      }
    }
    downloadCSV(exportDatagridData(dataColumn), datagridName)

    setOpenNewExport(false)
  }

  useEffect(() => {
    const fetchExportSettings = async () => {
      const { data } = await axios<ExportSettingType>(
        `/api/db_transactions/export_settings/get?datagrid=${datagridName}`
      )

      if (data) {
        const definedColumns: { column_name: string; mapped_column_name: string }[] = JSON.parse(
          data.user_defined_column
        )
        setExportSettings(data)

        setRowSelectionModel(definedColumns.map(({ column_name }) => column_name))

        setColumnsData(
          columns.map(c => {
            const definedColumn = definedColumns.find(({ column_name }) => column_name === c.column_name)

            if (definedColumn) {
              return definedColumn
            } else {
              return c
            }
          })
        )
      }
    }

    fetchExportSettings()
  }, [columns, datagridName])

  return (
    <>
      <Button
        onClick={handleOpen}
        id='basic-button'
        variant='text'
        size='small'
        startIcon={<Icon icon='material-symbols:download-sharp' />}
        aria-controls={openMenu ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={openMenu ? 'true' : undefined}
      >
        Export
      </Button>

      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={standardExportHandler}>Standard Export</MenuItem>

        <MenuItem onClick={newCustomExportHandler}>New Custom Export</MenuItem>

        <MenuItem disabled={!exportSettings} onClick={savedCustomExportHandler}>
          Saved Custom Export
        </MenuItem>
      </Menu>

      <Dialog
        open={openNewExport}
        onClose={() => setOpenNewExport(false)}
        maxWidth='lg'
        sx={{
          '.MuiPaper-root': {
            width: '100%'
          }
        }}
      >
        <IconButton sx={{ position: 'absolute', top: 4, right: 6, zIndex: 10 }} onClick={() => setOpenNewExport(false)}>
          <Icon icon='material-symbols:close' />
        </IconButton>

        <DialogContent>
          <DataGrid
            columns={dataGridColumns}
            rows={columnsData}
            autoHeight={false}
            checkboxSelection
            editMode='row'
            rowModesModel={rowModesModel}
            onProcessRowUpdateError={error => console.log(error)}
            disableRowSelectionOnClick
            processRowUpdate={processColumnRowUpdate}
            onRowSelectionModelChange={newRowSelectionModel => {
              setRowSelectionModel(newRowSelectionModel)
            }}
            rowSelectionModel={rowSelectionModel}
            getRowHeight={() => null}
            getRowId={row => row.column_name}
            sx={{
              height: 500
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            variant='outlined'
            onClick={() => {
              setAnchorEl(null)
              setOpenNewExport(false)
            }}
          >
            Cancel
          </Button>

          <Button variant='contained' onClick={() => submitNewExport(true)} disabled={!rowSelectionModel.length}>
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ExportButton
