import { Icon } from '@iconify/react'
import { Box, Button, Dialog, DialogActions, DialogContent, Grid, IconButton, Radio, Typography } from '@mui/material'
import { DataGrid, GridRowSelectionModel, GridToolbarContainer } from '@mui/x-data-grid'
import React, { FC, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useAuth } from 'src/hooks/useAuth'
import { CompanyMatchEnrichFromDb, ShortlistType } from 'src/types/apps/veridionTypes'
import { shortlistDataGridColumns } from './configs/shortlistDataGridColumns'
import toast from 'react-hot-toast'

interface IProps {
  open: boolean
  onClose: () => void
  handleSubmit: (name: string) => void
  shortlists: ShortlistType[]
  createStageShortlist: (s: ShortlistType) => void
  mode: string
  setToSelected: (c: CompanyMatchEnrichFromDb[]) => void
  removeShortlistGroup: (name: string) => Promise<void>
  removeShortlists: (name: string, ids: number[]) => Promise<void>
}

function CustomToolbar(selectedCompaniesHaveLength: boolean, deleteCompaniesHandler: () => void) {
  return (
    <GridToolbarContainer>
      <Button
        variant='text'
        size='small'
        disabled={!selectedCompaniesHaveLength}
        onClick={deleteCompaniesHandler}
        startIcon={<Icon icon='material-symbols:close' />}
      >
        Delete
      </Button>
    </GridToolbarContainer>
  )
}

const ShortlistModal: FC<IProps> = ({
  open,
  onClose,
  handleSubmit,
  shortlists,
  createStageShortlist,
  mode,
  setToSelected,
  removeShortlistGroup,
  removeShortlists
}) => {
  const { user } = useAuth()

  const [newShortlistTitle, setNewShortlistTitle] = useState('')
  const [selectedShortlist, setSelectedShortlist] = useState('')
  const [editedShortlist, setEditedShortlist] = useState('')
  const [groupForDelete, setGroupForDelete] = useState('')
  const [selectedShortlistItems, setSelectedShortlistItems] = useState<GridRowSelectionModel>([])
  const [isDeleteProceed, setIsDeleteProceed] = useState(false)

  const createNewShortlist = () => {
    if (user) {
      if (shortlists.find(({ name }) => name === newShortlistTitle)) {
        toast.error('Project with this name already exist', {
          style: {
            zIndex: '100000 !important'
          }
        })

        return
      }
      const newShortlist = {
        id: shortlists.length + 1,
        companies: [] as CompanyMatchEnrichFromDb[],
        user_id: user?.id,
        name: newShortlistTitle
      }

      createStageShortlist(newShortlist)

      setNewShortlistTitle('')
    }
  }

  const applyHandler = () => {
    handleSubmit(selectedShortlist)

    onClose()
  }

  const chooseShortlist = () => {
    const shortlist = shortlists.find(({ name }) => name === selectedShortlist)

    if (shortlist) {
      setToSelected(shortlist.companies)
    }

    onClose()
  }

  const deleteGroup = async (name: string) => {
    setGroupForDelete(name)
    await removeShortlistGroup(name)
    setGroupForDelete('')
  }

  const deleteShortlistItems = async () => {
    setIsDeleteProceed(true)

    await removeShortlists(editedShortlist, selectedShortlistItems as number[])

    setIsDeleteProceed(false)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      fullWidth
      maxWidth='md'
    >
      {!editedShortlist ? (
        <DialogContent>
          <Box display='flex' alignItems='center'>
            <CustomTextField
              placeholder='Project title'
              value={newShortlistTitle}
              onChange={e => setNewShortlistTitle(e.target.value)}
            />

            <IconButton disabled={!newShortlistTitle} color='primary' onClick={createNewShortlist}>
              <Icon icon='ic:round-plus' />
            </IconButton>
          </Box>

          <Grid xs={12} spacing={4} mt={4}>
            {shortlists.map(({ name, id }) => (
              <Box
                key={id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button
                  fullWidth
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}
                  onClick={() => setSelectedShortlist(name)}
                >
                  <Radio checked={selectedShortlist === name} />

                  <Box>
                    <Typography variant='h5'>{name}</Typography>
                  </Box>
                </Button>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Button
                    variant='outlined'
                    size='small'
                    startIcon={<Icon icon='material-symbols:edit-outline' />}
                    disabled={groupForDelete === name}
                    onClick={() => setEditedShortlist(name)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant='outlined'
                    size='small'
                    color='error'
                    sx={{ marginLeft: 2 }}
                    startIcon={<Icon icon='material-symbols:close' />}
                    disabled={groupForDelete === name}
                    onClick={() => deleteGroup(name)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Grid>
        </DialogContent>
      ) : (
        <DialogContent>
          <DataGrid
            style={{ overflow: 'hidden' }}
            autoHeight={false}
            rows={shortlists.find(({ name }) => name === editedShortlist)?.companies || []}
            columns={shortlistDataGridColumns(true, false)}
            pagination
            checkboxSelection
            disableRowSelectionOnClick
            getRowHeight={() => null}
            onRowSelectionModelChange={setSelectedShortlistItems}
            rowSelectionModel={selectedShortlistItems}
            loading={isDeleteProceed}
            slots={{
              toolbar: () => CustomToolbar(!!selectedShortlistItems.length, deleteShortlistItems)
            }}
            sx={{
              height: 500
            }}
          />
        </DialogContent>
      )}
      <DialogActions
        sx={{
          justifyContent: 'space-between'
        }}
      >
        {editedShortlist ? (
          <>
            <Button variant='outlined' onClick={() => setEditedShortlist('')}>
              Back
            </Button>

            <Button variant='contained' onClick={() => setEditedShortlist('')}>
              Done
            </Button>
          </>
        ) : (
          <>
            <Button variant='outlined' onClick={onClose}>
              Close
            </Button>

            {mode === 'edit' ? (
              <Button variant='contained' disabled={!selectedShortlist} onClick={applyHandler}>
                Apply
              </Button>
            ) : (
              <Button variant='contained' disabled={!selectedShortlist} onClick={chooseShortlist}>
                Choose
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ShortlistModal
