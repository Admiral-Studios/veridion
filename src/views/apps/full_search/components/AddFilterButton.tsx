import { Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React, { FC, useState } from 'react'
import Icon from 'src/@core/components/icon'
import { filters } from '../constants/constants'
import { AllFiltersType } from '../types/enums'
import { useFilterStore } from '../store/filterStore'

type Props = {
  params: string[]
  logicBoxId?: number
}

const AddFilterButton: FC<Props> = ({ params, logicBoxId }) => {
  const { onSetNewParam, onSetNewLogicOperatorParam, onSetChildParam } = useFilterStore()

  const [open, setOpen] = useState(false)

  const addParam = (value: AllFiltersType) => {
    if (logicBoxId) {
      onSetChildParam(logicBoxId, value)
    } else {
      onSetNewParam(value)
    }

    setOpen(false)
  }

  const addLogicalParam = () => {
    onSetNewLogicOperatorParam()
    setOpen(false)
  }

  return (
    <>
      <Button startIcon={<Icon icon='mdi:plus' />} color='info' onClick={() => setOpen(true)}>
        {logicBoxId ? 'Add nested filter' : 'Add filter'}
      </Button>

      <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
        <List
          sx={{
            maxWidth: '444px'
          }}
        >
          {filters
            .filter(f => !params.includes(f.value))
            .map(filter => (
              <ListItem key={filter.value}>
                <ListItemButton
                  sx={{
                    alignItems: 'flex-start'
                  }}
                  onClick={() => addParam(filter.value as AllFiltersType)}
                >
                  <ListItemIcon>
                    <Icon icon={filter.icon} color='#fbb03b' />
                  </ListItemIcon>

                  <ListItemText primary={filter.title} secondary={filter.description} />
                </ListItemButton>
              </ListItem>
            ))}

          {!logicBoxId && (
            <ListItem>
              <ListItemButton
                sx={{
                  alignItems: 'flex-start'
                }}
                onClick={addLogicalParam}
              >
                <ListItemIcon>
                  <Icon icon='mdi:plus-circle-outline' />
                </ListItemIcon>

                <ListItemText
                  primary='Add Nested Filter'
                  secondary={
                    <Typography>
                      Logical operators that determine the relationship between filters in a search query. There are two
                      types of rules supported by the API:
                      <Typography mt={1}>
                        <b>and</b>: Requires that all filters in the group must be satisfied for a result to be
                        included.
                      </Typography>
                      <Typography mt={1}>
                        <b>or</b>: Requires that at least one filter in the group must be satisfied for a result to be
                        included.
                      </Typography>
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  )
}

export default AddFilterButton
