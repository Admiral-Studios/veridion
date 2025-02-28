import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import React, { FC, useState } from 'react'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { prepareFilter } from '../utils/prepareFilter'
import { useAuth } from 'src/hooks/useAuth'
import { useFilterStore } from '../store/filterStore'
import axios from 'axios'
import { useSearchStore } from '../store/searchStore'
import { ThreadType } from 'src/types/apps/veridionTypes'

type Props = {
  disabled?: boolean
  operator: 'and' | 'or'
  searchVariant: string
}

const SaveTemplateDialogWithButton: FC<Props> = ({ operator, searchVariant, disabled }) => {
  const { user } = useAuth()

  const [isOpenSubjectModal, setIsOpenSubjectModal] = useState(false)
  const [subject, setSubject] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingInsertQuery, setLoadingInsertQuery] = useState(false)

  const saveThreadWithMessages = async () => {
    setLoadingInsertQuery(true)
    setIsLoading(true)

    const { data, params } = useFilterStore.getState()

    const { messages, threads, addThread, setSelectedThreadId } = useSearchStore.getState()

    const foundThread = threads.find(thread => subject === thread.subject)

    const jsonForSave =
      searchVariant === 'json'
        ? JSON.stringify(prepareFilter(params, data, operator))
        : JSON.stringify(prepareFilter(params, data, operator))

    if (!foundThread) {
      const { data: threadData } = await axios.post<{ id: number }>('/api/db_transactions/thread/add', {
        user_id: user?.id,
        subject: subject,
        json_query: jsonForSave,
        messages
      })

      if (user?.id) {
        addThread({
          user_id: user.id,
          subject: subject,
          json_query: jsonForSave,
          id: threadData.id,
          messages,
          type: 'filter'
        })

        setSelectedThreadId(threadData.id)
      }
    } else {
      const { data: threadData } = await axios.post<ThreadType>('/api/db_transactions/thread/patch', {
        user_id: user?.id,
        subject: subject,
        json_query: jsonForSave,
        messages,
        id: foundThread.id
      })

      setSelectedThreadId(threadData.id)
    }

    setSubject('')
    setLoadingInsertQuery(false)
    setIsOpenSubjectModal(false)
    setIsLoading(false)
  }

  return (
    <>
      <Button
        startIcon={<Icon icon='material-symbols:bookmark-outline' />}
        color='info'
        onClick={() => setIsOpenSubjectModal(true)}
        disabled={disabled}
      >
        Save Template
      </Button>

      <Dialog
        open={isOpenSubjectModal}
        onClose={() => setIsOpenSubjectModal(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        fullWidth
        maxWidth='sm'
      >
        <DialogContent>
          <CustomTextField
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder='Save subject'
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button variant='outlined' onClick={() => setIsOpenSubjectModal(false)}>
            Cancel
          </Button>

          <Button
            variant='contained'
            disabled={!subject || isLoading || loadingInsertQuery}
            onClick={saveThreadWithMessages}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SaveTemplateDialogWithButton
