import { IconButton } from '@mui/material'
import React, { FC } from 'react'
import Icon from 'src/@core/components/icon'

type Props = {
  icon: string
  value: string | null | undefined
}

const IconLink: FC<Props> = ({ value, icon }) => {
  return (
    <IconButton sx={{ p: 1 }} href={value || ''} disabled={!value} target='_blank'>
      <Icon icon={icon} color={value ? '#FBB03B' : '#BEBEBE'} />
    </IconButton>
  )
}

export default IconLink
