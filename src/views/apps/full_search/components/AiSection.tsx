import { Box, Button } from '@mui/material'
import React, { FC, useState } from 'react'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import MessagesList from '../../product_search/components/MessagesList'
import { useAuth } from 'src/hooks/useAuth'
import nProgress from 'nprogress'
import jwt from 'jsonwebtoken'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useFilterStore } from '../store/filterStore'
import { getNewPromptMessage } from '../utils/getNewPromptMessage'
import { useSearchStore } from '../store/searchStore'
import { setFilterFromJson } from '../utils/setFilterFromJson'

type Props = {
  apiKey: string
}

const AiSection: FC<Props> = ({ apiKey }) => {
  const { user } = useAuth()

  const { addMessage, messages } = useSearchStore()

  const [naturalValue, setNaturalValue] = useState('')
  const [isLoadingJsonResponse, setIsLoadingJsonResponse] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const sendNaturalQuery = async (variationsPrompt?: string) => {
    nProgress.start()
    setIsLoadingJsonResponse(true)
    try {
      if (user && user.id) {
        if (!variationsPrompt) {
          addMessage(naturalValue)
        }

        const filters = useFilterStore.getState().data

        const prompt = getNewPromptMessage(variationsPrompt || naturalValue, filters)

        const { data } = await axios.post<{ result: string }>(
          '/api/veridion/thread/send_query',
          {
            userId: user.id,
            query: prompt,
            history
          },
          {
            headers: { Authorization: jwt.sign({ apiKey }, process.env.NEXT_PUBLIC_JWT_SECRET || '') }
          }
        )

        setHistory(prev => [...prev, prompt, data.result])

        const result = JSON.parse(data.result)

        const isObject = typeof result !== 'string'

        if (isObject) {
          const filters: any[] = result.filters
          const operator = result.filters?.and ? 'and' : 'or'

          setFilterFromJson(filters, operator)
        }

        if (!variationsPrompt) {
          setNaturalValue('')
        }
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message, { duration: 5000 })
    }
    setIsLoadingJsonResponse(false)
    nProgress.done()
  }

  return (
    <Box>
      {!!messages.length && <MessagesList messages={messages} userName={user?.name || ''} />}

      <Box>
        <CustomTextField
          value={naturalValue}
          onChange={e => setNaturalValue(e.target.value)}
          fullWidth
          multiline
          maxRows={8}
          placeholder='Search example: Find companies that make lithium-ion batteries'
          InputProps={{
            endAdornment: (
              <Button
                variant='contained'
                sx={{ p: 1, minWidth: 'auto' }}
                disabled={!naturalValue.trim() || isLoadingJsonResponse || !apiKey}
                onClick={() => sendNaturalQuery(undefined)}
              >
                <Icon icon='mdi:arrow-right' />
              </Button>
            ),
            sx: {
              py: '3.5px !important'
            }
          }}
          sx={{
            my: 4
          }}
        />
      </Box>
    </Box>
  )
}

export default AiSection
