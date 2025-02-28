import { Box, Button, Dialog, DialogActions, DialogTitle, Tooltip } from '@mui/material'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
import axios from 'axios'
import { format } from 'date-fns'
import React from 'react'
import Icon from 'src/@core/components/icon'
import { UserDataType } from 'src/context/types'
import { PortalSettings } from 'src/types/apps/dataMarketplaceTypes'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

type Role = {
  id: number
  role: string
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  )
}

const ConfigurationPage = () => {
  const { data: users } = useSWR<UserDataType[]>(`/api/user/get_all`, fetcher)
  const { data: roles } = useSWR<Role[]>(`/api/user/get_roles`, fetcher)
  const { data: portalSettings } = useSWR<PortalSettings[]>(`/api/db_transactions/fetch_portal_settings`, fetcher)

  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({})
  const [userRows, setUserRows] = React.useState([] as UserDataType[])
  const [open, setOpen] = React.useState<boolean>(false)
  const [userIdForRemove, setUserIdForRemove] = React.useState<GridRowId | null>(null)
  const [settingRowModesModel, setSettingRowModesModel] = React.useState<GridRowModesModel>({})

  const handleClickOpen = () => setOpen(true)

  const handleDialogClose = () => {
    setUserIdForRemove(null)
    setOpen(false)
  }

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

  const handleOpenDeleteModalClick = (id: GridRowId) => async () => {
    handleClickOpen()
    setUserIdForRemove(id)
  }

  const handleDeleteClick = async () => {
    try {
      await axios.post(`/api/user/delete`, { id: userIdForRemove })
      setUserRows(userRows.filter(row => row.id !== userIdForRemove))
    } catch (error) {
    } finally {
      handleDialogClose()
    }
  }

  const handleEditSettingClick = (id: GridRowId) => () => {
    setSettingRowModesModel({ ...settingRowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleCancelSettingClick = (id: GridRowId) => () => {
    setSettingRowModesModel({
      ...settingRowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    })
  }

  const handleSaveSettingClick = (id: GridRowId) => async () => {
    setSettingRowModesModel({ ...settingRowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const processRowUpdate = async (newRow: GridRowModel, oldRow: GridRowModel) => {
    const updatedData = newRow as UserDataType

    const { role, role_id } = newRow
    const { role_id: oldRoleId } = oldRow

    const updatedRoleId = roles?.find(({ role: roleName }) => role === roleName)?.id
    const oldRole = roles?.find(({ id }) => id === oldRoleId)?.role

    if (updatedRoleId && role_id !== updatedRoleId) {
      const updatedUser: UserDataType = { ...updatedData, role_id: updatedRoleId }
      try {
        await axios.patch('/api/user/role/change', { role_id: updatedRoleId, id: updatedData.id })

        setUserRows(
          userRows.map(item => {
            if (item.id === updatedData.id) {
              return updatedUser
            }

            return item
          })
        )

        if (oldRole === 'visitor' && role === 'member') {
          await axios.post('/api/veridion/new-features', { email: updatedData.email })
        }

        return updatedUser
      } catch (error) {
        return newRow
      }
    }

    return { ...newRow, role_id: updatedRoleId }
  }

  const processSettingRowUpdate = async (newRow: GridRowModel) => {
    try {
      await axios.patch('/api/db_transactions/portal_settings/patch', {
        setting: newRow.setting,
        value: newRow.value
      })

      return newRow
    } catch (error) {
      return newRow
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Id',
      width: 60
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250
    },

    {
      field: 'user_name',
      headerName: 'Username',
      width: 180
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueGetter: params => {
        const role = roles?.find(({ id }) => id === params.row.role_id)

        return role ? role.role : ''
      },
      valueOptions: roles ? (roles as any).map((item: Role) => item.role) : '',

      renderCell: params => {
        if (params.value === 'visitor' && params.row.requested_elevanted_access)
          return (
            <>
              {params.value}{' '}
              <Tooltip title='User has requested elevated access'>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <Icon icon='material-symbols:upgrade-rounded' />
                </Box>
              </Tooltip>
            </>
          )

        return params.value
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit
        const userIsAdmin = false

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
        }

        if (userIsAdmin) {
          return []
        } else {
          return [
            <GridActionsCellItem
              key={id}
              icon={<Icon width={24} height={24} icon='material-symbols:edit-outline' />}
              label='Edit'
              className='textPrimary'
              onClick={handleEditClick(id)}
              color='inherit'
            />,

            <GridActionsCellItem
              key={id}
              icon={<Icon width={24} height={24} icon='material-symbols:delete-outline' />}
              label='Delete'
              className='textPrimary'
              onClick={handleOpenDeleteModalClick(id)}
              color='inherit'
            />
          ]
        }
      }
    }
  ]

  const portalSettingsColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Id',
      width: 60
    },
    {
      field: 'setting',
      headerName: 'Setting',
      width: 220
    },
    {
      field: 'value',
      headerName: 'Value',
      width: 250,
      editable: true,
      valueGetter: params => {
        return params.value ? format(new Date(params.value), 'yyyy-MM-dd') : ''
      },
      type: 'string'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = settingRowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<Icon width={24} height={24} icon='material-symbols:save-outline' />}
              label='Save'
              onClick={handleSaveSettingClick(id)}
              sx={{
                color: 'primary.main'
              }}
            />,
            <GridActionsCellItem
              key={id}
              icon={<Icon width={24} height={24} icon='iconoir:cancel' />}
              label='Cancel'
              className='textPrimary'
              color='inherit'
              onClick={handleCancelSettingClick(id)}
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
              onClick={handleEditSettingClick(id)}
            />
          ]
        }
      }
    }
  ]

  React.useEffect(() => {
    if (users && roles) {
      setUserRows(users.filter(({ role_id }) => role_id !== roles?.find(({ role }) => role === 'admin')?.id))
    }
  }, [users, roles])

  if (!users && !roles) return null

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        '& .actions': {
          color: 'text.secondary'
        },
        '& .textPrimary': {
          color: 'text.primary'
        }
      }}
    >
      <DataGrid
        rows={userRows}
        columns={columns}
        editMode='row'
        rowModesModel={rowModesModel}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={error => console.log(error)}
        slots={{ toolbar: CustomToolbar }}
        getRowHeight={() => null}
        sx={() => ({
          height: 500
        })}
      />

      <DataGrid
        rows={portalSettings || []}
        columns={portalSettingsColumns}
        editMode='row'
        rowModesModel={settingRowModesModel}
        onProcessRowUpdateError={error => console.log(error)}
        processRowUpdate={processSettingRowUpdate}
        getRowHeight={() => null}
        sx={() => ({
          height: 500
        })}
      />

      <Dialog onClose={handleDialogClose} aria-labelledby='simple-dialog-title' open={open}>
        <DialogTitle>Remove {users ? users?.find(({ id }) => id === userIdForRemove)?.email : ''}</DialogTitle>

        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>

          <Button onClick={handleDeleteClick}>Remove</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ConfigurationPage
