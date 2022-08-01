import { Box, Grow, Portal } from '@mui/material'

const FullScreenDialog = ({
  open,
  onClose,
  children
}: {
  open: boolean
  onClose: () => void
  children: JSX.Element
}) => {
  return (
    <Portal container={window.document.body}>
      <Grow in={open} mountOnEnter={true} unmountOnExit={true}>
        <Box
          sx={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(124,124,124,0.3)',
            overflow: 'auto',
            zIndex: 9
          }}
          onClick={onClose}>
          <Box
            sx={{
              display: 'inline-block',
              position: 'relative',
              top: '20%',
              left: '50%',
              pb: '20vh',
              transform: 'translateX(-50%)'
            }}
            onClick={(e) => e.stopPropagation()}>
            {children}
          </Box>
        </Box>
      </Grow>
    </Portal>
  )
}

export default FullScreenDialog
