import { Breakpoint, Dialog, DialogContent, IconButton, Typography } from '@mui/material'
import { FC, ReactNode } from 'react'
import Icon from 'src/@core/components/icon'

interface IProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title: string | ReactNode
  maxWidth?: Breakpoint
}

const ComplexFieldsDialog: FC<IProps> = ({ open, onClose, children, title, maxWidth = 'md' }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      fullWidth
      maxWidth={maxWidth}
    >
      <IconButton sx={{ position: 'absolute', top: 4, right: 6 }} onClick={onClose}>
        <Icon icon='material-symbols:close' />
      </IconButton>

      <DialogContent>
        {typeof title === 'string' ? (
          <Typography variant='h5' sx={{ mb: 8 }}>
            {title}
          </Typography>
        ) : (
          title
        )}

        {children}
      </DialogContent>
    </Dialog>
  )
}

export default ComplexFieldsDialog
