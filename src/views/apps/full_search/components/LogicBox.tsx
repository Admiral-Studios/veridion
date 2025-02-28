import { Box, IconButton } from '@mui/material'
import React, { FC } from 'react'
import Icon from 'src/@core/components/icon'
import AddFilterButton from './AddFilterButton'
import { AllFiltersType } from '../types/enums'
import FilterItem from './FilterItem'
import { useFilterStore } from '../store/filterStore'

type Props = {
  operator: 'and' | 'or'
  params: string[]
  index: number
  childParams: AllFiltersType[]
}

const LogicBox: FC<Props> = ({ operator, params, index, childParams }) => {
  const removeItem = (param: AllFiltersType) => {
    const { onRemoveParam } = useFilterStore.getState()

    onRemoveParam(param, index)
  }

  const changeLogicOperator = () => {
    const { onChangeLogicOperator } = useFilterStore.getState()

    onChangeLogicOperator(index, operator === 'and' ? 'or' : 'and')
  }

  const removeLogicBox = () => {
    const { onRemoveLogicBoxWithChildParams } = useFilterStore.getState()
    onRemoveLogicBoxWithChildParams(index)
  }

  return (
    <Box
      sx={{
        paddingLeft: 8,
        pt: 1,
        pb: 1,
        pr: 1,
        borderRadius: 2,
        ml: 5,
        border: '1px solid #F2F2F2',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '0',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#F2F2F2',
          p: 1,
          color: '#000',
          borderRadius: 2,
          cursor: 'pointer',
          textTransform: 'uppercase',
          fontSize: '10px'
        }}
        onClick={changeLogicOperator}
      >
        {operator}
        <Icon icon='mdi:exchange' color='#000' />
      </Box>

      {childParams.map(param => (
        <FilterItem key={param} type={param as AllFiltersType} removeItem={removeItem} />
      ))}

      <AddFilterButton params={params} logicBoxId={index} />

      <IconButton onClick={removeLogicBox}>
        <Icon icon='mdi:trash-can-outline' />
      </IconButton>
    </Box>
  )
}

export default LogicBox
