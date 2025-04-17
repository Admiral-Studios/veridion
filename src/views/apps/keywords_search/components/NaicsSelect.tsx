import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import React, { useCallback, useMemo, useState } from 'react'

import CustomTextField from 'src/@core/components/mui/text-field'
import { getSearchedNaics } from '../utils/searchNaics'
import useDebounce from 'src/hooks/useDebounce'
import Icon from 'src/@core/components/icon'
import FilterItemLabel from './FilterItemLabel'
import FilterItemValueBox from './FilterItemValueBox'

const TreeNode = ({
  node,
  selected,
  setSelected,
  opened,
  handleOpen,
  relation
}: {
  node: any
  selected: { [key: number]: string }
  setSelected: (checkde: boolean, node: any) => void
  opened: string[]
  handleOpen: (codes: string) => void
  relation: string
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked

    setSelected(checked, node)
  }

  const isSingleSelection = relation === 'equals' || relation === 'not_equals'

  return !node.childCodes?.length ? (
    <AccordionSummary>
      <FormControlLabel
        control={<Checkbox checked={!!selected[node.code]} onChange={handleChange} />}
        label={<Typography>{node.label}</Typography>}
        onClick={event => event.stopPropagation()}
      />
    </AccordionSummary>
  ) : (
    <Accordion
      sx={{
        m: '0 !important',
        boxShadow: 'none',
        border: '1px solid #d4d4d4',
        borderRadius: 0,
        borderTop: 0,
        '.MuiAccordion-rounded': {
          boxShadow: 'none'
        },

        '&:first-of-type': {
          borderTopLeftRadius: '8px !important',
          borderTopRightRadius: '8px !important',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
          borderTop: '1px solid #d4d4d4 !important'
        },

        '&:last-of-type': {
          borderTopLeftRadius: '0px',
          borderTopRightRadius: '0px',
          borderBottomLeftRadius: '8px !important',
          borderBottomRightRadius: '8px !important',
          borderTop: 0,
          borderBottom: '1px solid #d4d4d4 !important'
        }
      }}
      elevation={0}
      disableGutters
      expanded={opened.includes(node.code)}
    >
      <AccordionSummary
        expandIcon={node.children.length ? <GridExpandMoreIcon /> : null}
        onClick={() => handleOpen(node.code)}
      >
        {isSingleSelection ? (
          <Typography
            sx={{
              my: 2
            }}
          >
            {node.label}
          </Typography>
        ) : (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!node?.childCodes.some((child: { code: string; label: string }) => !!selected[+child.code])}
                onChange={handleChange}
              />
            }
            label={<Typography>{node.label}</Typography>}
            onClick={event => event.stopPropagation()}
          />
        )}
      </AccordionSummary>

      <AccordionDetails>
        {node.children.length &&
          opened.includes(node.code) &&
          node.children.map((child: any) => (
            <TreeNode
              key={child.code}
              node={child}
              selected={selected}
              setSelected={setSelected}
              opened={opened}
              handleOpen={handleOpen}
              relation={relation}
            />
          ))}
      </AccordionDetails>
    </Accordion>
  )
}

type Props = {
  naics: { [key: number]: string }
  onSelectNaics: (selection: { [key: number]: string }) => void
  relation: string
  onChangeRelation: (newRelation: string) => void
}

