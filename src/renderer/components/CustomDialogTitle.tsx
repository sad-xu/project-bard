import { DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

/** dialog 头部 */
const CustomDialogTitle = (props: {
  children: React.ReactNode
  onClose?: () => void
}) => {
  const { children, onClose, ...other } = props
  return (
    <DialogTitle {...other}>
      {children}
      {onClose && (
        <IconButton
          sx={{ position: 'absolute', right: 0, top: 8 }}
          aria-label="close"
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  )
}

export default CustomDialogTitle
