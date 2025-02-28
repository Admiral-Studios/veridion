import React, { useState, useEffect } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import SelectItem from './selectItem'
import { Settings } from '../../../../d3/settings'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '800px',
  width: '100%',
  height: '420px',
  backgroundColor: 'background.paper',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}

type ClusterItem = {
  key: string
  value: string[]
}

type ClusterKey = keyof typeof Settings.clusters

interface NodesModalProps {
  open: boolean
  handleClose: () => void
  handleApply: (data: Record<ClusterKey, string[]> | undefined) => void
}

const NodesModal: React.FC<NodesModalProps> = ({ open, handleClose, handleApply }) => {
  const [clusters, setClusters] = useState<ClusterItem[]>([])
  const [clustersDefault, setClustersDefault] = useState<Record<ClusterKey, string[]> | undefined>(
    Settings.clustersDefault
  )

  useEffect(() => {
    const array: ClusterItem[] = []
    for (const [key, value] of Object.entries(Settings.clusters)) {
      array.push({
        key: key,
        value: value as string[]
      })
    }
    setClusters([...array])
  }, [])

  const updateClusters = (key: ClusterKey, newItem: string[]) => {
    if (clustersDefault) {
      setClustersDefault(prevProps => ({
        ...prevProps,
        [key]: newItem
      }))
    }
  }

  const _renderSelect = () => {
    return (
      <div className='modal_selects'>
        {clusters.map((item, index) => {
          let value = ''
          const key = item.key as keyof typeof clustersDefault
          if (clustersDefault && Array.isArray(clustersDefault[key])) {
            const keyArr: string[] = clustersDefault[key]
            value = keyArr[keyArr.length - 1]
          }

          return (
            <div className='modal_select_item' key={index}>
              <SelectItem data={item} key={index} updateClustersProps={updateClusters} value={value} />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500
        }
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {_renderSelect()}
          <div className='apply_close_btns'>
            <Button variant='contained' onClick={() => handleApply(clustersDefault)}>
              Apply
            </Button>
            <Button variant='contained' onClick={handleClose}>
              Close
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  )
}

export default NodesModal