const NaicsSelect = ({ naics, onSelectNaics, relation, onChangeRelation }: Props) => {
  const [inputValue, setInputValue] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [opened, setOpened] = useState<string[]>([])

  const debouncedSearch = useDebounce(inputValue, 1000)

  const searchedNaics = useMemo(() => {
    const searchData = getSearchedNaics(debouncedSearch)

    setOpened(searchData.currentCodes)

    return searchData.groupedData
  }, [debouncedSearch])

  const labels = useMemo(
    () =>
      Object.entries(naics)
        .filter(([code]: [string, string]) => code.length === 6)
        .map(([, label]: [string, string]) => label),
    [naics]
  )

  const openMenu = Boolean(anchorEl)

  const handleOpen = useCallback((code: string) => {
    setOpened(prev => (prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]))
  }, [])

  const selectHandler = (checked: boolean, node: any) => {
    const isHaveChild = node.childCodes?.length

    const isSingleSelection = relation === 'equals' || relation === 'not_equals'

    if (isSingleSelection) {
      checked ? onSelectNaics({ [node.code]: node.label }) : onSelectNaics({})

      return
    }

    const newSelection = { ...naics }

    if (!isHaveChild) {
      if (checked) {
        newSelection[node.code] = node.label
      } else {
        delete newSelection[node.code]
      }
    } else {
      if (checked) {
        node.childCodes.forEach((code: { code: string; label: string }) => (newSelection[+code.code] = code.label))
      } else {
        node.childCodes.forEach((code: { code: string; label: string }) => delete newSelection[+code.code])
      }
    }

    onSelectNaics(newSelection)
  }

  const onDeleteNaics = (value: string | number) => {
    const key = Object.keys(naics).find((key: any) => naics[key] === `${value}`)

    if (key) {
      const newSelection = { ...naics }

      delete newSelection[+key]

      onSelectNaics(newSelection)
    }
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          borderRadius: 1.25,
          transition: 'box-shadow .1s ease-in-out',
          backgroundColor: '#F8F8F8',
          boxShadow: '0px 2px 8px 0px rgba(29, 29, 29, 0.151)',
          width: '100%',
          '&:hover': {
            boxShadow: '0px 2px 4px 0px rgba(29, 29, 29, 0.251)'
          }
        }}
        onClick={e => setAnchorEl(e.currentTarget)}
        id='naics-filter'
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            px: 1,
            py: 0.3,
            borderRadius: 1.25,
            backgroundColor: '#F8F8F8'
          }}
        >
          <FilterItemLabel icon='mdi:123' label='NAICS Code' />

          <FilterItemValueBox
            values={[
              {
                label: 'Relation',
                value: [relation || 'in']
              }
            ]}
          />
          <FilterItemValueBox
            values={[
              {
                label: 'Value',
                value: labels[0] ? [`${labels[0]}${labels.length > 1 ? `, +${labels.length - 1} criteria` : ''}`] : []
              }
            ]}
          />

          <IconButton
            onClick={e => {
              e.stopPropagation()
              onSelectNaics({})
            }}
            disabled={!Object.keys(naics).length}
          >
            <Icon icon='mdi:trash-can-outline' />
          </IconButton>
        </Box>
      </Box>

      <Menu
        id={`naics-filter-menu`}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => {
          setAnchorEl(null)
          setOpened([])
        }}
        variant='menu'
        disableAutoFocusItem
        sx={{
          '.MuiMenu-paper': {
            mt: 2,
            py: 2,
            maxWidth: '544px'
          }
        }}
      >
        <Box
          sx={{
            px: 4,
            position: 'relative'
          }}
        >
          <IconButton sx={{ position: 'absolute', top: 0, right: 0, p: 1 }} onClick={() => setAnchorEl(null)}>
            <Icon icon='material-symbols:close' />
          </IconButton>

          <Grid item container xs={12}>
            <Box
              sx={{
                width: '100%',
                minWidth: '344px'
              }}
            >
              <CustomTextField
                label='Relation'
                variant='outlined'
                size='small'
                select
                fullWidth
                value={relation}
                sx={{
                  mt: 4,
                  '.MuiInputBase-root .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',

                    '.MuiBox-root': {
                      mr: 4
                    }
                  }
                }}
                SelectProps={{
                  onChange: e => onChangeRelation(e.target.value as string)
                }}
              >
                {['equals', 'not_equals', 'in', 'not_in'].map(v => (
                  <MenuItem
                    key={v}
                    value={v}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    {v}
                  </MenuItem>
                ))}
              </CustomTextField>

              <CustomTextField
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder='Search by NAICS code or description'
                fullWidth
                sx={{ mt: 6 }}
              />

              <Box
                sx={{
                  mt: 6,
                  width: '100%',
                  maxHeight: '344px',
                  overflowY: 'auto'
                }}
              >
                {searchedNaics.map((node: any) => (
                  <TreeNode
                    key={node.code}
                    node={node}
                    selected={naics}
                    setSelected={selectHandler}
                    opened={opened}
                    handleOpen={handleOpen}
                    relation={relation}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Box mt={4}>
            <FilterItemValueBox
              values={[
                {
                  label: '',
                  value: labels
                }
              ]}
              onDelete={onDeleteNaics}
            />
          </Box>
        </Box>
      </Menu>
    </>
  )
}

export default NaicsSelect
