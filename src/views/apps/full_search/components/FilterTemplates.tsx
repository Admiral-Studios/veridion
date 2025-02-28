import { Box, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import axios from 'axios'
import { format } from 'date-fns'
import React, { FC, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import useDebounce from 'src/hooks/useDebounce'
import { ThreadFromDb } from 'src/types/apps/veridionTypes'
import { copyToClipboard } from 'src/utils/copyToClipboard'

type Props = {
  onSelectJsonTemplate: (json: string) => void
}

const FilterTemplates: FC<Props> = ({ onSelectJsonTemplate }) => {
  const { user } = useAuth()

  const [threads, setThreads] = useState<ThreadFromDb[] | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const debouncedSearchValue = useDebounce(searchTerm, 500)

  const searchedCompanies = useMemo(
    () =>
      (threads || []).filter(({ subject }) =>
        subject.toLowerCase().includes(debouncedSearchValue.toLowerCase().trim())
      ),
    [debouncedSearchValue, threads]
  )

  const columns: GridColDef[] = [
    {
      field: 'subject',
      headerName: 'Name',
      width: 300
    },
    {
      field: 'updated_at',
      headerName: 'Last updated',
      width: 200,
      renderCell: params => (params.value ? format(new Date(params.value), 'MMM. dd, yyyy') : '')
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      cellClassName: 'actions',
      getActions: ({ id, row }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<Icon width={24} height={24} icon='mdi:eye-outline' />}
            label='View'
            onClick={() => onSelectJsonTemplate(row.json_query)}
            sx={{
              color: 'secondary.contrastText'
            }}
          />,

          <GridActionsCellItem
            key={id}
            icon={<Icon width={24} height={24} icon='ri:file-copy-2-line' />}
            label='Copy'
            onClick={() => copyToClipboard(row.json_query)}
            sx={{
              color: 'secondary.contrastText'
            }}
          />,

          <GridActionsCellItem
            key={id}
            icon={<Icon width={24} height={24} icon='mdi:trash-can-outline' />}
            label='Remove'
            onClick={() => deleteThread(row.id)}
            sx={{
              color: 'secondary.contrastText'
            }}
          />
        ]
      }
    }
  ]

  const deleteThread = async (threadId: number) => {
    setIsLoading(true)
    try {
      await axios.post('/api/db_transactions/thread/delete', { id: threadId, user_id: user?.id })

      setThreads(threads => (threads ? threads.filter(thread => thread.id !== threadId) : threads))
    } catch (error) {
      toast.error('Failed to delete thread')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    const fetchThreads = async () => {
      const { data } = await axios.post<ThreadFromDb[]>('/api/db_transactions/thread/get', { user_id: user?.id })

      setThreads(
        data.map(thread => ({
          ...thread,
          type: thread.json_query
            ? typeof JSON.parse(thread.json_query) !== 'string'
              ? 'filter'
              : 'message'
            : 'message'
        }))
      )

      setIsLoading(false)
    }

    fetchThreads()
  }, [])

  return (
    <Box>
      {!!threads?.length && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              pb: 4,
              borderBottom: '1px solid #ececec'
            }}
          >
            <Typography variant='h3'>
              <Typography variant='h3' sx={{ display: 'inline', color: '#fbb03b' }}>
                {`${threads?.length} `}
              </Typography>
              Saved Templates
            </Typography>
          </Box>

          <Grid md={6} xs={12} container mt={4}>
            <TextField
              placeholder='Search by name'
              fullWidth
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              sx={{
                '.Mui-focused': {
                  '.iconify': {
                    color: '#fbb03b'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icon icon='mdi:search' />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </>
      )}

      <DataGrid
        columns={columns}
        rows={searchedCompanies}
        loading={isLoading}
        autoHeight={false}
        disableRowSelectionOnClick
        getRowHeight={() => null}
        sx={{
          height: 500
        }}
      />
    </Box>
  )
}

export default FilterTemplates
