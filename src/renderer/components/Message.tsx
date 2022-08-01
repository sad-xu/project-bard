import { Snackbar, Alert, AlertColor } from '@mui/material'
import { useState, useEffect } from 'react'

interface MessageProps {
  open: boolean
  type: AlertColor
  msg: string
}

const message = {
  success: (msg: string) => {},
  info: (msg: string) => {},
  warning: (msg: string) => {},
  error: (msg: string) => {}
}

const Message = () => {
  const [state, setState] = useState<MessageProps>({
    open: false,
    type: 'success',
    msg: ''
  })

  useEffect(() => {
    message.success = (msg) => {
      setState({
        open: true,
        type: 'success',
        msg
      })
    }
    message.info = (msg) => {
      setState({
        open: true,
        type: 'info',
        msg
      })
    }
    message.warning = (msg) => {
      setState({
        open: true,
        type: 'warning',
        msg
      })
    }
    message.error = (msg) => {
      setState({
        open: true,
        type: 'error',
        msg
      })
    }
  }, [])

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={1500}
      open={state.open}
      onClose={handleClose}>
      <Alert severity={state.type} onClose={handleClose}>
        {state.msg}
      </Alert>
    </Snackbar>
  )
}

export default Message
export { message }
