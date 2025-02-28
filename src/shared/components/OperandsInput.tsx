import { Icon } from '@iconify/react'
import { Autocomplete, Box, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import React, { FC, useRef, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import Badge from 'src/@core/components/mui/badge'
import CustomTextField from 'src/@core/components/mui/text-field'

interface IProps {
  addOperands: (o: string[]) => void
  operands: string[]
  label: React.ReactNode
  placeholder: string
  type?: 'exclude' | 'include'
  variationsQueryHandler?: (v: string) => Promise<void>
  badgeHandler?: (s: string) => void
  hideGroups?: boolean
}

const OperandsInput: FC<IProps> = ({
  addOperands,
  operands,
  label,
  placeholder,
  type,
  variationsQueryHandler,
  badgeHandler,
  hideGroups = false
}) => {
  const [inputValue, setInputValue] = useState('')
  const [editableValue, setEditableValue] = useState<{ index: number; value: string } | null>(null)

  const editableInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <>
      {!!operands.length && !hideGroups && (
        <Box mb={2}>
          {operands.map((operand, id) => (
            <Typography key={id} py={1}>
              Group {id + 1}: {operand}
            </Typography>
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
        <Autocomplete
          size='small'
          fullWidth
          multiple
          freeSolo
          options={[]}
          value={operands}
          inputValue={inputValue}
          getOptionLabel={option => option}
          onChange={(event, newInputValue: string[]) => {
            addOperands(newInputValue)

            return
          }}
          onInputChange={(event, newInputValue: string, reason) => {
            setInputValue(newInputValue)

            if (editableValue) {
              setEditableValue(null)
            }

            if (reason === 'clear') {
              addOperands([])

              setEditableValue(null)

              return
            }
          }}
          renderInput={params => {
            return (
              <CustomTextField
                {...params}
                variant='outlined'
                label={label}
                placeholder={placeholder}
                sx={{
                  '.MuiFormLabel-root': {
                    overflow: 'visible'
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Box>
                      {type !== 'exclude' && !!operands.length && variationsQueryHandler && (
                        <Tooltip title='Add variations with AI'>
                          <Badge
                            badgeContent='?'
                            color='info'
                            sx={{ width: '100%', '.MuiBadge-badge': { cursor: 'pointer' } }}
                            componentsProps={{
                              badge: {
                                onClick: () => badgeHandler && badgeHandler('/images/gifs/add_more_variation.gif')
                              }
                            }}
                          >
                            <IconButton
                              size='small'
                              onClick={() => variationsQueryHandler && variationsQueryHandler('Add more variations')}
                            >
                              <Icon icon='mdi:sparkles' />
                            </IconButton>
                          </Badge>
                        </Tooltip>
                      )}
                      {params.InputProps.endAdornment}
                    </Box>
                  )
                }}
              />
            )
          }}
          sx={{
            '.Mui-focusVisible': {
              backgroundColor: 'rgba(47, 43, 61, 0.06) !important'
            },
            '.MuiButtonBase-root': {
              ':hover': {
                backgroundColor: 'rgba(47, 43, 61, 0.1) !important'
              }
            }
          }}
          renderTags={(value, getTagsProps) => {
            return value.map((option, index) => {
              const props = getTagsProps({ index })

              return (
                <Chip
                  {...props}
                  key={index}
                  label={
                    editableValue?.index === index ? (
                      <CustomTextField
                        ref={editableInputRef}
                        size='small'
                        value={editableValue.value}
                        onChange={e => setEditableValue({ ...editableValue, value: e.target.value })}
                        autoFocus
                        fullWidth
                        onMouseDown={e => e.stopPropagation()}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const updatedOperands = [
                              ...operands.slice(0, index),
                              editableValue.value,
                              ...operands.slice(index + 1)
                            ]
                            addOperands(updatedOperands)
                            setEditableValue(null)
                          }

                          if (e.key === 'Backspace') {
                            e.stopPropagation()
                          }
                        }}
                        sx={{
                          '.MuiInputBase-root': {
                            padding: '0 !important',
                            border: 'none',
                            boxShadow: 'none !important',
                            minWidth: 'auto'
                          },
                          padding: 0
                        }}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              sx={{ p: 0 }}
                              onClick={e => {
                                e.stopPropagation()
                                setEditableValue(null)
                              }}
                            >
                              <IconifyIcon icon='mdi:cancel-circle' />
                            </IconButton>
                          )
                        }}
                      />
                    ) : (
                      option
                    )
                  }
                  clickable
                  onDelete={editableValue ? undefined : props.onDelete}
                  onClick={e => {
                    e.stopPropagation()
                    if (!editableValue) setEditableValue({ index, value: option })
                  }}
                  sx={
                    editableValue?.index === index
                      ? {
                          width: '100%',
                          '.MuiChip-label': {
                            width: '100%'
                          }
                        }
                      : undefined
                  }
                />
              )
            })
          }}
        />
      </Box>
    </>
  )
}

export default OperandsInput
